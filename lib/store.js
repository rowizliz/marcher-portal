import { Redis } from "@upstash/redis";

// In development without Upstash, fall back to in-memory store
let redis = null;
let memoryStore = {};

function getRedis() {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }
  return null;
}

// ── Submissions ──

export async function getSubmissions() {
  const r = getRedis();
  if (r) {
    const data = await r.get("submissions");
    return data || [];
  }
  return memoryStore.submissions || [];
}

export async function addSubmission(submission) {
  const subs = await getSubmissions();
  subs.unshift(submission);
  const r = getRedis();
  if (r) {
    await r.set("submissions", subs);
  } else {
    memoryStore.submissions = subs;
  }
  return submission;
}

export async function updateSubmissionStatus(id, status) {
  const subs = await getSubmissions();
  const sub = subs.find((s) => s.id === id);
  if (!sub) return null;
  sub.status = status;
  const r = getRedis();
  if (r) {
    await r.set("submissions", subs);
  } else {
    memoryStore.submissions = subs;
  }
  return sub;
}

// ── Workflow ──

const DEFAULT_WORKFLOW = { current_phase: "week_1", progress: 0, notes: "" };

export async function getWorkflow() {
  const r = getRedis();
  if (r) {
    const data = await r.get("workflow");
    return data || DEFAULT_WORKFLOW;
  }
  return memoryStore.workflow || DEFAULT_WORKFLOW;
}

export async function updateWorkflow(updates) {
  const current = await getWorkflow();
  const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
  const r = getRedis();
  if (r) {
    await r.set("workflow", updated);
  } else {
    memoryStore.workflow = updated;
  }
  return updated;
}

// ── Content (Invoice, Contract, Brief) ──

export async function getContent(docType) {
  const r = getRedis();
  if (r) {
    const data = await r.get(`content_${docType}`);
    return data || null;
  }
  return memoryStore[`content_${docType}`] || null;
}

export async function updateContent(docType, content) {
  const updated = { ...content, updated_at: new Date().toISOString() };
  const r = getRedis();
  if (r) {
    await r.set(`content_${docType}`, updated);
  } else {
    memoryStore[`content_${docType}`] = updated;
  }
  return updated;
}
