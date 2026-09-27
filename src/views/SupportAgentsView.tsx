import React, { useState } from 'react';
import {
  UserCheck,
  Mail,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import { SupportAgent, SupportTeam, Ticket } from '../types/support';

interface SupportAgentsViewProps {
  agents: SupportAgent[];
  tickets: Ticket[];
}

export const SupportAgentsView: React.FC<SupportAgentsViewProps> = ({
  agents,
  tickets,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<SupportTeam | 'All'>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const teams: Array<SupportTeam | 'All'> = [
    'All',
    'Payment Support',
    'Technical Support',
    'Refund Support',
    'Delivery Support',
    'Account Support',
    'General Support',
  ];

  const filteredAgents =
    selectedTeam === 'All'
      ? agents
      : agents.filter((a) => a.team === selectedTeam);

  const getAvailabilityStyle = (availability: SupportAgent['availability']) => {
    switch (availability) {
      case 'Available':
        return 'text-emerald-700 font-semibold';
      case 'In Escalation':
        return 'text-rose-700 font-semibold';
      case 'Busy':
      default:
        return 'text-amber-700 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Support Agents</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Specialized support teams, escalation hierarchy levels, and live ticket workloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Interactive Segmented Team Filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTeam === team
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {team === 'All' ? 'All Teams' : team.replace(' Support', '')}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table or Cards View */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Support Agent Roster & Escalation Tiers
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {filteredAgents.length} agents displayed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-5">Agent ID</th>
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4 text-right">Active Tickets</th>
                  <th className="py-3 px-4 text-right">Resolved Tickets</th>
                  <th className="py-3 px-4">Escalation Level</th>
                  <th className="py-3 px-5 text-right">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredAgents.map((agent) => {
                  const liveActive = tickets.filter(
                    (t) =>
                      t.assignedAgentId === agent.id && t.status !== 'Resolved'
                  ).length;

                  return (
                    <tr
                      key={agent.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-mono font-semibold text-indigo-950 whitespace-nowrap">
                        {agent.id}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {agent.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {agent.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {agent.role}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {agent.team}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        {liveActive || agent.activeTickets}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {agent.resolvedTickets}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-950 whitespace-nowrap">
                        {agent.escalationLevel}
                      </td>
                      <td className={`py-3.5 px-5 text-right whitespace-nowrap ${getAvailabilityStyle(agent.availability)}`}>
                        {agent.availability}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => {
            const liveActive = tickets.filter(
              (t) => t.assignedAgentId === agent.id && t.status !== 'Resolved'
            ).length;

            return (
              <div
                key={agent.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-950">
                      {agent.id} · {agent.escalationLevel}
                    </span>
                    <span className={getAvailabilityStyle(agent.availability)}>
                      {agent.availability}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-900" />
                    <span>{agent.name}</span>
                  </h3>
                  <p className="text-xs text-slate-600">{agent.role}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{agent.team}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Active Tickets</div>
                    <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                      {liveActive || agent.activeTickets}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Resolved Tickets</div>
                    <div className="text-base font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
                      {agent.resolvedTickets}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
