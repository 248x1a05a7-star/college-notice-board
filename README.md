# CampusBoard: Android College Notice Board App

An authentic Android-styled digital notice board web application designed for engineering institutes and universities. Built with React 19, TypeScript, and Tailwind CSS, featuring Material Design 3 ergonomics, local on-device persistence, and automated unit testing.

---

## 📱 App Highlights & Architecture

- **Collegiate Theme**: Styled for *Kallam Haranadhareddy Institute of Technology (KHIT Guntur)* with official college crest branding, academic department codes (CSE, ECE, EEE, MECH, CIVIL, AI&DS, IT, MBA, S&H, Exam Cell, TPO, Sports Council), and collegiate navy/gold palette.
- **Android System UI**: Authentic Android top status bar (time, battery %, Wi-Fi, 5G signals), punch-hole camera notch, Material 3 bottom navigation bar, floating action button (FAB), and Android gesture navigation pill.
- **Multi-Screen Ergonomics**: Seamlessly toggle between a realistic **Android Smartphone Shell (Pixel 9 Pro frame)** and an **Expanded Responsive View** for tablets/laptops.
- **On-Device Offline Persistence**: Notices are saved to the device's local storage partition (`localStorage`). Stored notices persist across browser refreshes, device restarts, and offline sessions.
- **Starts Empty**: Adheres strictly to the requirement of starting with a clean empty state (`[]`), with an optional on-demand demo pack loader for testing.

---

## 🧭 Four Connected Screens

### 1. Notice List Screen (`NoticeListScreen.tsx`)
- Displays all published notices with **Title, Department badge, Date, Reference Number, Excerpt preview, and Urgency indicator**.
- Robustly handles all **4 Core States**:
  1. **Loading State**: Shimmering Android skeleton cards and Material circular spinner.
  2. **Error-and-Retry State**: Clear error notification explaining sync failures with a primary **Retry Loading** button that recovers connection.
  3. **Empty State**: Illustrated notice board with guidance and a **Post First Notice** action button.
  4. **Data State**: Interactive notice cards, pull-to-refresh sync, search filter, and sorting (Newest first, Oldest first, Highest urgency).
- Bottom-right Material Floating Action Button (FAB) for fast notice creation.

### 2. Department Filter Screen (`DepartmentFilterScreen.tsx`)
- Comprehensive list of engineering branches, administrative wings, exam cell, and student affairs.
- Live search bar to filter departments by name or branch acronym (e.g. `CSE`, `EXAM`, `TPO`).
- Real-time active notice count badge per department.
- Radio selection with instant "Apply Filter" sticky action and "Reset to All Departments" option.

### 3. Notice Detail Screen (`NoticeDetailScreen.tsx`)
- Full official circular view complete with college crest emblem, institutional header, reference ID (e.g., `KHIT/EXAM/2026/088`), and publication timestamp.
- Displays issuing department, signatory name, official role/designation, and target audience.
- Formatted long-text body renderer with paragraph spacing that gracefully handles multi-page notices and varied screen sizes.
- Actions: **Copy formatted notice text** (with animated confirmation), **Bookmark/Save**, and **Delete notice** (with safety confirmation dialog).

### 4. Post Notice Form (`PostNoticeScreen.tsx`)
- Production-grade validation for every single input field:
  - **Notice Title**: Required, 5 to 120 characters, live counter.
  - **Issuing Department**: Required dropdown selection.
  - **Signatory Name**: Required, 3 to 60 characters.
  - **Signatory Designation**: Required role selection/entry.
  - **Notice Category**: Academic, Examination, Placement, Circular, Event, Fee, Sports.
  - **Urgency Level**: Normal, Important, Urgent with distinct visual colors.
  - **Target Audience**: All College, B.Tech Years, PG/MBA, Staff, etc.
  - **Notice Body/Content**: Required, minimum 20 characters, maximum 4,000 characters, live counter.
  - **Reference Number**: Optional or auto-generated with institutional naming rules (`KHIT/{DEPT}/{YEAR}/{ID}`).
- Inline validation errors in red with warning icons under touched fields.
- Disabled/loading states on submit to prevent duplicate submissions.

### 5. Diagnostics & Device Settings Screen (`DeviceSettingsScreen.tsx`)
- On-device storage metrics: notice count, storage size in KB.
- **Error Simulation Toggle**: Test Screen 1's "Error-and-Retry" state on demand.
- **In-App Automated Test Runner**: Run all 8 automated unit tests inside the browser.
- Data reset and optional demo sample pack loader.

---

## 🧪 Automated Testing

A complete automated unit test suite is included in `src/tests/noticeBoard.test.ts`.

### Run via Command Line:
```bash
npm test
```

### Run Inside the App:
Navigate to the **Device / Tests** tab in the bottom navigation and tap **Run Tests** to see live assertions and execution times.

### Test Coverage:
1. `Validation`: Rejects empty and too-short titles (< 5 characters).
2. `Validation`: Rejects submission without selected department.
3. `Validation`: Rejects notice content under 20 characters.
4. `Validation`: Requires author signatory name and designation.
5. `Validation`: Accepts valid, well-formed notice payload.
6. `Filtering`: Filters notice collection by department correctly.
7. `Empty State`: Verifies initial list starts clean without hard-coded records.
8. `Sorting`: Verifies chronological sorting (newest first).

---

## 🚀 How to Run the App

1. **Install dependencies** (already installed in this environment):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📋 Manual Steps & Setup Notes

- **No API Keys Required**: The app uses native browser on-device storage (`localStorage`) for persistence. No Firebase setup, external database credentials, or API keys are required.
- **Ready for PWA / Android APK wrapper**: The codebase is touch-optimized with a 44px+ hit target standard, Android status bars, and theme-color meta headers ready to be wrapped in a Trusted Web Activity (TWA) or Apache Cordova / Capacitor for native Android distribution.
