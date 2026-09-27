import React from 'react';
import {
  ArrowLeft,
  ArrowUpCircle,
  CheckCircle2,
  User,
  Mail,
  Tag,
  ShieldAlert,
  Users,
  UserCheck,
  Clock,
  ArrowDown,
} from 'lucide-react';
import { PageId, Ticket } from '../types/support';

interface TicketDetailsViewProps {
  ticket: Ticket;
  allTickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onEscalateTicket: (ticketId: string, customReason?: string) => void;
  onResolveTicket: (ticketId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const TicketDetailsView: React.FC<TicketDetailsViewProps> = ({
  ticket,
  allTickets,
  onSelectTicket,
  onEscalateTicket,
  onResolveTicket,
  onNavigate,
}) => {
  const isResolved = ticket.status === 'Resolved';
  const isMaxEscalated = ticket.escalationLevel === 'Manager Level';

  const getStatusTextStyle = (status: Ticket['status']) => {
    switch (status) {
      case 'Resolved':
        return 'text-emerald-700 font-bold';
      case 'Escalated':
        return 'text-rose-700 font-bold';
      case 'In Progress':
        return 'text-blue-700 font-bold';
      case 'Open':
      default:
        return 'text-amber-700 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Back Button + Quick Ticket Switcher + Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('tickets')}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tickets</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Inspect Ticket:
            </label>
            <select
              value={ticket.id}
              onChange={(e) => onSelectTicket(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-900"
            >
              {allTickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.customerName} ({t.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            disabled={isResolved || isMaxEscalated}
            onClick={() =>
              onEscalateTicket(
                ticket.id,
                'Escalated from Ticket Details console for higher-tier review.'
              )
            }
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isResolved || isMaxEscalated
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span>
              {isMaxEscalated ? 'At Manager Level' : 'Escalate Next Level'}
            </span>
          </button>

          <button
            disabled={isResolved}
            onClick={() => onResolveTicket(ticket.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              isResolved
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isResolved ? 'Ticket Resolved' : 'Resolve Ticket'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Ticket Metadata & Problem Description + Escalation Path */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-indigo-950 text-sm">
                    {ticket.id}
                  </span>
                  <span>·</span>
                  <span>Created {ticket.createdAt}</span>
                  <span>·</span>
                  <span className={getStatusTextStyle(ticket.status)}>
                    {ticket.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {ticket.issue}
                </h2>
              </div>
            </div>

            {/* Structured Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customer</span>
                </div>
                <div className="font-semibold text-slate-900">
                  {ticket.customerName} ({ticket.customerId})
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email</span>
                </div>
                <div className="font-medium text-slate-800 truncate" title={ticket.customerEmail}>
                  {ticket.customerEmail}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Category</span>
                </div>
                <div className="font-semibold text-indigo-950">
                  {ticket.category} ({ticket.categoryId})
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Priority</span>
                </div>
                <div className="font-semibold text-slate-900">{ticket.priority}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Team</span>
                </div>
                <div className="font-semibold text-slate-900">
                  {ticket.assignedTeam}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Agent</span>
                </div>
                <div className="font-semibold text-slate-900">
                  {ticket.assignedAgentName}
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800">
                Customer Problem Description
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                "{ticket.description}"
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>
                  Rule-Based Classification Matched Keywords:{' '}
                  <strong className="font-mono text-indigo-950">
                    [{ticket.matchedKeywords.join(', ')}]
                  </strong>
                </span>
                <span>Current Status: {ticket.status}</span>
              </div>
            </div>
          </div>

          {/* Escalation Chain Visual Summary for this Ticket */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ticket Escalation Hierarchy Position
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current Escalation Level:{' '}
                  <strong className="text-slate-900">{ticket.escalationLevel}</strong>
                </p>
              </div>
              <button
                onClick={() => onNavigate('graph-analysis')}
                className="text-xs font-semibold text-indigo-950 hover:underline"
              >
                Open in Graph Analysis →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center pt-2">
              {/* Ticket Root Node */}
              <div className="p-3 rounded-lg border-2 border-indigo-950 bg-indigo-950 text-white text-center">
                <div className="text-[10px] text-indigo-200 font-mono">TICKET NODE</div>
                <div className="text-xs font-bold font-mono mt-0.5">{ticket.id}</div>
                <div className="text-[11px] text-indigo-200 truncate">
                  {ticket.customerName}
                </div>
              </div>

              {ticket.escalationChain.map((node) => {
                const isCurrent = node.status === 'current';
                const isPassed = node.status === 'passed' || node.status === 'resolved';
                return (
                  <div
                    key={node.level}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      isCurrent
                        ? 'border-2 border-rose-600 bg-rose-50/70 text-slate-900'
                        : isPassed
                        ? 'border-emerald-300 bg-emerald-50/40 text-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-semibold uppercase">
                      {node.nodeType === 'manager' ? 'MANAGER NODE' : node.level}
                    </div>
                    <div className="text-xs font-bold mt-0.5 truncate">
                      {node.agentName}
                    </div>
                    <div className="text-[11px] truncate">
                      {isCurrent
                        ? 'Current Holder'
                        : isPassed
                        ? 'Completed'
                        : 'Standby'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Vertical Ticket Lifecycle Timeline */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-sm font-bold text-slate-900">
              Ticket Lifecycle Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sequential progression from intake and classification to resolution
            </p>
          </div>

          <div className="space-y-2">
            {ticket.timeline.map((step, index) => {
              const isLast = index === ticket.timeline.length - 1;
              return (
                <div key={step.id}>
                  <div
                    className={`p-4 rounded-xl border transition-colors ${
                      step.active
                        ? 'border-indigo-950 bg-indigo-50/40'
                        : step.completed
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-100 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {index + 1}. {step.title}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{step.timestamp}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Responsible:</span>
                      <span className="font-semibold text-slate-800">
                        {step.responsibleAgent}
                      </span>
                    </div>
                  </div>

                  {!isLast && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
