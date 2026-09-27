import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  CheckCheck,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { NotificationItem, PageId, Ticket } from '../types/support';

interface HeaderProps {
  title: string;
  subtitle: string;
  tickets: Ticket[];
  notifications: NotificationItem[];
  onSelectTicket: (ticketId: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  tickets,
  notifications,
  onSelectTicket,
  onMarkAllRead,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTickets = searchQuery.trim()
    ? tickets
        .filter(
          (t) =>
            t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-8 py-4 flex items-center justify-between gap-6">
      {/* Left: Page Title & Short Description */}
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
          {title}
        </h1>
        <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
      </div>

      {/* Right: Search, Notifications, User Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Global Ticket Search Box */}
        <div ref={searchRef} className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search ticket ID, customer, issue..."
              className="w-64 lg:w-72 pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-40">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Matching Support Tickets</span>
                <span className="font-mono tabular-nums">{filteredTickets.length} results</span>
              </div>
              {filteredTickets.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No tickets matching "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        onSelectTicket(ticket.id);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-start justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-900">
                          <span className="font-mono text-indigo-950 font-semibold">
                            {ticket.id}
                          </span>
                          <span>·</span>
                          <span className="truncate">{ticket.customerName}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {ticket.issue}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0 font-medium">
                        {ticket.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    onNavigate('tickets');
                    setSearchOpen(false);
                  }}
                  className="text-xs font-medium text-indigo-950 hover:underline flex items-center gap-1"
                >
                  <span>View all tickets</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-40">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">
                  System Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs font-medium text-indigo-900 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark read</span>
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.ticketId) {
                        onSelectTicket(item.ticketId);
                      }
                      setNotifOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors block ${
                      !item.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile: Vardhini (Project Admin) */}
        <button
          onClick={() => onNavigate('about-project')}
          className="flex items-center gap-2.5 text-left hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-950 text-white font-semibold text-xs flex items-center justify-center shrink-0">
            V
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold text-slate-900">Vardhini</div>
            <div className="text-[11px] text-slate-500">Project Admin</div>
          </div>
        </button>
      </div>
    </header>
  );
};
