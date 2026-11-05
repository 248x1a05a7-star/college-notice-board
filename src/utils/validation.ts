/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoticeFormData, FormErrors } from '../types/notice';

export function validateNoticeForm(data: NoticeFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // 1. Notice Title Validation
  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Notice title is required.';
  } else if (trimmedTitle.length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  // 2. Department Validation
  if (!data.departmentId || data.departmentId.trim() === '') {
    errors.departmentId = 'Please select an issuing department.';
  }

  // 3. Author Name Validation
  const trimmedAuthor = data.authorName.trim();
  if (!trimmedAuthor) {
    errors.authorName = 'Author/Signatory name is required.';
  } else if (trimmedAuthor.length < 3) {
    errors.authorName = 'Author name must be at least 3 characters.';
  } else if (trimmedAuthor.length > 60) {
    errors.authorName = 'Author name cannot exceed 60 characters.';
  }

  // 4. Author Designation Validation
  const trimmedDesignation = data.authorDesignation.trim();
  if (!trimmedDesignation) {
    errors.authorDesignation = 'Designation/role is required.';
  }

  // 5. Category Validation
  if (!data.category) {
    errors.category = 'Please choose a notice category.';
  }

  // 6. Priority Validation
  if (!data.priority || !['normal', 'important', 'urgent'].includes(data.priority)) {
    errors.priority = 'Priority level must be normal, important, or urgent.';
  }

  // 7. Target Audience Validation
  if (!data.targetAudience || data.targetAudience.trim() === '') {
    errors.targetAudience = 'Please specify the intended audience.';
  }

  // 8. Notice Content Validation
  const trimmedContent = data.content.trim();
  if (!trimmedContent) {
    errors.content = 'Full notice content is required.';
  } else if (trimmedContent.length < 20) {
    errors.content = `Notice content is too brief (${trimmedContent.length}/20 characters minimum).`;
  } else if (trimmedContent.length > 4000) {
    errors.content = 'Notice content cannot exceed 4,000 characters.';
  }

  // 9. Reference Number Validation (optional, but if provided must be >= 3 chars)
  if (data.referenceNo && data.referenceNo.trim().length > 0 && data.referenceNo.trim().length < 3) {
    errors.referenceNo = 'Reference number should be at least 3 characters if provided.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
