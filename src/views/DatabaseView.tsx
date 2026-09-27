import React, { useState } from 'react';
import {
  Database,
  Key,
  Link2,
  ArrowDown,
  Table as TableIcon,
} from 'lucide-react';
import {
  CategoryRecord,
  Customer,
  EscalationRecord,
  SupportAgent,
  Ticket,
} from '../types/support';

interface DatabaseViewProps {
  customers: Customer[];
  tickets: Ticket[];
  agents: SupportAgent[];
  categories: CategoryRecord[];
  escalations: EscalationRecord[];
}

type EntityKey = 'CUSTOMER' | 'TICKET' | 'AGENT' | 'CATEGORY' | 'ESCALATION';

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  customers,
  tickets,
  agents,
  categories,
  escalations,
}) => {
  const [selectedTable, setSelectedTable] = useState<EntityKey>('TICKET');

  const entities = [
    {
      name: 'CUSTOMER' as EntityKey,
      relationshipToTicket: '1 : Many → TICKET',
      fields: [
        { name: 'Customer_ID', keyType: 'PK', dataType: 'VARCHAR(16)' },
        { name: 'Name', keyType: '', dataType: 'VARCHAR(100)' },
        { name: 'Email', keyType: '', dataType: 'VARCHAR(150)' },
      ],
    },
    {
      name: 'AGENT' as EntityKey,
      relationshipToTicket: '1 : Many → TICKET',
      fields: [
        { name: 'Agent_ID', keyType: 'PK', dataType: 'VARCHAR(16)' },
        { name: 'Name', keyType: '', dataType: 'VARCHAR(100)' },
        { name: 'Team', keyType: '', dataType: 'VARCHAR(60)' },
        { name: 'Role', keyType: '', dataType: 'VARCHAR(80)' },
      ],
    },
    {
      name: 'CATEGORY' as EntityKey,
      relationshipToTicket: '1 : Many → TICKET',
      fields: [
        { name: 'Category_ID', keyType: 'PK', dataType: 'VARCHAR(16)' },
        { name: 'Category_Name', keyType: '', dataType: 'VARCHAR(50)' },
      ],
    },
  ];

  const ticketFields = [
    { name: 'Ticket_ID', keyType: 'PK', dataType: 'VARCHAR(16)' },
    { name: 'Customer_ID', keyType: 'FK', dataType: 'VARCHAR(16)' },
    { name: 'Agent_ID', keyType: 'FK', dataType: 'VARCHAR(16)' },
    { name: 'Category_ID', keyType: 'FK', dataType: 'VARCHAR(16)' },
    { name: 'Issue', keyType: '', dataType: 'TEXT' },
    { name: 'Status', keyType: '', dataType: 'VARCHAR(24)' },
    { name: 'Priority', keyType: '', dataType: 'VARCHAR(24)' },
  ];

  const escalationFields = [
    { name: 'Escalation_ID', keyType: 'PK', dataType: 'VARCHAR(16)' },
    { name: 'Ticket_ID', keyType: 'FK', dataType: 'VARCHAR(16)' },
    { name: 'Agent_ID', keyType: 'FK', dataType: 'VARCHAR(16)' },
    { name: 'Level', keyType: '', dataType: 'VARCHAR(30)' },
    { name: 'Date', keyType: '', dataType: 'TIMESTAMP' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Key Legend */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Database Relationships (ER Schema)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relational DBMS architecture connecting Customer, Agent, Category, Ticket, and Escalation entities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
          <span className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <strong className="font-mono text-slate-900">PK</strong>
            <span className="text-slate-600">= Primary Key</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-indigo-900" />
            <strong className="font-mono text-slate-900">FK</strong>
            <span className="text-slate-600">= Foreign Key</span>
          </span>
          <span className="font-mono text-slate-600">
            Cardinality: <strong>1 : Many</strong>
          </span>
        </div>
      </div>

      {/* ER-STYLE VISUAL DIAGRAM */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-950" />
            <h3 className="text-sm font-bold text-slate-900">
              Entity-Relationship Diagram (DBMS Module)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click any entity box to inspect its live relational tuples below
          </span>
        </div>

        {/* Tier 1 Entities: CUSTOMER, AGENT, CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entities.map((entity) => {
            const isSelected = selectedTable === entity.name;
            return (
              <div key={entity.name} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelectedTable(entity.name)}
                  className={`w-full text-left rounded-xl border transition-all overflow-hidden ${
                    isSelected
                      ? 'border-2 border-indigo-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="bg-indigo-950 text-white px-4 py-2.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">
                      {entity.name}
                    </span>
                    <span className="text-[10px] text-indigo-200 font-mono">
                      ENTITY
                    </span>
                  </div>
                  <div className="p-4 bg-white divide-y divide-slate-100 text-xs">
                    {entity.fields.map((field) => (
                      <div
                        key={field.name}
                        className="py-2 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900">
                            {field.name}
                          </span>
                          {field.keyType === 'PK' && (
                            <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              (PK)
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {field.dataType}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* 1 : Many Connector Down to TICKET */}
                <div className="flex flex-col items-center py-3 text-xs font-mono text-slate-500">
                  <div className="h-3 w-0.5 bg-slate-300" />
                  <div className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 my-1">
                    1 : Many
                  </div>
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tier 2 Central Entity: TICKET */}
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setSelectedTable('TICKET')}
            className={`w-full text-left rounded-xl border transition-all overflow-hidden ${
              selectedTable === 'TICKET'
                ? 'border-2 border-indigo-950 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="bg-indigo-950 text-white px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-sm font-bold">TICKET</span>
              <span className="text-[11px] text-indigo-200 font-mono">
                CENTRAL RELATIONAL ENTITY
              </span>
            </div>
            <div className="p-4 bg-white divide-y divide-slate-100 text-xs">
              {ticketFields.map((field) => (
                <div
                  key={field.name}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900">
                      {field.name}
                    </span>
                    {field.keyType === 'PK' && (
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        (PK)
                      </span>
                    )}
                    {field.keyType === 'FK' && (
                      <span className="font-mono text-[10px] font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded">
                        (FK)
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {field.dataType}
                  </span>
                </div>
              ))}
            </div>
          </button>

          {/* 1 : Many Connector Down to ESCALATION */}
          <div className="flex flex-col items-center py-3 text-xs font-mono text-slate-500">
            <div className="h-3 w-0.5 bg-slate-300" />
            <div className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 my-1">
              1 : Many
            </div>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Tier 3 Entity: ESCALATION */}
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setSelectedTable('ESCALATION')}
            className={`w-full text-left rounded-xl border transition-all overflow-hidden ${
              selectedTable === 'ESCALATION'
                ? 'border-2 border-indigo-950 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <span className="font-mono text-sm font-bold">ESCALATION</span>
              <span className="text-[11px] text-slate-300 font-mono">
                DEPENDENT ENTITY
              </span>
            </div>
            <div className="p-4 bg-white divide-y divide-slate-100 text-xs">
              {escalationFields.map((field) => (
                <div
                  key={field.name}
                  className="py-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900">
                      {field.name}
                    </span>
                    {field.keyType === 'PK' && (
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        (PK)
                      </span>
                    )}
                    {field.keyType === 'FK' && (
                      <span className="font-mono text-[10px] font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded">
                        (FK)
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">
                    {field.dataType}
                  </span>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Relational Table Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-950" />
            <h3 className="text-sm font-bold text-slate-900">
              Relational Table Records — {selectedTable}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                'CUSTOMER',
                'TICKET',
                'AGENT',
                'CATEGORY',
                'ESCALATION',
              ] as EntityKey[]
            ).map((tableKey) => (
              <button
                key={tableKey}
                onClick={() => setSelectedTable(tableKey)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors ${
                  selectedTable === tableKey
                    ? 'bg-white text-indigo-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tableKey}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {selectedTable === 'CUSTOMER' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                  <th className="py-3 px-5">Customer_ID (PK)</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-950">
                      {c.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'TICKET' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                  <th className="py-3 px-5">Ticket_ID (PK)</th>
                  <th className="py-3 px-4">Customer_ID (FK)</th>
                  <th className="py-3 px-4">Agent_ID (FK)</th>
                  <th className="py-3 px-4">Category_ID (FK)</th>
                  <th className="py-3 px-4">Issue</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tickets.slice(0, 10).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-950">
                      {t.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {t.customerId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {t.assignedAgentId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {t.categoryId}
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs truncate">
                      {t.issue}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {t.status}
                    </td>
                    <td className="py-3 px-5 text-slate-700">{t.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'AGENT' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                  <th className="py-3 px-5">Agent_ID (PK)</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-950">
                      {a.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {a.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{a.team}</td>
                    <td className="py-3 px-4 text-slate-600">{a.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'CATEGORY' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                  <th className="py-3 px-5">Category_ID (PK)</th>
                  <th className="py-3 px-4">Category_Name</th>
                  <th className="py-3 px-4">Assigned_Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-950">
                      {c.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {c.assignedTeam}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'ESCALATION' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                  <th className="py-3 px-5">Escalation_ID (PK)</th>
                  <th className="py-3 px-4">Ticket_ID (FK)</th>
                  <th className="py-3 px-4">Agent_ID (FK)</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {escalations.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 px-5 font-mono font-bold text-indigo-950">
                      {e.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {e.ticketId}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {e.assignedAgentId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-rose-700">
                      {e.currentLevel}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {e.escalatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
