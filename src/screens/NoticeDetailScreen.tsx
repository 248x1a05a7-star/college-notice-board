/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Trash2,
  AlertTriangle,
  Clock,
  Building,
  User,
  Users,
  Tag,
  Check,
  Calendar,
  FileText,
} from 'lucide-react';
import { Notice } from '../types/notice';
import { COLLEGE_NAME, COLLEGE_SHORT_NAME } from '../constants/departments';

interface NoticeDetailScreenProps {
  notice: Notice;
  onBack: () => void;
  onDeleteNotice: (id: string) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
}

export const NoticeDetailScreen: React.FC<NoticeDetailScreenProps> = ({
  notice,
  onBack,
  onDeleteNotice,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleCopyNotice = () => {
    const textToCopy = `[${notice.referenceNo}]\n${COLLEGE_NAME}\n\n${notice.title}\nDepartment: ${notice.departmentName} (${notice.departmentCode})\nIssued: ${formatDate(notice.createdAt)}\nSignatory: ${notice.authorName} (${notice.authorDesignation})\nTarget: ${notice.targetAudience}\n\n${notice.content}\n\n-- Published via KHIT CampusBoard`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isUrgent = notice.priority === 'urgent';
  const isImportant = notice.priority === 'important';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Back to Notice List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold truncate max-w-[170px] text-slate-200">
            {notice.departmentCode} Circular
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Bookmark Button */}
          <button
            onClick={(e) => onToggleBookmark(notice.id, e)}
            className="p-2 rounded-full text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title={notice.isBookmarked ? 'Bookmarked' : 'Add bookmark'}
            aria-label="Bookmark notice"
          >
            <Bookmark
              className={`w-4 h-4 ${
                notice.isBookmarked ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>

          {/* Share/Copy Notice Button */}
          <button
            onClick={handleCopyNotice}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
            title="Copy notice text"
            aria-label="Share notice"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          {/* Delete Notice Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-full text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Delete this notice"
            aria-label="Delete notice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Copy notification banner */}
      {copied && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium animate-fadeIn shrink-0">
          Notice details copied to clipboard!
        </div>
      )}

      {/* Scrollable Notice Document Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Main Document Paper Sheet */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          {/* College Crest & Official Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="flex justify-center mb-2">
              <img
                src="/src/assets/images/campus_board_app_icon_1793894988564.jpg"
                alt="College Seal"
                className="w-14 h-14 rounded-full border-2 border-amber-500/60 shadow-xs object-cover"
              />
            </div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 font-display">
              {COLLEGE_NAME}
            </h2>
            <div className="text-[11px] font-semibold text-blue-800 tracking-wider uppercase mt-0.5">
              OFFICIAL CAMPUS CIRCULAR · {notice.departmentName}
            </div>
          </div>

          {/* Reference & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold">REF:</span>
              <span className="text-slate-900">{notice.referenceNo}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(notice.createdAt)}</span>
              </div>

              {isUrgent && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  <AlertTriangle className="w-3 h-3" />
                  URGENT
                </span>
              )}
              {isImportant && !isUrgent && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  <Clock className="w-3 h-3" />
                  IMPORTANT
                </span>
              )}
            </div>
          </div>

          {/* Full Notice Title (Handles very long text cleanly) */}
          <div className="pt-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug font-display break-words">
              {notice.title}
            </h1>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <Building className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Department
                </span>
                <span className="font-semibold text-slate-900">
                  {notice.departmentName} ({notice.departmentCode})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Target Audience
                </span>
                <span className="font-semibold text-slate-900">
                  {notice.targetAudience}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Issued By
                </span>
                <span className="font-semibold text-slate-900">
                  {notice.authorName}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  {notice.authorDesignation}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Category
                </span>
                <span className="capitalize font-semibold text-slate-900">
                  {notice.category} Announcement
                </span>
              </div>
            </div>
          </div>

          {/* Full Notice Content (Handles long paragraphs, whitespace, line breaks) */}
          <div className="pt-2 pb-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Notice Details
            </div>
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal break-words selection:bg-blue-100">
              {notice.content}
            </div>
          </div>

          {/* Institutional Signature Block */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-900">{notice.authorName}</div>
              <div className="text-slate-600">{notice.authorDesignation}</div>
              <div className="text-[11px] text-slate-400 font-medium">
                {notice.departmentName} · {COLLEGE_SHORT_NAME}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-[11px] text-slate-500 font-mono flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Verified On-Device Copy</span>
            </div>
          </div>
        </div>

        {/* Back and Share Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs active:scale-98"
          >
            ← Back to All Notices
          </button>
          <button
            onClick={handleCopyNotice}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Copy Full Notice</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Delete This Notice?
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-slate-900">"{notice.title}"</span> from your device? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteNotice(notice.id);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
