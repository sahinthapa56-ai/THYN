/// <reference types="chrome" />

interface LinkedInProfile {
  name: string;
  headline: string | null;
  company: string | null;
  position: string | null;
  location: string | null;
  linkedinUrl: string;
  avatarUrl: string | null;
  summary: string | null;
  experience: Array<{ title: string; company: string; period: string }>;
  education: Array<{ school: string; degree: string; period: string }>;
  skills: string[];
}

function scrapeLinkedInProfile(): LinkedInProfile | null {
  const url = window.location.href;

  // Name
  const nameEl =
    document.querySelector("h1") ||
    document.querySelector('[class*="text-heading-xlarge"]') ||
    document.querySelector('[data-anonymize="person-name"]');
  const name = nameEl?.textContent?.trim() || "";

  if (!name) return null; // Not a profile page

  // Headline
  const headlineEl =
    document.querySelector('[class*="text-body-medium"]') ||
    document.querySelector('[class*="headline"]');
  const headline = headlineEl?.textContent?.trim() || null;

  // Location
  const locationEl =
    document.querySelector('[class*="text-body-small"][class*="inline"]') ||
    document.querySelector('[data-anonymize="location"]');
  const location = locationEl?.textContent?.trim() || null;

  // Avatar
  const avatarEl =
    document.querySelector('img[class*="profile-photo"]') ||
    document.querySelector('img[data-anonymize="profile-picture"]') ||
    document.querySelector('img[class*="pv-top-card-profile-picture"]');
  const avatarUrl = avatarEl?.getAttribute("src") || null;

  // About / Summary
  const summaryEl =
    document.querySelector('[class*="display-flex"][class*="full-width"] p') ||
    document.querySelector('[data-anonymize="summary"]') ||
    document.querySelector("section.summary p") ||
    document.querySelector('[id*="about"] + div p');
  const summary = summaryEl?.textContent?.trim() || null;

  // Company & Position (from top card)
  const companyEl =
    document.querySelector('[data-anonymize="company"]') ||
    document.querySelector('[class*="experience-section"]') ||
    document.querySelector('[class*="pv-top-card--experience-list"]');
  const company = companyEl?.textContent?.trim()?.split("\n")?.[0] || null;

  const positionEl = document.querySelector('[class*="experience-item"] h3') ||
    document.querySelector('[data-anonymize="position"]');
  const position = positionEl?.textContent?.trim() || null;

  // Experience items
  const experience: Array<{ title: string; company: string; period: string }> = [];
  document.querySelectorAll("section.experience-section li, [data-section='experience'] li")
    .forEach((li) => {
      const title = li.querySelector("h3")?.textContent?.trim() || "";
      const companyName = li.querySelector("h4")?.textContent?.trim() || "";
      const period = li.querySelector("[class*='date-range']")?.textContent?.trim() || "";
      if (title) experience.push({ title, company: companyName, period });
    });

  // Education
  const education: Array<{ school: string; degree: string; period: string }> = [];
  document.querySelectorAll("section.education-section li, [data-section='education'] li")
    .forEach((li) => {
      const school = li.querySelector("h3")?.textContent?.trim() || "";
      const degree = li.querySelector("h4")?.textContent?.trim() || "";
      const period = li.querySelector("[class*='date-range']")?.textContent?.trim() || "";
      if (school) education.push({ school, degree, period });
    });

  // Skills
  const skills: string[] = [];
  document.querySelectorAll('[class*="skill"], [data-anonymize="skill"]')
    .forEach((el) => {
      const skill = el.textContent?.trim();
      if (skill) skills.push(skill);
    });

  return {
    name,
    headline,
    company,
    position,
    location,
    linkedinUrl: url.split("?")[0], // clean URL
    avatarUrl,
    summary,
    experience,
    education,
    skills,
  };
}

// Send profile data on page load
const profile = scrapeLinkedInProfile();
if (profile) {
  chrome.runtime.sendMessage({ type: "LINKEDIN_PROFILE", payload: profile });
}

// Re-send on URL changes (SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(() => {
      const updated = scrapeLinkedInProfile();
      if (updated) {
        chrome.runtime.sendMessage({ type: "LINKEDIN_PROFILE", payload: updated });
      }
    }, 2000); // wait for LinkedIn's SPA to render
  }
}).observe(document, { subtree: true, childList: true });

// Respond to ping from side panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_LINKEDIN_PROFILE") {
    const profile = scrapeLinkedInProfile();
    sendResponse({ ok: true, profile });
  }
  return true;
});
