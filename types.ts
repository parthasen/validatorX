
export enum AgentRole {
  DISCOVERY = 'Discovery',
  RESEARCH = 'Research',
  QUESTION_GENERATOR = 'Question Generator',
  VALIDATOR = 'Validator',
  INTERVIEWER = 'Interviewer'
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'working' | 'ready';
  avatar: string;
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  status: 'draft' | 'discovery' | 'research' | 'validation' | 'completed';
  knowledgeBaseId?: string;
  themes: Theme[];
}

export interface Theme {
  id: string;
  keyword: string;
  description: string;
  selected: boolean;
}

export interface Feedback {
  id: string;
  expertName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: 'builder' | 'expert' | 'admin';
  phone?: string;
  socialLink?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  summary: string;
  keywords: string[];
  findings: string[];
}
