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

// ── Client Auth ──

export async function getClientPassword() {
  const r = getRedis();
  if (r) {
    return await r.get("client_password");
  }
  return memoryStore.client_password || null;
}

export async function setClientPassword(password) {
  const r = getRedis();
  if (r) {
    await r.set("client_password", password);
  } else {
    memoryStore.client_password = password;
  }
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

// ── Progress Steps ──

const DEFAULT_STEPS = [
  { id: "brief", label: "Trao đổi Brief", status: "pending", client_note: "", admin_note: "" },
  { id: "contract", label: "Ký kết Hợp đồng", status: "pending", client_note: "", admin_note: "" },
  { id: "payment_1", label: "Thanh toán Đợt 1", status: "pending", client_note: "", admin_note: "" },
  { id: "phase_1", label: "Hạng mục 1 — Build Up", status: "pending", client_note: "", admin_note: "" },
  { id: "review_1", label: "Review Hạng mục 1", status: "pending", client_note: "", admin_note: "" },
  { id: "phase_2", label: "Hạng mục 2 — Fix & Custom", status: "pending", client_note: "", admin_note: "" },
  { id: "review_2", label: "Review Hạng mục 2", status: "pending", client_note: "", admin_note: "" },
  { id: "phase_3", label: "Hạng mục 3 — Tối ưu & Deploy", status: "pending", client_note: "", admin_note: "" },
  { id: "review_3", label: "Review Hạng mục 3", status: "pending", client_note: "", admin_note: "" },
  { id: "payment_2", label: "Thanh toán Đợt 2", status: "pending", client_note: "", admin_note: "" },
  { id: "done", label: "Hoàn Thành ✓", status: "pending", client_note: "", admin_note: "" },
];

export async function getProgress() {
  const r = getRedis();
  if (r) {
    const data = await r.get("progress_steps");
    return data || DEFAULT_STEPS;
  }
  return memoryStore.progress_steps || DEFAULT_STEPS;
}

export async function updateProgress(steps) {
  const r = getRedis();
  if (r) {
    await r.set("progress_steps", steps);
  } else {
    memoryStore.progress_steps = steps;
  }
  return steps;
}

// ── Chat ──

export async function getMessages() {
  const r = getRedis();
  if (r) {
    const data = await r.get("chat_messages");
    return data || [];
  }
  return memoryStore.chat_messages || [];
}

export async function addMessage(msg) {
  const msgs = await getMessages();
  msgs.push({ ...msg, id: crypto.randomUUID(), timestamp: new Date().toISOString() });
  // Keep last 200 messages
  const trimmed = msgs.slice(-200);
  const r = getRedis();
  if (r) {
    await r.set("chat_messages", trimmed);
  } else {
    memoryStore.chat_messages = trimmed;
  }
  return trimmed;
}

async function saveMessages(msgs) {
  const r = getRedis();
  if (r) { await r.set("chat_messages", msgs); } else { memoryStore.chat_messages = msgs; }
}

export async function deleteMessage(id) {
  const msgs = await getMessages();
  const filtered = msgs.filter(m => m.id !== id);
  await saveMessages(filtered);
  return filtered;
}

export async function editMessage(id, newText) {
  const msgs = await getMessages();
  const updated = msgs.map(m => m.id === id ? { ...m, text: newText, edited: true } : m);
  await saveMessages(updated);
  return updated;
}

// ── Notifications ──

export async function getNotifications(target) {
  const key = `notifications_${target}`;
  const r = getRedis();
  if (r) {
    const data = await r.get(key);
    return data || [];
  }
  return memoryStore[key] || [];
}

export async function addNotification(target, type, title, message) {
  const key = `notifications_${target}`;
  const notifs = await getNotifications(target);
  notifs.push({ id: crypto.randomUUID(), type, title, message, read: false, timestamp: new Date().toISOString() });
  const trimmed = notifs.slice(-50);
  const r = getRedis();
  if (r) { await r.set(key, trimmed); } else { memoryStore[key] = trimmed; }
  return trimmed;
}

export async function markNotificationsRead(target) {
  const key = `notifications_${target}`;
  const notifs = await getNotifications(target);
  const updated = notifs.map(n => ({ ...n, read: true }));
  const r = getRedis();
  if (r) { await r.set(key, updated); } else { memoryStore[key] = updated; }
  return updated;
}
