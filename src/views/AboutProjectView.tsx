import React from 'react';
import {
  Database,
  Network,
  GitBranch,
  Cpu,
  Boxes,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { PageId } from '../types/support';

interface AboutProjectViewProps {
  onNavigate: (page: PageId) => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  onNavigate,
}) => {
  const subjectMappings = [
    {
      code: 'DBMS',
      subjectName: 'Database Management Systems',
      description:
        'Stores and manages customers, tickets, agents, categories and escalation records.',
      implementationDetail:
        'Normalized 5-entity relational schema (CUSTOMER, TICKET, AGENT, CATEGORY, ESCALATION) enforcing Primary Key (PK) and Foreign Key (FK) referential integrity across 1 : Many relationships.',
      icon: Database,
      targetPage: 'database' as PageId,
      linkLabel: 'Inspect ER Diagram & Tables →',
    },
    {
      code: 'DMGT',
      subjectName: 'Discrete Mathematics & Graph Theory',
      description:
        'Represents relationships and escalation paths using graph concepts.',
      implementationDetail:
        'Models the support escalation hierarchy as a Directed Graph G = (V, E) where vertices V represent the Ticket, Agent tiers, and Manager authority, and directed edges E represent escalation transitions.',
      icon: Network,
      targetPage: 'escalations' as PageId,
      linkLabel: 'View Escalation Graph →',
    },
    {
      code: 'ADSA',
      subjectName: 'Advanced Data Structures & Algorithms',
      description:
        'Demonstrates BFS and DFS traversal on the escalation graph.',
      implementationDetail:
        'Executes Breadth-First Search (Queue-based FIFO traversal) and Depth-First Search (Stack-based traversal) across escalation vertices from Ticket to Manager.',
      icon: GitBranch,
      targetPage: 'graph-analysis' as PageId,
      linkLabel: 'Run BFS & DFS Traversal →',
    },
    {
      code: 'OOPJ',
      subjectName: 'Object-Oriented Programming with Java',
      description:
        'Uses object-oriented concepts for customers, tickets, agents and routing logic.',
      implementationDetail:
        'Encapsulates domain entities (Customer, Ticket, SupportAgent, EscalationRecord) and implements automated team routing logic connecting classified categories to support queues.',
      icon: Boxes,
      targetPage: 'project-flow' as PageId,
      linkLabel: 'Explore Routing Workflow →',
    },
    {
      code: 'PYTHON',
      subjectName: 'Python Programming',
      description:
        'Uses a simple rule-based system to classify ticket descriptions.',
      implementationDetail:
        'Evaluates incoming issue titles and problem descriptions using transparent, explainable keyword rules to classify tickets into Payment, Technical, Refund, Delivery, Account, or General.',
      icon: Cpu,
      targetPage: 'create-ticket' as PageId,
      linkLabel: 'Test Rule-Based Classifier →',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Project Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-950 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Smart Customer Support Ticketing & Escalation System
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interdisciplinary Academic Project · Project Admin: Vardhini
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg transition-colors self-start md:self-auto"
          >
            Return to Dashboard
          </button>
        </div>

        {/* Problem Statement & Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wide">
              Problem Statement
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              Customer support organizations receive many customer complaints. When tickets are not properly connected with customers, agents and escalation history, resolving issues can take longer.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Without structured categorization and a clear multi-tier escalation hierarchy, high-priority complaints (such as unconfirmed payments or critical login errors) suffer from manual routing delays and lack of ownership visibility.
            </p>
          </div>

          <div className="p-5 bg-indigo-50/40 border border-indigo-200 rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
              Proposed Solution
            </div>
            <p className="text-sm text-slate-900 leading-relaxed font-medium">
              This website provides a centralized system for creating, categorizing, assigning, tracking and escalating customer support tickets.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              By combining a deterministic rule-based classification engine, automated department routing, relational database integrity, and graph-based escalation tracking, support teams can resolve customer issues systematically.
            </p>
          </div>
        </div>
      </div>

      {/* SUBJECT MAPPING SECTION */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Curriculum Subject Mapping
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Core computer science subjects integrated into this project demonstration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjectMappings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-50 px-2.5 py-1 rounded">
                      {item.code}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.subjectName}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-950 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.implementationDetail}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate(item.targetPage)}
                    className="text-xs font-semibold text-indigo-950 hover:underline"
                  >
                    {item.linkLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SettingsHelpViewProps {
  mode: 'settings' | 'help';
  onResetDemoData: () => void;
  onNavigate: (page: PageId) => void;
}

export const SettingsHelpView: React.FC<SettingsHelpViewProps> = ({
  mode,
  onResetDemoData,
  onNavigate,
}) => {
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const handleReset = () => {
    onResetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  if (mode === 'settings') {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              System Settings & Demo State Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure presentation preferences and reset local demonstration data.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">
                  Administrator Profile
                </div>
                <div className="text-slate-500 mt-0.5">
                  Vardhini · Project Admin (vardhini.g@enterprise-client.in)
                </div>
              </div>
              <span className="font-mono text-emerald-700 font-semibold">
                Active Session
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">
                  Classification Engine Mode
                </div>
                <div className="text-slate-500 mt-0.5">
                  Deterministic Rule-Based Keyword Matching (6 Categories)
                </div>
              </div>
              <span className="font-mono text-slate-700 font-semibold">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-slate-900">
                  Reset Presentation Demo Dataset
                </div>
                <div className="text-slate-500 mt-0.5">
                  Restore all 15 initial tickets (including T-1001 for Vardhini), 9 customers, and 5 escalation records to their default state.
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Demonstration data has been restored to its original baseline.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <BookOpen className="w-5 h-5 text-indigo-950" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Help & Presentation Walkthrough Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recommended sequence for demonstrating this project during college viva or evaluation.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">
              Step 1: Dashboard & Featured Ticket T-1001
            </div>
            <p className="text-slate-600">
              Start on the Dashboard to highlight total ticket volume and click on{' '}
              <strong className="font-mono">T-1001</strong> (Vardhini — "Payment deducted but order not confirmed") to show its lifecycle timeline.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">
              Step 2: Create & Classify Ticket (Python Rule-Based Engine)
            </div>
            <p className="text-slate-600">
              Open <strong>Create Ticket</strong>, select a sample scenario or type a custom issue, and click <strong>Create & Classify Ticket</strong> to demonstrate automatic category detection and team routing.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">
              Step 3: Escalations & Graph Analysis (DMGT & ADSA)
            </div>
            <p className="text-slate-600">
              Navigate to <strong>Escalations</strong> and <strong>Graph Analysis</strong> to show the Ticket → Level 1 → Level 2 → Senior Agent → Manager chain and click <strong>Run BFS</strong> and <strong>Run DFS</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">
              Step 4: Database ER Diagram & Subject Mapping
            </div>
            <p className="text-slate-600">
              Show the <strong>Database</strong> ER relationships (1 : Many, PK/FK) and conclude on <strong>About Project</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
