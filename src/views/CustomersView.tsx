import React, { useState } from 'react';
import {
  Search,
  User,
  Mail,
  Building2,
  ArrowUpRight,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Customer, Ticket } from '../types/support';

interface CustomersViewProps {
  customers: Customer[];
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  tickets,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || 'C-101'
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const getCustomerTickets = (customer: Customer) =>
    tickets.filter(
      (t) =>
        t.customerId === customer.id ||
        t.customerName.toLowerCase() === customer.name.toLowerCase()
    );

  const selectedCustomerTickets = selectedCustomer
    ? getCustomerTickets(selectedCustomer)
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Customers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any customer row to inspect their complete support ticket history and resolution status.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer ID, name, email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
          />
        </div>
      </div>

      {/* Main Layout: Customer Table + Selected Customer Ticket History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Customers Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Registered Customer Directory
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {filteredCustomers.length} customers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-5">Customer ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-3 text-right">Total Tickets</th>
                  <th className="py-3 px-3 text-right">Open</th>
                  <th className="py-3 px-3 text-right">Resolved</th>
                  <th className="py-3 px-5 text-right">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredCustomers.map((customer) => {
                  const custTickets = getCustomerTickets(customer);
                  const total = custTickets.length;
                  const resolved = custTickets.filter(
                    (t) => t.status === 'Resolved'
                  ).length;
                  const open = total - resolved;
                  const isSelected = customer.id === selectedCustomer?.id;

                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono font-semibold text-indigo-950 whitespace-nowrap">
                        {customer.id}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {customer.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {customer.organization}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {customer.email}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {total}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-amber-700">
                        {open}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {resolved}
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                        {customer.lastActivity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Customer Ticket History Inspector */}
        {selectedCustomer && (
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-950">
                  {selectedCustomer.id}
                </span>
                <span className="text-xs text-slate-400">
                  Since {selectedCustomer.createdAt}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>{selectedCustomer.name}</span>
              </h3>
              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCustomer.organization}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <TicketIcon className="w-3.5 h-3.5 text-indigo-950" />
                  <span>Customer Ticket History</span>
                </h4>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {selectedCustomerTickets.length} records
                </span>
              </div>

              {selectedCustomerTickets.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-lg text-xs text-slate-500">
                  No tickets logged for this customer.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedCustomerTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket.id)}
                      className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-indigo-950">
                          {ticket.id}
                        </span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <span>{ticket.status}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800" />
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-900 mt-1 line-clamp-2">
                        {ticket.issue}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>
                          {ticket.category} · {ticket.assignedTeam}
                        </span>
                        <span className="font-mono tabular-nums">
                          {ticket.createdAt}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
