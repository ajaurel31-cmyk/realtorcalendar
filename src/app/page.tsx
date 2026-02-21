"use client";

import React, { useState, useEffect, useCallback } from "react";
import LandingPage from "@/components/landing/LandingPage";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import GenerateButton from "@/components/generator/GenerateButton";
import ExportMenu from "@/components/export/ExportMenu";
import CustomizePanel from "@/components/settings/CustomizePanel";
import { AgentProfile, CalendarPost, CalendarState, DEFAULT_PROFILE } from "@/types";
import { getProfile, saveProfile, getCalendarState, saveCalendarState, clearAllData } from "@/lib/storage";
import { generateMonth, loadTemplates } from "@/lib/calendar-generator";
import { Settings, CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [profile, setProfile] = useState<AgentProfile>(DEFAULT_PROFILE);
  const [calendarState, setCalendarState] = useState<CalendarState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [templatesReady, setTemplatesReady] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const savedProfile = getProfile();
    const savedCalendar = getCalendarState();
    setProfile(savedProfile);
    setCalendarState(savedCalendar);
    // Skip landing page if user has already completed onboarding
    if (savedProfile.onboardingComplete) {
      setShowLanding(false);
    }
    setLoaded(true);

    loadTemplates().then(() => setTemplatesReady(true));
  }, []);

  // Persist profile changes
  const updateProfile = useCallback((newProfile: AgentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  }, []);

  // Persist calendar changes
  const updateCalendar = useCallback((newState: CalendarState) => {
    setCalendarState(newState);
    saveCalendarState(newState);
  }, []);

  const handleOnboardingComplete = async (newProfile: AgentProfile) => {
    updateProfile(newProfile);
    await loadTemplates();
    setTemplatesReady(true);

    const now = new Date();
    const posts = generateMonth(now.getFullYear(), now.getMonth(), newProfile);
    const newState: CalendarState = {
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      posts,
    };
    updateCalendar(newState);
  };

  const handleGenerate = async () => {
    if (!templatesReady) await loadTemplates();
    const year = calendarState?.currentYear ?? new Date().getFullYear();
    const month = calendarState?.currentMonth ?? new Date().getMonth();
    const posts = generateMonth(year, month, profile);
    updateCalendar({ currentYear: year, currentMonth: month, posts });
  };

  const handlePostUpdate = (updatedPost: CalendarPost) => {
    if (!calendarState) return;
    const posts = calendarState.posts.map((p) =>
      p.id === updatedPost.id ? updatedPost : p
    );
    updateCalendar({ ...calendarState, posts });
  };

  const handlePostsReorder = (posts: CalendarPost[]) => {
    if (!calendarState) return;
    updateCalendar({ ...calendarState, posts });
  };

  const handleMonthChange = async (year: number, month: number) => {
    if (!templatesReady) await loadTemplates();
    const posts = generateMonth(year, month, profile);
    updateCalendar({ currentYear: year, currentMonth: month, posts });
  };

  const handleReset = () => {
    if (confirm("This will clear all your data and restart the setup. Continue?")) {
      clearAllData();
      setProfile(DEFAULT_PROFILE);
      setCalendarState(null);
      setShowLanding(true);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLanding && !profile.onboardingComplete) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!profile.onboardingComplete) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-md shadow-primary/20">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  Content Calendar
                </h1>
                <p className="text-[11px] text-muted-foreground leading-tight hidden sm:block">
                  {profile.name} &middot; {profile.brokerage}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <GenerateButton
                onGenerate={handleGenerate}
                hasExistingPosts={(calendarState?.posts.length ?? 0) > 0}
              />
              <ExportMenu
                posts={calendarState?.posts ?? []}
                profile={profile}
                year={calendarState?.currentYear ?? new Date().getFullYear()}
                month={calendarState?.currentMonth ?? new Date().getMonth()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset all data"
                className="text-muted-foreground hover:text-red-500"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {calendarState && calendarState.posts.length > 0 ? (
          <CalendarGrid
            year={calendarState.currentYear}
            month={calendarState.currentMonth}
            posts={calendarState.posts}
            profile={profile}
            onPostUpdate={handlePostUpdate}
            onPostsReorder={handlePostsReorder}
            onMonthChange={handleMonthChange}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <CalendarDays className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No posts yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Click &ldquo;Generate My Month&rdquo; to auto-fill your calendar with a
              balanced mix of listing, educational, branding, and engagement posts.
            </p>
            <GenerateButton
              onGenerate={handleGenerate}
              hasExistingPosts={false}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            Realtor Content Calendar &mdash; Plan, create, and schedule your social media content.
          </p>
        </div>
      </footer>

      {/* Settings Panel */}
      {showSettings && (
        <CustomizePanel
          profile={profile}
          onUpdate={updateProfile}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
