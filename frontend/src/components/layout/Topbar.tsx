import { useState, useRef, useEffect } from 'react';
import { PanelLeftClose, PanelRightOpen, Lock, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

export default function Topbar({ isCollapsed, setIsCollapsed }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { theme } = useTheme();
  // 1. I-extract ang 'user' mula sa context
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header 
      className="h-16 flex items-center px-6 justify-between border-b border-slate-200/50 transition-colors duration-300"
      style={{ backgroundColor: theme.topbarBg, borderColor: theme.topbarBorder, color: theme.topbarAccent }}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 rounded-lg text-slate-500 transition-all duration-300 hover:bg-slate-200/50 active:scale-90 cursor-pointer"
        style={{ color: theme.topbarAccent }}
      >
        {isCollapsed ? <PanelRightOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>

      {/* Profile Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 hover:ring-2 hover:ring-blue-500/20 transition-all duration-300 hover:shadow-md active:scale-95 cursor-pointer"
        >
          {/* 2. Dito natin ilalagay ang dynamic initials */}
          {user ? getInitials(user.first_name + ' ' + user.last_name) : '??'}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
            
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-semibold shadow-sm">
                  {user ? getInitials(user.first_name + ' ' + user.last_name) : '??'}
                </div>
                <div>
                  {/* 3. Dito ang dynamic name at role */}
                  <p className="text-sm font-semibold text-slate-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
                </div>
              </div>
            </div>

            <div className="p-1">
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-all duration-200 cursor-pointer"
              >
                <Lock size={16} /> Change Password
              </button>
              
              <div className="border-t border-slate-100 my-1" />
              
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}