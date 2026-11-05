/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NoticePriority = 'normal' | 'important' | 'urgent';

export type NoticeCategory =
  | 'academic'
  | 'examination'
  | 'placement'
  | 'circular'
  | 'event'
  | 'fee'
  | 'sports'
  | 'general';

export interface Department {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: 'engineering' | 'humanities' | 'administrative' | 'student-affairs';
  color: string;
  iconName: string;
}

export interface Notice {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  content: string;
  authorName: string;
  authorDesignation: string;
  category: NoticeCategory;
  priority: NoticePriority;
  targetAudience: string;
  referenceNo: string;
  createdAt: string; // ISO date string
  updatedAt?: string;
  isBookmarked?: boolean;
  isRead?: boolean;
  attachmentName?: string;
}

export interface NoticeFormData {
  title: string;
  departmentId: string;
  content: string;
  authorName: string;
  authorDesignation: string;
  category: NoticeCategory;
  priority: NoticePriority;
  targetAudience: string;
  referenceNo: string;
}

export type FormErrors = Partial<Record<keyof NoticeFormData, string>>;

export type ScreenId = 'feed' | 'filter' | 'detail' | 'post' | 'device';
