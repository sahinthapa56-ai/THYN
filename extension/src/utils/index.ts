export function generateId(): string {
  return crypto.randomUUID();
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(ts);
}

export function detectPageType(url: string, title: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("arxiv.org") || url.includes("scholar.google")) return "research";
  if (url.includes("linkedin.com")) return "profile";
  if (url.includes("amazon.") || url.includes("product")) return "product";
  if (url.includes("docs.google") || url.includes("notion")) return "document";
  if (url.endsWith(".pdf")) return "pdf";
  if (title.toLowerCase().includes("job") || title.includes("hiring")) return "job";
  if (url.includes("twitter.com") || url.includes("x.com")) return "social";
  if (url.includes("reddit.com")) return "forum";
  return "article";
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function classNames(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
