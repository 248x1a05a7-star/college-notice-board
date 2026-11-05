/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department } from '../types/notice';

export const COLLEGE_NAME = 'Kallam Haranadhareddy Institute of Technology';
export const COLLEGE_SHORT_NAME = 'KHIT Guntur';
export const APP_NAME = 'CampusBoard';

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept_cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'Comp Science',
    category: 'engineering',
    color: '#2563EB', // Blue
    iconName: 'Laptop',
  },
  {
    id: 'dept_aids',
    code: 'AI&DS',
    name: 'Artificial Intelligence & Data Science',
    shortName: 'AI & Data Science',
    category: 'engineering',
    color: '#7C3AED', // Violet
    iconName: 'Cpu',
  },
  {
    id: 'dept_ece',
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'Electronics',
    category: 'engineering',
    color: '#0891B2', // Cyan
    iconName: 'Radio',
  },
  {
    id: 'dept_eee',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    shortName: 'Electrical',
    category: 'engineering',
    color: '#D97706', // Amber
    iconName: 'Zap',
  },
  {
    id: 'dept_mech',
    code: 'MECH',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    category: 'engineering',
    color: '#EA580C', // Orange
    iconName: 'Wrench',
  },
  {
    id: 'dept_civil',
    code: 'CIVIL',
    name: 'Civil Engineering',
    shortName: 'Civil',
    category: 'engineering',
    color: '#059669', // Emerald
    iconName: 'Building',
  },
  {
    id: 'dept_it',
    code: 'IT',
    name: 'Information Technology',
    shortName: 'Info Tech',
    category: 'engineering',
    color: '#4F46E5', // Indigo
    iconName: 'Network',
  },
  {
    id: 'dept_mba',
    code: 'MBA',
    name: 'Master of Business Administration',
    shortName: 'Management Studies',
    category: 'humanities',
    color: '#9333EA', // Purple
    iconName: 'Briefcase',
  },
  {
    id: 'dept_sh',
    code: 'S&H',
    name: 'Basic Sciences & Humanities',
    shortName: 'Science & Humanities',
    category: 'humanities',
    color: '#0D9488', // Teal
    iconName: 'BookOpen',
  },
  {
    id: 'dept_exam',
    code: 'EXAM',
    name: 'Controller of Examinations Cell',
    shortName: 'Examination Cell',
    category: 'administrative',
    color: '#DC2626', // Red
    iconName: 'GraduationCap',
  },
  {
    id: 'dept_tpo',
    code: 'TPO',
    name: 'Training & Placement Cell',
    shortName: 'Placements & Careers',
    category: 'administrative',
    color: '#16A34A', // Green
    iconName: 'Award',
  },
  {
    id: 'dept_admin',
    code: 'ADMIN',
    name: "Principal's Administrative Office",
    shortName: 'Principal Office',
    category: 'administrative',
    color: '#1E293B', // Slate
    iconName: 'ShieldCheck',
  },
  {
    id: 'dept_sports',
    code: 'SPORTS',
    name: 'Dean of Student Affairs & Sports Council',
    shortName: 'Student Affairs',
    category: 'student-affairs',
    color: '#BE123C', // Rose
    iconName: 'Trophy',
  },
];

export const CATEGORIES = [
  { id: 'academic', label: 'Academic & Classes', color: 'bg-blue-100 text-blue-800' },
  { id: 'examination', label: 'Examinations & Results', color: 'bg-rose-100 text-rose-800' },
  { id: 'placement', label: 'Placements & Internships', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'circular', label: 'General College Circular', color: 'bg-slate-100 text-slate-800' },
  { id: 'event', label: 'Campus Events & Workshops', color: 'bg-purple-100 text-purple-800' },
  { id: 'fee', label: 'Fee & Scholarships', color: 'bg-amber-100 text-amber-800' },
  { id: 'sports', label: 'Sports & Cultural', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'general', label: 'Public Notices', color: 'bg-gray-100 text-gray-800' },
] as const;

export const AUDIENCE_OPTIONS = [
  'All College (Students & Staff)',
  'B.Tech - All Years',
  '1st Year Students (Freshers)',
  '2nd Year Students',
  '3rd Year Students',
  'Final Year (4th Year)',
  'PG / MBA Students',
  'Faculty & Teaching Staff',
  'Hostel Residents',
];

export const DESIGNATION_OPTIONS = [
  'Head of Department (HOD)',
  'Controller of Examinations',
  'Training & Placement Officer',
  'Principal',
  'Dean of Academic Affairs',
  'Dean of Student Affairs',
  'Associate Professor / Class Teacher',
  'Sports Director / Physical Director',
  'Librarian',
  'Student Council General Secretary',
];
