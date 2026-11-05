/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { NoticeFormData, FormErrors, NoticePriority, NoticeCategory } from '../types/notice';
import {
  DEPARTMENTS,
  CATEGORIES,
  AUDIENCE_OPTIONS,
  DESIGNATION_OPTIONS,
  COLLEGE_SHORT_NAME,
} from '../constants/departments';
import { validateNoticeForm } from '../utils/validation';

interface PostNoticeScreenProps {
  onBack: () => void;
  onSubmit: (formData: NoticeFormData) => Promise<void>;
}

export const PostNoticeScreen: React.FC<PostNoticeScreenProps> = ({
  onBack,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    departmentId: '',
    authorName: '',
    authorDesignation: 'Head of Department (HOD)',
    category: 'academic',
    priority: 'normal',
    targetAudience: 'All College (Students & Staff)',
    content: '',
    referenceNo: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Run validation
  const { isValid, errors } = validateNoticeForm(formData);

  const handleBlur = (field: keyof NoticeFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: keyof NoticeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const shouldShowError = (field: keyof NoticeFormData): boolean => {
    return (submitAttempted || touched[field]) && Boolean(errors[field]);
  };

  // Helper to auto-generate institutional reference number
  const handleAutoGenerateRef = () => {
    const dept = DEPARTMENTS.find((d) => d.id === formData.departmentId) || DEPARTMENTS[0];
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(Math.random() * 900) + 100;
    const generated = `KHIT/${dept.code}/${year}/${randomSeq}`;
    setFormData((prev) => ({ ...prev, referenceNo: generated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isValid) {
      // Focus on first error if any
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Failed to post notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Cancel posting notice"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Post Official Notice
            </h2>
            <p className="text-[11px] text-slate-400">
              Publish circular to college notice board
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Fill quick demo template for easy testing
            setFormData({
              title: 'Mid-Semester Technical Project Review Presentation Schedule',
              departmentId: 'dept_cse',
              authorName: 'Dr. P. Rajesh Kumar',
              authorDesignation: 'Head of Department (HOD)',
              category: 'academic',
              priority: 'important',
              targetAudience: '3rd Year Students',
              content: `All III B.Tech students are instructed to prepare their Phase-1 capstone project slides and live demo code for internal evaluation on November 15, 2026.\n\nEvaluation Panel Breakdown:\n- Panel A (Room 301): AI & Cloud Computing Projects\n- Panel B (Room 304): Embedded Systems & Cyber Security Projects\n\nDress code: Formal uniform with ID cards. Soft copies of documentation must be submitted to the project coordinator by 10 AM.`,
              referenceNo: 'KHIT/CSE/2026/091',
            });
          }}
          className="flex items-center gap-1 text-[11px] text-blue-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Auto-fill form with a realistic notice template"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Auto-fill Demo</span>
        </button>
      </header>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-24"
        noValidate
      >
        {/* Notice Title Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="notice-title">
              Notice Title <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[10px] font-mono ${
                formData.title.length > 120 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}
            >
              {formData.title.length}/120
            </span>
          </div>

          <input
            id="notice-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="e.g., Campus Placement Drive for Final Year B.Tech CSE"
            className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
              shouldShowError('title')
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />

          {shouldShowError('title') && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Issuing Department Field */}
        <div className="space-y-1">
          <label
            htmlFor="notice-department"
            className="block text-xs font-semibold text-slate-700"
          >
            Issuing Department / Branch <span className="text-rose-500">*</span>
          </label>

          <select
            id="notice-department"
            value={formData.departmentId}
            onChange={(e) => handleChange('departmentId', e.target.value)}
            onBlur={() => handleBlur('departmentId')}
            className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border text-slate-900 focus:outline-none transition-all ${
              shouldShowError('departmentId')
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">-- Choose College Department --</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                [{dept.code}] {dept.name}
              </option>
            ))}
          </select>

          {shouldShowError('departmentId') && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.departmentId}</span>
            </p>
          )}
        </div>

        {/* Signatory Name & Designation (2-column on wider screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Author Name */}
          <div className="space-y-1">
            <label
              htmlFor="notice-author"
              className="block text-xs font-semibold text-slate-700"
            >
              Signatory / Author Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="notice-author"
              type="text"
              value={formData.authorName}
              onChange={(e) => handleChange('authorName', e.target.value)}
              onBlur={() => handleBlur('authorName')}
              placeholder="e.g., Dr. P. Rajesh Kumar"
              className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                shouldShowError('authorName')
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {shouldShowError('authorName') && (
              <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.authorName}</span>
              </p>
            )}
          </div>

          {/* Author Designation */}
          <div className="space-y-1">
            <label
              htmlFor="notice-designation"
              className="block text-xs font-semibold text-slate-700"
            >
              Designation / Role <span className="text-rose-500">*</span>
            </label>
            <select
              id="notice-designation"
              value={formData.authorDesignation}
              onChange={(e) => handleChange('authorDesignation', e.target.value)}
              onBlur={() => handleBlur('authorDesignation')}
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DESIGNATION_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority & Urgency Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Priority / Urgency Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'normal', label: 'Normal', color: 'border-slate-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 text-slate-700' },
                { id: 'important', label: 'Important', color: 'border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 text-amber-900' },
                { id: 'urgent', label: 'Urgent Alert', color: 'border-slate-200 peer-checked:border-rose-500 peer-checked:bg-rose-50 text-rose-900' },
              ] as const
            ).map((p) => (
              <label
                key={p.id}
                className="cursor-pointer relative"
              >
                <input
                  type="radio"
                  name="priority"
                  value={p.id}
                  checked={formData.priority === p.id}
                  onChange={() => handleChange('priority', p.id as NoticePriority)}
                  className="peer sr-only"
                />
                <div
                  className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${p.color} hover:bg-slate-50`}
                >
                  {p.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Category & Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category */}
          <div className="space-y-1">
            <label
              htmlFor="notice-category"
              className="block text-xs font-semibold text-slate-700"
            >
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="notice-category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value as NoticeCategory)}
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1">
            <label
              htmlFor="notice-audience"
              className="block text-xs font-semibold text-slate-700"
            >
              Target Audience <span className="text-rose-500">*</span>
            </label>
            <select
              id="notice-audience"
              value={formData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AUDIENCE_OPTIONS.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Full Notice Content Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="notice-content">
              Full Notice Description & Body <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-[10px] font-mono ${
                formData.content.length < 20 && (submitAttempted || touched.content)
                  ? 'text-rose-500 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {formData.content.length} characters (min 20)
            </span>
          </div>

          <textarea
            id="notice-content"
            rows={5}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            onBlur={() => handleBlur('content')}
            placeholder="Enter the complete text of the notice, guidelines, schedule dates, or instructions..."
            className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none transition-all leading-relaxed ${
              shouldShowError('content')
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
                : 'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />

          {shouldShowError('content') && (
            <p className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.content}</span>
            </p>
          )}
        </div>

        {/* Optional Reference Number */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="notice-reference"
              className="block text-xs font-semibold text-slate-700"
            >
              Reference Number (Optional)
            </label>
            <button
              type="button"
              onClick={handleAutoGenerateRef}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
            >
              Generate Ref No.
            </button>
          </div>
          <input
            id="notice-reference"
            type="text"
            value={formData.referenceNo}
            onChange={(e) => handleChange('referenceNo', e.target.value)}
            placeholder="e.g., KHIT/CSE/2026/042 (leave blank to auto-create)"
            className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        {/* Validation Error Banner (if attempted and has issues) */}
        {submitAttempted && !isValid && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">Please correct the highlighted fields:</span>
              <ul className="list-disc list-inside mt-1 text-[11px] space-y-0.5 text-rose-700">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* On-device persistence notice */}
        <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Notices are stored directly in your device's persistent storage and remain available across restarts.
          </span>
        </div>
      </form>

      {/* Sticky Bottom Submit Bar */}
      <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-lg flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving to Device...</span>
            </div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Publish Notice</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};
