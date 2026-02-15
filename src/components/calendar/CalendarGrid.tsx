"use client";

import React, { useState, useMemo } from "react";
import { CalendarPost, AgentProfile } from "@/types";
import DayCell from "./DayCell";
import PostDetail from "./PostDetail";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarGridProps {
  year: number;
  month: number;
  posts: CalendarPost[];
  profile: AgentProfile;
  onPostUpdate: (post: CalendarPost) => void;
  onPostsReorder: (posts: CalendarPost[]) => void;
  onMonthChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  year,
  month,
  posts,
  profile,
  onPostUpdate,
  onPostsReorder,
  onMonthChange,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const { calendarDays } = useMemo(() => {
    const dim = new Date(year, month + 1, 0).getDate();
    const fdow = new Date(year, month, 1).getDay();
    const days: (number | null)[] = [];

    for (let i = 0; i < fdow; i++) days.push(null);
    for (let d = 1; d <= dim; d++) days.push(d);
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) days.push(null);
    }

    return { calendarDays: days };
  }, [year, month]);

  const postMap = useMemo(() => {
    const map = new Map<string, CalendarPost>();
    posts.forEach((p) => map.set(p.date, p));
    return map;
  }, [posts]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleDayClick = (dateStr: string) => {
    if (postMap.has(dateStr)) {
      setSelectedDate(dateStr);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activePost = posts.find((p) => p.id === active.id);
    const overPost = posts.find((p) => p.id === over.id);
    if (!activePost || !overPost) return;

    const updatedPosts = posts.map((p) => {
      if (p.id === activePost.id) return { ...p, date: overPost.date };
      if (p.id === overPost.id) return { ...p, date: activePost.date };
      return p;
    });

    onPostsReorder(updatedPosts);
  };

  const navigateMonth = (direction: number) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    onMonthChange(newYear, newMonth);
  };

  const selectedPost = selectedDate ? postMap.get(selectedDate) : undefined;

  const postCount = posts.length;
  const categoryBreakdown = posts.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {MONTH_NAMES[month]} {year}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {postCount} posts scheduled
            {postCount > 0 && (
              <span className="ml-2">
                &middot;{" "}
                {Object.entries(categoryBreakdown)
                  .map(([cat, count]) => `${count} ${cat}`)
                  .join(", ")}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date();
              onMonthChange(now.getFullYear(), now.getMonth());
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-semibold text-muted-foreground py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={posts.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, idx) => {
              const dateStr = day
                ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : "";
              const post = day ? postMap.get(dateStr) : undefined;

              return (
                <DayCell
                  key={idx}
                  day={day}
                  dateStr={dateStr}
                  post={post}
                  isToday={dateStr === todayStr}
                  onClick={handleDayClick}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-muted-foreground font-medium">Legend:</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Listing
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Educational
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Branding
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Engagement
        </span>
      </div>

      {/* Post Detail Slide-over */}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          profile={profile}
          onUpdate={(updated) => {
            onPostUpdate(updated);
            setSelectedDate(updated.date);
          }}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
