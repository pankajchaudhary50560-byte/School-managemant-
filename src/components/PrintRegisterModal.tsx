import React from 'react';
import { X, Printer, Download, School, Check, UserX } from 'lucide-react';
import { AttendanceStats, AttendanceStatus, Student } from '../types';
import { formatIndianDate, generateCsvData } from '../utils/attendanceLogic';

interface PrintRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameVal: string;
  sectionVal: string;
  dateVal: string;
  students: Student[];
  attendanceMap: Record<string, { status: AttendanceStatus; remark?: string }>;
  stats: AttendanceStats;
}

export const PrintRegisterModal: React.FC<PrintRegisterModalProps> = ({
  isOpen,
  onClose,
  classNameVal,
  sectionVal,
  dateVal,
  students,
  attendanceMap,
  stats,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const entries = students.map((s) => ({
      rollNo: s.rollNo,
      admissionNo: s.admissionNo,
      studentName: s.studentName,
      status: attendanceMap[s.id]?.status || 'Absent',
      remark: attendanceMap[s.id]?.remark || '',
    }));

    const csv = generateCsvData(classNameVal, sectionVal, dateVal, entries);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_Class${classNameVal}_${sectionVal || 'All'}_${dateVal}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden in print) */}
        <div className="bg-[#12366b] text-white px-5 py-3.5 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Attendance Register Print Preview</h3>
              <p className="text-[11px] text-blue-200">
                Class {classNameVal} {sectionVal ? `(${sectionVal})` : ''} • {formatIndianDate(dateVal)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              title="Download Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-white transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Register</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-800" id="printableRegister">
          {/* Official School Header */}
          <div className="text-center pb-4 border-b-2 border-slate-800">
            <div className="inline-flex items-center justify-center space-x-2 text-[#12366b] mb-1">
              <School className="w-6 h-6 text-[#12366b]" />
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase">
                SP CHAUDHARY SENIOR SECONDARY SCHOOL
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Daily Student Attendance Register & Master Record Book
            </p>
          </div>

          {/* Metadata Row */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
            <div>
              <span className="text-slate-500">Class:</span> <strong className="text-slate-800">Class {classNameVal}</strong>
            </div>
            <div>
              <span className="text-slate-500">Section:</span> <strong className="text-slate-800">{sectionVal || 'All Sections'}</strong>
            </div>
            <div>
              <span className="text-slate-500">Date:</span> <strong className="text-slate-800">{formatIndianDate(dateVal)}</strong>
            </div>
            <div>
              <span className="text-slate-500">Rate:</span>{' '}
              <strong className="text-emerald-700">{stats.percent}% ({stats.present}/{stats.total})</strong>
            </div>
          </div>

          {/* Quick Statistics Summary Bar */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-100 p-2 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Total</span>
              <strong className="text-sm font-bold text-slate-800">{stats.total}</strong>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
              <span className="text-emerald-600 block text-[10px]">Present</span>
              <strong className="text-sm font-bold text-emerald-700">{stats.present}</strong>
            </div>
            <div className="bg-rose-50 p-2 rounded border border-rose-200">
              <span className="text-rose-600 block text-[10px]">Absent</span>
              <strong className="text-sm font-bold text-rose-700">{stats.absent}</strong>
            </div>
            <div className="bg-amber-50 p-2 rounded border border-amber-200">
              <span className="text-amber-600 block text-[10px]">Leave</span>
              <strong className="text-sm font-bold text-amber-700">{stats.leave}</strong>
            </div>
          </div>

          {/* Attendance Register Table */}
          <div className="mt-4 border border-slate-300 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                  <th className="py-2 px-3 w-16 text-center border-r border-slate-300 whitespace-nowrap">Roll No</th>
                  <th className="py-2 px-3 w-28 border-r border-slate-300 whitespace-nowrap">Adm No</th>
                  <th className="py-2 px-3 border-r border-slate-300">Student Name</th>
                  <th className="py-2 px-3 w-24 text-center border-r border-slate-300 whitespace-nowrap">Status</th>
                  <th className="py-2 px-3 whitespace-nowrap">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => {
                  const record = attendanceMap[student.id];
                  const status = record?.status || 'Absent';
                  const remark = record?.remark || '';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-bold text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {student.rollNo}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600 border-r border-slate-200 whitespace-nowrap">
                        {student.admissionNo}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-200">
                        {student.studentName}
                      </td>
                      <td className="py-2 px-3 text-center font-bold border-r border-slate-200 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] whitespace-nowrap ${
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800 font-bold'
                              : status === 'Leave'
                              ? 'bg-amber-100 text-amber-800 font-bold'
                              : 'bg-rose-100 text-rose-800 font-bold'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 italic">
                        {remark || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Teacher and Principal Signatures Footer */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-48 mx-auto"></div>
              <p className="mt-1 font-bold text-slate-800">Class Teacher Signature</p>
              <p className="text-[10px] text-slate-400">हस्ताक्षर कक्षा अध्यापक</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-48 mx-auto"></div>
              <p className="mt-1 font-bold text-slate-800">Principal Signature & Stamp</p>
              <p className="text-[10px] text-slate-400">हस्ताक्षर एवं मुहर प्रधानाचार्य</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
