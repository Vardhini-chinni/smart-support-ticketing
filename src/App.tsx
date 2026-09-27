import React, { useState } from 'react';
import {
  buildEscalationChain,
  buildTimeline,
  classifyTicketIssue,
  INITIAL_AGENTS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_ESCALATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKETS,
} from './data/mockData';
import {
  Customer,
  EscalationLevel,
  EscalationRecord,
  NotificationItem,
  PageId,
  SupportAgent,
  Ticket,
  TicketPriority,
  TicketStatus,
} from './types/support';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { TicketsView } from './views/TicketsView';
import { CreateTicketView } from './views/CreateTicketView';
import { TicketDetailsView } from './views/TicketDetailsView';
import { CustomersView } from './views/CustomersView';
import { SupportAgentsView } from './views/SupportAgentsView';
import { EscalationsView } from './views/EscalationsView';
import { GraphAnalysisView } from './views/GraphAnalysisView';
import { AnalyticsView } from './views/AnalyticsView';
import { DatabaseView } from './views/DatabaseView';
import { ProjectFlowView } from './views/ProjectFlowView';
import { AboutProjectView, SettingsHelpView } from './views/AboutProjectView';

const PAGE_METADATA: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of customer support tickets, resolutions and escalations.',
  },
  tickets: {
    title: 'Customer Tickets',
    subtitle: 'View, search and manage customer support requests.',
  },
  'create-ticket': {
    title: 'Create New Ticket',
    subtitle: 'Register a customer issue and automatically route it to the appropriate support team.',
  },
  'ticket-details': {
    title: 'Ticket Details',
    subtitle: 'Inspect ticket attributes, lifecycle timeline, and escalation hierarchy.',
  },
  customers: {
    title: 'Customers',
    subtitle: 'Directory of registered customers and their support request history.',
  },
  agents: {
    title: 'Support Agents',
    subtitle: 'Support teams, agent workload distribution, and escalation availability.',
  },
  escalations: {
    title: 'Escalations',
    subtitle: 'Monitor and advance multi-tier ticket escalations across support hierarchy levels.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Quantitative metrics on ticket categories, priorities, escalations, and SLA resolution.',
  },
  'graph-analysis': {
    title: 'Graph Analysis',
    subtitle: 'Analyze escalation paths using graph traversal concepts.',
  },
  database: {
    title: 'Database',
    subtitle: 'Entity-Relationship diagram and relational database schema.',
  },
  'project-flow': {
    title: 'Project Flow',
    subtitle: 'Visual workflow from customer ticket creation to classification, routing, and resolution.',
  },
  'about-project': {
    title: 'About Project',
    subtitle: 'Problem statement, solution overview, and academic subject mapping.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage system preferences and reset presentation demonstration data.',
  },
  help: {
    title: 'Help & Support',
    subtitle: 'Presentation walkthrough guide and feature documentation.',
  },
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [agents, setAgents] = useState<SupportAgent[]>(INITIAL_AGENTS);
  const [escalations, setEscalations] =
    useState<EscalationRecord[]>(INITIAL_ESCALATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [selectedTicketId, setSelectedTicketId] = useState<string>('T-1001');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<
    TicketStatus | 'All'
  >('All');

  const openTicketCount = tickets.filter((t) => t.status !== 'Resolved').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;

  const handleNavigate = (page: PageId) => {
    if (page === 'tickets') {
      setTicketStatusFilter('All');
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWithStatusFilter = (status: TicketStatus | 'All') => {
    setTicketStatusFilter(status);
    setActivePage('tickets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActivePage('ticket-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTicket = (input: {
    customerName: string;
    customerEmail: string;
    issue: string;
    description: string;
    priority: TicketPriority;
  }): Ticket => {
    const classification = classifyTicketIssue(input.issue, input.description);
    const nowTimestamp = '2026-09-26 10:20';

    // Find or create customer
    let existingCustomer = customers.find(
      (c) =>
        c.name.toLowerCase() === input.customerName.toLowerCase() ||
        c.email.toLowerCase() === input.customerEmail.toLowerCase()
    );

    if (!existingCustomer) {
      const nextCustNum = 101 + customers.length;
      const newCustomer: Customer = {
        id: `C-${nextCustNum}`,
        name: input.customerName,
        email: input.customerEmail,
        phone: '+91 98000 12345',
        organization: 'Enterprise Client Portal',
        createdAt: '2026-09-26',
        lastActivity: nowTimestamp,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      existingCustomer = newCustomer;
    } else {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === existingCustomer!.id
            ? { ...c, lastActivity: nowTimestamp }
            : c
        )
      );
    }

    // Find agent on the assigned team
    const teamAgent =
      agents.find(
        (a) =>
          a.team === classification.assignedTeam &&
          a.escalationLevel === 'Level 1'
      ) ||
      agents.find((a) => a.team === classification.assignedTeam) ||
      agents[0];

    const nextTicketNumber = 1001 + tickets.length;
    const newTicketId = `T-${nextTicketNumber}`;

    const newTicket: Ticket = {
      id: newTicketId,
      customerId: existingCustomer.id,
      customerName: existingCustomer.name,
      customerEmail: existingCustomer.email,
      issue: input.issue,
      description: input.description,
      categoryId: classification.categoryId,
      category: classification.category,
      priority: input.priority,
      assignedTeam: classification.assignedTeam,
      assignedAgentId: teamAgent.id,
      assignedAgentName: teamAgent.name,
      status: 'Open',
      escalationLevel: 'None',
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp,
      matchedKeywords: classification.matchedKeywords,
      timeline: buildTimeline({
        ticketId: newTicketId,
        createdAt: nowTimestamp,
        category: classification.category,
        assignedTeam: classification.assignedTeam,
        assignedAgentName: teamAgent.name,
        status: 'Open',
        escalationLevel: 'None',
      }),
      escalationChain: buildEscalationChain(
        'None',
        false,
        teamAgent.name,
        teamAgent.id,
        nowTimestamp
      ),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `New Ticket ${newTicket.id} Created`,
        description: `Classified as ${newTicket.category} and routed to ${newTicket.assignedTeam}.`,
        timestamp: 'Just now',
        read: false,
        ticketId: newTicket.id,
        type: 'ticket',
      },
      ...prev,
    ]);

    return newTicket;
  };

  const handleEscalateTicket = (ticketId: string, customReason?: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || target.status === 'Resolved') return;

    const nextLevelMap: Record<
      EscalationLevel,
      'Level 1' | 'Level 2' | 'Senior Level' | 'Manager Level'
    > = {
      None: 'Level 1',
      'Level 1': 'Level 2',
      'Level 2': 'Senior Level',
      'Senior Level': 'Manager Level',
      'Manager Level': 'Manager Level',
    };

    const nextLevel = nextLevelMap[target.escalationLevel];

    // Determine agent for the new escalation level
    let nextAgentId = target.assignedAgentId;
    let nextAgentName = target.assignedAgentName;
    if (nextLevel === 'Level 2') {
      nextAgentId = 'AG-202';
      nextAgentName = 'Priya Nair';
    } else if (nextLevel === 'Senior Level') {
      nextAgentId = 'AG-208';
      nextAgentName = 'Vikram Desai';
    } else if (nextLevel === 'Manager Level') {
      nextAgentId = 'AG-209';
      nextAgentName = 'Ananya Sharma';
    }

    const nowTimestamp = '2026-09-26 10:30';
    const reasonText =
      customReason ||
      target.escalationReason ||
      `Ticket escalated to ${nextLevel} for specialized resolution.`;

    const primaryL1AgentName =
      target.escalationChain[0]?.agentName || target.assignedAgentName;
    const primaryL1AgentId =
      target.escalationChain[0]?.agentId || target.assignedAgentId;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'Escalated',
          escalationLevel: nextLevel,
          escalationReason: reasonText,
          assignedAgentId: nextAgentId,
          assignedAgentName: nextAgentName,
          updatedAt: nowTimestamp,
          timeline: buildTimeline({
            ticketId: t.id,
            createdAt: t.createdAt,
            category: t.category,
            assignedTeam: t.assignedTeam,
            assignedAgentName: nextAgentName,
            status: 'Escalated',
            escalationLevel: nextLevel,
            escalationReason: reasonText,
          }),
          escalationChain: buildEscalationChain(
            nextLevel,
            false,
            primaryL1AgentName,
            primaryL1AgentId,
            nowTimestamp,
            reasonText
          ),
        };
      })
    );

    setEscalations((prev) => {
      const existing = prev.find((e) => e.ticketId === ticketId);
      if (existing) {
        return prev.map((e) =>
          e.ticketId === ticketId
            ? {
                ...e,
                currentLevel: nextLevel,
                assignedAgentId: nextAgentId,
                assignedAgentName: nextAgentName,
                reason: reasonText,
                escalatedAt: nowTimestamp,
                status: 'Escalated',
              }
            : e
        );
      }
      const newEsc: EscalationRecord = {
        id: `ESC-${301 + prev.length}`,
        ticketId: target.id,
        customerId: target.customerId,
        customerName: target.customerName,
        issue: target.issue,
        category: target.category,
        reason: reasonText,
        currentLevel: nextLevel,
        assignedAgentId: nextAgentId,
        assignedAgentName: nextAgentName,
        escalatedAt: nowTimestamp,
        status: 'Escalated',
      };
      return [newEsc, ...prev];
    });

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Ticket ${ticketId} Escalated to ${nextLevel}`,
        description: `Assigned to ${nextAgentName}.`,
        timestamp: 'Just now',
        read: false,
        ticketId,
        type: 'escalation',
      },
      ...prev,
    ]);
  };

  const handleResolveTicket = (ticketId: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target || target.status === 'Resolved') return;

    const nowTimestamp = '2026-09-26 10:35';
    const primaryL1AgentName =
      target.escalationChain[0]?.agentName || target.assignedAgentName;
    const primaryL1AgentId =
      target.escalationChain[0]?.agentId || target.assignedAgentId;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'Resolved',
          updatedAt: nowTimestamp,
          timeline: buildTimeline({
            ticketId: t.id,
            createdAt: t.createdAt,
            category: t.category,
            assignedTeam: t.assignedTeam,
            assignedAgentName: t.assignedAgentName,
            status: 'Resolved',
            escalationLevel: t.escalationLevel,
            escalationReason: t.escalationReason,
          }),
          escalationChain: buildEscalationChain(
            t.escalationLevel,
            true,
            primaryL1AgentName,
            primaryL1AgentId,
            nowTimestamp,
            t.escalationReason
          ),
        };
      })
    );

    setEscalations((prev) =>
      prev.map((e) =>
        e.ticketId === ticketId ? { ...e, status: 'Resolved' } : e
      )
    );

    setAgents((prev) =>
      prev.map((a) =>
        a.id === target.assignedAgentId
          ? { ...a, resolvedTickets: a.resolvedTickets + 1 }
          : a
      )
    );

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Ticket ${ticketId} Marked Resolved`,
        description: `${target.issue} resolved by ${target.assignedAgentName}.`,
        timestamp: 'Just now',
        read: false,
        ticketId,
        type: 'resolution',
      },
      ...prev,
    ]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleResetDemoData = () => {
    setTickets(INITIAL_TICKETS);
    setCustomers(INITIAL_CUSTOMERS);
    setAgents(INITIAL_AGENTS);
    setEscalations(INITIAL_ESCALATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedTicketId('T-1001');
    setTicketStatusFilter('All');
  };

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const currentMeta = PAGE_METADATA[activePage];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        openTicketCount={openTicketCount}
        escalatedCount={escalatedCount}
      />

      {/* Main Content Area beside Fixed Sidebar */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <Header
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          tickets={tickets}
          notifications={notifications}
          onSelectTicket={handleSelectTicket}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-8 max-w-[1440px] w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              tickets={tickets}
              escalations={escalations}
              onSelectTicket={handleSelectTicket}
              onNavigate={handleNavigate}
              onNavigateWithStatusFilter={handleNavigateWithStatusFilter}
            />
          )}

          {activePage === 'tickets' && (
            <TicketsView
              tickets={tickets}
              initialStatusFilter={ticketStatusFilter}
              onSelectTicket={handleSelectTicket}
              onEscalateTicket={handleEscalateTicket}
              onResolveTicket={handleResolveTicket}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'create-ticket' && (
            <CreateTicketView
              onCreateTicket={handleCreateTicket}
              onSelectTicket={handleSelectTicket}
            />
          )}

          {activePage === 'ticket-details' && selectedTicket && (
            <TicketDetailsView
              ticket={selectedTicket}
              allTickets={tickets}
              onSelectTicket={handleSelectTicket}
              onEscalateTicket={handleEscalateTicket}
              onResolveTicket={handleResolveTicket}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'customers' && (
            <CustomersView
              customers={customers}
              tickets={tickets}
              onSelectTicket={handleSelectTicket}
            />
          )}

          {activePage === 'agents' && (
            <SupportAgentsView agents={agents} tickets={tickets} />
          )}

          {activePage === 'escalations' && (
            <EscalationsView
              tickets={tickets}
              escalations={escalations}
              onSelectTicket={handleSelectTicket}
              onContinueEscalation={(ticketId) =>
                handleEscalateTicket(ticketId)
              }
              onResolveTicket={handleResolveTicket}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'graph-analysis' && (
            <GraphAnalysisView tickets={tickets} />
          )}

          {activePage === 'analytics' && <AnalyticsView tickets={tickets} />}

          {activePage === 'database' && (
            <DatabaseView
              customers={customers}
              tickets={tickets}
              agents={agents}
              categories={INITIAL_CATEGORIES}
              escalations={escalations}
            />
          )}

          {activePage === 'project-flow' && (
            <ProjectFlowView onNavigate={handleNavigate} />
          )}

          {activePage === 'about-project' && (
            <AboutProjectView onNavigate={handleNavigate} />
          )}

          {activePage === 'settings' && (
            <SettingsHelpView
              mode="settings"
              onResetDemoData={handleResetDemoData}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'help' && (
            <SettingsHelpView
              mode="help"
              onResetDemoData={handleResetDemoData}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
