import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle2,
  Eye,
  ArrowDown,
  ArrowRight,
  Network,
  ShieldAlert,
  UserCheck,
  Award,
} from 'lucide-react';
import { EscalationRecord, PageId, Ticket } from '../types/support';

interface EscalationsViewProps {
  tickets: Ticket[];
  escalations: EscalationRecord[];
  onSelectTicket: (ticketId: string) => void;
  onContinueEscalation: (ticketId: string) => void;
  onResolveTicket: (ticketId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const EscalationsView: React.FC<EscalationsViewProps> = ({
  tickets,
  escalations,
  onSelectTicket,
  onContinueEscalation,
  onResolveTicket,
  onNavigate,
}) => {
  const [focusedTicketId, setFocusedTicketId] = useState<string>('T-1001');

  const focusedTicket =
    tickets.find((t) => t.id === focusedTicketId) ||
    tickets.find((t) => t.status === 'Escalated') ||
    tickets[0];

  const totalEscalations = escalations.length;
  const level1Count = escalations.filter((e) => e.currentLevel === 'Level 1').length;
  const level2Count = escalations.filter((e) => e.currentLevel === 'Level 2').length;
  const seniorCount = escalations.filter((e) => e.currentLevel === 'Senior Level').length;
  const managerCount = escalations.filter((e) => e.currentLevel === 'Manager Level').length;

  const levelSummary = [
    { label: 'Total Escalations', value: totalEscalations, note: 'All logged escalations' },
    { label: 'Level 1', value: level1Count, note: 'Initial specialist review' },
    { label: 'Level 2', value: level2Count, note: 'Domain analyst tier' },
    { label: 'Senior Level', value: seniorCount, note: 'Senior engineering lead' },
    { label: 'Manager Level', value: managerCount, note: 'Executive operations sign-off' },
  ];

  return (
    <div className="space-y-8">
      {/* 5 Escalation Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {levelSummary.map((card, idx) => (
          <div
            key={card.label}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{card.label}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {idx === 0 ? 'ALL' : `TIER ${idx}`}
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-3">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{card.note}</div>
          </div>
        ))}
      </div>

      {/* SECTION 8: VISUAL ESCALATION GRAPH */}
      {focusedTicket && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-950" />
                <h3 className="text-base font-bold text-slate-900">
                  Escalation Graph — {focusedTicket.id} ({focusedTicket.customerName})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Directed graph representation distinguishing Ticket Node, Agent Nodes, and Manager Node with active position tracking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={focusedTicket.id}
                onChange={(e) => setFocusedTicketId(e.target.value)}
                className="px-3 py-1.5 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-900"
              >
                {tickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.customerName} ({t.escalationLevel})
                  </option>
                ))}
              </select>

              <button
                onClick={() => onNavigate('graph-analysis')}
                className="px-3.5 py-1.5 text-xs font-semibold text-indigo-950 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
              >
                BFS / DFS Traversal →
              </button>
            </div>
          </div>

          {/* Node Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100">
            <div className="flex flex-wrap items-center gap-5">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-indigo-950 inline-block" />
                <strong className="text-slate-800">Ticket Node (Root Vertex)</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-white border-2 border-slate-400 inline-block" />
                <strong className="text-slate-800">Support Agent Nodes (L1 / L2 / Senior)</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-amber-600 inline-block" />
                <strong className="text-slate-800">Manager Node (Terminal Authority)</strong>
              </span>
            </div>
            <div className="font-mono text-xs">
              Current Position:{' '}
              <strong className="text-rose-700">
                {focusedTicket.status === 'Resolved'
                  ? 'Resolved'
                  : focusedTicket.escalationLevel === 'None'
                  ? 'Level 1 Agent'
                  : focusedTicket.escalationLevel}
              </strong>
            </div>
          </div>

          {/* Directed Graph Chain: Ticket -> L1 -> L2 -> Senior -> Manager */}
          <div className="py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* 1. TICKET NODE */}
            <div className="flex-1 rounded-xl border-2 border-indigo-950 bg-indigo-950 text-white p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-indigo-200 font-mono">
                <span>TICKET NODE</span>
                <span>V0</span>
              </div>
              <div className="my-2">
                <div className="text-sm font-bold font-mono">
                  Ticket {focusedTicket.id}
                </div>
                <div className="text-xs text-indigo-100 font-medium mt-0.5">
                  {focusedTicket.customerName}
                </div>
                <div className="text-[11px] text-indigo-300 truncate mt-1" title={focusedTicket.issue}>
                  {focusedTicket.issue}
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-800 text-[11px] text-indigo-200 flex items-center justify-between">
                <span>Category: {focusedTicket.category}</span>
                <span className="font-mono">{focusedTicket.priority}</span>
              </div>
            </div>

            {/* Edge */}
            <div className="flex items-center justify-center text-slate-400">
              <ArrowRight className="w-5 h-5 hidden lg:block" />
              <ArrowDown className="w-5 h-5 lg:hidden" />
            </div>

            {/* 2-5. AGENT NODES & MANAGER NODE */}
            {focusedTicket.escalationChain.map((step, index) => {
              const isCurrent = step.status === 'current';
              const isPassed = step.status === 'passed' || step.status === 'resolved';
              const isManager = step.nodeType === 'manager';

              return (
                <React.Fragment key={step.level}>
                  <div
                    className={`flex-1 rounded-xl p-4 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-2 border-rose-600 bg-rose-50/60 shadow-xs'
                        : isPassed
                        ? 'border border-emerald-400 bg-emerald-50/30'
                        : isManager
                        ? 'border-2 border-amber-300 bg-amber-50/30'
                        : 'border border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span
                        className={`font-bold uppercase ${
                          isManager ? 'text-amber-800' : 'text-slate-600'
                        }`}
                      >
                        {isManager ? 'MANAGER NODE' : 'AGENT NODE'}
                      </span>
                      <span className="text-slate-400">V{index + 1}</span>
                    </div>

                    <div className="my-2">
                      <div className="text-xs font-bold text-slate-500">
                        {step.nodeLabel}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        {isManager ? (
                          <Award className="w-4 h-4 text-amber-700 shrink-0" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-indigo-900 shrink-0" />
                        )}
                        <span className="truncate">{step.agentName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {step.role}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-500">{step.agentId}</span>
                      <span
                        className={`font-bold ${
                          isCurrent
                            ? 'text-rose-700'
                            : isPassed
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCurrent
                          ? '● CURRENT POSITION'
                          : isPassed
                          ? '✓ TRAVERSED'
                          : 'STANDBY'}
                      </span>
                    </div>
                  </div>

                  {index < focusedTicket.escalationChain.length - 1 && (
                    <div className="flex items-center justify-center text-slate-400">
                      <ArrowRight className="w-5 h-5 hidden lg:block" />
                      <ArrowDown className="w-5 h-5 lg:hidden" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Interactive Action Footer for Selected Escalation Graph */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="text-slate-600">
              <strong className="text-slate-900">Escalation Reason:</strong>{' '}
              {focusedTicket.escalationReason ||
                'Standard support workflow — click "Continue Escalation" to advance along directed edge.'}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                disabled={
                  focusedTicket.status === 'Resolved' ||
                  focusedTicket.escalationLevel === 'Manager Level'
                }
                onClick={() => onContinueEscalation(focusedTicket.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  focusedTicket.status === 'Resolved' ||
                  focusedTicket.escalationLevel === 'Manager Level'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Continue Escalation</span>
              </button>
              <button
                disabled={focusedTicket.status === 'Resolved'}
                onClick={() => onResolveTicket(focusedTicket.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  focusedTicket.status === 'Resolved'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: ESCALATION TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active & Historical Escalation Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click "View Escalation" to load the ticket into the visual Escalation Graph above, or "Continue Escalation" to advance tiers.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {escalations.length} escalations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                <th className="py-3 px-5">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Current Level</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Escalated At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {escalations.map((esc) => {
                const isResolved = esc.status === 'Resolved';
                const isManager = esc.currentLevel === 'Manager Level';
                const isFocused = focusedTicket?.id === esc.ticketId;

                return (
                  <tr
                    key={esc.id}
                    className={`transition-colors ${
                      isFocused ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-indigo-950 whitespace-nowrap">
                      <button
                        onClick={() => onSelectTicket(esc.ticketId)}
                        className="hover:underline"
                      >
                        {esc.ticketId}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {esc.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      <div className="line-clamp-2">{esc.reason}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{esc.currentLevel}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {esc.assignedAgentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                      {esc.escalatedAt}
                    </td>
                    <td
                      className={`py-3.5 px-4 font-semibold whitespace-nowrap ${
                        isResolved ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {esc.status}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setFocusedTicketId(esc.ticketId)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Escalation</span>
                        </button>

                        <button
                          disabled={isResolved || isManager}
                          onClick={() => {
                            setFocusedTicketId(esc.ticketId);
                            onContinueEscalation(esc.ticketId);
                          }}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1 ${
                            isResolved || isManager
                              ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                              : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                          }`}
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>Continue Escalation</span>
                        </button>

                        <button
                          disabled={isResolved}
                          onClick={() => onResolveTicket(esc.ticketId)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1 ${
                            isResolved
                              ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
