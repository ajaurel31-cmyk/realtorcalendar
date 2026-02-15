"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AgentProfile,
  Platform,
  PostingCadence,
  PLATFORM_LABELS,
} from "@/types";
import {
  X,
  User,
  MapPin,
  Palette,
  Hash,
  Clock,
  Share2,
  Trash2,
  Plus,
} from "lucide-react";

interface CustomizePanelProps {
  profile: AgentProfile;
  onUpdate: (profile: AgentProfile) => void;
  onClose: () => void;
}

const CADENCE_OPTIONS: { value: PostingCadence; label: string }[] = [
  { value: "3x-mwf", label: "3x/week (Mon, Wed, Fri)" },
  { value: "3x-tts", label: "3x/week (Tue, Thu, Sat)" },
  { value: "4x", label: "4x/week" },
  { value: "5x", label: "5x/week (Weekdays)" },
];

export default function CustomizePanel({ profile, onUpdate, onClose }: CustomizePanelProps) {
  const [localProfile, setLocalProfile] = useState<AgentProfile>({ ...profile });
  const [newHashtag, setNewHashtag] = useState("");

  const update = (changes: Partial<AgentProfile>) => {
    const updated = { ...localProfile, ...changes };
    setLocalProfile(updated);
    onUpdate(updated);
  };

  const togglePlatform = (platform: Platform) => {
    const platforms = localProfile.platforms.includes(platform)
      ? localProfile.platforms.filter((p) => p !== platform)
      : [...localProfile.platforms, platform];
    update({ platforms });
  };

  const addHashtagGroup = () => {
    if (!newHashtag.trim()) return;
    const tags = newHashtag
      .split(/[\s,]+/)
      .map((t) => (t.startsWith("#") ? t : `#${t}`))
      .filter((t) => t.length > 1);
    if (tags.length > 0) {
      update({ customHashtags: [...localProfile.customHashtags, tags] });
      setNewHashtag("");
    }
  };

  const removeHashtagGroup = (index: number) => {
    update({
      customHashtags: localProfile.customHashtags.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl border-l border-gray-100 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                <Input
                  value={localProfile.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Brokerage</label>
                <Input
                  value={localProfile.brokerage}
                  onChange={(e) => update({ brokerage: e.target.value })}
                  placeholder="Your brokerage"
                />
              </div>
            </div>
          </section>

          {/* Market */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Market
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">City</label>
                <Input
                  value={localProfile.city}
                  onChange={(e) => update({ city: e.target.value })}
                  placeholder="Your city"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Market area</label>
                <Input
                  value={localProfile.market}
                  onChange={(e) => update({ market: e.target.value })}
                  placeholder="e.g. Greater Metro Area"
                />
              </div>
            </div>
          </section>

          {/* Posting Cadence */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Posting Cadence
            </h3>
            <div className="space-y-2">
              {CADENCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => update({ postingCadence: option.value })}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-all ${
                    localProfile.postingCadence === option.value
                      ? "border-primary bg-primary/5 text-foreground font-medium"
                      : "border-gray-100 text-muted-foreground hover:border-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* Platforms */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    localProfile.platforms.includes(platform)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {PLATFORM_LABELS[platform]}
                </button>
              ))}
            </div>
          </section>

          {/* Brand Colors */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              Brand Colors
            </h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localProfile.brandColors.primary}
                    onChange={(e) =>
                      update({
                        brandColors: { ...localProfile.brandColors, primary: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={localProfile.brandColors.primary}
                    onChange={(e) =>
                      update({
                        brandColors: { ...localProfile.brandColors, primary: e.target.value },
                      })
                    }
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localProfile.brandColors.accent}
                    onChange={(e) =>
                      update({
                        brandColors: { ...localProfile.brandColors, accent: e.target.value },
                      })
                    }
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={localProfile.brandColors.accent}
                    onChange={(e) =>
                      update({
                        brandColors: { ...localProfile.brandColors, accent: e.target.value },
                      })
                    }
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Custom Hashtags */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <Hash className="w-4 h-4 text-muted-foreground" />
              Custom Hashtag Groups
            </h3>
            {localProfile.customHashtags.length > 0 && (
              <div className="space-y-2 mb-3">
                {localProfile.customHashtags.map((group, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-gray-50 rounded-lg p-2"
                  >
                    <div className="flex-1 flex flex-wrap gap-1">
                      {group.map((tag, j) => (
                        <span
                          key={j}
                          className="text-xs bg-white text-muted-foreground px-2 py-0.5 rounded border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeHashtagGroup(i)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                placeholder="Enter hashtags separated by spaces"
                onKeyDown={(e) => e.key === "Enter" && addHashtagGroup()}
                className="text-sm"
              />
              <Button variant="outline" size="icon" onClick={addHashtagGroup}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
