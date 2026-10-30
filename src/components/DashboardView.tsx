import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  ArrowUpRight,
  UserPlus,
  CalendarDays,
  FileSpreadsheet,
  TrendingUp,
  School,
  Sparkles,
  Award,
} from 'lucide-react';
import { Student, FeePayment, MarksheetRecord } from '../types';
import { formatINR } from '../utils/schoolLogic';

interface DashboardViewProps {
  students: Student[];
  payments: FeePayment[];
  todayAttendancePercent: number;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  payments,
  todayAttendancePercent,
  onNavigate,
}) => {
  const totalStudents = students.length;
  const totalTeachers = 18; // Pre-configured faculty count
  const totalFeesCollected = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Group students count by class
  const classBreakdown = ['6', '7', '8', '9', '10', '11', '12'].map((cls) => {
    const count = students.filter((s) => s.className === cls).length;
    return { className: `Class ${cls}`, count };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#12366b] via-[#1a4a8f] to-[#12366b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <School className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, School Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            SP Chaudhary School Management System
          </h1>
          <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed">
            छात्र प्रवेश, दैनिक उपस्थिति, फीस प्रबंधन एवं वार्षिक परीक्षा परिणाम (मार्कशीट) को एक ही स्थान से सरलता से प्रबंधित करें।
          </p>

          {/* Quick Actions Buttons */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('students')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>नया छात्र प्रवेश (+ New Admission)</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all active:scale-95 border border-white/20"
            >
              <CalendarDays className="w-4 h-4" />
              <span>दैनिक उपस्थिति (Attendance)</span>
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all active:scale-95 border border-white/20"
            >
              <Receipt className="w-4 h-4" />
              <span>फीस जमा (Fees)</span>
            </button>
            <button
              onClick={() => onNavigate('marksheet')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all active:scale-95 border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>मार्कशीट (Marksheet)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <section aria-label="School overview cards" className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800" id="students">
              {totalStudents}
            </p>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">कुल नामांकित छात्र</p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Total Teachers
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800" id="teachers">
              {totalTeachers}
            </p>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">अध्यापक एवं स्टाफ</p>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Today's Attendance
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800" id="attendance">
              {todayAttendancePercent}%
            </p>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">आज की कुल उपस्थिति</p>
        </div>

        {/* Fee Collection */}
        <div
          onClick={() => onNavigate('fees')}
          className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Fee Collection
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 truncate" id="fees">
              {formatINR(totalFeesCollected)}
            </p>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
          </div>
          <p className="mt-1 text-xs text-slate-400 font-medium">कुल जमा शुल्क</p>
        </div>
      </section>

      {/* Class Wise Distribution Grid */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              कक्षावार छात्र नामांकन (Class-wise Students)
            </h2>
            <p className="text-xs text-slate-500">कक्षा 6 से 12 तक के विद्यार्थियों की संख्या</p>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {classBreakdown.map((item) => (
            <div
              key={item.className}
              onClick={() => onNavigate('attendance')}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer text-center group"
            >
              <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700 block">
                {item.className}
              </span>
              <p className="text-xl font-extrabold text-slate-800 group-hover:text-blue-700 mt-1">
                {item.count}
              </p>
              <span className="text-[10px] text-slate-400">विद्यार्थी</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Grid: Recent Fees & Recent Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Fee Payments */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>हालिया फीस भुगतान (Recent Payments)</span>
            </h3>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Fees
            </button>
          </div>

          <div className="space-y-2.5">
            {payments.slice(0, 4).map((pay) => {
              const student = students.find((s) => s.id === pay.studentId);
              return (
                <div
                  key={pay.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {student ? student.studentName : 'विद्यार्थी'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Receipt: {pay.receiptNo} • {pay.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-600">
                      +{formatINR(pay.amount)}
                    </span>
                    <p className="text-[10px] text-slate-400">{pay.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>हालिया छात्र नामांकन (Recent Admissions)</span>
            </h3>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View Directory
            </button>
          </div>

          <div className="space-y-2.5">
            {students.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                    {s.rollNo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{s.studentName}</h4>
                    <p className="text-[11px] text-slate-400">
                      Class {s.className} ({s.section}) • Adm: {s.admissionNo}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Enrolled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
