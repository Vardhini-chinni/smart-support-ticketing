export type PageId =
  | 'dashboard'
  | 'tickets'
  | 'create-ticket'
  | 'ticket-details'
  | 'customers'
  | 'agents'
  | 'escalations'
  | 'analytics'
  | 'graph-analysis'
  | 'database'
  | 'project-flow'
  | 'about-project'
  | 'settings'
  | 'help';

export type TicketCategory =
  | 'Payment'
  | 'Technical'
  | 'Refund'
  | 'Delivery'
  | 'Account'
  | 'General';

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved';

export type EscalationLevel =
  | 'None'
  | 'Level 1'
  | 'Level 2'
  | 'Senior Level'
  | 'Manager Level';

export type SupportTeam =
  | 'Payment Support'
  | 'Technical Support'
  | 'Refund Support'
  | 'Delivery Support'
  | 'Account Support'
  | 'General Support';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  createdAt: string;
  lastActivity: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  team: SupportTeam;
  activeTickets: number;
  resolvedTickets: number;
  escalationLevel: 'Level 1' | 'Level 2' | 'Senior Level' | 'Manager Level';
  availability: 'Available' | 'Busy' | 'In Escalation';
}

export interface CategoryRecord {
  id: string;
  name: TicketCategory;
  assignedTeam: SupportTeam;
  keywords: string[];
  slaHours: number;
  description: string;
}

export interface TicketTimelineStep {
  id: string;
  stage:
    | 'Ticket Created'
    | 'Category Identified'
    | 'Assigned to Team'
    | 'Assigned to Agent'
    | 'Escalated'
    | 'Resolved';
  title: string;
  description: string;
  timestamp: string;
  responsibleAgent: string;
  completed: boolean;
  active?: boolean;
}

export interface EscalationChainStep {
  level: 'Level 1' | 'Level 2' | 'Senior Level' | 'Manager Level';
  nodeLabel: string;
  agentId: string;
  agentName: string;
  role: string;
  nodeType: 'agent' | 'manager';
  status: 'passed' | 'current' | 'upcoming' | 'resolved';
  timestamp?: string;
  reason?: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issue: string;
  description: string;
  categoryId: string;
  category: TicketCategory;
  priority: TicketPriority;
  assignedTeam: SupportTeam;
  assignedAgentId: string;
  assignedAgentName: string;
  status: TicketStatus;
  escalationLevel: EscalationLevel;
  escalationReason?: string;
  createdAt: string;
  updatedAt: string;
  matchedKeywords: string[];
  timeline: TicketTimelineStep[];
  escalationChain: EscalationChainStep[];
}

export interface EscalationRecord {
  id: string;
  ticketId: string;
  customerId: string;
  customerName: string;
  issue: string;
  category: TicketCategory;
  reason: string;
  currentLevel: 'Level 1' | 'Level 2' | 'Senior Level' | 'Manager Level';
  assignedAgentId: string;
  assignedAgentName: string;
  escalatedAt: string;
  status: 'Escalated' | 'Resolved';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  ticketId?: string;
  type: 'escalation' | 'ticket' | 'resolution';
}

export interface ClassificationResult {
  category: TicketCategory;
  categoryId: string;
  assignedTeam: SupportTeam;
  matchedKeywords: string[];
  ruleExplanation: string;
}
