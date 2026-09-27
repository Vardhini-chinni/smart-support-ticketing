import React from 'react';
import {
  Ticket as TicketIcon,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { EscalationRecord, PageId, Ticket, TicketStatus } from '../types/support';
import { WEEKLY_TICKET_ACTIVITY } from '../data/mockData';

interface DashboardViewProps {
  tickets: Ticket[];
  escalations: EscalationRecord[];
  onSelectTicket: (ticketId: string) => void;
  onNavigate: (page: PageId) => void;
  onNavigateWithStatusFilter: (status: TicketStatus | 'All') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tickets,
  escalations,
  onSelectTicket,
  onNavigate,
  onNavigateWithStatusFilter,
}) => {
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  const statCards = [
    {
      label: 'Total Tickets',
      value: totalCount,
      trend: '+12% this week',
      trendTone: 'text-slate-600',
      icon: TicketIcon,
      iconTone: 'text-indigo-900 bg-indigo-50',
      filterStatus: 'All' as const,
    },
    {
      label: 'Open Tickets',
      value: openCount,
      trend: 'Awaiting triage',
      trendTone: 'text-amber-700',
      icon: Clock,
      iconTone: 'text-amber-700 bg-amber-50',
      filterStatus: 'Open' as const,
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      trend: 'Active agent work',
      trendTone: 'text-blue-700',
      icon: RefreshCw,
      iconTone: 'text-blue-700 bg-blue-50',
      filterStatus: 'In Progress' as const,
    },
    {
      label: 'Resolved',
      value: resolvedCount,
      trend: `${Math.round((resolvedCount / Math.max(totalCount, 1)) * 100)}% resolution rate`,
      trendTone: 'text-emerald-700',
      icon: CheckCircle2,
      iconTone: 'text-emerald-700 bg-emerald-50',
      filterStatus: 'Resolved' as const,
    },
    {
      label: 'Escalated',
      value: escalatedCount,
      trend: 'Priority hierarchy review',
      trendTone: 'text-rose-700',
      icon: AlertTriangle,
      iconTone: 'text-rose-700 bg-rose-50',
      filterStatus: 'Escalated' as const,
    },
  ];

  const maxDailyVal = Math.max(
    ...WEEKLY_TICKET_ACTIVITY.map((d) => Math.max(d.created, d.resolved)),
    25
  );

  const statusDistribution = [
    { label: 'Resolved', count: resolvedCount, color: '#059669', twText: 'text-emerald-700' },
    { label: 'Escalated', count: escalatedCount, color: '#e11d48', twText: 'text-rose-700' },
    { label: 'Open', count: openCount, color: '#d97706', twText: 'text-amber-700' },
    { label: 'In Progress', count: inProgressCount, color: '#2563eb', twText: 'text-blue-700' },
  ];

  // Calculate SVG donut segments
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const getStatusTextStyle = (status: TicketStatus) => {
    switch (status) {
      case 'Resolved':
        return 'text-emerald-700 font-semibold';
      case 'Escalated':
        return 'text-rose-700 font-semibold';
      case 'In Progress':
        return 'text-blue-700 font-semibold';
      case 'Open':
      default:
        return 'text-amber-700 font-semibold';
    }
  };

  const getPriorityTextStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-700 font-semibold';
      case 'High':
        return 'text-amber-700 font-semibold';
      case 'Medium':
        return 'text-slate-700 font-medium';
      case 'Low':
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Overview of customer support tickets, resolutions and escalations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time operational summary across all 6 support teams and 4 escalation hierarchy levels.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('escalations')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            View Escalation Chain
          </button>
          <button
            onClick={() => onNavigate('create-ticket')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* 5 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigateWithStatusFilter(card.filterStatus)}
              className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-slate-300 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconTone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">
                  {card.label}
                </div>
                <div className={`text-[11px] mt-1 ${card.trendTone}`}>
                  {card.trend}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Charts Row: Left = Ticket Activity, Right = Ticket Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Ticket Activity Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ticket Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily comparison of incoming tickets vs resolved and escalated cases (7-day window)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-950 inline-block" />
                <span>Created</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                <span>Resolved</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" />
                <span>Escalated</span>
              </span>
            </div>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-4 pb-2 px-2 border-b border-slate-100">
            {WEEKLY_TICKET_ACTIVITY.map((item) => {
              const createdHeight = Math.round((item.created / maxDailyVal) * 150);
              const resolvedHeight = Math.round((item.resolved / maxDailyVal) * 150);
              const escalatedHeight = Math.max(Math.round((item.escalated / maxDailyVal) * 150), 6);

              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full flex items-end justify-center gap-1.5 h-40">
                    <div
                      style={{ height: `${createdHeight}px` }}
                      title={`${item.day} Created: ${item.created}`}
                      className="w-3 sm:w-3.5 bg-indigo-950 rounded-t transition-opacity group-hover:opacity-90"
                    />
                    <div
                      style={{ height: `${resolvedHeight}px` }}
                      title={`${item.day} Resolved: ${item.resolved}`}
                      className="w-3 sm:w-3.5 bg-emerald-600 rounded-t transition-opacity group-hover:opacity-90"
                    />
                    <div
                      style={{ height: `${escalatedHeight}px` }}
                      title={`${item.day} Escalated: ${item.escalated}`}
                      className="w-2.5 sm:w-3 bg-rose-600 rounded-t transition-opacity group-hover:opacity-90"
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-600 font-mono">
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Weekly intake volume: 123 tickets</span>
            <span className="font-mono tabular-nums text-slate-700 font-medium">
              Avg First Response: 18m 40s
            </span>
          </div>
        </div>

        {/* RIGHT: Ticket Status Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ticket Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Current distribution of active and closed tickets
            </p>
          </div>

          <div className="my-6 flex items-center justify-center gap-8">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {statusDistribution.map((slice) => {
                  const pct = totalCount > 0 ? slice.count / totalCount : 0;
                  const strokeDasharray = `${pct * circumference} ${circumference}`;
                  const strokeDashoffset = -cumulativePercent * circumference;
                  cumulativePercent += pct;
                  return (
                    <circle
                      key={slice.label}
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {totalCount}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total Tickets
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {statusDistribution.map((item) => {
                const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <div className="font-mono tabular-nums text-slate-900 font-semibold">
                      {item.count}{' '}
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SLA Compliance Rate</span>
            <span className="font-mono tabular-nums font-semibold text-emerald-700">
              94.2% On-Target
            </span>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Tickets</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest customer support tickets routed across specialized teams. Click any row for full lifecycle timeline.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tickets')}
            className="text-xs font-semibold text-indigo-950 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All Tickets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {tickets.slice(0, 8).map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono font-semibold text-indigo-950 whitespace-nowrap">
                    {ticket.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {ticket.customerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                    {ticket.issue}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {ticket.category}
                  </td>
                  <td className={`py-3.5 px-4 whitespace-nowrap ${getPriorityTextStyle(ticket.priority)}`}>
                    {ticket.priority}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {ticket.assignedTeam}
                  </td>
                  <td className={`py-3.5 px-4 whitespace-nowrap ${getStatusTextStyle(ticket.status)}`}>
                    {ticket.status}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {ticket.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Escalation Activity Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Escalation Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological escalation log tracking multi-tier agent handoffs
            </p>
          </div>
          <button
            onClick={() => onNavigate('escalations')}
            className="text-xs font-semibold text-indigo-950 hover:underline flex items-center gap-1"
          >
            <span>Open Escalation Console</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {escalations.slice(0, 4).map((esc) => (
            <div
              key={esc.id}
              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 last:border-none last:pb-0"
            >
              <span
                className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  esc.status === 'Escalated' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-indigo-950">
                    {esc.ticketId}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-900">
                    {esc.customerName}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-rose-700">
                    {esc.currentLevel}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">
                    Assigned to {esc.assignedAgentName}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{esc.reason}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {esc.escalatedAt}
                </span>
                <button
                  onClick={() => onSelectTicket(esc.ticketId)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Inspect Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
