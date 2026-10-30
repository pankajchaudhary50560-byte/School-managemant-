import { AttendanceEntry, AttendanceRecord, AttendanceStats, AttendanceStatus, Student } from '../types';

export function calculateAttendanceStats(
  students: Student[],
  attendanceMap: Record<string, { status: AttendanceStatus; remark?: string }>
): AttendanceStats {
  const total = students.length;
  if (total === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      leave: 0,
      percent: 0,
      statusLabel: 'Low',
    };
  }

  let present = 0;
  let absent = 0;
  let leave = 0;

  for (const s of students) {
    const entry = attendanceMap[s.id];
    const status = entry?.status || 'Absent';
    if (status === 'Present') present++;
    else if (status === 'Leave') leave++;
    else absent++;
  }

  const percent = Math.round((present / total) * 100);

  let statusLabel: AttendanceStats['statusLabel'] = 'Low';
  if (percent >= 90) statusLabel = 'Excellent';
  else if (percent >= 75) statusLabel = 'Good';
  else if (percent >= 50) statusLabel = 'Average';

  return {
    total,
    present,
    absent,
    leave,
    percent,
    statusLabel,
  };
}

export function getRecordKey(date: string, className: string, section: string): string {
  const sec = section && section.trim() !== '' ? section.trim().toUpperCase() : 'ALL';
  return `${date}_Class${className}_Sec${sec}`;
}

export function filterStudentsList(
  students: Student[],
  options: {
    className: string;
    section?: string;
    searchQuery?: string;
    statusFilter?: string;
    attendanceMap?: Record<string, { status: AttendanceStatus; remark?: string }>;
  }
): Student[] {
  const { className, section, searchQuery, statusFilter, attendanceMap } = options;

  let filtered = students.filter((s) => {
    const sameClass = String(s.className).trim() === String(className).trim();
    const sameSection = !section || section === '' || String(s.section).trim().toUpperCase() === section.trim().toUpperCase();
    return sameClass && sameSection;
  });

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (s) =>
        s.studentName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q)
    );
  }

  if (statusFilter && statusFilter !== 'ALL' && attendanceMap) {
    filtered = filtered.filter((s) => {
      const status = attendanceMap[s.id]?.status || 'Absent';
      return status.toLowerCase() === statusFilter.toLowerCase();
    });
  }

  // Sort numerically by roll number if possible, else lexicographically
  filtered.sort((a, b) => {
    const rollA = parseInt(a.rollNo, 10);
    const rollB = parseInt(b.rollNo, 10);
    if (!isNaN(rollA) && !isNaN(rollB)) {
      return rollA - rollB;
    }
    return a.rollNo.localeCompare(b.rollNo);
  });

  return filtered;
}

export function generateCsvData(
  className: string,
  section: string,
  date: string,
  entries: { rollNo: string; admissionNo: string; studentName: string; status: AttendanceStatus; remark?: string }[]
): string {
  const headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Date', 'Status', 'Remark'];
  const rows = entries.map((e) => [
    `"${e.rollNo}"`,
    `"${e.admissionNo}"`,
    `"${e.studentName.replace(/"/g, '""')}"`,
    `"${className}"`,
    `"${section || 'All'}"`,
    `"${date}"`,
    `"${e.status}"`,
    `"${(e.remark || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function formatIndianDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}
