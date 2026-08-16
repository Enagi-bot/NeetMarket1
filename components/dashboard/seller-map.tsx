"use client"

import { useEffect, useRef, useState } from "react"
import type { Seller } from "@/lib/app-context"
import { StarRating } from "@/components/brand"
import { maskPhone } from "@/lib/app-context"

declare global {
  interface Window {
    google?: any
    __neetmarketMapInit?: () => void
  }
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

function loadGoogleMaps(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!MAPS_KEY) {
      reject(new Error("no-key"))
      return
    }
    if (window.google?.maps) {
      resolve(window.google)
      return
    }
    const existing = document.getElementById("gmaps-script") as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google))
      existing.addEventListener("error", reject)
      return
    }
    const script = document.createElement("script")
    script.id = "gmaps-script"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=marker`
    script.async = true
    script.defer = true
    script.addEventListener("load", () => resolve(window.google))
    script.addEventListener("error", reject)
    document.head.appendChild(script)
  })
}

export function SellerMap({
  sellers,
  activeId,
  onSelect,
}: {
  sellers: Seller[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading")
  const mapObj = useRef<any>(null)
  const markers = useRef<any[]>([])

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapRef.current) return
        const center = sellers[0]
          ? { lat: sellers[0].lat, lng: sellers[0].lng }
          : { lat: 6.5244, lng: 3.3792 }
        mapObj.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
        })
        setStatus("ready")
      })
      .catch(() => {
        if (!cancelled) setStatus("fallback")
      })
    return () => {
      cancelled = true
    }
  }, [sellers])

  // sync markers when map is ready
  useEffect(() => {
    if (status !== "ready" || !mapObj.current || !window.google) return
    const google = window.google
    markers.current.forEach((m) => m.setMap(null))
    markers.current = sellers.map((s) => {
      const marker = new google.maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map: mapObj.current,
        title: s.business,
        animation: s.id === activeId ? google.maps.Animation.BOUNCE : undefined,
      })
      marker.addListener("click", () => onSelect(s.id))
      return marker
    })
  }, [status, sellers, activeId, onSelect])

  if (status === "fallback") {
    return <FallbackMap sellers={sellers} activeId={activeId} onSelect={onSelect} />
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border">
      <div ref={mapRef} className="h-full w-full" />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-muted/60 text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
    </div>
  )
}

/* Interactive fallback: schematic map plane with positioned pins. */
function FallbackMap({
  sellers,
  activeId,
  onSelect,
}: {
  sellers: Seller[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  const active = sellers.find((s) => s.id === activeId) ?? null
  // normalise lat/lng into a 0-100 box for schematic placement
  const lats = sellers.map((s) => s.lat)
  const lngs = sellers.map((s) => s.lng)
  const minLat = Math.min(...lats, 6.4)
  const maxLat = Math.max(...lats, 6.7)
  const minLng = Math.min(...lngs, 3.2)
  const maxLng = Math.max(...lngs, 3.6)
  const pos = (s: Seller) => ({
    left: `${8 + ((s.lng - minLng) / (maxLng - minLng || 1)) * 84}%`,
    top: `${88 - ((s.lat - minLat) / (maxLat - minLat || 1)) * 76}%`,
  })

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border">
      <div
        className="relative flex-1"
        style={{
          backgroundColor: "oklch(0.93 0.03 150)",
          backgroundImage:
            "linear-gradient(oklch(0.88 0.03 150) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.03 150) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {/* faux roads */}
        <div className="absolute left-0 top-1/3 h-2 w-full -rotate-3 bg-background/70" />
        <div className="absolute left-1/4 top-0 h-full w-2 rotate-6 bg-background/70" />
        <div className="absolute right-1/4 top-0 h-full w-1.5 -rotate-3 bg-background/50" />

        {sellers.map((s) => {
          const p = pos(s)
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ left: p.left, top: p.top }}
              aria-label={`${s.business} location`}
            >
              <span
                className={`flex flex-col items-center ${isActive ? "animate-bounce" : ""}`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 border-background text-xs font-semibold shadow-md ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {s.business.charAt(0)}
                </span>
                <span className="mt-0.5 h-2 w-2 rotate-45 border-b-2 border-r-2 border-background bg-primary" />
              </span>
            </button>
          )
        })}

        <div className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          Schematic map · add a Maps API key for live view
        </div>
      </div>

      {active && (
        <div className="border-t border-border bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-card-foreground">{active.business}</p>
              <p className="truncate text-xs text-muted-foreground">
                {active.area}, {active.locality}
              </p>
            </div>
            <StarRating value={active.rating} size={13} />
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{maskPhone(active.contact)}</p>
        </div>
      )}
    </div>
  )
}
