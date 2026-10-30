import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { AttendanceStatus, Student } from '../types';

interface StudentTableViewProps {
  students: Student[];
  attendanceMap: Record<string, { status: AttendanceStatus; remark?: string }>;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onRemarkChange: (studentId: string, remark: string) => void;
}

export const StudentTableView: React.FC<StudentTableViewProps> = ({
  students,
  attendanceMap,
  onStatusChange,
  onRemarkChange,
}) => {
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-3 w-16 text-center whitespace-nowrap">Roll No</th>
              <th className="py-3 px-3 w-32 whitespace-nowrap">Adm. No</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Status (स्थिति)</th>
              <th className="py-3 px-3 w-44">Remark / Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((student, index) => {
              const record = attendanceMap[student.id];
              const status: AttendanceStatus = record?.status || 'Absent';
              const remark = record?.remark || '';

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    index % 2 === 1 ? 'bg-slate-50/30' : ''
                  }`}
                >
                  {/* Roll No */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 text-xs">
                      {student.rollNo}
                    </span>
                  </td>

                  {/* Admission No */}
                  <td className="py-3 px-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {student.admissionNo}
                  </td>

                  {/* Student Name */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{student.studentName}</div>
                    {student.section && (
                      <span className="text-[11px] text-slate-400">Sec: {student.section}</span>
                    )}
                  </td>

                  {/* Attendance Status Buttons */}
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 space-x-1" role="group" aria-label={`Status for ${student.studentName}`}>
                      <button
                        type="button"
                        onClick={() => onStatusChange(student.id, 'Present')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-emerald-700'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusChange(student.id, 'Absent')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'Absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-rose-700'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => onStatusChange(student.id, 'Leave')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                          status === 'Leave'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-amber-700'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>

                  {/* Remark input */}
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      placeholder="Note / Reason..."
                      value={remark}
                      onChange={(e) => onRemarkChange(student.id, e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
