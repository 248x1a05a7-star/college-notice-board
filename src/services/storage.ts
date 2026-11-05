/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Notice, NoticeFormData } from '../types/notice';
import { DEPARTMENTS } from '../constants/departments';

const STORAGE_KEY = 'campusboard_notices_v1';
const SIMULATE_ERROR_KEY = 'campusboard_simulate_error_v1';

// Helper to get local storage safely
function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

/**
 * Check if the error simulation is manually activated for testing the error state
 */
export function isErrorSimulated(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  return storage.getItem(SIMULATE_ERROR_KEY) === 'true';
}

/**
 * Toggle simulated error state for testing "error-and-retry"
 */
export function setSimulatedError(active: boolean): void {
  const storage = getStorage();
  if (!storage) return;
  if (active) {
    storage.setItem(SIMULATE_ERROR_KEY, 'true');
  } else {
    storage.removeItem(SIMULATE_ERROR_KEY);
  }
}

/**
 * Retrieve all notices stored on device.
 * Starts with empty array [] as per requirement:
 * "Start with an empty list; do not use hard-coded sample notices."
 */
export async function fetchNotices(): Promise<Notice[]> {
  // Simulate standard device storage / SQLite access latency (200-350ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (isErrorSimulated()) {
    throw new Error('Device I/O Sync Failure: Could not read notices from local storage partition. Please verify storage permissions and tap Retry.');
  }

  const storage = getStorage();
  if (!storage) return [];

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    // Explicitly empty start
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error parsing stored notices:', err);
    throw new Error('Corrupted local storage data. Unable to parse notice records.');
  }
}

/**
 * Persist a new notice to on-device storage
 */
