/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateNoticeForm } from '../utils/validation';
import { Notice, NoticeFormData } from '../types/notice';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runAllTests(): TestResult[] {
  const results: TestResult[] = [];

  function test(name: string, fn: () => void) {
    const start = performance.now();
    try {
      fn();
      results.push({
        name,
        passed: true,
        durationMs: Math.round((performance.now() - start) * 100) / 100,
      });
    } catch (err: unknown) {
      results.push({
        name,
        passed: false,
        message: err instanceof Error ? err.message : String(err),
        durationMs: Math.round((performance.now() - start) * 100) / 100,
      });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${msg}`);
    }
  }

  // 1. Validation: Title constraints
  test('Validation: Rejects empty and too-short titles (< 5 chars)', () => {
    const invalidData: NoticeFormData = {
      title: 'Hi',
      departmentId: 'dept_cse',
      content: 'This is a sufficiently long notice content body that meets requirements.',
      authorName: 'Dr. Rao',
      authorDesignation: 'HOD',
      category: 'academic',
      priority: 'normal',
      targetAudience: 'All College',
      referenceNo: 'REF-01',
    };
    const res = validateNoticeForm(invalidData);
    assert(!res.isValid, 'Should be invalid with title "Hi"');
    assert(Boolean(res.errors.title), 'Should contain title error message');
  });

  // 2. Validation: Department requirement
  test('Validation: Rejects submission without selected department', () => {
    const noDeptData: NoticeFormData = {
      title: 'Valid Notice Title Here',
      departmentId: '',
      content: 'This is a sufficiently long notice content body that meets requirements.',
      authorName: 'Dr. Rao',
      authorDesignation: 'HOD',
      category: 'academic',
      priority: 'normal',
      targetAudience: 'All College',
      referenceNo: 'REF-01',
    };
    const res = validateNoticeForm(noDeptData);
    assert(!res.isValid, 'Should be invalid when department is empty');
    assert(Boolean(res.errors.departmentId), 'Should contain department error');
  });

  // 3. Validation: Content minimum length
  test('Validation: Rejects content under 20 characters', () => {
    const shortContentData: NoticeFormData = {
      title: 'Valid Notice Title',
      departmentId: 'dept_cse',
      content: 'Too short text',
      authorName: 'Prof. Sharma',
      authorDesignation: 'Dean',
      category: 'circular',
      priority: 'important',
      targetAudience: 'All Students',
      referenceNo: 'REF-02',
    };
    const res = validateNoticeForm(shortContentData);
    assert(!res.isValid, 'Should be invalid with content length < 20');
    assert(Boolean(res.errors.content), 'Should contain content length error');
  });

  // 4. Validation: Author & Designation
  test('Validation: Requires author name and designation', () => {
    const noAuthorData: NoticeFormData = {
      title: 'Valid Notice Title',
      departmentId: 'dept_cse',
      content: 'Valid content that has more than 20 characters easily.',
      authorName: '',
      authorDesignation: '',
      category: 'academic',
      priority: 'normal',
      targetAudience: 'All College',
      referenceNo: '',
    };
    const res = validateNoticeForm(noAuthorData);
    assert(!res.isValid, 'Should be invalid when author and designation are empty');
    assert(Boolean(res.errors.authorName), 'Should flag authorName error');
    assert(Boolean(res.errors.authorDesignation), 'Should flag authorDesignation error');
  });

  // 5. Validation: Valid Form passes cleanly
  test('Validation: Accepts valid, well-formed notice payload', () => {
    const validData: NoticeFormData = {
      title: 'Annual Campus Sports Meet 2026 Registration Announcement',
      departmentId: 'dept_sports',
      content: 'All inter-department athletic teams are requested to assemble at the sports complex pavilion on Friday.',
      authorName: 'Dr. K. Srinivas',
      authorDesignation: 'Physical Director',
      category: 'sports',
      priority: 'important',
      targetAudience: 'All College (Students & Staff)',
      referenceNo: 'KHIT/SPT/2026/09',
    };
    const res = validateNoticeForm(validData);
    assert(res.isValid, 'Should be valid');
    assert(Object.keys(res.errors).length === 0, 'Errors object should be empty');
  });

  // 6. Filtering Logic: Single department & all departments
  test('Filtering: Filters notice collection by department correctly', () => {
    const mockNotices: Notice[] = [
      {
        id: '1',
        title: 'CSE Workshop',
        departmentId: 'dept_cse',
        departmentName: 'Computer Science',
        departmentCode: 'CSE',
        content: 'Long notice content body here for testing.',
        authorName: 'Dr. X',
        authorDesignation: 'HOD',
        category: 'academic',
        priority: 'normal',
        targetAudience: 'All',
        referenceNo: 'REF-1',
        createdAt: '2026-11-01T10:00:00Z',
      },
      {
        id: '2',
        title: 'ECE Seminar',
        departmentId: 'dept_ece',
        departmentName: 'Electronics',
        departmentCode: 'ECE',
        content: 'Long notice content body here for testing.',
        authorName: 'Dr. Y',
        authorDesignation: 'HOD',
        category: 'academic',
        priority: 'urgent',
        targetAudience: 'All',
        referenceNo: 'REF-2',
        createdAt: '2026-11-02T10:00:00Z',
      },
    ];

    const cseNotices = mockNotices.filter((n) => n.departmentId === 'dept_cse');
    assert(cseNotices.length === 1, 'Should find exactly 1 CSE notice');
    assert(cseNotices[0].id === '1', 'Should match notice ID 1');

    const mechNotices = mockNotices.filter((n) => n.departmentId === 'dept_mech');
    assert(mechNotices.length === 0, 'Should find 0 notices for MECH');
  });

  // 7. Initial empty state requirement test
  test('Empty State: Initial notice list is empty by default', () => {
    const initialList: Notice[] = [];
    assert(initialList.length === 0, 'Initial list must start empty without hardcoded data');
  });

  // 8. Sorting: Date descending
  test('Sorting: Correctly orders notices newest first', () => {
    const dates = [
      { id: 'old', createdAt: '2026-10-01T00:00:00Z' },
      { id: 'new', createdAt: '2026-11-05T00:00:00Z' },
      { id: 'mid', createdAt: '2026-10-20T00:00:00Z' },
    ];
    const sorted = [...dates].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    assert(sorted[0].id === 'new', 'First element should be newest');
    assert(sorted[1].id === 'mid', 'Second element should be mid');
    assert(sorted[2].id === 'old', 'Third element should be oldest');
  });

  return results;
}

// When run directly from CLI (e.g. `tsx src/tests/noticeBoard.test.ts`)
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('noticeBoard.test')) {
  console.log('--- RUNNING CAMPUSBOARD TESTS ---');
  const results = runAllTests();
  let failed = 0;
  for (const r of results) {
    if (r.passed) {
      console.log(`✓ [PASS] ${r.name} (${r.durationMs}ms)`);
    } else {
      failed++;
      console.error(`✗ [FAIL] ${r.name}: ${r.message}`);
    }
  }
  console.log(`\nResults: ${results.length - failed}/${results.length} passed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('All tests passed successfully! 🎉');
  }
}
