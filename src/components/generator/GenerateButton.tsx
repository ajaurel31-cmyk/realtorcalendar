"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onGenerate: () => Promise<void>;
  hasExistingPosts: boolean;
}

export default function GenerateButton({ onGenerate, hasExistingPosts }: GenerateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = async () => {
    if (hasExistingPosts && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setShowConfirm(false);
    setLoading(true);
    try {
      await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber-600 font-medium">Replace existing posts?</span>
        <Button size="sm" variant="destructive" onClick={handleClick}>
          Yes, regenerate
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="shadow-md shadow-primary/20">
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate My Month
        </>
      )}
    </Button>
  );
}
