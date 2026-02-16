"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Sparkles,
  Download,
  Clock,
  Palette,
  LayoutGrid,
  MessageSquare,
  Share2,
  ChevronRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "One-Click Calendar",
    description: "Generate a full month of content in seconds with a balanced mix of post types.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: MessageSquare,
    title: "214+ Post Templates",
    description: "Listing, educational, branding, and engagement posts — ready to customize.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Your name, brokerage, city, and brand colors auto-fill into every post.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: LayoutGrid,
    title: "Visual Calendar",
    description: "Color-coded monthly grid. Drag-and-drop to rearrange. Click to edit any post.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download as PDF, CSV, or ICS. Import to Google Calendar, Sheets, or print it.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: Share2,
    title: "Multi-Platform",
    description: "Optimized captions for Instagram, Facebook, LinkedIn, and TikTok.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const POST_TYPES = [
  { emoji: "🟢", label: "Listing Posts", count: "55", desc: "Just listed, open house, price drop, just sold" },
  { emoji: "🔵", label: "Educational", count: "55", desc: "Market updates, buyer tips, neighborhood spotlights" },
  { emoji: "🟡", label: "Personal Branding", count: "52", desc: "Agent stories, testimonials, behind the scenes" },
  { emoji: "🟣", label: "Engagement", count: "52", desc: "Polls, quizzes, this-or-that, hot takes" },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <CalendarDays className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-foreground text-sm">Realtor Content Calendar</span>
          </div>
          <Button onClick={onGetStarted} size="sm">
            Get Started
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          214+ ready-to-use post templates
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] max-w-3xl mx-auto">
          Your social media,{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            planned in seconds
          </span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Generate a full month of real estate social media posts — listings, educational content,
          personal branding, and engagement — tailored to your market.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={onGetStarted} size="lg" className="text-base px-8 shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Calendar
          </Button>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Takes less than 60 seconds
          </span>
        </div>

        {/* Preview mockup */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-100/50 border border-gray-100 p-4 sm:p-6">
            {/* Mock calendar header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="h-5 w-36 bg-gray-800 rounded-md" />
                <div className="h-3 w-48 bg-gray-200 rounded mt-1.5" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-28 bg-indigo-500 rounded-lg" />
                <div className="h-8 w-20 bg-gray-100 rounded-lg" />
              </div>
            </div>
            {/* Mock calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center py-1">
                  {d}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 0 + 1;
                const hasPost = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30].includes(day);
                const colors = ["bg-green-100 border-green-200", "bg-blue-100 border-blue-200", "bg-amber-100 border-amber-200", "bg-purple-100 border-purple-200"];
                const dotColors = ["bg-green-400", "bg-blue-400", "bg-amber-400", "bg-purple-400"];
                const colorIdx = day % 4;

                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-1.5 sm:p-2 min-h-[40px] sm:min-h-[56px] ${
                      day > 0 && day <= 31
                        ? hasPost
                          ? "bg-white border-gray-200"
                          : "bg-white/60 border-gray-100"
                        : "bg-gray-50/50 border-transparent"
                    }`}
                  >
                    {day > 0 && day <= 31 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-gray-400">{day}</span>
                          {hasPost && <div className={`w-1.5 h-1.5 rounded-full ${dotColors[colorIdx]}`} />}
                        </div>
                        {hasPost && (
                          <div className={`mt-1 text-[7px] sm:text-[9px] px-1 py-0.5 rounded border ${colors[colorIdx]} truncate`}>
                            {colorIdx === 0 && "Just Listed..."}
                            {colorIdx === 1 && "Market Tip..."}
                            {colorIdx === 2 && "My Story..."}
                            {colorIdx === 3 && "Poll: Would..."}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content types */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
          A balanced content mix, every month
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Our algorithm distributes posts across four categories so your feed stays fresh and engaging.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POST_TYPES.map((type) => (
            <div
              key={type.label}
              className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{type.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{type.label}</h3>
                  <span className="text-xs font-medium bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-full">
                    {type.count} templates
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
          Everything you need to plan your content
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          No more staring at a blank screen. No more inconsistent posting. Just open, generate, and go.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${feature.bg} mb-3`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
          Ready in 3 simple steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Set up your profile", desc: "Enter your name, brokerage, city, and pick your platforms." },
            { step: "2", title: "Generate your month", desc: "One click fills your calendar with a balanced content mix." },
            { step: "3", title: "Customize & export", desc: "Edit any post, drag to rearrange, then export to PDF or CSV." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Stop guessing what to post
          </h2>
          <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
            Join hundreds of real estate agents who plan their entire month of content in under 60 seconds.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Planning Now
            </Button>
            <div className="flex items-center gap-4 text-sm text-indigo-200 mt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> No signup required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Works on any device
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground">
            Realtor Content Calendar &mdash; Plan, create, and schedule your social media content.
          </p>
        </div>
      </footer>
    </div>
  );
}
