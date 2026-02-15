"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPost, AgentProfile } from "@/types";
import { exportToCSV, exportToICS, exportToPDF } from "@/lib/export-utils";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface ExportMenuProps {
  posts: CalendarPost[];
  profile: AgentProfile;
  year: number;
  month: number;
}

export default function ExportMenu({ posts, profile, year, month }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: "pdf" | "csv" | "ics") => {
    setExporting(type);
    try {
      switch (type) {
        case "pdf":
          await exportToPDF(posts, profile, year, month);
          break;
        case "csv":
          exportToCSV(posts, profile);
          break;
        case "ics":
          exportToICS(posts, profile);
          break;
      }
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(null);
      setOpen(false);
    }
  };

  if (posts.length === 0) return null;

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        <Download className="w-4 h-4 mr-2" />
        Export
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
            >
              {exporting === "pdf" ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              ) : (
                <FileText className="w-4 h-4 text-red-500" />
              )}
              <div className="text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-muted-foreground">Printable calendar</div>
              </div>
            </button>
            <button
              onClick={() => handleExport("csv")}
              disabled={exporting !== null}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
            >
              {exporting === "csv" ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-500" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-green-500" />
              )}
              <div className="text-left">
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-muted-foreground">Google Sheets / Excel</div>
              </div>
            </button>
            <button
              onClick={() => handleExport("ics")}
              disabled={exporting !== null}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-gray-50 transition-colors"
            >
              {exporting === "ics" ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Calendar className="w-4 h-4 text-blue-500" />
              )}
              <div className="text-left">
                <div className="font-medium">Export as ICS</div>
                <div className="text-xs text-muted-foreground">Google Calendar / Outlook</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
