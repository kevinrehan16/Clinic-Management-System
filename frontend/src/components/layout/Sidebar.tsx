import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Settings, 
  CreditCard, ChevronDown, ChevronRight, MonitorCog 
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getInitials } from '../../utils/formatters';

const getColor = (variable: string) => `var(${variable})`;

export default function Sidebar({ 
  isCollapsed, 
  onOpenSettings 
}: { 
  isCollapsed: boolean; 
  onOpenSettings: () => void; 
}) {
  const { user } = useAuth();
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const location = useLocation();
  const isBillingActive = location.pathname.startsWith('/billing');

  // 1. GUMAWA NG REF PARA SA BILLING CONTAINER
  const billingRef = useRef<HTMLDivElement>(null);

  // 2. CLICK OUTSIDE LISTENER: Kusa nitong isasara ang menu kapag nag-click sa labas at hindi ito active
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isBillingOpen && // Kung nakabukas ang menu
        !isBillingActive && // AT hindi naman ito ang aktibong page ngayon
        billingRef.current && 
        !billingRef.current.contains(event.target as Node) // AT sa labas ng container nag-click
      ) {
        setIsBillingOpen(false); // Isara ang menu
      }
    }

    // Isabit ang event listener sa buong document
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Linisin ang listener kapag nag-unmount ang component
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBillingOpen, isBillingActive]);

  // Unified Classes
  const activeParentClass = `bg-[var(--active-parent)] text-white font-medium shadow-md shadow-blue-500/20`;
  const inactiveParentClass = `text-[var(--menu-text)] hover:bg-slate-700/40 hover:text-white`;

  const navLinkBase = "flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-colors duration-150 ease-in-out";
  
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${navLinkBase} ${isActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`;

  const SectionHeader = ({ title }: { title: string }) => (
    isCollapsed ? (
      <div className="border-t border-slate-700/50 mx-4 my-4"></div>
    ) : (
      <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 first:mt-0">
        {title}
      </div>
    )
  );

  return (
    <aside 
      className={`h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: getColor('--sidebar-bg'), color: getColor('--menu-text') }}
    >
      
      {/* Brand Logo */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5'} border-b border-slate-700/50 shrink-0`}>
        <div className="inline-block p-1 rounded-full border-3 border-[var(--active-parent)]">
          <img 
            src="/web_images/clinic.jpg" 
            alt="Logo" 
            className="h-8 w-8 rounded-full object-cover shadow-md" 
          />
        </div>
        {!isCollapsed && <span className="ml-2.5 font-extrabold text-xl tracking-tight">Med<span className="text-[var(--active-parent)]">Salus</span></span>}
      </div>

      <nav className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin">
        
        {/* Dashboard */}
        <NavLink to="/" className={getNavLinkClass}>
          <LayoutDashboard size={18} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Operations */}
        <div>
          <SectionHeader title="Operations" />
          <div className="space-y-1.5">
            <NavLink to="/patients" className={getNavLinkClass}>
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span>Patients</span>}
            </NavLink>
            
            <NavLink to="/appointments" className={getNavLinkClass}>
              <Calendar size={18} className="shrink-0" />
              {!isCollapsed && <span>Appointments</span>}
            </NavLink>
            
            {/* BILLING CONTAINER - INILAGAY ANG REF DITO */}
            <div ref={billingRef}>
              <button 
                onClick={() => setIsBillingOpen(!isBillingOpen)}
                className={`${navLinkBase} w-full justify-between ${isBillingActive ? activeParentClass : inactiveParentClass} ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                  <CreditCard size={18} className="shrink-0" />
                  {!isCollapsed && <span>Billing</span>}
                </div>
                {!isCollapsed && (isBillingOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              
              {isBillingOpen && (
                <div className={`mt-1 relative w-full ${isCollapsed ? 'flex flex-col items-center gap-2' : 'space-y-1'}`}> 
                  
                  {/* Patayong gabay na linya */}
                  {!isCollapsed && (
                    <div className="absolute left-[23px] top-0 bottom-0 w-[1px] bg-slate-700/50 z-0" />
                  )}

                  {/* INVOICES LINK */}
                  <NavLink 
                    to="/billing/invoices" 
                    className="group flex items-center w-full text-sm h-9 relative z-10"
                  >
                    {({ isActive }) => (
                      <div className="pl-[23px] flex items-center w-full h-full">
                        
                        {/* Horizontal Line Indicator */}
                        <span className={`h-[1px] shrink-0 transition-all duration-150 ${
                          isActive 
                            ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' 
                            : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)] group-hover:shadow-[0_0_8px_var(--active-parent)]'
                        }`} />
                        
                        {/* Hover Background Pill */}
                        <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${
                          isActive 
                            ? 'text-white font-bold bg-slate-700/30' 
                            : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'
                        }`}>
                          Invoices
                        </div>

                      </div>
                    )}
                  </NavLink>

                  {/* TRANSACTIONS LINK */}
                  <NavLink 
                    to="/billing/transactions" 
                    className="group flex items-center w-full text-sm h-9 relative z-10"
                  >
                    {({ isActive }) => (
                      <div className="pl-[23px] flex items-center w-full h-full">
                        
                        {/* Horizontal Line Indicator */}
                        <span className={`h-[1px] shrink-0 transition-all duration-150 ${
                          isActive 
                            ? 'w-3 bg-[var(--active-parent)] shadow-[0_0_8px_var(--active-parent)]' 
                            : 'w-3 bg-slate-600 group-hover:bg-[var(--active-parent)] group-hover:shadow-[0_0_8px_var(--active-parent)]'
                        }`} />
                        
                        {/* Hover Background Pill */}
                        <div className={`flex-1 flex items-center h-full px-3 rounded-lg transition-colors duration-150 ${
                          isActive 
                            ? 'text-white font-bold bg-slate-700/30' 
                            : 'text-slate-400 group-hover:bg-slate-700/40 group-hover:text-white'
                        }`}>
                          Transactions
                        </div>

                      </div>
                    )}
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System */}
        <div>
          <SectionHeader title="System" />
          <NavLink to="/settings" className={getNavLinkClass}>
            <MonitorCog size={18} className="shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 mt-auto bg-slate-900/30">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isCollapsed && (
             <div className="flex items-center gap-3">
                 {/* <img src="https://i.pravatar.cc/40?u=clinicuser" alt="User" className="w-9 h-9 rounded-full"/> */}
                 <div className="w-10 h-10 rounded-full bg-[var(--active-parent)] border-2 border-white-200 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user ? getInitials(user.first_name + ' ' + user.last_name) : '??'}
                 </div>
                 <div>
                     <p className="text-sm font-semibold text-white">{user?.first_name} {user?.last_name}</p>
                     <p className="text-xs text-slate-400">{user?.role}</p>
                 </div>
             </div>
           )}
           <button 
             onClick={onOpenSettings}
             className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
             title="Change Theme"
           >
             <Settings size={18} className="transition-transform duration-300 hover:rotate-90" />
           </button>
        </div>
      </div>
    </aside>
  );
}