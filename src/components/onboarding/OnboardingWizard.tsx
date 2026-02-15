"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AgentProfile,
  DEFAULT_PROFILE,
  Platform,
  PostingCadence,
  PLATFORM_LABELS,
} from "@/types";
import {
  CalendarDays,
  User,
  MapPin,
  Clock,
  Share2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (profile: AgentProfile) => void;
}

const STEPS = [
  { title: "About You", icon: User, subtitle: "Let's personalize your calendar" },
  { title: "Your Market", icon: MapPin, subtitle: "Where do you serve?" },
  { title: "Posting Schedule", icon: Clock, subtitle: "How often do you want to post?" },
  { title: "Platforms", icon: Share2, subtitle: "Where do you share content?" },
  { title: "Ready!", icon: Sparkles, subtitle: "Your calendar is about to be generated" },
];

const CADENCE_OPTIONS: { value: PostingCadence; label: string; description: string }[] = [
  { value: "3x-mwf", label: "3x / week", description: "Monday, Wednesday, Friday" },
  { value: "3x-tts", label: "3x / week", description: "Tuesday, Thursday, Saturday" },
  { value: "4x", label: "4x / week", description: "Mon, Tue, Thu, Sat" },
  { value: "5x", label: "5x / week", description: "Every weekday (Mon–Fri)" },
];

const PLATFORM_OPTIONS: { value: Platform; label: string; color: string }[] = [
  { value: "instagram", label: "Instagram", color: "from-pink-500 to-purple-500" },
  { value: "facebook", label: "Facebook", color: "from-blue-600 to-blue-500" },
  { value: "linkedin", label: "LinkedIn", color: "from-blue-700 to-blue-600" },
  { value: "tiktok", label: "TikTok", color: "from-gray-900 to-gray-700" },
];

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<AgentProfile>({ ...DEFAULT_PROFILE });

  const canProceed = () => {
    switch (step) {
      case 0:
        return profile.name.trim().length > 0;
      case 1:
        return profile.city.trim().length > 0;
      case 2:
        return true;
      case 3:
        return profile.platforms.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, onboardingComplete: true });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const togglePlatform = (platform: Platform) => {
    setProfile((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-8 px-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-2 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              {React.createElement(STEPS[step].icon, {
                className: "w-7 h-7 text-primary",
              })}
            </div>
            <h2 className="text-2xl font-bold text-foreground">{STEPS[step].title}</h2>
            <p className="text-muted-foreground mt-1">{STEPS[step].subtitle}</p>
          </div>

          {/* Content */}
          <div className="p-8 pt-6 min-h-[240px]">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Your name
                  </label>
                  <Input
                    placeholder="e.g. Sarah Johnson"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Brokerage
                  </label>
                  <Input
                    placeholder="e.g. Keller Williams Realty"
                    value={profile.brokerage}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, brokerage: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    City
                  </label>
                  <Input
                    placeholder="e.g. Austin"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, city: e.target.value }))
                    }
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Market area (optional)
                  </label>
                  <Input
                    placeholder="e.g. Greater Austin Area"
                    value={profile.market}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, market: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {CADENCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        postingCadence: option.value,
                      }))
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      profile.postingCadence === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    {profile.postingCadence === option.value && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {PLATFORM_OPTIONS.map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() => togglePlatform(platform.value)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                      profile.platforms.includes(platform.value)
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-sm text-foreground">
                      {platform.label}
                    </span>
                    {profile.platforms.includes(platform.value) && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6 py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-100">
                  <CalendarDays className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Everything looks great, {profile.name.split(" ")[0]}!
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    We&apos;ll generate a full month of content tailored for{" "}
                    <span className="font-medium text-foreground">{profile.city}</span> across{" "}
                    <span className="font-medium text-foreground">
                      {profile.platforms.map((p) => PLATFORM_LABELS[p]).join(", ")}
                    </span>
                    .
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    30% Listing posts
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    30% Educational
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    20% Branding
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    20% Engagement
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="lg"
              className="min-w-[140px]"
            >
              {step === STEPS.length - 1 ? (
                <>
                  Generate Calendar
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Realtor Content Calendar — Your social media, planned.
        </p>
      </div>
    </div>
  );
}
