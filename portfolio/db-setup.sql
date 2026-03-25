-- Run this once in the Netlify Neon database console to create the table.
-- The serverless function also auto-creates it on first request, so this is optional.

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for browsing submissions by date
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions (created_at DESC);
