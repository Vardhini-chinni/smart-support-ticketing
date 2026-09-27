import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Network,
  ArrowDown,
  ArrowRight,
  GitCommit,
  BookOpen,
} from 'lucide-react';
import { Ticket } from '../types/support';

interface GraphAnalysisViewProps {
  tickets: Ticket[];
}

interface GraphVertex {
  id: string;
  shortLabel: string;
  detailLabel: string;
  role: string;
  nodeType: 'ticket' | 'agent' | 'manager';
}

export const GraphAnalysisView: React.FC<GraphAnalysisViewProps> = ({
  tickets,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('T-1001');
  const [activeAlgorithm, setActiveAlgorithm] = useState<'BFS' | 'DFS' | null>(
    null
  );
  const [visitedStepCount, setVisitedStepCount] = useState<number>(0);

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const vertices: GraphVertex[] = [
    {
      id: 'V0',
      shortLabel: 'Ticket',
      detailLabel: `Ticket ${selectedTicket.id} (${selectedTicket.customerName})`,
      role: `${selectedTicket.category} Issue · Root Vertex`,
      nodeType: 'ticket',
    },
    {
      id: 'V1',
      shortLabel: 'Agent 1',
      detailLabel: `Level 1 Agent (${selectedTicket.escalationChain[0]?.agentName || 'Aarav Mehta'})`,
      role: 'Tier 1 Support Specialist',
      nodeType: 'agent',
    },
    {
      id: 'V2',
      shortLabel: 'Agent 2',
      detailLabel: `Level 2 Agent (${selectedTicket.escalationChain[1]?.agentName || 'Priya Nair'})`,
      role: 'Tier 2 Escalation Analyst',
      nodeType: 'agent',
    },
    {
      id: 'V3',
      shortLabel: 'Senior Agent',
      detailLabel: `Senior Agent (${selectedTicket.escalationChain[2]?.agentName || 'Vikram Desai'})`,
      role: 'Senior Escalation Lead',
      nodeType: 'agent',
    },
    {
      id: 'V4',
      shortLabel: 'Manager',
      detailLabel: `Manager (${selectedTicket.escalationChain[3]?.agentName || 'Ananya Sharma'})`,
      role: 'Support Operations Manager',
      nodeType: 'manager',
    },
  ];

  const edges = [
    { from: 'V0 (Ticket)', to: 'V1 (Agent 1)', relation: 'Initial Assignment' },
    { from: 'V1 (Agent 1)', to: 'V2 (Agent 2)', relation: 'Level 1 → Level 2 Escalation' },
    { from: 'V2 (Agent 2)', to: 'V3 (Senior Agent)', relation: 'Level 2 → Senior Escalation' },
    { from: 'V3 (Senior Agent)', to: 'V4 (Manager)', relation: 'Senior → Manager Escalation' },
  ];

  const triggerTraversal = (algo: 'BFS' | 'DFS') => {
    setActiveAlgorithm(algo);
    setVisitedStepCount(1);
    let step = 1;
    const interval = window.setInterval(() => {
      step += 1;
      setVisitedStepCount(step);
      if (step >= vertices.length) {
        window.clearInterval(interval);
      }
    }, 180);
  };

  const resetTraversal = () => {
    setActiveAlgorithm(null);
    setVisitedStepCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Graph Analysis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyze escalation paths using graph traversal concepts (DMGT & ADSA demonstration).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">
              Target Ticket:
            </label>
            <select
              value={selectedTicket.id}
              onChange={(e) => {
                setSelectedTicketId(e.target.value);
                resetTraversal();
              }}
              className="px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-900"
            >
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.customerName} ({t.escalationLevel})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => triggerTraversal('BFS')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeAlgorithm === 'BFS'
                ? 'bg-indigo-950 text-white'
                : 'bg-indigo-900 text-white hover:bg-indigo-950'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run BFS</span>
          </button>

          <button
            onClick={() => triggerTraversal('DFS')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              activeAlgorithm === 'DFS'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run DFS</span>
          </button>

          {activeAlgorithm && (
            <button
              onClick={resetTraversal}
              className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Traversal Result Banner (Displayed when Run BFS or Run DFS is clicked, or always accessible) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-950" />
            <h3 className="text-sm font-bold text-slate-900">
              Visual Escalation Chain & Traversal Sequence
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            G = (V, E) where |V| = 5 vertices, |E| = 4 directed edges
          </span>
        </div>

        {/* Visual Node Sequence */}
        <div className="py-2 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {vertices.map((vertex, idx) => {
            const isVisited = activeAlgorithm !== null && idx < visitedStepCount;
            const isTicket = vertex.nodeType === 'ticket';
            const isManager = vertex.nodeType === 'manager';

            return (
              <React.Fragment key={vertex.id}>
                <div
                  className={`flex-1 rounded-xl p-4 border transition-all ${
                    isVisited
                      ? activeAlgorithm === 'BFS'
                        ? 'border-2 border-indigo-950 bg-indigo-50/70 shadow-xs'
                        : 'border-2 border-emerald-600 bg-emerald-50/60 shadow-xs'
                      : isTicket
                      ? 'border-2 border-indigo-950 bg-indigo-950 text-white'
                      : isManager
                      ? 'border-2 border-amber-300 bg-amber-50/30 text-slate-900'
                      : 'border border-slate-200 bg-slate-50 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span
                      className={
                        isTicket && !isVisited
                          ? 'text-indigo-200 font-bold'
                          : 'text-slate-500 font-bold'
                      }
                    >
                      {vertex.id} · {vertex.nodeType.toUpperCase()} NODE
                    </span>
                    {isVisited && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          activeAlgorithm === 'BFS'
                            ? 'bg-indigo-950 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        STEP {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div
                      className={`text-sm font-bold ${
                        isTicket && !isVisited ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {vertex.shortLabel}
                    </div>
                    <div
                      className={`text-xs mt-0.5 truncate ${
                        isTicket && !isVisited
                          ? 'text-indigo-200'
                          : 'text-slate-600'
                      }`}
                      title={vertex.detailLabel}
                    >
                      {vertex.detailLabel}
                    </div>
                  </div>
                </div>

                {idx < vertices.length - 1 && (
                  <div className="flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-5 h-5 hidden lg:block" />
                    <ArrowDown className="w-5 h-5 lg:hidden" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* BFS & DFS Traversal Sequence Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div
            className={`p-4 rounded-xl border transition-colors ${
              activeAlgorithm === 'BFS'
                ? 'border-2 border-indigo-950 bg-indigo-50/40'
                : 'border-slate-200 bg-slate-50/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950">
                BFS Traversal (Breadth-First Search — Queue FIFO):
              </span>
              {activeAlgorithm === 'BFS' && (
                <span className="text-[11px] font-mono font-semibold text-indigo-900">
                  ACTIVE OUTPUT
                </span>
              )}
            </div>
            <div className="mt-2 font-mono text-xs font-semibold text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
              Ticket → Agent 1 → Agent 2 → Senior Agent → Manager
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500">
              Explores escalation nodes level-by-level starting from root vertex{' '}
              <span className="font-mono">{selectedTicket.id}</span>.
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border transition-colors ${
              activeAlgorithm === 'DFS'
                ? 'border-2 border-emerald-600 bg-emerald-50/40'
                : 'border-slate-200 bg-slate-50/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">
                DFS Traversal (Depth-First Search — Stack LIFO):
              </span>
              {activeAlgorithm === 'DFS' && (
                <span className="text-[11px] font-mono font-semibold text-emerald-700">
                  ACTIVE OUTPUT
                </span>
              )}
            </div>
            <div className="mt-2 font-mono text-xs font-semibold text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
              Ticket → Agent 1 → Agent 2 → Senior Agent → Manager
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500">
              Follows the directed escalation chain to deepest authority node before backtracking.
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Graph Breakdown: Vertices, Edges, Current Escalation Path & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Vertices / Nodes */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Vertices / Nodes (V)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 distinct nodes representing ticket and support hierarchy tiers
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {vertices.map((v) => (
              <div key={v.id} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-indigo-950 mr-2">
                    {v.id}:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {v.shortLabel}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {v.detailLabel}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 capitalize shrink-0">
                  {v.nodeType}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Directed Edges */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Directed Edges (E)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjacency transitions connecting escalation tiers
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {edges.map((edge, idx) => (
              <div key={idx} className="py-3 space-y-1">
                <div className="flex items-center gap-2 font-mono font-semibold text-slate-900">
                  <GitCommit className="w-3.5 h-3.5 text-indigo-900 shrink-0" />
                  <span>{edge.from}</span>
                  <span className="text-slate-400">→</span>
                  <span>{edge.to}</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-5">
                  {edge.relation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Current Escalation Path & Academic Explanation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Current Escalation Path
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active state for {selectedTicket.id} ({selectedTicket.customerName})
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ticket Status:</span>
                <span className="font-bold text-slate-900">
                  {selectedTicket.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Hierarchy Tier:</span>
                <span className="font-bold text-rose-700">
                  {selectedTicket.escalationLevel === 'None'
                    ? 'Level 1 (Standard)'
                    : selectedTicket.escalationLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Holder:</span>
                <span className="font-semibold text-slate-900">
                  {selectedTicket.assignedAgentName}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
              <BookOpen className="w-4 h-4" />
              <span>Graph Traversal Concept Note</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              BFS and DFS are used to demonstrate how escalation relationships can be traversed across the support hierarchy graph. In a linear escalation chain, both visit nodes sequentially from the Ticket vertex to the Manager vertex with time complexity{' '}
              <span className="font-mono font-semibold">O(V + E)</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
