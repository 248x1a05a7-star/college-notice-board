/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenId, Notice, Department, NoticeFormData } from './types/notice';
import {
  fetchNotices,
  persistNotice,
  removeNotice,
  toggleNoticeBookmark,
  loadDemoSamplePack,
} from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { NoticeListScreen } from './screens/NoticeListScreen';
import { DepartmentFilterScreen } from './screens/DepartmentFilterScreen';
import { NoticeDetailScreen } from './screens/NoticeDetailScreen';
import { PostNoticeScreen } from './screens/PostNoticeScreen';
import { DeviceSettingsScreen } from './screens/DeviceSettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('feed');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient Android snackbar message
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Fetch notices from device storage
  const loadNoticesFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNotices();
      setNotices(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load notices from device storage.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on component mount
  useEffect(() => {
    loadNoticesFromStorage();
  }, [loadNoticesFromStorage]);

  // Handler: Select a notice to read in Detail Screen
  const handleSelectNotice = (notice: Notice) => {
    setActiveNotice(notice);
    setCurrentScreen('detail');
  };

  // Handler: Save newly created notice
  const handlePostNotice = async (formData: NoticeFormData) => {
    try {
      const newNotice = await persistNotice(formData);
      setNotices((prev) => [newNotice, ...prev]);
      showToast('Notice published and saved to device!');
      setActiveNotice(newNotice);
      setCurrentScreen('detail');
    } catch (err) {
      console.error('Failed to persist notice:', err);
      showToast('Error saving notice to storage.');
    }
  };

  // Handler: Delete notice
  const handleDeleteNotice = async (id: string) => {
    const success = await removeNotice(id);
    if (success) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
      showToast('Notice deleted from device.');
      setActiveNotice(null);
      setCurrentScreen('feed');
    } else {
      showToast('Could not delete notice.');
    }
  };

  // Handler: Bookmark toggle
  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = await toggleNoticeBookmark(id);
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isBookmarked: newStatus } : n))
    );
    if (activeNotice && activeNotice.id === id) {
      setActiveNotice((prev) => (prev ? { ...prev, isBookmarked: newStatus } : null));
    }
    showToast(newStatus ? 'Notice added to bookmarks' : 'Bookmark removed');
  };

  // Handler: Optional demo pack load
  const handleLoadDemoPack = async () => {
    setIsLoading(true);
    try {
      const demoList = await loadDemoSamplePack();
      setNotices(demoList);
      showToast('Loaded 4 sample college notices onto device storage!');
    } catch {
      showToast('Error loading sample notices.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AndroidFrame
      currentScreen={currentScreen}
      onNavigate={(screen) => setCurrentScreen(screen)}
      activeFilterCount={selectedDepartment ? 1 : 0}
      noticeCount={notices.length}
    >
      {/* Android Toast / Snackbar Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs py-2 px-4 rounded-full shadow-lg border border-slate-700 backdrop-blur-md animate-fadeIn flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen 1: Notice List (Feed) */}
      {currentScreen === 'feed' && (
        <NoticeListScreen
          notices={notices}
          isLoading={isLoading}
          error={error}
          selectedDepartment={selectedDepartment}
          onClearDepartmentFilter={() => setSelectedDepartment(null)}
          onOpenFilterScreen={() => setCurrentScreen('filter')}
          onSelectNotice={handleSelectNotice}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onReload={loadNoticesFromStorage}
          onToggleBookmark={handleToggleBookmark}
          onLoadDemoPack={handleLoadDemoPack}
        />
      )}

      {/* Screen 2: Department Filter */}
      {currentScreen === 'filter' && (
        <DepartmentFilterScreen
          selectedDepartment={selectedDepartment}
          notices={notices}
          onSelectDepartment={(dept) => setSelectedDepartment(dept)}
          onBack={() => setCurrentScreen('feed')}
        />
      )}

      {/* Screen 3: Notice Detail */}
      {currentScreen === 'detail' && activeNotice && (
        <NoticeDetailScreen
          notice={activeNotice}
          onBack={() => setCurrentScreen('feed')}
          onDeleteNotice={handleDeleteNotice}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Screen 4: Post Notice Form */}
      {currentScreen === 'post' && (
        <PostNoticeScreen
          onBack={() => setCurrentScreen('feed')}
          onSubmit={handlePostNotice}
        />
      )}

      {/* Screen 5: Device Settings & In-App Test Suite */}
      {currentScreen === 'device' && (
        <DeviceSettingsScreen
          notices={notices}
          onRefreshData={loadNoticesFromStorage}
        />
      )}
    </AndroidFrame>
  );
}
