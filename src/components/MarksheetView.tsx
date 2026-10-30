import React, { useState, useMemo, useRef } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  PlusCircle,
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
  School,
  Sparkles,
  BookOpen,
  Camera,
  User,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarksheetRecord, Student, SubjectMark } from '../types';
import { calculateGrade, computeMarksheetStats, evaluateResult } from '../utils/schoolLogic';
import { formatIndianDate } from '../utils/attendanceLogic';
import { compressImageFile, STUDENT_AVATAR_PRESETS } from '../utils/imageHelper';

interface MarksheetViewProps {
  students: Student[];
  marksheets: MarksheetRecord[];
  onSaveMarksheet: (record: MarksheetRecord) => void;
  onUpdateStudent: (student: Student) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const DEFAULT_SUBJECTS = [
  'Hindi (हिंदी)',
  'English (अंग्रेजी)',
  'Mathematics (गणित)',
  'Science (विज्ञान)',
  'Social Science (सामाजिक विज्ञान)',
  'Computer Applications',
];

export const MarksheetView: React.FC<MarksheetViewProps> = ({
  students,
  marksheets,
  onSaveMarksheet,
  onUpdateStudent,
  onShowToast,
}) => {
  // Tabs: 'records' | 'create'
  const [activeTab, setActiveTab] = useState<'records' | 'create'>('records');

  const handleMarksheetPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePrintMarksheet) return;
    try {
      const compressed = await compressImageFile(file);
      const updatedStudent: Student = { ...activePrintMarksheet.student, photoUrl: compressed };
      setActivePrintMarksheet({ ...activePrintMarksheet, student: updatedStudent });
      onUpdateStudent(updatedStudent);
      onShowToast('success', `मार्कशीट में छात्र "${updatedStudent.studentName}" की फोटो सुरक्षित हो गई!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetMarksheetAvatar = (avatarUrl: string) => {
    if (!activePrintMarksheet) return;
    const updatedStudent: Student = { ...activePrintMarksheet.student, photoUrl: avatarUrl };
    setActivePrintMarksheet({ ...activePrintMarksheet, student: updatedStudent });
    onUpdateStudent(updatedStudent);
    onShowToast('success', 'मार्कशीट के लिए फोटो अवतार चुन लिया गया!');
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Create Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [examTerm, setExamTerm] = useState('Annual Examination 2026');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [attendanceRate, setAttendanceRate] = useState<number>(95);
  const [teacherRemarks, setTeacherRemarks] = useState('उत्कृष्ट प्रदर्शन एवं अनुशासित व्यवहार।');

  // Subject Marks State
  const [subjectScores, setSubjectScores] = useState<Record<string, number>>({
    'Hindi (हिंदी)': 85,
    'English (अंग्रेजी)': 82,
    'Mathematics (गणित)': 90,
    'Science (विज्ञान)': 88,
    'Social Science (सामाजिक विज्ञान)': 84,
    'Computer Applications': 92,
  });

  // Active Marksheet for Print Modal
  const [activePrintMarksheet, setActivePrintMarksheet] = useState<{
    record: MarksheetRecord;
    student: Student;
  } | null>(null);

  // Compute live marksheet stats
  const currentSubjectMarks: SubjectMark[] = useMemo(() => {
    return DEFAULT_SUBJECTS.map((sub) => {
      const score = Math.max(0, Math.min(100, Number(subjectScores[sub]) || 0));
      return {
        subject: sub,
        maxMarks: 100,
        theoryMarks: score,
        totalMarks: score,
      };
    });
  }, [subjectScores]);

  const liveStats = useMemo(() => {
    return computeMarksheetStats(currentSubjectMarks);
  }, [currentSubjectMarks]);

  const handleScoreChange = (subject: string, val: number) => {
    setSubjectScores((prev) => ({
      ...prev,
      [subject]: val,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('कृपया विद्यार्थी चुनें।');
      return;
    }

    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const newRecord: MarksheetRecord = {
      id: `MARK-${selectedStudentId}-${Date.now().toString().slice(-4)}`,
      studentId: selectedStudentId,
      examTerm,
      academicYear,
      subjects: currentSubjectMarks,
      totalMaxMarks: liveStats.totalMax,
      totalObtained: liveStats.totalObtained,
      percentage: liveStats.percentage,
      grade: liveStats.grade,
      result: liveStats.result,
      attendanceRate,
      teacherRemarks,
      updatedAt: new Date().toISOString(),
    };

    onSaveMarksheet(newRecord);
    confetti({ particleCount: 40, spread: 60 });
    onShowToast('success', `छात्र "${student.studentName}" की मार्कशीट सफलतापूर्वक तैयार हो गई!`);

    setActivePrintMarksheet({ record: newRecord, student });
    setActiveTab('records');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>📊 Marksheet & Result (परीक्षा परिणाम)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            छात्रों के विषयवार अंक भरें, ग्रेड व प्रतिशत निकालें एवं आधिकारिक मार्कशीट प्रिंट करें।
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'records'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मार्कशीट सूची (Records) ({marksheets.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-[#12366b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ नई मार्कशीट बनाएँ</span>
          </button>
        </div>
      </div>

      {/* CREATE MARKSHEET FORM */}
      {activeTab === 'create' && (
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          <div className="pb-4 border-b border-slate-100 mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#12366b] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">मार्कशीट तैयार करें (Prepare Marksheet)</h2>
              <p className="text-xs text-slate-400">छात्र का चयन करें और प्रत्येक विषय के अंक दर्ज करें</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Student (विद्यार्थी) <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="">-- विद्यार्थी चुनें --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentName} (Roll: #{s.rollNo}, Class {s.className}-{s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Examination Term (परीक्षा) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={examTerm}
                  onChange={(e) => setExamTerm(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="Annual Examination 2026">Annual Examination 2026 (वार्षिक परीक्षा)</option>
                  <option value="Half-Yearly Examination 2026">Half-Yearly Exam (अर्धवार्षिक परीक्षा)</option>
                  <option value="Pre-Board Examination 2026">Pre-Board Examination</option>
                  <option value="Unit Test - 1">Unit Test - 1</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Academic Session (सत्र)
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Subject Marks Entry Grid */}
            <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>विषयवार प्राप्तांक भरें (Subject Scores - Max Marks: 100 each)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {DEFAULT_SUBJECTS.map((sub) => {
                  const score = subjectScores[sub] ?? 0;
                  const isFail = score < 33;
                  return (
                    <div
                      key={sub}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <label className="block text-xs font-bold text-slate-700 truncate" title={sub}>
                          {sub}
                        </label>
                        <span className="text-[10px] text-slate-400">Min Pass: 33</span>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={score}
                          onChange={(e) => handleScoreChange(sub, Number(e.target.value))}
                          className={`w-16 px-2 py-1 text-center font-bold text-sm rounded-lg border focus:outline-none focus:ring-2 ${
                            isFail
                              ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-rose-500'
                              : 'border-slate-300 bg-slate-50 text-slate-800 focus:ring-blue-600'
                          }`}
                        />
                        <span className="text-xs text-slate-400 font-mono">/100</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Computed Result Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-[#12366b] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] text-blue-200 block">Total Obtained</span>
                  <p className="text-xl sm:text-2xl font-black text-amber-300">
                    {liveStats.totalObtained} / {liveStats.totalMax}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-blue-200 block">Percentage</span>
                  <p className="text-xl sm:text-2xl font-black text-white">
                    {liveStats.percentage}%
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-blue-200 block">Grade</span>
                  <p className="text-xl sm:text-2xl font-black text-emerald-300">
                    {liveStats.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-blue-200">Final Result:</span>
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase ${
                    liveStats.result === 'PASS'
                      ? 'bg-emerald-500 text-white'
                      : liveStats.result === 'COMPARTMENT'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {liveStats.result}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Attendance Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Teacher's Remarks (कक्षा अध्यापक की टिप्पणी)
                </label>
                <input
                  type="text"
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('records')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={!selectedStudentId}
                className="px-6 py-2.5 rounded-xl bg-[#12366b] hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
              >
                💾 मार्कशीट सुरक्षित करें व प्रिंट करें
              </button>
            </div>
          </form>
        </section>
      )}

      {/* MARKSHEET RECORDS LIST */}
      {activeTab === 'records' && (
        <section className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[220px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, roll no, exam..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
          </div>

          {/* Marksheets Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Exam Term</th>
                    <th className="py-3 px-4">Marks</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Result</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marksheets
                    .filter((m) => {
                      const student = students.find((s) => s.id === m.studentId);
                      if (!student) return false;
                      if (filterClass && student.className !== filterClass) return false;
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        student.studentName.toLowerCase().includes(q) ||
                        student.admissionNo.toLowerCase().includes(q) ||
                        m.examTerm.toLowerCase().includes(q)
                      );
                    })
                    .map((item) => {
                      const student = students.find((s) => s.id === item.studentId);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                                {student?.photoUrl ? (
                                  <img src={student.photoUrl} alt={student.studentName} className="w-full h-full object-cover" />
                                ) : (
                                  (student?.studentName || 'S').charAt(0)
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block">
                                  {student?.studentName || 'Student'}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  Adm: {student?.admissionNo}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            Class {student?.className} ({student?.section})
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {item.examTerm}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {item.totalObtained} / {item.totalMaxMarks}
                          </td>
                          <td className="py-3 px-4 text-center font-extrabold text-blue-700">
                            {item.percentage}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                              {item.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                item.result === 'PASS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.result === 'COMPARTMENT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.result}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => student && setActivePrintMarksheet({ record: item, student })}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* OFFICIAL PRINTABLE MARKSHEET MODAL */}
      {activePrintMarksheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Top Bar */}
            <div className="bg-[#12366b] text-white px-5 py-3.5 flex items-center justify-between no-print">
              <span className="font-bold text-sm">Official Report Card / Marksheet</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Marksheet</span>
                </button>
                <button
                  onClick={() => setActivePrintMarksheet(null)}
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Card Sheet Body */}
            <div className="p-6 sm:p-10 text-slate-800 bg-white" id="printableMarksheet">
              {/* School Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <div className="inline-flex items-center justify-center space-x-2 text-[#12366b] mb-1">
                  <School className="w-7 h-7 text-[#12366b]" />
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                    SP CHAUDHARY SENIOR SECONDARY SCHOOL
                  </h2>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  AFFILIATED TO CBSE, NEW DELHI • SCHOOL CODE: 54921
                </p>
                <h3 className="mt-2 text-sm sm:text-base font-extrabold text-[#12366b] uppercase tracking-wide">
                  ANNUAL ACADEMIC REPORT CARD (सत्र 2026-2027)
                </h3>
                <p className="text-xs text-slate-600 font-semibold">{activePrintMarksheet.record.examTerm}</p>
              </div>

              {/* Student Metadata Box with Official Passport Photo Frame */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-300 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                {/* Student Info Grid */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium w-full">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Student Name:</span>
                    <strong className="text-slate-900">{activePrintMarksheet.student.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Roll Number:</span>
                    <strong className="text-slate-900">#{activePrintMarksheet.student.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Admission No:</span>
                    <strong className="font-mono text-slate-900">{activePrintMarksheet.student.admissionNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Class & Section:</span>
                    <strong className="text-slate-900">
                      Class {activePrintMarksheet.student.className} - {activePrintMarksheet.student.section}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Father's Name:</span>
                    <strong className="text-slate-900">{activePrintMarksheet.student.fatherName || 'Shri S. Kumar'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Attendance Rate:</span>
                    <strong className="text-emerald-700">{activePrintMarksheet.record.attendanceRate || 95}%</strong>
                  </div>
                </div>

                {/* Official Passport Photo Box on Marksheet */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-24 h-28 rounded-lg border-2 border-slate-800 bg-white p-1 flex items-center justify-center overflow-hidden shadow-xs relative group">
                    {activePrintMarksheet.student.photoUrl ? (
                      <img
                        src={activePrintMarksheet.student.photoUrl}
                        alt="Student"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <User className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                        <span className="text-[9px] block font-bold uppercase tracking-wider text-slate-500">
                          Passport Photo
                        </span>
                      </div>
                    )}

                    {/* Hover upload trigger */}
                    <label className="no-print absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-0.5 text-amber-300" />
                      <span>फोटो बदलें</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMarksheetPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Photo Upload & Change Button on Marksheet (hidden in print) */}
                  <div className="no-print mt-2 flex flex-col items-center space-y-1">
                    <label className="cursor-pointer inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold shadow-xs active:scale-95 transition-all">
                      <Camera className="w-3 h-3" />
                      <span>{activePrintMarksheet.student.photoUrl ? 'फोटो बदलें' : 'फोटो जोड़ें'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMarksheetPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Quick Avatar selector */}
                    <div className="flex items-center space-x-1">
                      {STUDENT_AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSetMarksheetAvatar(p.url)}
                          className="w-5 h-5 rounded-full border border-slate-300 overflow-hidden hover:scale-115 transition-transform"
                          title={p.name}
                        >
                          <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div className="mt-5 border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">S.N.</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Subject Name</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Passing</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-28 text-center">Marks Obtained</th>
                      <th className="py-2.5 px-3 w-20 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activePrintMarksheet.record.subjects.map((sub, index) => {
                      const subjectGrade = calculateGrade(sub.totalMarks);
                      return (
                        <tr key={sub.subject}>
                          <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-500">
                            {index + 1}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">
                            {sub.subject}
                          </td>
                          <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-600">
                            {sub.maxMarks}
                          </td>
                          <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-600">
                            33
                          </td>
                          <td className="py-2 px-3 text-center border-r border-slate-200 font-bold text-slate-900">
                            {sub.totalMarks}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-purple-700">
                            {subjectGrade}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={2} className="py-2.5 px-3 border-r border-slate-300 text-right uppercase">
                        Grand Total:
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-300">
                        {activePrintMarksheet.record.totalMaxMarks}
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-300">
                        198
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-300 text-blue-900">
                        {activePrintMarksheet.record.totalObtained}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-800">
                        {activePrintMarksheet.record.grade}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Overall Result & Remarks */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500 block text-[11px]">Percentage:</span>
                  <strong className="text-base text-blue-800 font-black">
                    {activePrintMarksheet.record.percentage}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Overall Grade:</span>
                  <strong className="text-base text-purple-800 font-black">
                    Grade {activePrintMarksheet.record.grade}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Result:</span>
                  <strong
                    className={`text-base font-black ${
                      activePrintMarksheet.record.result === 'PASS'
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {activePrintMarksheet.record.result}
                  </strong>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <strong>Teacher's Remark:</strong>{' '}
                <span className="italic">{activePrintMarksheet.record.teacherRemarks}</span>
              </div>

              {/* Official Signatures */}
              <div className="mt-12 pt-6 border-t border-slate-400 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400 w-32 mx-auto mb-1"></div>
                  <strong className="text-slate-800">Class Teacher</strong>
                </div>
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400 w-32 mx-auto mb-1"></div>
                  <strong className="text-slate-800">Controller of Exams</strong>
                </div>
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400 w-32 mx-auto mb-1"></div>
                  <strong className="text-slate-800">Principal Seal & Stamp</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
