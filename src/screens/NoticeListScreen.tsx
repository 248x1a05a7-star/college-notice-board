/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  AlertCircle,
  FileQuestion,
  X,
  ArrowUpDown,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Notice, Department, ScreenId } from '../types/notice';
import { NoticeCard } from '../components/NoticeCard';
import { COLLEGE_SHORT_NAME, APP_NAME } from '../constants/departments';

interface NoticeListScreenProps {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  selectedDepartment: Department | null;
  onClearDepartmentFilter: () => void;
  onOpenFilterScreen: () => void;
  onSelectNotice: (notice: Notice) => void;
  onNavigate: (screen: ScreenId) => void;
  onReload: () => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onLoadDemoPack: () => void;
}

export const NoticeListScreen: React.FC<NoticeListScreenProps> = ({
  notices,
  isLoading,
  error,
  selectedDepartment,
  onClearDepartmentFilter,
  onOpenFilterScreen,
  onSelectNotice,
  onNavigate,
  onReload,
  onToggleBookmark,
  onLoadDemoPack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    let result = [...notices];

    // Filter by department if selected
    if (selectedDepartment) {
      result = result.filter((n) => n.departmentId === selectedDepartment.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.departmentName.toLowerCase().includes(q) ||
          n.authorName.toLowerCase().includes(q) ||
          n.referenceNo.toLowerCase().includes(q)
      );
    }

    // Sort notices
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'priority') {
      const rank = { urgent: 3, important: 2, normal: 1 };
      result.sort((a, b) => rank[b.priority] - rank[a.priority]);
    }

    return result;
  }, [notices, selectedDepartment, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      {/* Screen Top App Bar */}
      <header className="sticky top-0 z-10 bg-slate-900 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/src/assets/images/campus_board_app_icon_1793894988564.jpg"
              alt="CampusBoard Crest"
              className="w-8 h-8 rounded-full border border-amber-400/50 shadow-xs shrink-0 object-cover"
              onError={(e) => {
                // Fallback styled SVG container if image load fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight truncate leading-tight font-display text-white">
                {APP_NAME}
              </h1>
              <p className="text-[11px] text-slate-300 truncate font-medium">
                {COLLEGE_SHORT_NAME} · Official Notice Board
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Search notices"
              title="Search notices"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Department Filter Trigger */}
            <button
              onClick={onOpenFilterScreen}
              className={`p-2 rounded-full transition-colors relative ${
                selectedDepartment
                  ? 'text-amber-400 bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Filter by department"
              title="Department Filters"
            >
              <Filter className="w-5 h-5" />
              {selectedDepartment && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            {/* Reload / Refresh Button */}
            <button
              onClick={onReload}
              disabled={isLoading}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              aria-label="Refresh notices"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, circulars, or keywords..."
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-800 text-white rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 border border-slate-700"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Subheader Toolbar: Active Filter Chip & Sort Options */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {selectedDepartment ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold whitespace-nowrap">
              <span>Dept: {selectedDepartment.shortName}</span>
              <button
                onClick={onClearDepartmentFilter}
                className="hover:text-blue-950 p-0.5"
                title="Clear department filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="font-medium text-slate-600">All College Departments</span>
          )}

          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-mono">
            {filteredNotices.length} {filteredNotices.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')}
            className="text-[11px] bg-transparent text-slate-700 font-medium border-none focus:outline-none cursor-pointer pr-1"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">High Priority</option>
          </select>
        </div>
      </div>

      {/* Content Area: Handles all 4 states */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* STATE 1: LOADING STATE */}
        {isLoading && (
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Checking device storage for notices...</span>
            </div>
            {/* Shimmer skeleton cards */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3.5 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STATE 2: ERROR-AND-RETRY STATE */}
        {!isLoading && error && (
          <div className="my-8 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-rose-900 mb-1">
              Notice Board Sync Failure
            </h3>
            <p className="text-xs text-rose-700 max-w-sm mb-4 leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={onReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Loading</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: EMPTY STATE (Starts empty by requirement!) */}
        {!isLoading && !error && filteredNotices.length === 0 && (
          <div className="my-8 px-4 py-8 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold font-display text-slate-900 mb-1.5">
              {searchQuery || selectedDepartment
                ? 'No Matching Notices Found'
                : 'Notice Board is Empty'}
            </h3>

            <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
              {searchQuery || selectedDepartment
                ? 'No notices match your current search query or department filter. Try clearing filters.'
                : 'There are currently no active notices on this device. Be the first to publish an official circular or exam announcement.'}
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              {selectedDepartment || searchQuery ? (
                <button
                  onClick={() => {
                    onClearDepartmentFilter();
                    setSearchQuery('');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                >
                  Clear All Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('post')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post First Notice</span>
                  </button>

                  <button
                    onClick={onLoadDemoPack}
                    className="w-full py-2 px-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Load Demo Pack (4 Sample Notices)</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* STATE 4: DATA STATE (List of notices) */}
        {!isLoading && !error && filteredNotices.length > 0 && (
          <div className="space-y-1 pb-16">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onSelect={onSelectNotice}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

      {/* Android Floating Action Button (FAB) at bottom-right */}
      <button
        onClick={() => onNavigate('post')}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        title="Post New Notice"
        aria-label="Post New Notice"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-bold pr-1">Post Notice</span>
      </button>
    </div>
  );
};
