import React, { useState } from 'react';
import {
  Check,
  X,
  Clock,
  MessageSquare,
  ChevronDown,
  User,
  Phone,
} from 'lucide-react';
import { AttendanceStatus, Student } from '../types';

interface StudentCardsViewProps {
  students: Student[];
  attendanceMap: Record<string, { status: AttendanceStatus; remark?: string }>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onRemarkChange: (studentId: string, remark: string) => void;
}

export const StudentCardsView: React.FC<StudentCardsViewProps> = ({
  students,
  attendanceMap,
  onStatusChange,
  onRemarkChange,
}) => {
  const [expandedRemarkId, setExpandedRemarkId] = useState<string | null>(null);

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80">
        <p className="text-sm font-medium text-slate-500">
          कोई विद्यार्थी नहीं मिला। कृपया फ़िल्टर बदलें या विद्यार्थी जोड़ें।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student) => {
        const record = attendanceMap[student.id];
        const currentStatus: AttendanceStatus = record?.status || 'Absent';
        const remark = record?.remark || '';
        const isRemarkOpen = expandedRemarkId === student.id;

        // Card border color based on status
        const getCardAccent = () => {
          switch (currentStatus) {
            case 'Present':
              return 'border-emerald-200 bg-emerald-50/20';
            case 'Leave':
              return 'border-amber-200 bg-amber-50/20';
            case 'Absent':
            default:
              return 'border-rose-200 bg-rose-50/15';
          }
        };

        return (
          <div
            key={student.id}
            className={`bg-white rounded-2xl p-4 border transition-all duration-150 shadow-xs hover:shadow-md flex flex-col justify-between ${getCardAccent()}`}
          >
            <div>
              {/* Card Top: Roll No Badge, Name, Admission No */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-200 shrink-0">
                    #{student.rollNo}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 truncate" title={student.studentName}>
                      {student.studentName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Adm: {student.admissionNo} {student.section ? `• Sec ${student.section}` : ''}
                    </p>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    currentStatus === 'Present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentStatus === 'Leave'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {currentStatus}
                </span>
              </div>

              {/* Quick Info (Optional Phone / Gender) */}
              {student.phone && (
                <div className="mt-2.5 flex items-center text-[11px] text-slate-500">
                  <Phone className="w-3 h-3 mr-1 text-slate-400" />
                  <span>{student.phone}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions: Large Touch Status Toggle Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label={`Attendance status for ${student.studentName}`}>
                {/* Present Button */}
                <button
                  type="button"
                  onClick={() => onStatusChange(student.id, 'Present')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
                    currentStatus === 'Present'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Present</span>
                </button>

                {/* Absent Button */}
                <button
                  type="button"
                  onClick={() => onStatusChange(student.id, 'Absent')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
                    currentStatus === 'Absent'
                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-800'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Absent</span>
                </button>

                {/* Leave Button */}
                <button
                  type="button"
                  onClick={() => onStatusChange(student.id, 'Leave')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
                    currentStatus === 'Leave'
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500 ring-offset-1'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Leave</span>
                </button>
              </div>

              {/* Remark section */}
              <div className="mt-2.5">
                {isRemarkOpen || remark ? (
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      placeholder="Note/Reason (e.g. Fever, Leave application)..."
                      value={remark}
                      onChange={(e) => onRemarkChange(student.id, e.target.value)}
                      className="w-full text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    />
                    {!remark && (
                      <button
                        onClick={() => setExpandedRemarkId(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-600 px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setExpandedRemarkId(student.id)}
                    className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center space-x-1 font-medium"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>+ Add Remark / Reason</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
