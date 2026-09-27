import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Plus,
} from 'lucide-react';
import { classifyTicketIssue } from '../data/mockData';
import { Ticket, TicketPriority } from '../types/support';

interface CreateTicketViewProps {
  onCreateTicket: (input: {
    customerName: string;
    customerEmail: string;
    issue: string;
    description: string;
    priority: TicketPriority;
  }) => Ticket;
  onSelectTicket: (ticketId: string) => void;
}

const DEMO_SCENARIOS = [
  {
    label: 'Payment Issue (Vardhini)',
    customerName: 'Vardhini',
    customerEmail: 'vardhini.g@enterprise-client.in',
    issue: 'Payment deducted via UPI but order not confirmed',
    description:
      'My payment of ₹3,200 was paid and deducted from my bank account during checkout, but the transaction status still shows unconfirmed.',
    priority: 'High' as TicketPriority,
  },
  {
    label: 'Technical Crash',
    customerName: 'Rohan Kulkarni',
    customerEmail: 'rohan.kulkarni@finverse.io',
    issue: 'Portal login error and dashboard crash on Safari',
    description:
      'After entering our account password, the application throws an unexpected error 500 and crashes.',
    priority: 'Critical' as TicketPriority,
  },
  {
    label: 'Refund Request',
    customerName: 'Meera Krishnan',
    customerEmail: 'meera.k@cloudnova.com',
    issue: 'Pending refund money back for cancelled subscription',
    description:
      'We cancelled our quarterly license last week and requested a full refund reimbursement to our corporate card.',
    priority: 'Medium' as TicketPriority,
  },
  {
    label: 'Delivery Delay',
    customerName: 'Aditya Verma',
    customerEmail: 'aditya.verma@logixhub.in',
    issue: 'Courier parcel delayed at regional shipping hub',
    description:
      'Our hardware parcel delivery has not moved for 3 days according to the shipping tracking portal.',
    priority: 'Medium' as TicketPriority,
  },
];

export const CreateTicketView: React.FC<CreateTicketViewProps> = ({
  onCreateTicket,
  onSelectTicket,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('High');
  const [error, setError] = useState('');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  // Live preview of rule-based classification
  const livePreview =
    issue.trim() || description.trim()
      ? classifyTicketIssue(issue, description)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !issue.trim() || !description.trim()) {
      setError('Please complete all required fields before creating the ticket.');
      return;
    }
    setError('');
    const newTicket = onCreateTicket({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      issue: issue.trim(),
      description: description.trim(),
      priority,
    });
    setCreatedTicket(newTicket);
  };

  const applyPreset = (preset: (typeof DEMO_SCENARIOS)[number]) => {
    setCustomerName(preset.customerName);
    setCustomerEmail(preset.customerEmail);
    setIssue(preset.issue);
    setDescription(preset.description);
    setPriority(preset.priority);
    setError('');
    setCreatedTicket(null);
  };

  const handleReset = () => {
    setCustomerName('');
    setCustomerEmail('');
    setIssue('');
    setDescription('');
    setPriority('High');
    setError('');
    setCreatedTicket(null);
  };

  const classificationRules = [
    {
      keywords: 'payment / paid / transaction / deducted',
      category: 'Payment',
      team: 'Payment Support',
    },
    {
      keywords: 'login / password / crash / error',
      category: 'Technical',
      team: 'Technical Support',
    },
    {
      keywords: 'refund / money back / return',
      category: 'Refund',
      team: 'Refund Support',
    },
    {
      keywords: 'delivery / shipping / parcel / courier',
      category: 'Delivery',
      team: 'Delivery Support',
    },
    {
      keywords: 'account / profile / verification',
      category: 'Account',
      team: 'Account Support',
    },
    {
      keywords: 'otherwise (no keyword match)',
      category: 'General',
      team: 'General Support',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Ticket Creation Form + Result Card */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Ticket</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Register a customer issue and automatically route it to the appropriate support team.
              </p>
            </div>
          </div>

          {/* Quick Presentation Presets */}
          <div className="py-4 border-b border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Quick Demo Scenarios (Click to auto-fill form):
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_SCENARIOS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Vardhini"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g., vardhini.g@enterprise-client.in"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Issue Title *
                </label>
                <input
                  type="text"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g., Payment deducted but order not confirmed"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Problem Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail so the rule-based classifier can identify keywords..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-900"
              />
            </div>

            {/* Live Classification Preview Banner */}
            {livePreview && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Live Rule Preview: </span>
                  <span className="font-semibold text-indigo-950">
                    {livePreview.category}
                  </span>
                  <span className="text-slate-400"> → </span>
                  <span className="font-semibold text-slate-800">
                    {livePreview.assignedTeam}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Keywords: {livePreview.matchedKeywords.join(', ')}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create & Classify Ticket</span>
              </button>
            </div>
          </form>
        </div>

        {/* Result Card after submitting */}
        {createdTicket && (
          <div className="bg-white border-2 border-emerald-600 rounded-xl p-6 space-y-5 shadow-xs">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ticket Created Successfully
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Classified via deterministic rule-based keyword inspection and routed to team queue.
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-indigo-950">
                Ticket ID: {createdTicket.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Ticket ID</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-1">
                  {createdTicket.id}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Detected Category</div>
                <div className="font-bold text-indigo-950 text-sm mt-1">
                  {createdTicket.category}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Assigned Team</div>
                <div className="font-bold text-slate-900 text-sm mt-1">
                  {createdTicket.assignedTeam}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-slate-500">Status</div>
                <div className="font-bold text-amber-700 text-sm mt-1">
                  {createdTicket.status}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="text-slate-600">
                Assigned Agent:{' '}
                <strong className="text-slate-900">{createdTicket.assignedAgentName}</strong> ·
                Matched Keywords:{' '}
                <span className="font-mono text-indigo-950">
                  [{createdTicket.matchedKeywords.join(', ')}]
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Another</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTicket(createdTicket.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-950 hover:bg-indigo-900 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Open Ticket Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Explainable Rule-Based Classification Reference */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-950 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Explainable Rule-Based Classification
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic keyword evaluation rules (No black-box ML claims)
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          When a ticket is submitted, the Python Classification logic scans the{' '}
          <strong className="text-slate-900">Issue Title</strong> and{' '}
          <strong className="text-slate-900">Problem Description</strong> against deterministic
          keyword rules and routes the ticket to the corresponding support team via Java routing logic.
        </p>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {classificationRules.map((rule) => {
            const isMatched = livePreview?.category === rule.category;
            return (
              <div
                key={rule.category}
                className={`p-3.5 text-xs transition-colors ${
                  isMatched ? 'bg-indigo-50/70' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-slate-600">
                    {rule.keywords}
                  </span>
                  {isMatched && (
                    <span className="text-[11px] font-bold text-indigo-950">
                      MATCHED
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    → {rule.category}
                  </span>
                  <span className="text-slate-500 font-medium">
                    Team: {rule.team}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
