import React, { useState } from 'react';
import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  FileSpreadsheet,
  Menu,
  X,
  School,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Users
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onResetData: () => void;
  studentCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onNavigate,
  onResetData,
  studentCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard (डैशबोर्ड)', icon: LayoutDashboard, badge: null },
    { id: 'students', label: 'Students (छात्र)', icon: GraduationCap, badge: `${studentCount}` },
    { id: 'attendance', label: 'Attendance (उपस्थिति)', icon: CalendarDays, badge: 'Active' },
    { id: 'fees', label: 'Fees Management (फीस)', icon: ReceiptText, badge: null },
    { id: 'marksheet', label: 'Marksheet (मार्कशीट)', icon: FileSpreadsheet, badge: null },
  ];

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#12366b] text-white px-4 py-3 shadow-md flex items-center justify-between no-print">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center font-bold text-white border border-blue-300/30">
              <School className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">SP CHAUDHARY</h1>
              <p className="text-[10px] text-blue-200">School Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Online
          </span>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 no-print"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#12366b] text-white p-5 flex flex-col justify-between shadow-2xl transform transition-transform duration-300 ease-in-out no-print ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center border border-blue-400/30 shadow-inner">
                <School className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h2 className="font-bold text-base tracking-wide">SP CHAUDHARY</h2>
                <p className="text-xs text-blue-200">School Management</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-1.5">
            <p className="px-3 text-[11px] font-semibold text-blue-200/60 uppercase tracking-wider mb-2">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentTab;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-blue-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-white/15 text-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-xl bg-blue-950/50 border border-white/5">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span>Enrolled Students</span>
              <span className="font-bold text-white">{studentCount}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <button
            onClick={() => {
              onResetData();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-[#12366b] text-white flex-col justify-between p-5 z-30 shadow-xl no-print">
        <div>
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
            <div className="w-11 h-11 rounded-xl bg-blue-500/25 flex items-center justify-center border border-blue-400/30 shadow-inner">
              <School className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wide text-white">SP CHAUDHARY</h2>
              <p className="text-xs text-blue-200 font-medium">School Management</p>
            </div>
          </div>

          {/* Nav List */}
          <div className="mt-6 space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-blue-200/60 uppercase tracking-wider mb-2">Management</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentTab;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/40 font-semibold ring-1 ring-white/20'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-blue-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-900 shadow-xs'
                          : 'bg-white/15 text-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3.5 rounded-xl bg-blue-950/60 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-300" /> Total Students
              </span>
              <span className="font-bold text-amber-300 text-sm">{studentCount}</span>
            </div>
            <p className="text-[11px] text-blue-200/80 leading-snug">
              Class 6 to 12 record book
            </p>
          </div>

          <button
            onClick={onResetData}
            title="Reset students & attendance records to default test dataset"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
