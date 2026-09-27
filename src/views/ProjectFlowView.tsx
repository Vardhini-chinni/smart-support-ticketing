import React, { useState } from 'react';
import {
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  User,
  FilePlus2,
  Cpu,
  Tag,
  GitBranch,
  Users,
  UserCheck,
  HelpCircle,
  Network,
} from 'lucide-react';
import { PageId } from '../types/support';

interface ProjectFlowViewProps {
  onNavigate: (page: PageId) => void;
}

interface FlowStepInfo {
  id: string;
  title: string;
  subtitle: string;
  subjectModule: string;
  details: string;
}

const FLOW_STEPS: FlowStepInfo[] = [
  {
    id: 'customer',
    title: 'Customer',
    subtitle: 'Initiates Support Request',
    subjectModule: 'DBMS (Customer Entity)',
    details:
      'A registered or new customer (e.g., Vardhini) encounters an issue with a payment, login, refund, delivery, or account setting.',
  },
  {
    id: 'create-ticket',
    title: 'Create Ticket',
    subtitle: 'Issue & Priority Intake',
    subjectModule: 'Frontend & DBMS Intake',
    details:
      'Customer enters Name, Email, Issue Title, Problem Description, and Priority into the intake portal.',
  },
  {
    id: 'python-classification',
    title: 'Python Classification',
    subtitle: 'Rule-Based Keyword Engine',
    subjectModule: 'PYTHON Module',
    details:
      'Deterministic rule-based inspection evaluates the problem text for domain keywords (e.g., payment, deducted, crash, refund, parcel).',
  },
  {
    id: 'category-identified',
    title: 'Category Identified',
    subtitle: 'Payment / Technical / Refund / Delivery / Account / General',
    subjectModule: 'DBMS (Category Entity)',
    details:
      'Assigns the exact Category_ID (PK) based on matched keyword rules.',
  },
  {
    id: 'java-routing',
    title: 'Java Routing Logic',
    subtitle: 'Object-Oriented Dispatcher',
    subjectModule: 'OOPJ Module',
    details:
      'Uses object-oriented encapsulation and routing logic to map the identified category to the specialized Support Team and available Agent.',
  },
  {
    id: 'support-team',
    title: 'Support Team',
    subtitle: 'Specialized Department Queue',
    subjectModule: 'Operational Queue',
    details:
      'Ticket enters the designated department queue (e.g., Payment Support for T-1001).',
  },
  {
    id: 'support-agent',
    title: 'Support Agent',
    subtitle: 'Level 1 Specialist Investigation',
    subjectModule: 'DBMS (Agent Entity)',
    details:
      'Assigned Level 1 Support Agent investigates the issue within the target SLA window.',
  },
];

export const ProjectFlowView: React.FC<ProjectFlowViewProps> = ({
  onNavigate,
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>(
    'python-classification'
  );

  const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    customer: User,
    'create-ticket': FilePlus2,
    'python-classification': Cpu,
    'category-identified': Tag,
    'java-routing': GitBranch,
    'support-team': Users,
    'support-agent': UserCheck,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            System Architecture & Project Flow
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual end-to-end ticket processing pipeline from customer intake to resolution or graph-based escalation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('create-ticket')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg transition-colors whitespace-nowrap"
          >
            Test Workflow Live →
          </button>
        </div>
      </div>

      {/* Main Flowchart Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Linear Sequence: Customer -> Support Agent */}
          {FLOW_STEPS.map((step, idx) => {
            const Icon = stepIcons[step.id] || HelpCircle;
            const isSelected = selectedStepId === step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStepId(step.id)}
                  className={`w-full max-w-md p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'border-2 border-indigo-950 bg-indigo-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          0{idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {step.subtitle}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-indigo-950 bg-slate-100 px-2 py-1 rounded shrink-0">
                    {step.subjectModule}
                  </span>
                </button>

                <div className="py-1.5 flex flex-col items-center text-slate-400">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </React.Fragment>
            );
          })}

          {/* Decision Node: Issue Resolved? */}
          <div className="w-full max-w-md p-4 rounded-xl border-2 border-amber-500 bg-amber-50/50 text-center space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">
              DECISION GATEWAY
            </div>
            <div className="text-sm font-bold text-slate-900">
              Issue Resolved?
            </div>
            <div className="text-xs text-slate-600">
              Evaluates whether the assigned agent resolved the ticket within SLA
            </div>
          </div>

          {/* Branching Arrows: YES (Left) vs NO (Right) */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 mt-2 border-t border-slate-200">
            {/* LEFT BRANCH: YES -> CLOSE */}
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                YES (Issue Resolved)
              </div>
              <ArrowDown className="w-4 h-4 text-emerald-600 my-2" />

              <div className="w-full p-5 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 text-center space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto" />
                <div className="text-sm font-bold text-slate-900">CLOSE</div>
                <p className="text-xs text-slate-600">
                  Ticket status updated to Resolved in DBMS; resolution timestamp recorded.
                </p>
              </div>
            </div>

            {/* RIGHT BRANCH: NO -> ESCALATE -> Escalation Graph -> Resolve -> CLOSE */}
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs font-bold">
                NO (Requires Higher Tier)
              </div>
              <ArrowDown className="w-4 h-4 text-rose-600 my-2" />

              {/* ESCALATE */}
              <div className="w-full p-4 rounded-xl border-2 border-rose-600 bg-rose-50/40 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ESCALATE</span>
                </div>
                <p className="text-xs text-slate-600">
                  Logs escalation record and advances ticket tier
                </p>
              </div>

              <ArrowDown className="w-4 h-4 text-slate-400 my-2" />

              {/* Escalation Graph */}
              <button
                type="button"
                onClick={() => onNavigate('graph-analysis')}
                className="w-full p-4 rounded-xl border border-indigo-950 bg-indigo-950 text-white text-center space-y-1 hover:bg-indigo-900 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
                  <Network className="w-4 h-4 text-indigo-300" />
                  <span>Escalation Graph</span>
                </div>
                <p className="text-xs text-indigo-200">
                  Level 1 → Level 2 → Senior Agent → Manager (DMGT / ADSA)
                </p>
              </button>

              <ArrowDown className="w-4 h-4 text-slate-400 my-2" />

              {/* Resolve */}
              <div className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <div className="text-xs font-bold text-slate-900">Resolve</div>
                <div className="text-[11px] text-slate-500">
                  Higher-tier authority resolves complex issue
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-emerald-600 my-2" />

              {/* CLOSE */}
              <div className="w-full p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/40 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CLOSE</span>
                </div>
                <p className="text-xs text-slate-600">
                  Escalation closed and ticket marked Resolved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
