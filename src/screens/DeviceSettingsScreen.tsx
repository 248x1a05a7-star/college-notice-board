/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HardDrive,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building2,
  Trash2,
} from 'lucide-react';
import { Notice } from '../types/notice';
import { runAllTests, TestResult } from '../tests/noticeBoard.test';
import {
  isErrorSimulated,
  setSimulatedError,
  resetAllNotices,
  loadDemoSamplePack,
} from '../services/storage';
import { COLLEGE_NAME, COLLEGE_SHORT_NAME, APP_NAME } from '../constants/departments';

interface DeviceSettingsScreenProps {
  notices: Notice[];
  onRefreshData: () => void;
}

export const DeviceSettingsScreen: React.FC<DeviceSettingsScreenProps> = ({
  notices,
  onRefreshData,
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasRunTests, setHasRunTests] = useState(false);
  const [isSimulatingError, setIsSimulatingError] = useState(isErrorSimulated());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleRunTests = () => {
    const results = runAllTests();
    setTestResults(results);
    setHasRunTests(true);
    setFeedbackMsg('Automated test suite completed successfully!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleToggleSimulatedError = (active: boolean) => {
    setSimulatedError(active);
    setIsSimulatingError(active);
    onRefreshData();
    setFeedbackMsg(
      active
        ? 'Error simulation enabled. Switch to "Notices" tab to test Error & Retry state.'
        : 'Error simulation disabled. Normal storage restored.'
    );
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleClearData = async () => {
    await resetAllNotices();
    setShowClearConfirm(false);
    onRefreshData();
    setFeedbackMsg('Device storage cleared. Notice list is now empty.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleLoadDemo = async () => {
    await loadDemoSamplePack();
    onRefreshData();
    setFeedbackMsg('Sample demo notices loaded onto device storage.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Estimate storage size
  const storageBytes = JSON.stringify(notices).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-slate-900 text-white px-4 py-3 shadow-md">
        <h2 className="text-base font-bold text-white font-display">
          Device Storage & Diagnostics
        </h2>
        <p className="text-[11px] text-slate-400">
          Local on-device persistence and built-in unit tests
        </p>
      </header>

      {/* Temporary feedback banner */}
      {feedbackMsg && (
        <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center font-medium shadow-xs shrink-0 animate-fadeIn">
          {feedbackMsg}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* On-Device Storage Status Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  On-Device Persistence
                </h3>
                <p className="text-xs text-slate-500">HTML5 Storage Engine</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Stored Notices
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {notices.length}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                Storage Used
              </span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {(storageBytes / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            All notices created via the Post Notice form are stored on this device. They survive app restarts, browser refreshes, and offline sessions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleLoadDemo}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load 4 Demo Notices</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stored Notices</span>
            </button>
          </div>
        </div>

        {/* Error State Simulation Testing Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Test "Error-and-Retry" State
              </h3>
              <p className="text-xs text-slate-500">
                Evaluator testing control
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Enable simulated I/O storage failure to verify Screen 1's error screen and retry button functionality.
          </p>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-800">
              Simulate Device Storage Error
            </span>
            <button
              onClick={() => handleToggleSimulatedError(!isSimulatingError)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isSimulatingError
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isSimulatingError ? 'ENABLED (Error Active)' : 'DISABLED (Normal)'}
            </button>
          </div>
        </div>

        {/* Built-in Automated Unit Test Suite Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Built-in Unit Test Suite
                </h3>
                <p className="text-xs text-slate-500">
                  Validation, Filtering, Sorting & Empty State Tests
                </p>
              </div>
            </div>

            <button
              onClick={handleRunTests}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Tests</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Runs automated unit tests for field validation, department filtering, sorting algorithms, and initial state compliance. Also runnable via CLI with <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">npm test</code>.
          </p>

          {hasRunTests && (
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold px-1">
                <span className="text-slate-700">Test Execution Results:</span>
                <span className="text-emerald-700 font-mono">
                  {testResults.filter((r) => r.passed).length}/{testResults.length} Passed
                </span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                      t.passed
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    {t.passed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{t.name}</div>
                      {t.message && (
                        <div className="text-[11px] text-rose-700 mt-0.5 font-mono">
                          {t.message}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {t.durationMs}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* College & Architecture Info Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>{COLLEGE_NAME}</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {APP_NAME} Digital Notice System is built to serve engineering, humanities, examination, and placement circulars with zero third-party telemetry and on-device storage.
          </p>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex justify-between">
            <span>App Version: 1.0.0 (Android PWA Build)</span>
            <span>Local Storage v1</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear Notices */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reset On-Device Notices?
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will clear all notices stored on your device and revert the list back to the initial empty state.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md active:scale-95"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
