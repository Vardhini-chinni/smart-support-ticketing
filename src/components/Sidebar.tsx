import React from 'react';
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  PlusCircle,
  Users,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Network,
  Database,
  GitBranch,
  Info,
  Settings,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { PageId } from '../types/support';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  openTicketCount: number;
  escalatedCount: number;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  openTicketCount,
  escalatedCount,
}) => {
  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets', icon: TicketIcon, count: openTicketCount },
    { id: 'create-ticket', label: 'Create Ticket', icon: PlusCircle },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'agents', label: 'Support Agents', icon: UserCheck },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle, count: escalatedCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'graph-analysis', label: 'Graph Analysis', icon: Network },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'project-flow', label: 'Project Flow', icon: GitBranch },
    { id: 'about-project', label: 'About Project', icon: Info },
  ];

  const bottomNavItems: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const isNavItemActive = (id: PageId) => {
    if (activePage === 'ticket-details' && id === 'tickets') {
      return true;
    }
    return activePage === id;
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-200">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left w-full group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-950 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-indigo-900 transition-colors">
            <ShieldCheck className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight text-slate-900 leading-tight truncate">
              SMART SUPPORT
            </div>
            <div className="text-xs font-medium text-slate-500 truncate mt-0.5">
              Ticketing System
            </div>
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Primary Sidebar Navigation">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? 'text-indigo-300' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    active
                      ? 'bg-indigo-800 text-indigo-100'
                      : 'text-slate-500'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-slate-200 space-y-0.5 bg-slate-50/50">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-indigo-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active ? 'text-indigo-300' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
