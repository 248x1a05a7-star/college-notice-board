/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { Notice } from '../types/notice';

interface NoticeCardProps {
  notice: Notice;
  onSelect: (notice: Notice) => void;
  onToggleBookmark?: (id: string, e: React.MouseEvent) => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  notice,
  onSelect,
  onToggleBookmark,
}) => {
  // Format publication date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const isUrgent = notice.priority === 'urgent';
  const isImportant = notice.priority === 'important';

  return (
    <article
      onClick={() => onSelect(notice)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(notice);
        }
      }}
      className={`group w-full p-4 mb-3 rounded-2xl bg-white border transition-all duration-200 cursor-pointer text-left relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        isUrgent
          ? 'border-rose-300 shadow-sm shadow-rose-100 hover:border-rose-400 bg-rose-50/20'
          : isImportant
          ? 'border-amber-200 shadow-sm shadow-amber-50 hover:border-amber-300'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      } active:scale-[0.99]`}
    >
      {/* Top Metadata Row: Department · Date · Urgency */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-blue-700 tracking-wider">
            {notice.departmentCode}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600 font-medium truncate max-w-[150px]">
            {notice.departmentName}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-400 whitespace-nowrap">
            {formatDate(notice.createdAt)}
          </span>
        </div>

        {/* Priority Badge */}
        {isUrgent && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 whitespace-nowrap shrink-0">
            <AlertTriangle className="w-3 h-3" />
            URGENT
          </span>
        )}
        {isImportant && !isUrgent && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3" />
            IMPORTANT
          </span>
        )}
      </div>

      {/* Notice Title: Handles long titles with proper break */}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors leading-snug line-clamp-2 mb-1.5 break-words">
        {notice.title}
      </h3>

      {/* Preview Excerpt */}
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 break-words">
        {notice.content}
      </p>

      {/* Footer Info: Author & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="truncate pr-2">
          <span className="font-medium text-slate-700">{notice.authorName}</span>
          <span className="text-slate-400"> ({notice.authorDesignation})</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(notice.id, e);
              }}
              aria-label={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  notice.isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
            </button>
          )}
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
};
