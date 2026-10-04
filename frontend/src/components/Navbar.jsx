import React from 'react';
import { QuillSketch, BookmarkSketch } from './SketchIcons';
import { Calendar, LogOut } from 'lucide-react';

export const Navbar = ({
  user,
  onLogout,
  onOpenLogger
}) => {
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="border-b border-[#E3DAC8] bg-[#FAF7F0] sticky top-0 z-30 shadow-[0_2px_8px_rgba(40,30,15,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Journal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A6F54]/10 border border-[#2A6F54]/30 flex items-center justify-center shadow-inner">
            <QuillSketch className="w-6 h-6" color="#2A6F54" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#1F2B26]">HEALTIFY</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAE2D2] text-[#4A4036] font-medium border border-[#D5C9B4]">
                Journal Edition
              </span>
            </div>
            <p className="text-xs text-[#6F685D] font-journal italic">
              Personal Lifestyle Tracking & Wellness Companion
            </p>
          </div>
        </div>

        {/* Date & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Paper Date Bookmark */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F2EDE2] border border-[#DDD3C0] text-xs text-[#524B40]">
            <Calendar className="w-3.5 h-3.5 text-[#2A6F54]" />
            <span className="font-medium">{todayStr}</span>
          </div>

          {/* Quick Record Habit Button */}
          <button
            onClick={onOpenLogger}
            className="ink-btn px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
            title="Record today's lifestyle habits"
          >
            <BookmarkSketch className="w-3.5 h-3.5" color="#FAF8F2" />
            <span>Record Today</span>
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-[#DDD3C0]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#1F2B26] leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#786F62] leading-tight">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg border border-[#DDD3C0] hover:bg-[#FBEAE7] text-[#8C3A2B] transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
