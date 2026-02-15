"use client";

import React from "react";
import { CalendarPost, CATEGORY_COLORS, CATEGORY_EMOJIS } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DayCellProps {
  day: number | null;
  dateStr: string;
  post: CalendarPost | undefined;
  isToday: boolean;
  onClick: (dateStr: string) => void;
}

function PostChip({ post }: { post: CalendarPost }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const bgColors: Record<string, string> = {
    listing: "bg-green-50 border-green-200 text-green-800",
    educational: "bg-blue-50 border-blue-200 text-blue-800",
    branding: "bg-amber-50 border-amber-200 text-amber-800",
    engagement: "bg-purple-50 border-purple-200 text-purple-800",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`text-[10px] sm:text-xs leading-tight px-1.5 py-1 rounded-md border cursor-grab active:cursor-grabbing truncate ${bgColors[post.category]}`}
    >
      <span className="mr-0.5">{CATEGORY_EMOJIS[post.category]}</span>
      <span className="hidden sm:inline">{post.caption.slice(0, 30)}...</span>
      <span className="sm:hidden">{post.caption.slice(0, 15)}...</span>
    </div>
  );
}

export default function DayCell({ day, dateStr, post, isToday, onClick }: DayCellProps) {
  if (day === null) {
    return <div className="min-h-[80px] sm:min-h-[100px] bg-gray-50/50 rounded-lg" />;
  }

  return (
    <div
      onClick={() => onClick(dateStr)}
      className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${
        isToday
          ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
          : post
          ? "border-gray-200 bg-white"
          : "border-gray-100 bg-white/70"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-xs sm:text-sm font-medium ${
            isToday
              ? "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
              : "text-gray-500"
          }`}
        >
          {day}
        </span>
        {post && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[post.category] }}
          />
        )}
      </div>
      {post && <PostChip post={post} />}
    </div>
  );
}

export { PostChip };
