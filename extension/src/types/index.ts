export interface PageContext {
  ok: boolean;
  url: string;
  title: string;
  selection: string;
  text: string;
  description: string;
  metadata: Record<string, string>;
  links: string[];
  images: string[];
  pageType: string;
  language: string;
  charset: string;
}

export interface AIAnalysis {
  summary?: string;
  tasks?: string[];
  email?: string;
  flashcards?: FlashCard[];
  rewrite?: string;
  tags?: string[];
  decisions?: string[];
  keyPoints?: string[];
  sentiment?: string;
  entities?: string[];
}

export interface FlashCard {
  question: string;
  answer: string;
}

export interface Capture {
  id: string;
  url: string;
  title: string;
  text?: string;
  selection?: string;
  description?: string;
  pageType?: string;
  capturedAt: number;
  synced: boolean;
  tags?: string[];
  summaryId?: string;
}

export interface Summary {
  id: string;
  url: string;
  title: string;
  summary?: string;
  tasks?: string[];
  generatedAt: number;
  model?: string;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  sourceUrl?: string;
  sourceTitle?: string;
  createdAt: number;
  dueDate?: number;
  priority?: "low" | "medium" | "high";
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  mode: string;
  prompt: string;
}

export interface Workspace {
  id: string;
  name: string;
  members: string[];
  captures: string[];
  createdAt: number;
}

export interface ThynMessage {
  type: string;
  payload?: any;
}

export interface ThynResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

export type PageType =
  | "article"
  | "video"
  | "research"
  | "profile"
  | "product"
  | "document"
  | "pdf"
  | "job"
  | "social"
  | "forum";

export type AIMode =
  | "summary"
  | "tasks"
  | "email"
  | "flashcards"
  | "rewrite"
  | "compare"
  | "ask"
  | "analyze";

export type ToneType = "concise" | "professional" | "friendly" | "persuasive" | "casual";

export interface AppSettings {
  darkMode: boolean;
  autoCapture: boolean;
  notifications: boolean;
  dailyDigest: boolean;
  redactSensitive: boolean;
  summaryLength: "short" | "medium" | "long";
  theme: "dark" | "light" | "system";
}