export async function persistNotice(formData: NoticeFormData): Promise<Notice> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const dept = DEPARTMENTS.find((d) => d.id === formData.departmentId) || DEPARTMENTS[0];
  const now = new Date();

  // Generate Reference No if omitted
  const autoRef = formData.referenceNo.trim() || 
    `KHIT/${dept.code}/${now.getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`;

  const newNotice: Notice = {
    id: `notice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: formData.title.trim(),
    departmentId: dept.id,
    departmentName: dept.name,
    departmentCode: dept.code,
    content: formData.content.trim(),
    authorName: formData.authorName.trim(),
    authorDesignation: formData.authorDesignation.trim(),
    category: formData.category,
    priority: formData.priority,
    targetAudience: formData.targetAudience.trim(),
    referenceNo: autoRef,
    createdAt: now.toISOString(),
    isBookmarked: false,
    isRead: false,
  };

  const storage = getStorage();
  if (storage) {
    const existing = await fetchNotices().catch(() => []);
    const updated = [newNotice, ...existing];
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return newNotice;
}

/**
 * Delete a notice from on-device storage
 */
export async function removeNotice(id: string): Promise<boolean> {
  const storage = getStorage();
  if (!storage) return false;

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return true;

  try {
    const list: Notice[] = JSON.parse(raw);
    const filtered = list.filter((n) => n.id !== id);
    storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggle bookmark status
 */
export async function toggleNoticeBookmark(id: string): Promise<boolean> {
  const storage = getStorage();
  if (!storage) return false;

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const list: Notice[] = JSON.parse(raw);
    let newStatus = false;
    const updated = list.map((item) => {
      if (item.id === id) {
        newStatus = !item.isBookmarked;
        return { ...item, isBookmarked: newStatus };
      }
      return item;
    });
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newStatus;
  } catch {
    return false;
  }
}

/**
 * Clear all notices on device
 */
export async function resetAllNotices(): Promise<void> {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
  }
}

/**
 * Optional sample notices pack.
 * strictly triggered on explicit user tap in Settings or Empty state,
 * NEVER initialized by default!
 */
export async function loadDemoSamplePack(): Promise<Notice[]> {
  const sampleNotices: Notice[] = [
    {
      id: 'demo_notice_1',
      title: 'Schedule for B.Tech Semester End Laboratory & Practical Examinations',
      departmentId: 'dept_exam',
      departmentName: 'Controller of Examinations Cell',
      departmentCode: 'EXAM',
      content: `All B.Tech students (II, III, and IV Years) are hereby notified that the End-Semester Practical & Laboratory Examinations for the Academic Session 2026 are scheduled to commence from November 18, 2026.\n\nKey Guidelines for Candidates:\n1. Students must carry their official College Identity Card and Hall Ticket issued by the Examination Section.\n2. Lab records, observation notebooks, and mini-project reports must be duly verified and signed by the respective Lab In-Charge and Head of the Department on or before November 14, 2026.\n3. Late arrivals beyond 15 minutes of the scheduled batch time will not be entertained.\n4. Detailed batch-wise timetable and external examiners roster have been displayed on the respective department notice boards.\n\nStrict compliance is expected.`,
      authorName: 'Dr. M. Srinivasa Rao',
      authorDesignation: 'Controller of Examinations',
      category: 'examination',
      priority: 'urgent',
      targetAudience: 'B.Tech - All Years',
      referenceNo: 'KHIT/EXAM/2026/088',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      isBookmarked: true,
      isRead: false,
    },
    {
      id: 'demo_notice_2',
      title: 'Campus Placement Drive: CloudCore Technologies for CSE & AI&DS',
      departmentId: 'dept_tpo',
      departmentName: 'Training & Placement Cell',
      departmentCode: 'TPO',
      content: `We are pleased to announce that CloudCore Technologies (Tier-1 Cloud Solutions Partner) will be conducting an on-campus placement drive for Final Year B.Tech students (Computer Science & Engineering and Artificial Intelligence & Data Science).\n\nEligibility Criteria:\n- Minimum aggregate CGPA: 7.25 with no active backlogs\n- Roles Offered: Associate Cloud Engineer & Junior ML Software Engineer\n- CTC Package: ₹8.50 LPA to ₹12.00 LPA\n- Selection Stages: Online Coding Assessment (HackerRank), Technical Interview Round 1 (DSA & System Design), HR & Managerial Round.\n\nInterested and eligible candidates must register on the TPO Student Portal before November 10, 2026, 5:00 PM. No spot registrations will be allowed.`,
      authorName: 'Prof. K. Venkateswarlu',
      authorDesignation: 'Training & Placement Officer',
      category: 'placement',
      priority: 'important',
      targetAudience: 'Final Year (4th Year)',
      referenceNo: 'KHIT/TPO/2026/142',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      isBookmarked: false,
      isRead: false,
    },
    {
      id: 'demo_notice_3',
      title: 'State-Level AI & Robotics Hackathon 2026 - Registrations Open',
      departmentId: 'dept_cse',
      departmentName: 'Computer Science & Engineering',
      departmentCode: 'CSE',
      content: `The Department of Computer Science & Engineering, in collaboration with the ACM & CSI Student Chapters, is hosting the 36-hour National Hackathon 'CodeSparks 2026' on December 2-3, 2026.\n\nTracks Include:\n• Generative AI & Autonomous Agents\n• Smart Campus IoT & Embedded Robotics\n• FinTech & Secure Digital Public Infrastructure\n• Healthcare Tech Solutions\n\nPrize Pool: ₹1,50,000 in cash awards + direct interview mentorship. Teams of 2 to 4 students can register through the CSE Department portal. Mentors will be assigned to short-listed prototypes.\n\nContact the CSE Student Coordinators or visit the departmental research lab for further details.`,
      authorName: 'Dr. P. Rajesh Kumar',
      authorDesignation: 'Head of Department (HOD)',
      category: 'event',
      priority: 'normal',
      targetAudience: 'All College (Students & Staff)',
      referenceNo: 'KHIT/CSE/2026/054',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), // ~2 days ago
      isBookmarked: false,
      isRead: true,
    },
    {
      id: 'demo_notice_4',
      title: 'Payment of Second Semester Tuition Fee & Scholarship Renewal Form',
      departmentId: 'dept_admin',
      departmentName: "Principal's Administrative Office",
      departmentCode: 'ADMIN',
      content: `This is to bring to the notice of all undergraduate and postgraduate students that the payment window for the Even Semester Tuition & Examination fees for the Academic Year 2026-2027 is now open.\n\nImportant Instructions:\n1. Students eligible for State Government JVD/EBC/Fee Reimbursement must submit their attendance acknowledgement and biometric e-KYC receipts at the Administrative counter.\n2. Online payment can be executed via the KHIT ERP Student Login using Net Banking, UPI, or Debit/Credit card without transaction surcharges.\n3. Last date to pay without late fee: November 25, 2026.\n\nDefaulters will be barred from mid-term exam hall ticket generation as per university norms.`,
      authorName: 'Dr. C. H. Subbarao',
      authorDesignation: 'Principal',
      category: 'fee',
      priority: 'important',
      targetAudience: 'All College (Students & Staff)',
      referenceNo: 'KHIT/ADM/2026/029',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      isBookmarked: false,
      isRead: true,
    },
  ];

  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(sampleNotices));
  }
  return sampleNotices;
}
