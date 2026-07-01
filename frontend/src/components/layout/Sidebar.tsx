import { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Settings, 
  CreditCard, ChevronDown, ChevronRight 
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const getColor = (variable: string) => `var(${variable})`;

export default function Sidebar({ 
  isCollapsed, 
  onOpenSettings 
}: { 
  isCollapsed: boolean; 
  onOpenSettings: () => void; 
}) {
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const location = useLocation();
  const isBillingActive = location.pathname.startsWith('/billing');

  // Unified Classes
  const activeParentClass = `bg-[var(--active-parent)] text-white font-medium shadow-md shadow-blue-500/20`;
  const inactiveParentClass = `text-[var(--menu-text)] hover:bg-[var(--submenu-bg)] hover:translate-x-1 hover:text-[var(--menu-text)]`;

  const navLinkBase = "flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-all duration-300 ease-in-out";
  
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
    <aside className={`h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
           style={{ backgroundColor: getColor('--sidebar-bg'), color: getColor('--menu-text') }}>
      
      {/* Brand Logo */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-5'} border-b border-slate-700/50 shrink-0`}>
        <img src="/web_images/clinic.jpg" alt="Logo" className="h-10 w-10 rounded-full border-2 border-slate-500 object-cover shadow-md" />
        {!isCollapsed && <span className="ml-3.5 font-extrabold text-xl tracking-tight">SALUS</span>}
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
            
            {/* BILLING (Fixed Alignment) */}
            <div>
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
                <div className={`mt-1.5 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'ml-4 space-y-1'}`}> 
                   <NavLink to="/billing/invoices" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white hover:translate-x-1'}`}>
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Invoices
                   </NavLink>
                   <NavLink to="/billing/transactions" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white hover:translate-x-1'}`}>
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Transactions
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
            <Settings size={18} className="shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 mt-auto bg-slate-900/30">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isCollapsed && (
             <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/40?u=clinicuser" alt="User" className="w-9 h-9 rounded-full"/>
                 <div>
                     <p className="text-sm font-semibold text-white">Dr. Santos</p>
                     <p className="text-xs text-slate-400">Admin</p>
                 </div>
             </div>
           )}
           <button 
             onClick={onOpenSettings}
             className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all duration-300 hover:rotate-90"
             title="Change Theme"
           >
             <Settings size={18} />
           </button>
        </div>
      </div>
    </aside>
  );
}