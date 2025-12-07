export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INGESTION = 'INGESTION',
  ANALYSIS = 'ANALYSIS',
  ARCHITECTURE = 'ARCHITECTURE',
  SETTINGS = 'SETTINGS'
}

export interface FinancialMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface IngestionJob {
  id: string;
  source: string;
  type: 'Video' | 'PDF' | 'Audio';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  progress: number;
  filename: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DocSection {
  title: string;
  content: string;
  code?: string;
  language?: string;
}