'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, Lock, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/form'
import { ImageUpload } from '@/components/onboarding/image-upload'
import { OnboardingShell } from '@/components/onboarding/onboarding-shell'
import { useApp } from '@/lib/app-context'
import { getLgas, getLocalities } from '@/lib/nigeria-data'

export function SellerOnboarding() {
  const { user, finishSellerOnboarding } = useApp()
  const [step, setStep] = useState(1)

  const [image, setImage] = useState('')
  const [business, setBusiness] = useState('')
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')
  const [overrideContact, setOverrideContact] = useState(false)
  const [contact, setContact] = useState(user?.phone ?? '')
  const [lga, setLga] = useState('')
  const [locality, setLocality] = useState('')
  const [area, setArea] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const state = user?.state ?? ''
  const lgas = useMemo(() => getLgas(state), [state])
  const localities = useMemo(() => getLocalities(state, lga), [state, lga])

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!business.trim()) e.business = 'Enter your business name'
    if (!username.trim()) e.username = 'Choose a username'
    else if (!/^[a-z0-9_]{3,}$/i.test(username)) e.username = 'Letters, numbers, underscore (min 3)'
    if (!description.trim()) e.description = 'Tell buyers what you sell'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!lga) e.lga = 'Select your LGA'
    if (!locality) e.locality = 'Select your locality'
    if (!area.trim()) e.area = 'Enter your street / area'
    if (overrideContact && contact.replace(/\D/g, '').length !== 11)
      e.contact = 'Enter an 11-digit number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep((s) => s + 1)
  }

  function finish() {
    finishSellerOnboarding({
      username,
      business,
      description,
      image: image || '/sellers/fashion.png',
      contact,
      lga,
      locality,
      area,
    })
  }

  return (
    <OnboardingShell
      step={step}
      total={3}
      title={
        step === 1
          ? 'Set up your shopfront'
          : step === 2
            ? 'Where can buyers find you?'
            : 'Your trust score starts here'
      }
      subtitle={
        step === 1
          ? 'Your photo and details are the first thing buyers see.'
          : step === 2
            ? 'Precise location powers local recommendations.'
            : 'Keep it high to stay top of local suggestions.'
      }
    >
      {step === 1 ? (
        <div className="space-y-5">
          <ImageUpload value={image} onChange={setImage} />
          <Field label="Business name" error={errors.business}>
            <Input
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="e.g. Ada Thrift Store"
              aria-invalid={!!errors.business}
            />
          </Field>
          <Field label="Username" error={errors.username} hint="This is your public @handle.">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              placeholder="ada_thrift"
              aria-invalid={!!errors.username}
            />
          </Field>
          <Field label="Business description" error={errors.description}>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Grade-A okrika, bags & sneakers. New drops every week."
              aria-invalid={!!errors.description}
            />
          </Field>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
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
          <Field label="Area / Street" error={errors.area}>
            <Input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Enitan Street"
              aria-invalid={!!errors.area}
            />
          </Field>

          <Field
            label="Contact number shown to buyers"
            error={errors.contact}
            hint="Buyers see it partly masked to prevent spam."
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={overrideContact}
                  onChange={(e) => setOverrideContact(e.target.checked)}
                  className="size-4 accent-[var(--primary)]"
                />
                Use a different number than my registration phone
              </label>
              <Input
                value={contact}
                disabled={!overrideContact}
                onChange={(e) => setContact(e.target.value)}
                aria-invalid={!!errors.contact}
                className="disabled:bg-muted/50"
              />
            </div>
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <div className="rounded-3xl border border-accent/40 bg-gradient-to-b from-accent/20 to-card p-6 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Award className="size-7" />
            </span>
            <div className="mt-4 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-6 fill-accent text-accent" />
              ))}
            </div>
            <p className="mt-3 font-display text-3xl font-bold">5.0 / 5.0</p>
            <p className="text-sm text-muted-foreground">5 trust points to start</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Sparkles, t: 'Deliver on time & as described', d: 'Happy buyers keep your score high.' },
              { icon: Star, t: 'Earn reviews', d: 'Every 5-star review boosts local ranking.' },
              { icon: Award, t: 'Stay recommended', d: 'High scorers appear first in suggestions.' },
            ].map((r) => (
              <div key={r.t} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <r.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{r.t}</p>
                  <p className="text-xs text-muted-foreground">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex gap-3">
        {step > 1 ? (
          <Button variant="outline" size="lg" className="h-12" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button size="lg" className="h-12 flex-1 text-base" onClick={next}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button size="lg" className="h-12 flex-1 text-base" onClick={finish}>
            Enter my dashboard
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </OnboardingShell>
  )
}
