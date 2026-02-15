"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CalendarPost,
  AgentProfile,
  Platform,
  CATEGORY_LABELS,
  CATEGORY_EMOJIS,
  CATEGORY_COLORS,
  PLATFORM_LABELS,
} from "@/types";
import { regeneratePost } from "@/lib/calendar-generator";
import { copyToClipboard } from "@/lib/export-utils";
import {
  X,
  RefreshCw,
  Copy,
  Check,
  ImageIcon,
  Clock,
  Hash,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PostDetailProps {
  post: CalendarPost;
  profile: AgentProfile;
  onUpdate: (post: CalendarPost) => void;
  onClose: () => void;
}

export default function PostDetail({ post, profile, onUpdate, onClose }: PostDetailProps) {
  const [editedPost, setEditedPost] = useState<CalendarPost>(post);
  const [copied, setCopied] = useState(false);
  const [showHashtags, setShowHashtags] = useState(false);

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleRegenerate = () => {
    const newPost = regeneratePost(editedPost, profile);
    setEditedPost(newPost);
    onUpdate(newPost);
  };

  const handleCopy = async () => {
    const fullText = editedPost.caption + "\n\n" + editedPost.hashtags.join(" ");
    await copyToClipboard(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlatform = (platform: Platform) => {
    const updated = {
      ...editedPost,
      platforms: editedPost.platforms.includes(platform)
        ? editedPost.platforms.filter((p) => p !== platform)
        : [...editedPost.platforms, platform],
    };
    setEditedPost(updated);
    onUpdate(updated);
  };

  const handleCaptionChange = (caption: string) => {
    const updated = { ...editedPost, caption };
    setEditedPost(updated);
    onUpdate(updated);
  };

  const handleNotesChange = (notes: string) => {
    const updated = { ...editedPost, notes };
    setEditedPost(updated);
    onUpdate(updated);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl border-l border-gray-100 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[editedPost.category] }}
                />
                <Badge variant={editedPost.category as "listing" | "educational" | "branding" | "engagement"}>
                  {CATEGORY_EMOJIS[editedPost.category]} {CATEGORY_LABELS[editedPost.category]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(editedPost.date)}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-5">
          {/* Caption */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Caption
            </label>
            <Textarea
              value={editedPost.caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="min-h-[140px] text-sm"
            />
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLATFORM_LABELS) as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    editedPost.platforms.includes(platform)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {PLATFORM_LABELS[platform]}
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Image */}
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-900">Suggested Image</span>
            </div>
            <p className="text-sm text-blue-700">{editedPost.suggestedImageType}</p>
          </div>

          {/* Best Time */}
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-900">Best Time to Post</span>
            </div>
            <p className="text-sm text-amber-700">{editedPost.bestTimeToPost}</p>
          </div>

          {/* Hashtags */}
          <div>
            <button
              onClick={() => setShowHashtags(!showHashtags)}
              className="flex items-center justify-between w-full text-sm font-medium text-foreground mb-2"
            >
              <span className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Hashtags ({editedPost.hashtags.length})
              </span>
              {showHashtags ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {showHashtags && (
              <div className="flex flex-wrap gap-1.5">
                {editedPost.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-muted-foreground px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Private Notes
            </label>
            <Textarea
              value={editedPost.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add your own notes here..."
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
