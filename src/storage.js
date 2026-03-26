import { createClient } from '@supabase/supabase-js'

// ── Configuration ──
// Set these in your Vercel environment variables:
//   VITE_SUPABASE_URL=https://nsbmmxprfnhszblqlivn.supabase.co
//   VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxx
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null

// ── Key-Value Store ──
// Uses a single "kv_store" table with columns: key (text, primary), value (text), updated_at (timestamptz)
// Falls back to localStorage when Supabase is not configured (local dev)

export async function kvGet(key) {
  if (!supabase) {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
  }
  const { data, error } = await supabase
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .single()
  if (error || !data) return null
  return JSON.parse(data.value)
}

export async function kvSet(key, value) {
  const json = JSON.stringify(value)
  if (!supabase) {
    localStorage.setItem(key, json)
    return
  }
  const { error } = await supabase
    .from('kv_store')
    .upsert({ key, value: json, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) console.error('kvSet error:', error)
}

export async function kvDelete(key) {
  if (!supabase) {
    localStorage.removeItem(key)
    return
  }
  await supabase.from('kv_store').delete().eq('key', key)
}

// ── Drop-in replacements for osLoad / osSave ──
export async function osLoad(key, fallback) {
  try {
    const val = await kvGet(key)
    return val !== null ? val : fallback
  } catch {
    return fallback
  }
}

export async function osSave(key, value) {
  try {
    await kvSet(key, value)
  } catch (e) {
    console.error('osSave error:', e)
  }
}

export { supabase }
