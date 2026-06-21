import { apiPost } from "./api";

export interface PageContext {
  url: string;
  title: string;
  text?: string;
  selection?: string;
  description?: string;
  pageType?: string;
}

export interface AIResult {
  summary?: string;
  tasks?: string[];
  email?: string;
  flashcards?: { question: string; answer: string }[];
  rewrite?: string;
  tags?: string[];
  decisions?: string[];
}

export async function analyzePage(page: PageContext, mode: string): Promise<AIResult> {
  return apiPost<AIResult>("/ai/analyze", { mode, page });
}

export async function summarizePage(page: PageContext): Promise<AIResult> {
  return analyzePage(page, "summary");
}

export async function extractTasks(page: PageContext): Promise<AIResult> {
  return analyzePage(page, "tasks");
}

export async function generateEmail(page: PageContext): Promise<AIResult> {
  return analyzePage(page, "email");
}

export async function generateFlashcards(page: PageContext): Promise<AIResult> {
  return analyzePage(page, "flashcards");
}

export async function compareTabs(pages: PageContext[]): Promise<AIResult> {
  return apiPost<AIResult>("/ai/compare", { pages });
}

export async function rewriteText(text: string, tone: string): Promise<AIResult> {
  return apiPost<AIResult>("/ai/rewrite", { text, tone });
}

export async function askQuestion(page: PageContext, question: string): Promise<AIResult> {
  return apiPost<AIResult>("/ai/ask", { page, question });
}
