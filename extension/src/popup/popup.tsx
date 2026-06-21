import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001"

interface LinkedInProfile {
  name: string
  headline: string | null
  company: string | null
  position: string | null
  location: string | null
  avatarUrl: string | null
  summary: string | null
  linkedinUrl: string
}

function App() {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try reading directly from storage first
    chrome.storage.local.get("linkedinProfile", (data) => {
      if (data.linkedinProfile) {
        setProfile(data.linkedinProfile)
      } else {
        // Also try messaging background
        chrome.runtime.sendMessage(
          { type: "GET_LINKEDIN_PROFILE" },
          (res) => {
            if (res?.profile) setProfile(res.profile)
          }
        )
      }
    })

    // Check if contact already saved
    chrome.storage.local.get("authToken", async (tokenData) => {
      const token = tokenData.authToken
      if (!token) return

      // Get current tab URL
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const url = tabs[0]?.url || ""
        if (!url.includes("linkedin.com/in/")) return

        try {
          const res = await fetch(
            `${API_BASE}/contacts?linkedinUrl=${encodeURIComponent(url)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          if (res.ok) {
            const data = await res.json()
            if (data.contacts?.length > 0) setSaved(true)
          }
        } catch {}
      })
    })
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)

    const token = await new Promise<string | null>((resolve) => {
      chrome.storage.local.get("authToken", (data) => {
        resolve(data.authToken || null)
      })
    })

    if (!token) {
      setError("No access token. Go to Settings to set one up.")
      setSaving(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `API ${res.status}`)
      }
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        width: "320px",
        padding: "16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, #3B82F6, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 700,
            color: "white",
          }}
        >
          T
        </div>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>
          THYN
        </span>
      </div>

      {/* Profile info */}
      {profile ? (
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #3B82F6, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {profile.name}
              </div>
              {profile.headline && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {profile.headline}
                </div>
              )}
            </div>
            {saved && (
              <div
                style={{
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  fontSize: "10px",
                  color: "#4ADE80",
                  fontWeight: 600,
                }}
              >
                Saved
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {profile.company && <span>{profile.company}</span>}
            {profile.location && (
              <>
                <span>·</span>
                <span>{profile.location}</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "24px 0",
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
          }}
        >
          Loading profile data...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "8px 12px",
            marginBottom: "12px",
            borderRadius: "8px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            fontSize: "12px",
            color: "#F87171",
          }}
        >
          {error}
        </div>
      )}

      {/* Actions */}
      {profile && !saved && (
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#3B82F6",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.5 : 1,
            marginBottom: "8px",
          }}
        >
          {saving ? "Saving..." : "Save to THYN"}
        </button>
      )}

      {saved && (
        <div
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            color: "#4ADE80",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          ✓ Saved to your contacts
        </div>
      )}

      <div
        style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: "11px",
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
        }}
      >
        {profile?.company && (
          <span>
            Data from {profile.company ? `LinkedIn` : "Profile"}
          </span>
        )}
      </div>
    </div>
  )
}

const root = document.getElementById("root")
if (root) {
  root.innerHTML = ""
  createRoot(root).render(<App />)
}
