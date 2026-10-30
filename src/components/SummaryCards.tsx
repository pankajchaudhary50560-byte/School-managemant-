import React from 'react';
import { Users, UserCheck, UserX, Clock, Award, TrendingUp } from 'lucide-react';
import { AttendanceStats } from '../types';

interface SummaryCardsProps {
  stats: AttendanceStats;
  selectedClass: string;
  selectedSection: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  stats,
  selectedClass,
  selectedSection,
}) => {
  const getBadgeColor = (label: AttendanceStats['statusLabel']) => {
    switch (label) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <section aria-label="Attendance statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4">
      {/* Total Students Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Total Students
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {stats.total}
          </p>
          <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Class {selectedClass || '-'}{selectedSection ? ` (${selectedSection})` : ''}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">कुल नामांकित छात्र</p>
      </div>

      {/* Present Students Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-emerald-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wide">
            Present
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.present}
          </p>
          <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {stats.total > 0 ? `${Math.round((stats.present / stats.total) * 100)}%` : '0%'}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/70">उपस्थित छात्र</p>
      </div>

      {/* Absent Students Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-rose-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-rose-700 uppercase tracking-wide">
            Absent
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {stats.absent}
          </p>
          {stats.leave > 0 && (
            <span className="text-[10px] sm:text-[11px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              +{stats.leave} Leave
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-rose-600/70">अनुपस्थित छात्र</p>
      </div>

      {/* Attendance Percentage Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Attendance Rate
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {stats.percent}%
          </p>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getBadgeColor(
              stats.statusLabel
            )}`}
          >
            {stats.statusLabel}
          </span>
        </div>
        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.percent >= 75
                ? 'bg-emerald-500'
                : stats.percent >= 50
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, stats.percent)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
