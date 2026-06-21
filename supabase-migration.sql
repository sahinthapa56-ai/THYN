-- ============================================================
-- THYN V1 — Supabase Migration: Tables + Row Level Security
-- Run this in your Supabase SQL Editor after creating the project.
-- ============================================================

-- ── Profiles (maps to Supabase Auth users) ─────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  avatar      TEXT,
  "supabaseId" TEXT UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Contacts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "profileId"   TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "linkedinUrl" TEXT NOT NULL,
  name          TEXT NOT NULL,
  headline      TEXT,
  company       TEXT,
  position      TEXT,
  location      TEXT,
  "avatarUrl"   TEXT,
  summary       TEXT,
  tags          TEXT[] DEFAULT '{}',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_linkedin_url UNIQUE ("linkedinUrl")
);

CREATE INDEX IF NOT EXISTS idx_contacts_profile ON public.contacts("profileId");
CREATE INDEX IF NOT EXISTS idx_contacts_linkedin ON public.contacts("linkedinUrl");

-- ── Notes ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "contactId" TEXT NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  "profileId" TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_contact ON public.notes("contactId");
CREATE INDEX IF NOT EXISTS idx_notes_profile ON public.notes("profileId");

-- ── Reminders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reminders (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "contactId" TEXT NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  "profileId" TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  note        TEXT,
  "dueAt"     TIMESTAMPTZ NOT NULL,
  done        BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_contact ON public.reminders("contactId");
CREATE INDEX IF NOT EXISTS idx_reminders_profile ON public.reminders("profileId");
CREATE INDEX IF NOT EXISTS idx_reminders_due ON public.reminders("dueAt");

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

-- ── Profiles ────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ("supabaseId" = auth.uid()::TEXT);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ("supabaseId" = auth.uid()::TEXT);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ("supabaseId" = auth.uid()::TEXT);

-- ── Contacts ─────────────────────────────────────────────
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for backend API)
CREATE POLICY "Service role has full access"
  ON public.contacts FOR ALL
  USING (auth.role() = 'service_role');

-- Auth users can only see their own contacts
CREATE POLICY "Users can view own contacts"
  ON public.contacts FOR SELECT
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can insert own contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can update own contacts"
  ON public.contacts FOR UPDATE
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can delete own contacts"
  ON public.contacts FOR DELETE
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

-- ── Notes ────────────────────────────────────────────────
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access"
  ON public.notes FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own notes"
  ON public.notes FOR SELECT
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can insert own notes"
  ON public.notes FOR INSERT
  WITH CHECK (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can delete own notes"
  ON public.notes FOR DELETE
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

-- ── Reminders ────────────────────────────────────────────
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access"
  ON public.reminders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  USING (
    "profileId" IN (
      SELECT id FROM public.profiles WHERE "supabaseId" = auth.uid()::TEXT
    )
  );

-- ═══════════════════════════════════════════════════════════
-- TRIGGER: auto-update updatedAt on row changes
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_profiles_updated_at'
  ) THEN
    CREATE TRIGGER set_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_contacts_updated_at'
  ) THEN
    CREATE TRIGGER set_contacts_updated_at
      BEFORE UPDATE ON public.contacts
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_notes_updated_at'
  ) THEN
    CREATE TRIGGER set_notes_updated_at
      BEFORE UPDATE ON public.notes
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_reminders_updated_at'
  ) THEN
    CREATE TRIGGER set_reminders_updated_at
      BEFORE UPDATE ON public.reminders
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END;
$$;
