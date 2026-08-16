'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select } from '@/components/ui/form'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'
import { useApp } from '@/lib/app-context'
import { CATEGORIES, getLgas, getLocalities } from '@/lib/nigeria-data'
import { cn } from '@/lib/utils'

export function BuyerOnboarding() {
  const { user, finishBuyerOnboarding } = useApp()
  const [step, setStep] = useState(1)

  const [username, setUsername] = useState('')
  const [contact, setContact] = useState(user?.phone ?? '')
  const [lga, setLga] = useState('')
  const [locality, setLocality] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const state = user?.state ?? ''
  const lgas = useMemo(() => getLgas(state), [state])
  const localities = useMemo(() => getLocalities(state, lga), [state, lga])

  function toggle(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!username.trim()) e.username = 'Choose a username'
    else if (!/^[a-z0-9_]{3,}$/i.test(username)) e.username = 'Letters, numbers, underscore (min 3)'
    if (!lga) e.lga = 'Select your LGA'
    if (!locality) e.locality = 'Select your locality'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step === 1 && !validateStep1()) return
    setStep(2)
  }

  function finish() {
    finishBuyerOnboarding({ username, contact, lga, locality, interests })
  }

  return (
    <OnboardingShell
      step={step}
      total={2}
      title={step === 1 ? 'Tell us about you' : 'What are you into?'}
      subtitle={
        step === 1
          ? 'We use your location to surface sellers nearby.'
          : 'Pick a few interests to seed your local feed.'
      }
    >
      {step === 1 ? (
        <div className="space-y-5">
          <Field label="Username" error={errors.username}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              placeholder="e.g. chidi_buys"
              aria-invalid={!!errors.username}
            />
          </Field>
          <Field
            label="Preferred contact info"
            hint="Used for order updates. Only shared with sellers you transact with."
          >
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone or email"
            />
          </Field>
          <Field label="State" hint="Locked from your registration.">
            <div className="flex h-12 items-center justify-between rounded-xl border border-input bg-muted/50 px-3.5 text-[0.95rem]">
              <span className="font-medium">{state}</span>
              <Lock className="size-4 text-muted-foreground" />
            </div>
          </Field>
          <Field label="Local Government Area (LGA)" error={errors.lga}>
            <Select
              value={lga}
              onChange={(e) => {
                setLga(e.target.value)
                setLocality('')
              }}
              aria-invalid={!!errors.lga}
            >
              <option value="">Select LGA</option>
              {lgas.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Locality / City" error={errors.locality}>
            <Select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              disabled={!lga}
              aria-invalid={!!errors.locality}
            >
              <option value="">{lga ? 'Select locality' : 'Select LGA first'}</option>
              {localities.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => {
              const active = interests.includes(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={cn(
                    'relative flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition-all',
                    active
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                      : 'border-input bg-card hover:border-primary/40',
                  )}
                  aria-pressed={active}
                >
                  <span className="pr-2 leading-tight">{c.label}</span>
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-full border',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input',
                    )}
                  >
                    {active ? <Check className="size-3.5" /> : null}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {interests.length} selected · you can change these anytime
          </p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 1 ? (
          <Button variant="outline" size="lg" className="h-12" onClick={() => setStep(1)}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : null}
        {step === 1 ? (
          <Button size="lg" className="h-12 flex-1 text-base" onClick={next}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            className="h-12 flex-1 text-base"
            onClick={finish}
            disabled={interests.length === 0}
          >
            Start exploring
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </OnboardingShell>
  )
}
