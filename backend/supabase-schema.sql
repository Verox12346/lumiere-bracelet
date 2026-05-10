-- =============================================
-- LUMIERE BRACELET — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_price TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending_whatsapp' 
    CHECK (status IN ('pending_whatsapp', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Row Level Security (RLS) — only server (service key) can read/write
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Deny all public access (your backend uses service key, bypasses RLS)
CREATE POLICY "No public access to contact_messages" ON contact_messages FOR ALL USING (false);
CREATE POLICY "No public access to orders" ON orders FOR ALL USING (false);
