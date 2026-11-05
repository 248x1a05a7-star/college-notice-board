/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Search, X, RotateCcw } from 'lucide-react';
import { Department, Notice } from '../types/notice';
import { DEPARTMENTS } from '../constants/departments';

interface DepartmentFilterScreenProps {
  selectedDepartment: Department | null;
  notices: Notice[];
  onSelectDepartment: (dept: Department | null) => void;
  onBack: () => void;
}

export const DepartmentFilterScreen: React.FC<DepartmentFilterScreenProps> = ({
  selectedDepartment,
  notices,
  onSelectDepartment,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<Department | null>(selectedDepartment);

  // Calculate count of notices per department
  const noticeCountsByDept = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notices) {
      map[n.departmentId] = (map[n.departmentId] || 0) + 1;
    }
    return map;
  }, [notices]);

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return DEPARTMENTS;
    const q = searchQuery.toLowerCase();
    return DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.shortName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleApply = () => {
    onSelectDepartment(tempSelected);
    onBack();
  };

  const handleReset = () => {
    setTempSelected(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Back to notices"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Filter by Department
            </h2>
            <p className="text-[11px] text-slate-400">
              Select a branch to view targeted circulars
            </p>
          </div>
        </div>

        {tempSelected && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </header>

      {/* Search Input for Departments */}
      <div className="p-3 bg-white border-b border-slate-200 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department or branch code..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Departments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
        {/* Option 0: All Departments */}
        <div
          onClick={() => setTempSelected(null)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setTempSelected(null);
            }
          }}
          className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${
            tempSelected === null
              ? 'bg-blue-50/70 border-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                tempSelected === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              ALL
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                All Departments & Units
              </div>
              <div className="text-xs text-slate-500">
                Show every notice from the entire campus
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {notices.length}
            </span>
            {tempSelected === null && (
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* Section divider */}
        <div className="pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Academic & Administrative Wings
        </div>

        {/* Filtered Department items */}
        {filteredDepartments.map((dept) => {
          const isSelected = tempSelected?.id === dept.id;
          const count = noticeCountsByDept[dept.id] || 0;

          return (
            <div
              key={dept.id}
              onClick={() => setTempSelected(dept)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setTempSelected(dept);
                }
              }}
              className={`w-full p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white"
                  style={{ backgroundColor: dept.color }}
                >
                  {dept.code.substring(0, 4)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {dept.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Code: {dept.code} · {dept.shortName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                    count > 0
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {count}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredDepartments.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            No department matches "{searchQuery}".
          </div>
        )}
      </div>

      {/* Sticky Bottom Apply Bar */}
      <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-lg flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>
            {tempSelected
              ? `Apply: ${tempSelected.shortName} (${noticeCountsByDept[tempSelected.id] || 0})`
              : `Show All Departments (${notices.length})`}
          </span>
        </button>
      </footer>
    </div>
  );
};
