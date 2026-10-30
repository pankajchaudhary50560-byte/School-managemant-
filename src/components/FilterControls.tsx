import React from 'react';
import {
  Calendar,
  CheckCheck,
  UserX,
  Search,
  Filter,
  UserPlus,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';

interface FilterControlsProps {
  selectedClass: string;
  setSelectedClass: (c: string) => void;
  selectedSection: string;
  setSelectedSection: (s: string) => void;
  attendanceDate: string;
  setAttendanceDate: (d: string) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onOpenAddStudent: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (f: string) => void;
  viewMode: 'cards' | 'table';
  setViewMode: (m: 'cards' | 'table') => void;
  hasLoadedStudents: boolean;
  studentCount: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  selectedClass,
  setSelectedClass,
  selectedSection,
  setSelectedSection,
  attendanceDate,
  setAttendanceDate,
  onMarkAllPresent,
  onMarkAllAbsent,
  onOpenAddStudent,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  viewMode,
  setViewMode,
  hasLoadedStudents,
  studentCount,
}) => {
  // Quick date navigation
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceDate(today);
  };

  const setYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setAttendanceDate(d.toISOString().split('T')[0]);
  };

  const stepDate = (days: number) => {
    try {
      const d = new Date(attendanceDate || new Date());
      d.setDate(d.getDate() + days);
      setAttendanceDate(d.toISOString().split('T')[0]);
    } catch {
      setToday();
    }
  };

  return (
    <section aria-label="Attendance filter controls" className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>कक्षा की उपस्थिति लगाएँ</span>
            <span className="text-xs font-normal text-slate-400">| Select & Mark</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            कक्षा, तारीख और सेक्शन चुनकर सीधे उपस्थिति लगाएँ।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddStudent}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors border border-blue-200/60 active:scale-95"
            title="Add a new student to this class"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Main Filter Row: Class, Date, Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-4">
        {/* Class Selection */}
        <div>
          <label htmlFor="attendanceClass" className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Class <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              id="attendanceClass"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
            >
              <option value="">-- कक्षा चुनें --</option>
              <option value="6">Class 6 (छठी कक्षा)</option>
              <option value="7">Class 7 (सातवीं कक्षा)</option>
              <option value="8">Class 8 (आठवीं कक्षा)</option>
              <option value="9">Class 9 (नौवीं कक्षा)</option>
              <option value="10">Class 10 (दसवीं कक्षा)</option>
              <option value="11">Class 11 (ग्यारहवीं कक्षा)</option>
              <option value="12">Class 12 (बारहवीं कक्षा)</option>
            </select>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="attendanceDate" className="text-xs font-bold text-slate-700">
              Attendance Date <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={setToday}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={setYesterday}
                className="text-[10px] font-medium text-slate-600 hover:text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded transition-colors"
              >
                Yesterday
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => stepDate(-1)}
              title="Previous Day"
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 active:scale-95 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              id="attendanceDate"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => stepDate(1)}
              title="Next Day"
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 active:scale-95 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Selection */}
        <div>
          <label htmlFor="attendanceSection" className="block text-xs font-bold text-slate-700 mb-1.5">
            Section
          </label>
          <select
            id="attendanceSection"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
          >
            <option value="">All Sections (सभी सेक्शन)</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>
      </div>

      {/* Quick Actions & Bulk Controls */}
      {selectedClass && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="markAllPresent"
              onClick={onMarkAllPresent}
              disabled={studentCount === 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-xs"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>

            <button
              type="button"
              id="markAllAbsent"
              onClick={onMarkAllAbsent}
              disabled={studentCount === 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-xs"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Mark All Absent</span>
            </button>
          </div>

          {/* View mode toggle (Cards vs Table) */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile friendly touch cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Card View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Classic table register view"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table View</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Status Filters Bar */}
      {selectedClass && studentCount > 0 && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no, or admission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Chips Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'Present', label: 'Present' },
              { id: 'Absent', label: 'Absent' },
              { id: 'Leave', label: 'Leave' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === chip.id
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
