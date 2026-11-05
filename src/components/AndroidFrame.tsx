/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Smartphone,
  Maximize2,
  Minimize2,
  Newspaper,
  Filter,
  PlusCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { ScreenId } from '../types/notice';

interface AndroidFrameProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  children: React.ReactNode;
  activeFilterCount?: number;
  noticeCount?: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentScreen,
  onNavigate,
  children,
  activeFilterCount = 0,
  noticeCount = 0,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);

  // Live status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 transition-colors">
      {/* Top Desktop Utility Bar (Controls Phone vs Full-Screen View & Quick Info) */}
      <header className="w-full max-w-5xl mb-2 sm:mb-4 px-4 py-2 flex items-center justify-between gap-4 text-xs font-medium text-slate-300 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-slate-200">CampusBoard Android App</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">KHIT Guntur Digital Notice Board</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneView(!isPhoneView)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 active:scale-95"
            title="Toggle between Android Phone Frame and Responsive Expanded View"
          >
            {isPhoneView ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Either centered Android Phone Shell or Responsive Fluid Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneView
            ? 'max-w-[430px] h-[92vh] max-h-[920px] rounded-[44px] shadow-2xl shadow-black/80 border-[8px] border-slate-800 ring-1 ring-slate-700/60 overflow-hidden relative bg-slate-50 text-slate-900'
            : 'max-w-4xl min-h-[85vh] rounded-2xl shadow-xl border border-slate-800 overflow-hidden bg-slate-50 text-slate-900 relative'
        }`}
      >
        {/* Android Status Bar */}
        <div className="w-full bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0 z-30">
          <div className="font-semibold tracking-wide text-[13px]">{currentTime}</div>

          {/* Camera Notch / Dynamic Pill Indicator */}
          {isPhoneView && (
            <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            {/* Cellular signal bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <div className="w-0.5 h-1 bg-slate-300 rounded-sm"></div>
              <div className="w-0.5 h-1.5 bg-slate-300 rounded-sm"></div>
              <div className="w-0.5 h-2 bg-slate-300 rounded-sm"></div>
              <div className="w-0.5 h-2.5 bg-slate-300 rounded-sm"></div>
            </div>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span>98%</span>
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Dynamic App Body (Screens render here) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-50">
          {children}
        </main>

        {/* Android Bottom Navigation Bar (Material Design 3 style) */}
        <nav
          aria-label="Android Bottom Navigation"
          className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shrink-0 z-20 shadow-md"
        >
          {/* Tab 1: Notices Feed */}
          <button
            onClick={() => onNavigate('feed')}
            className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'feed'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-colors ${
                currentScreen === 'feed' ? 'bg-blue-100' : 'bg-transparent'
              }`}
            >
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 whitespace-nowrap">Notices</span>
          </button>

          {/* Tab 2: Departments Filter */}
          <button
            onClick={() => onNavigate('filter')}
            className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl relative transition-all ${
              currentScreen === 'filter'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-full relative transition-colors ${
                currentScreen === 'filter' ? 'bg-blue-100' : 'bg-transparent'
              }`}
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 whitespace-nowrap">Departments</span>
          </button>

          {/* Tab 3: Post Notice Form */}
          <button
            onClick={() => onNavigate('post')}
            className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'post'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-colors ${
                currentScreen === 'post' ? 'bg-blue-100' : 'bg-transparent'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 whitespace-nowrap">Post Notice</span>
          </button>

          {/* Tab 4: Device & Test Runner */}
          <button
            onClick={() => onNavigate('device')}
            className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
              currentScreen === 'device'
                ? 'text-blue-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-colors ${
                currentScreen === 'device' ? 'bg-blue-100' : 'bg-transparent'
              }`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 whitespace-nowrap">Device / Tests</span>
          </button>
        </nav>

        {/* Android Home Gesture Pill Bar (At bottom of phone shell) */}
        <div className="w-full bg-white pb-2 pt-1 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
