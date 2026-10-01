import React from 'react';
import {
  ScanLine,
  Receipt,
  Sparkles,
  BarChart3,
  GraduationCap,
  CheckCircle2,
  Moon,
  Clock,
  BookOpen,
} from 'lucide-react';
import { PortfolioApp } from '../types';

interface AppMockupPreviewProps {
  app: PortfolioApp;
  isDetailed?: boolean;
}

export const AppMockupPreview: React.FC<AppMockupPreviewProps> = ({
  app,
  isDetailed = false,
}) => {
  const { mockupType, id } = app;

  if (app.screenshotUrl) {
    return (
      <div className={`relative w-full overflow-hidden bg-black rounded-2xl border border-neutral-800 ${isDetailed ? 'h-64 sm:h-72' : 'h-52'}`}>
        <div className="absolute top-2.5 end-2.5 z-10 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-black/80 backdrop-blur text-white border border-neutral-700">
          معاينة الواجهة · Preview
        </div>
        <img
          src={app.screenshotUrl}
          alt={app.name.en}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden bg-black text-neutral-300 rounded-2xl border border-neutral-800 select-none shadow-sm ${
        isDetailed ? 'h-64 sm:h-72' : 'h-52'
      }`}
    >
      {/* Top simulated window bar (Strict Monochrome) */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800 bg-neutral-950 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
        </div>
        <div className="text-[11px] font-mono text-neutral-400 truncate max-w-[170px]">
          arixon://{app.id}
        </div>
        <div className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-neutral-900 border border-neutral-800 text-neutral-300">
          معاينة الواجهة
        </div>
      </div>

      {/* Screen body depending on mockupType (Pure Monochrome) */}
      <div className="p-3.5 h-[calc(100%-37px)] flex flex-col justify-between">
        {/* 1. POS Cashier Terminal */}
        {(mockupType === 'pos' || id === 'arixon-pos') && (
          <div className="h-full flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Subtotal</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">$342.50</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Items</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">14 pcs</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Speed</div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">0.18s</div>
              </div>
            </div>

            <div className="space-y-1.5 my-2">
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-white text-xs truncate">Sample item #89 · Barcode scan</span>
                </div>
                <span className="font-mono text-white text-xs tabular-nums">$18.00</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-white text-xs truncate">Thermal receipt printer linked</span>
                </div>
                <span className="font-mono text-white text-xs tabular-nums">$7.50</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1 text-white">
                <CheckCircle2 className="w-3 h-3 text-white" /> Offline-First Ledger
              </span>
              <span className="font-mono text-neutral-300">Shift #14 Closed</span>
            </div>
          </div>
        )}

        {/* 2. Educational Centers & Student Studios */}
        {((mockupType === 'stats' && id !== 'arixon-pos') || id === 'edu-centers-management' || id === 'arixon-students-studios') && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <GraduationCap className="w-4 h-4 text-neutral-300" />
                <span>
                  {id === 'arixon-students-studios' ? 'Electronic Exam & Quiz Bank' : 'Educational Center Hub'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                {id === 'arixon-students-studios' ? 'QUIZ: 20 MIN' : '98.4% ATTENDANCE'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 my-2 items-end h-16 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-neutral-700 rounded-t h-8" />
                <span className="text-[9px] text-neutral-400">Grade 10</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-neutral-600 rounded-t h-11" />
                <span className="text-[9px] text-neutral-400">Grade 11</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-neutral-500 rounded-t h-9" />
                <span className="text-[9px] text-neutral-400">Grade 12</span>
              </div>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-full bg-white rounded-t h-14" />
                <span className="text-[9px] text-white font-bold">Exam Hub</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
              <span className="text-white">
                {id === 'arixon-students-studios' ? 'Model answers & instant scores' : 'Teacher splits & student fees'}
              </span>
              <span className="font-mono text-neutral-300">0 Room Conflicts</span>
            </div>
          </div>
        )}

        {/* 3. Arixon AI Studio */}
        {(mockupType === 'ai_gen' || id === 'arixon-ai') && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Arixon AI Visual Studio</span>
              </div>
              <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                4K EXPORT
              </span>
            </div>

            <div className="my-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="text-[11px] text-neutral-400 truncate max-w-[210px]">
                &quot;Studio lighting commercial product visual on dark obsidian...&quot;
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-white text-black rounded font-bold shrink-0">
                Synthesize
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] text-neutral-300">
                1:1 Post
              </div>
              <div className="h-10 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[9px] text-white font-medium">
                9:16 Story
              </div>
              <div className="h-10 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[9px] text-neutral-300">
                16:9 Banner
              </div>
            </div>
          </div>
        )}

        {/* 4. Musalla Sayyidna Muhammad */}
        {(mockupType === 'school' || id === 'musalla-sayyidna-muhammad') && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Moon className="w-4 h-4 text-white" />
                <span>مصلى سيدنا محمد · Prayer & Timetable</span>
              </div>
              <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                SYNCHRONIZED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800 text-center">
                <div className="text-[10px] text-neutral-400">Fajr</div>
                <div className="text-xs font-bold text-white font-mono">04:32 AM</div>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800 text-center">
                <div className="text-[10px] text-neutral-400">Dhuhr</div>
                <div className="text-xs font-bold text-white font-mono">12:15 PM</div>
              </div>
              <div className="bg-neutral-800 p-2 rounded border border-neutral-700 text-center">
                <div className="text-[10px] text-neutral-300">Asr (Next)</div>
                <div className="text-xs font-bold text-white font-mono">03:30 PM</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
              <span className="flex items-center gap-1 text-white">
                <Clock className="w-3 h-3" /> Iqamah in 28m
              </span>
              <span className="text-neutral-300">Ad-Free Spiritual Interface</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
