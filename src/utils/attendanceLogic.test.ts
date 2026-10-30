import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAttendanceStats,
  getRecordKey,
  filterStudentsList,
  generateCsvData,
  formatIndianDate,
} from './attendanceLogic';
import { Student, AttendanceStatus } from '../types';

const mockStudents: Student[] = [
  { id: '1', rollNo: '1', admissionNo: 'SPC-101', studentName: 'Aarav Sharma', className: '10', section: 'A' },
  { id: '2', rollNo: '2', admissionNo: 'SPC-102', studentName: 'Priya Patel', className: '10', section: 'A' },
  { id: '3', rollNo: '3', admissionNo: 'SPC-103', studentName: 'Rohan Verma', className: '10', section: 'B' },
  { id: '4', rollNo: '4', admissionNo: 'SPC-104', studentName: 'Ananya Singh', className: '9', section: 'A' },
];

test('calculateAttendanceStats calculates percentage and counts accurately', () => {
  const attendanceMap: Record<string, { status: AttendanceStatus }> = {
    '1': { status: 'Present' },
    '2': { status: 'Present' },
    '3': { status: 'Absent' },
    '4': { status: 'Leave' },
  };

  const stats = calculateAttendanceStats(mockStudents, attendanceMap);
  assert.equal(stats.total, 4);
  assert.equal(stats.present, 2);
  assert.equal(stats.absent, 1);
  assert.equal(stats.leave, 1);
  assert.equal(stats.percent, 50);
  assert.equal(stats.statusLabel, 'Average');
});

test('calculateAttendanceStats returns 0 when no students given', () => {
  const stats = calculateAttendanceStats([], {});
  assert.equal(stats.total, 0);
  assert.equal(stats.present, 0);
  assert.equal(stats.percent, 0);
});

test('getRecordKey formats key uniformly', () => {
  assert.equal(getRecordKey('2026-10-30', '10', 'A'), '2026-10-30_Class10_SecA');
  assert.equal(getRecordKey('2026-10-30', '10', ''), '2026-10-30_Class10_SecALL');
});

test('filterStudentsList filters by class, section and search query', () => {
  const class10Students = filterStudentsList(mockStudents, { className: '10' });
  assert.equal(class10Students.length, 3);

  const sectionA = filterStudentsList(mockStudents, { className: '10', section: 'A' });
  assert.equal(sectionA.length, 2);
  assert.equal(sectionA[0].studentName, 'Aarav Sharma');

  const searchResult = filterStudentsList(mockStudents, { className: '10', searchQuery: 'priya' });
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].admissionNo, 'SPC-102');
});

test('generateCsvData produces valid CSV with headers and rows', () => {
  const csv = generateCsvData('10', 'A', '2026-10-30', [
    { rollNo: '1', admissionNo: 'SPC-101', studentName: 'Aarav Sharma', status: 'Present', remark: 'Good' },
  ]);
  assert.ok(csv.includes('Roll No,Admission No,Student Name'));
  assert.ok(csv.includes('"Aarav Sharma"'));
  assert.ok(csv.includes('"Present"'));
});

test('formatIndianDate formats YYYY-MM-DD to DD/MM/YYYY', () => {
  assert.equal(formatIndianDate('2026-10-30'), '30/10/2026');
});
