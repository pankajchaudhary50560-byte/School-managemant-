import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CalendarDays,
  Save,
  Printer,
  RotateCcw,
  Sparkles,
  School,
  AlertCircle,
  CheckCircle2,
  Users,
  FileSpreadsheet,
  ChevronRight,
  Info,
  Calendar,
  LayoutDashboard,
  GraduationCap,
  ReceiptText,
} from 'lucide-react';

import { AttendanceRecord, AttendanceStatus, FeeDemand, FeePayment, MarksheetRecord, Student } from './types';
import {
  calculateAttendanceStats,
  filterStudentsList,
  formatIndianDate,
  getRecordKey,
} from './utils/attendanceLogic';
import {
  INITIAL_DEMANDS,
  INITIAL_MARKSHEETS,
  INITIAL_PAYMENTS,
  INITIAL_STUDENTS,
  loadStoredData,
  STORAGE_ATTENDANCE_KEY,
  STORAGE_FEE_DEMANDS_KEY,
  STORAGE_FEE_PAYMENTS_KEY,
  STORAGE_MARKSHEETS_KEY,
  STORAGE_STUDENTS_KEY,
} from './data/initialData';

import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { FeesView } from './components/FeesView';
import { MarksheetView } from './components/MarksheetView';

import { SummaryCards } from './components/SummaryCards';
import { FilterControls } from './components/FilterControls';
import { StudentCardsView } from './components/StudentCardsView';
import { StudentTableView } from './components/StudentTableView';
import { AddStudentModal } from './components/AddStudentModal';
import { PrintRegisterModal } from './components/PrintRegisterModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation active tab: 'dashboard' | 'students' | 'attendance' | 'fees' | 'marksheet'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Master Data state with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() =>
    loadStoredData(STORAGE_STUDENTS_KEY, INITIAL_STUDENTS)
  );
  const [demands, setDemands] = useState<FeeDemand[]>(() =>
    loadStoredData(STORAGE_FEE_DEMANDS_KEY, INITIAL_DEMANDS)
  );
  const [payments, setPayments] = useState<FeePayment[]>(() =>
    loadStoredData(STORAGE_FEE_PAYMENTS_KEY, INITIAL_PAYMENTS)
  );
  const [marksheets, setMarksheets] = useState<MarksheetRecord[]>(() =>
    loadStoredData(STORAGE_MARKSHEETS_KEY, INITIAL_MARKSHEETS)
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FEE_DEMANDS_KEY, JSON.stringify(demands));
    } catch (e) {
      console.error(e);
    }
  }, [demands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FEE_PAYMENTS_KEY, JSON.stringify(payments));
    } catch (e) {
      console.error(e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MARKSHEETS_KEY, JSON.stringify(marksheets));
    } catch (e) {
      console.error(e);
    }
  }, [marksheets]);

  // Attendance Module state
  const [selectedClass, setSelectedClass] = useState<string>('10');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: AttendanceStatus; remark?: string }>
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load attendance records for selection
  const loadAttendanceForSelection = useCallback(
    (cls: string, sec: string, date: string, currentStudents: Student[]) => {
      if (!cls || !date) {
        setAttendanceMap({});
        return;
      }

      const key = getRecordKey(date, cls, sec);
      let savedRecords: Record<string, AttendanceRecord> = {};
      try {
        const raw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
        if (raw) savedRecords = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to read attendance records', e);
      }

      const existingRecord = savedRecords[key];
      const newMap: Record<string, { status: AttendanceStatus; remark?: string }> = {};

      const targetStudents = currentStudents.filter((s) => {
        const sameClass = String(s.className).trim() === String(cls).trim();
        const sameSection = !sec || sec === '' || String(s.section).trim().toUpperCase() === sec.trim().toUpperCase();
        return sameClass && sameSection;
      });

      if (existingRecord && Array.isArray(existingRecord.entries)) {
        for (const s of targetStudents) {
          const entry = existingRecord.entries.find((e) => e.studentId === s.id);
          newMap[s.id] = {
            status: entry ? entry.status : 'Absent',
            remark: entry?.remark || '',
          };
        }
      } else {
        for (const s of targetStudents) {
          newMap[s.id] = { status: 'Absent', remark: '' };
        }
      }

      setAttendanceMap(newMap);
      setHasUnsavedChanges(false);
    },
    []
  );

  useEffect(() => {
    loadAttendanceForSelection(selectedClass, selectedSection, attendanceDate, students);
  }, [selectedClass, selectedSection, attendanceDate, students, loadAttendanceForSelection]);

  // Filtered students for attendance
  const filteredStudents = useMemo(() => {
    return filterStudentsList(students, {
      className: selectedClass,
      section: selectedSection,
      searchQuery,
      statusFilter,
      attendanceMap,
    });
  }, [students, selectedClass, selectedSection, searchQuery, statusFilter, attendanceMap]);

  const allClassStudents = useMemo(() => {
    return filterStudentsList(students, {
      className: selectedClass,
      section: selectedSection,
    });
  }, [students, selectedClass, selectedSection]);

  const stats = useMemo(() => {
    return calculateAttendanceStats(allClassStudents, attendanceMap);
  }, [allClassStudents, attendanceMap]);

  // Attendance handlers
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'Absent' }),
        remark,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleMarkAllPresent = () => {
    if (filteredStudents.length === 0) return;
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      for (const s of filteredStudents) {
        updated[s.id] = {
          ...(updated[s.id] || {}),
          status: 'Present',
        };
      }
      return updated;
    });
    setHasUnsavedChanges(true);
    addToast('info', `सभी ${filteredStudents.length} विद्यार्थी Present किए गए।`);
  };

  const handleMarkAllAbsent = () => {
    if (filteredStudents.length === 0) return;
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      for (const s of filteredStudents) {
        updated[s.id] = {
          ...(updated[s.id] || {}),
          status: 'Absent',
        };
      }
      return updated;
    });
    setHasUnsavedChanges(true);
    addToast('info', `सभी ${filteredStudents.length} विद्यार्थी Absent किए गए।`);
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !attendanceDate) {
      addToast('error', 'कृपया पहले कक्षा और तारीख चुनें।');
      return;
    }

    if (allClassStudents.length === 0) {
      addToast('error', 'इस कक्षा में कोई विद्यार्थी नहीं है।');
      return;
    }

    const key = getRecordKey(attendanceDate, selectedClass, selectedSection);
    let savedRecords: Record<string, AttendanceRecord> = {};
    try {
      const raw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
      if (raw) savedRecords = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    const entries = allClassStudents.map((s) => {
      const record = attendanceMap[s.id];
      return {
        studentId: s.id,
        admissionNo: s.admissionNo,
        rollNo: s.rollNo,
        studentName: s.studentName,
        status: record?.status || 'Absent',
        remark: record?.remark || '',
      };
    });

    savedRecords[key] = {
      date: attendanceDate,
      className: selectedClass,
      section: selectedSection,
      entries,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(savedRecords));
      setHasUnsavedChanges(false);
      addToast(
        'success',
        `✅ Class ${selectedClass}${selectedSection ? ` (${selectedSection})` : ''} की उपस्थिति (${formatIndianDate(attendanceDate)}) सुरक्षित हो गई!`
      );
      confetti({ particleCount: 40, spread: 60 });
    } catch (error) {
      console.error(error);
      addToast('error', 'उपस्थिति सेव नहीं हो सकी।');
    }
  };

  // Student CRUD
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    addToast('success', 'छात्र विवरण अपडेट हो गया।');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Fee Demands & Payments
  const handleAddDemand = (demandData: Omit<FeeDemand, 'id' | 'createdAt'>) => {
    const newDemand: FeeDemand = {
      ...demandData,
      id: `FEE-DEM-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDemands((prev) => [newDemand, ...prev]);
  };

  const handleAddPayment = (paymentData: Omit<FeePayment, 'id' | 'receiptNo'> & { id?: string; receiptNo?: string }) => {
    const newPayment: FeePayment = {
      ...paymentData,
      id: paymentData.id || `PAY-${Date.now()}`,
      receiptNo: paymentData.receiptNo || `SPF-${paymentData.date.replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  // Marksheet Saving
  const handleSaveMarksheet = (newRecord: MarksheetRecord) => {
    setMarksheets((prev) => {
      const filtered = prev.filter((m) => !(m.studentId === newRecord.studentId && m.examTerm === newRecord.examTerm));
      return [newRecord, ...filtered];
    });
  };

  // Reset Data to Defaults
  const handleResetData = () => {
    if (window.confirm('क्या आप डेमो डेटा को रीसेट करना चाहते हैं?')) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setDemands(INITIAL_DEMANDS);
      setPayments(INITIAL_PAYMENTS);
      setMarksheets(INITIAL_MARKSHEETS);
      setSelectedClass('10');
      setSelectedSection('A');
      loadAttendanceForSelection('10', 'A', attendanceDate, INITIAL_STUDENTS);
      addToast('info', 'डेमो डेटा रीसेट हो चुका है।');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col font-sans">
      {/* Navigation (Sidebar & Mobile Drawer) */}
      <Navigation
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onResetData={handleResetData}
        studentCount={students.length}
      />

      {/* Main Container */}
      <main className="flex-1 lg:ml-64 p-3.5 sm:p-6 lg:p-8 max-w-7xl pb-24 lg:pb-12">
        {/* Render Active View */}
        {currentTab === 'dashboard' && (
          <DashboardView
            students={students}
            payments={payments}
            todayAttendancePercent={stats.percent || 90}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'students' && (
          <StudentsView
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onShowToast={addToast}
          />
        )}

        {currentTab === 'fees' && (
          <FeesView
            students={students}
            demands={demands}
            payments={payments}
            onAddDemand={handleAddDemand}
            onAddPayment={handleAddPayment}
            onShowToast={addToast}
          />
        )}

        {currentTab === 'marksheet' && (
          <MarksheetView
            students={students}
            marksheets={marksheets}
            onSaveMarksheet={handleSaveMarksheet}
            onUpdateStudent={handleUpdateStudent}
            onShowToast={addToast}
          />
        )}

        {currentTab === 'attendance' && (
          <div className="space-y-4">
            {/* Attendance Header */}
            <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit mb-1 border border-blue-200/50">
                  <School className="w-3.5 h-3.5" />
                  <span>SP Chaudhary School Management</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>📅 Daily Attendance Management</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  कक्षावार दैनिक उपस्थिति दर्ज करें, रिपोर्ट देखें व प्रिंट रजिस्टर निकालें।
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 no-print">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  disabled={allClassStudents.length === 0}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95 disabled:opacity-50"
                  title="Print register or download Excel"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Register</span>
                </button>

                <button
                  id="saveAttendance"
                  onClick={handleSaveAttendance}
                  disabled={allClassStudents.length === 0}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                    hasUnsavedChanges
                      ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-500/50 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Attendance</span>
                </button>
              </div>
            </header>

            {/* Unsaved Changes Banner */}
            {hasUnsavedChanges && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-800 animate-in fade-in duration-200 no-print">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="font-semibold">
                    बदलाव अभी सेव नहीं हुए हैं! कृपया नीचे दिए गए "Save Attendance" बटन से सेव करें।
                  </span>
                </div>
                <button
                  onClick={handleSaveAttendance}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] shadow-xs shrink-0 ml-2"
                >
                  सेव करें
                </button>
              </div>
            )}

            {/* Attendance Filter Controls */}
            <FilterControls
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              attendanceDate={attendanceDate}
              setAttendanceDate={setAttendanceDate}
              onMarkAllPresent={handleMarkAllPresent}
              onMarkAllAbsent={handleMarkAllAbsent}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
              hasLoadedStudents={allClassStudents.length > 0}
              studentCount={filteredStudents.length}
            />

            {/* Summary Cards */}
            {selectedClass && (
              <SummaryCards
                stats={stats}
                selectedClass={selectedClass}
                selectedSection={selectedSection}
              />
            )}

            {/* Student Attendance List */}
            <section aria-label="Student attendance register" className="mt-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-slate-800" id="classHeading">
                  {selectedClass ? (
                    <>
                      Class {selectedClass} {selectedSection ? `- Section ${selectedSection}` : ''}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({filteredStudents.length} Students)
                      </span>
                    </>
                  ) : (
                    'विद्यार्थियों की सूची'
                  )}
                </h2>
                <div className="text-xs text-slate-400 font-medium">
                  तारीख: <span className="font-semibold text-slate-700">{formatIndianDate(attendanceDate)}</span>
                </div>
              </div>

              {viewMode === 'cards' ? (
                <StudentCardsView
                  students={filteredStudents}
                  attendanceMap={attendanceMap}
                  onStatusChange={handleStatusChange}
                  onRemarkChange={handleRemarkChange}
                />
              ) : (
                <StudentTableView
                  students={filteredStudents}
                  attendanceMap={attendanceMap}
                  onStatusChange={handleStatusChange}
                  onRemarkChange={handleRemarkChange}
                />
              )}
            </section>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav aria-label="Mobile navigation bar" className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around z-40 shadow-lg no-print">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'attendance', label: 'Attendance', icon: CalendarDays },
          { id: 'fees', label: 'Fees', icon: ReceiptText },
          { id: 'marksheet', label: 'Marksheet', icon: FileSpreadsheet },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700 stroke-[2.5]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
        defaultClass={selectedClass}
        defaultSection={selectedSection}
      />

      {/* Print Register Modal */}
      <PrintRegisterModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        classNameVal={selectedClass}
        sectionVal={selectedSection}
        dateVal={attendanceDate}
        students={allClassStudents}
        attendanceMap={attendanceMap}
        stats={stats}
      />

      {/* Floating Toast Notification */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
