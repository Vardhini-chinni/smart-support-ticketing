import React from 'react';
import {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../types/support';
import { ESCALATION_TREND_DATA, INITIAL_CATEGORIES } from '../data/mockData';

interface AnalyticsViewProps {
  tickets: Ticket[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tickets }) => {
  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  const resolutionRate =
    totalTickets > 0 ? ((resolvedCount / totalTickets) * 100).toFixed(1) : '0.0';
  const escalationRate =
    totalTickets > 0 ? ((escalatedCount / totalTickets) * 100).toFixed(1) : '0.0';

  const categories: TicketCategory[] = [
    'Payment',
    'Technical',
    'Refund',
    'Delivery',
    'Account',
    'General',
  ];

  const categoryCounts = categories.map((cat) => {
    const count = tickets.filter((t) => t.category === cat).length;
    const pct = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
    return { category: cat, count, pct };
  });

  const statuses: Array<{ status: TicketStatus; color: string }> = [
    { status: 'Resolved', color: 'bg-emerald-600' },
    { status: 'Escalated', color: 'bg-rose-600' },
    { status: 'Open', color: 'bg-amber-500' },
    { status: 'In Progress', color: 'bg-blue-600' },
  ];

  const priorities: Array<{ priority: TicketPriority; color: string }> = [
    { priority: 'Critical', color: 'bg-rose-600' },
    { priority: 'High', color: 'bg-amber-600' },
    { priority: 'Medium', color: 'bg-indigo-900' },
    { priority: 'Low', color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500">Total Tickets</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
            {totalTickets}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 6 support categories
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500">Resolution Rate</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-2">
            {resolutionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {resolvedCount} of {totalTickets} tickets resolved
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500">Escalation Rate</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 mt-2">
            {escalationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {escalatedCount} tickets in active escalation
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs font-semibold text-slate-500">
            Average Resolution Time
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-950 mt-2">
            3h 42m
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            18% faster than 4h 30m target SLA
          </div>
        </div>
      </div>

      {/* Row 1: Tickets by Category + Tickets by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Tickets by Category */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Tickets by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of issues classified by the rule-based engine
            </p>
          </div>

          <div className="space-y-3.5">
            {categoryCounts.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    {item.category}
                  </span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {item.count} tickets ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-950 rounded-full transition-all"
                    style={{ width: `${Math.max(item.pct, 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tickets by Status & 3. Tickets by Priority */}
        <div className="space-y-6">
          {/* Tickets by Status */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tickets by Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current operational state breakdown
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statuses.map((s) => {
                const count = tickets.filter((t) => t.status === s.status).length;
                const pct =
                  totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
                return (
                  <div
                    key={s.status}
                    className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <span className={`w-2.5 h-2.5 rounded-xs ${s.color}`} />
                      <span>{s.status}</span>
                    </div>
                    <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-2">
                      {count}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {pct}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Tickets by Priority */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tickets by Priority
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Urgency classification across incoming customer requests
              </p>
            </div>

            <div className="space-y-3">
              {priorities.map((p) => {
                const count = tickets.filter((t) => t.priority === p.priority).length;
                const pct =
                  totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
                return (
                  <div key={p.priority} className="flex items-center gap-4 text-xs">
                    <div className="w-20 font-semibold text-slate-800">
                      {p.priority}
                    </div>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${p.color} rounded-full`}
                        style={{ width: `${Math.max(pct, 6)}%` }}
                      />
                    </div>
                    <div className="w-20 text-right font-mono tabular-nums text-slate-700">
                      {count} ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 4. Escalation Trends & 5. Resolution Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 4. Escalation Trends */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Escalation Trends
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4-week progression of escalations by tier level
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-indigo-950 inline-block" /> L1
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-600 inline-block" /> L2
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-600 inline-block" /> Senior
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-rose-600 inline-block" /> Manager
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                  <th className="py-2.5">Period</th>
                  <th className="py-2.5 text-right">Level 1</th>
                  <th className="py-2.5 text-right">Level 2</th>
                  <th className="py-2.5 text-right">Senior Level</th>
                  <th className="py-2.5 text-right">Manager Level</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {ESCALATION_TREND_DATA.map((row) => {
                  const rowTotal =
                    row.level1 + row.level2 + row.senior + row.manager;
                  return (
                    <tr key={row.period}>
                      <td className="py-3 font-sans font-semibold text-slate-900">
                        {row.period}
                      </td>
                      <td className="py-3 text-right text-slate-700">
                        {row.level1}
                      </td>
                      <td className="py-3 text-right text-blue-700">
                        {row.level2}
                      </td>
                      <td className="py-3 text-right text-amber-700">
                        {row.senior}
                      </td>
                      <td className="py-3 text-right text-rose-700 font-bold">
                        {row.manager}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {rowTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Resolution Statistics by Team */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Resolution Statistics by Support Team
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target SLA window vs actual ticket resolution performance
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                  <th className="py-2.5">Support Team</th>
                  <th className="py-2.5 text-right">Target SLA</th>
                  <th className="py-2.5 text-right">Assigned</th>
                  <th className="py-2.5 text-right">Resolved</th>
                  <th className="py-2.5 text-right">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_CATEGORIES.map((cat, idx) => {
                  const teamTickets = tickets.filter(
                    (t) => t.assignedTeam === cat.assignedTeam
                  );
                  const teamResolved = teamTickets.filter(
                    (t) => t.status === 'Resolved'
                  ).length;
                  const compliance = [96, 92, 95, 91, 98, 99][idx] || 95;

                  return (
                    <tr key={cat.id}>
                      <td className="py-3 font-semibold text-slate-900">
                        {cat.assignedTeam}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-slate-600">
                        {cat.slaHours}h
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {teamTickets.length}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                        {teamResolved}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-bold text-indigo-950">
                        {compliance}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
