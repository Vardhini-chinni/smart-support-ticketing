import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Eye,
  ArrowUpCircle,
  CheckCircle2,
  Plus,
  Download,
} from 'lucide-react';
import {
  PageId,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '../types/support';

interface TicketsViewProps {
  tickets: Ticket[];
  initialStatusFilter?: TicketStatus | 'All';
  onSelectTicket: (ticketId: string) => void;
  onEscalateTicket: (ticketId: string, customReason?: string) => void;
  onResolveTicket: (ticketId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  initialStatusFilter = 'All',
  onSelectTicket,
  onEscalateTicket,
  onResolveTicket,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');
  const [escalatingTicket, setEscalatingTicket] = useState<Ticket | null>(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  React.useEffect(() => {
    setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      search.trim() === '' ||
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(search.toLowerCase()) ||
      ticket.assignedAgentName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
  };

  const escapeCsvCell = (value: string | number | undefined) => {
    const str = value === undefined || value === null ? '' : String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportCsv = () => {
    if (filteredTickets.length === 0) return;

    const headers = [
      'Ticket ID',
      'Customer ID',
      'Customer Name',
      'Customer Email',
      'Issue',
      'Description',
      'Category',
      'Priority',
      'Assigned Team',
      'Assigned Agent',
      'Status',
      'Escalation Level',
      'Created',
      'Last Updated',
    ];

    const rows = filteredTickets.map((ticket) => [
      ticket.id,
      ticket.customerId,
      ticket.customerName,
      ticket.customerEmail,
      ticket.issue,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.assignedTeam,
      ticket.assignedAgentName,
      ticket.status,
      ticket.escalationLevel,
      ticket.createdAt,
      ticket.updatedAt,
    ]);

    const csvContent =
      '\uFEFF' +
      [
        headers.map(escapeCsvCell).join(','),
        ...rows.map((row) => row.map(escapeCsvCell).join(',')),
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `smart-support-tickets-${dateStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    window.setTimeout(() => setExportSuccess(false), 2500);
  };

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

  const getPriorityTextStyle = (priority: TicketPriority) => {
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

  const handleConfirmEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalatingTicket) return;
    onEscalateTicket(
      escalatingTicket.id,
      escalationReason.trim() ||
        'Escalated by support supervisor for higher-tier investigation.'
    );
    setEscalatingTicket(null);
    setEscalationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Customer Tickets</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              View, search and manage customer support requests across all categories and priorities.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              disabled={filteredTickets.length === 0}
              onClick={handleExportCsv}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                filteredTickets.length === 0
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : exportSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Export current filtered ticket list to a CSV spreadsheet"
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Exported ({filteredTickets.length})</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV ({filteredTickets.length})</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('create-ticket')}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Ticket</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          {/* Search Tickets */}
          <div className="lg:col-span-4 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Ticket ID, customer, issue, agent..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
            />
          </div>

          {/* Filter by Status */}
          <div className="lg:col-span-3">
            <select
              aria-label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:bg-white focus:border-indigo-900"
            >
              <option value="All">Status: All Statuses</option>
              <option value="Open">Status: Open</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Escalated">Status: Escalated</option>
              <option value="Resolved">Status: Resolved</option>
            </select>
          </div>

          {/* Filter by Category */}
          <div className="lg:col-span-2">
            <select
              aria-label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'All')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:bg-white focus:border-indigo-900"
            >
              <option value="All">Category: All</option>
              <option value="Payment">Payment</option>
              <option value="Technical">Technical</option>
              <option value="Refund">Refund</option>
              <option value="Delivery">Delivery</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Filter by Priority */}
          <div className="lg:col-span-2">
            <select
              aria-label="Filter by Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'All')}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:bg-white focus:border-indigo-900"
            >
              <option value="All">Priority: All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="lg:col-span-1 flex items-center justify-end">
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="w-full py-2 px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="lg:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="font-mono text-slate-900">{filteredTickets.length}</strong> of{' '}
            <strong className="font-mono text-slate-900">{tickets.length}</strong> support tickets
          </span>
          <span>Click "View" to inspect full timeline or "Escalate" to advance tier</span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-sm font-semibold text-slate-900">
              No tickets match your current filter criteria
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try clearing your search query or switching the status, category, or priority filters back to "All".
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 rounded-lg hover:bg-indigo-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-5">Ticket ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issue</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredTickets.map((ticket) => {
                  const isResolved = ticket.status === 'Resolved';
                  const isMaxEscalated = ticket.escalationLevel === 'Manager Level';

                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono font-semibold text-indigo-950 whitespace-nowrap">
                        <button
                          onClick={() => onSelectTicket(ticket.id)}
                          className="hover:underline text-left"
                        >
                          {ticket.id}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {ticket.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {ticket.customerEmail}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs">
                        <div className="truncate font-medium" title={ticket.issue}>
                          {ticket.issue}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {ticket.assignedTeam}
                          {ticket.escalationLevel !== 'None' &&
                            ` · ${ticket.escalationLevel}`}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {ticket.category}
                      </td>
                      <td className={`py-3.5 px-4 whitespace-nowrap ${getPriorityTextStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {ticket.assignedAgentName}
                      </td>
                      <td className={`py-3.5 px-4 whitespace-nowrap ${getStatusTextStyle(ticket.status)}`}>
                        {ticket.status}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                        {ticket.createdAt}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectTicket(ticket.id)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            disabled={isResolved || isMaxEscalated}
                            onClick={() => {
                              setEscalatingTicket(ticket);
                              setEscalationReason('');
                            }}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1 ${
                              isResolved || isMaxEscalated
                                ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                            }`}
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>Escalate</span>
                          </button>

                          <button
                            disabled={isResolved}
                            onClick={() => onResolveTicket(ticket.id)}
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
        )}
      </div>

      {/* Escalation Modal */}
      {escalatingTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Escalate Ticket {escalatingTicket.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customer: {escalatingTicket.customerName} · Current Tier:{' '}
                  {escalatingTicket.escalationLevel === 'None'
                    ? 'Standard Queue'
                    : escalatingTicket.escalationLevel}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmEscalation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Escalation Reason / Hand-off Note
                </label>
                <textarea
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Specify why this issue requires higher-level intervention..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalatingTicket(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
