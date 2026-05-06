"use client";

import { Calendar, Filter, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPACES = ["All Spaces", "Hot Desk", "Meeting Room", "Private Office"];

export function BookingsFilters() {
  const [activeSpace, setActiveSpace] = useState("All Spaces");

  return (
    <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Oct 12 - Oct 19, 2023
          </span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div className="flex flex-wrap gap-2">
          {SPACES.map((space) => (
            <button
              key={space}
              onClick={() => setActiveSpace(space)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors border outline-none",
                activeSpace === space
                  ? "bg-primary text-white border-primary"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-100 dark:border-slate-700"
              )}
            >
              {space}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors bg-white dark:bg-slate-900 shadow-sm active:scale-95">
          <Filter className="h-5 w-5" />
        </button>
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors bg-white dark:bg-slate-900 shadow-sm active:scale-95">
          <Download className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
