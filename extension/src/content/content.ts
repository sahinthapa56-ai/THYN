function getSelectionText(): string {
  const sel = window.getSelection();
  return sel ? String(sel.toString()).trim() : "";
}

function getPageText(): string {
  return document.body?.innerText?.slice(0, 30000) || "";
}

function getPageMetadata(): Record<string, string> {
  const meta: Record<string, string> = {};
  document.querySelectorAll("meta").forEach((el) => {
    const name = el.getAttribute("name") || el.getAttribute("property") || "";
    const content = el.getAttribute("content") || "";
    if (name && content) meta[name] = content;
  });
  return meta;
}

function getPageLinks(): string[] {
  const links: string[] = [];
  document.querySelectorAll("a[href]").forEach((el) => {
    const href = (el as HTMLAnchorElement).href;
    if (href && href.startsWith("http")) links.push(href);
  });
  return links.slice(0, 50);
}

function getPageImages(): string[] {
  const images: string[] = [];
  document.querySelectorAll("img[src]").forEach((el) => {
    const src = (el as HTMLImageElement).src;
    if (src && src.startsWith("http")) images.push(src);
  });
  return images.slice(0, 20);
}

function detectPageType(): string {
  const url = location.href;
  const title = document.title.toLowerCase();

  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("arxiv.org") || url.includes("scholar.google")) return "research";
  if (url.includes("linkedin.com")) return "profile";
  if (url.includes("amazon.") || url.includes("shop.") || url.includes("product")) return "product";
  if (url.includes("docs.google") || url.includes("notion")) return "document";
  if (url.endsWith(".pdf")) return "pdf";
  if (title.includes("job") || title.includes("hiring") || url.includes("careers")) return "job";
  if (url.includes("twitter.com") || url.includes("x.com")) return "social";
  if (url.includes("reddit.com")) return "forum";
  return "article";
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_CONTEXT") {
    sendResponse({
      ok: true,
      url: location.href,
      title: document.title,
      selection: getSelectionText(),
      text: getPageText(),
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
      metadata: getPageMetadata(),
      links: getPageLinks(),
      images: getPageImages(),
      pageType: detectPageType(),
      language: document.documentElement.lang || "en",
      charset: document.characterSet,
    });
  }

  if (message.type === "GET_SELECTION") {
    sendResponse({
      ok: true,
      selection: getSelectionText(),
    });
  }
});

export {};
