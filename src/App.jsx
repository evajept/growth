import React, { useState, useEffect, useRef } from "react";
import { osLoad, osSave } from "./storage.js";

const C = {
  bg: "#ffffff", bgS: "#f7f7f5",
  tx: "#37352f", txS: "#787774", txT: "#b4b4b0",
  bdr: "#e9e9e7", bdrH: "#d3d3d0",
  blue: "#2eaadc", blueBg: "#d3e5ef",
  red: "#e03e3e", redBg: "#fbe4e4",
  green: "#0f7b6c", greenBg: "#dbeddb",
  yellow: "#dfab01", yellowBg: "#fdecc8",
  purple: "#6940a5", purpleBg: "#e8deee",
  orange: "#d9730d", orangeBg: "#fadec9",
  pink: "#ad1a72", pinkBg: "#f4dfeb",
  coral: "#D85A30", coralBg: "#FAECE7",
  teal: "#0F6E56", tealBg: "#E1F5EE",
};
const F = {
  serif: '"Charter","Georgia","Cambria",serif',
  sans: 'system-ui,-apple-system,"Segoe UI",sans-serif',
  mono: '"SFMono-Regular","Menlo","Consolas",monospace',
};

// ── Shared components ──
const Tag = ({ children, color }) => {
  const m = { blue: { bg: C.blueBg, c: C.blue }, green: { bg: C.greenBg, c: C.green }, red: { bg: C.redBg, c: C.red }, yellow: { bg: C.yellowBg, c: "#856d0a" }, purple: { bg: C.purpleBg, c: C.purple }, orange: { bg: C.orangeBg, c: C.orange }, pink: { bg: C.pinkBg, c: C.pink }, coral: { bg: C.coralBg, c: C.coral }, teal: { bg: C.tealBg, c: C.teal } };
  const s = m[color] || { bg: C.bgS, c: C.tx };
  return (<span style={{ display: "inline-flex", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontFamily: F.sans, fontWeight: 500, background: s.bg, color: s.c, lineHeight: "20px", whiteSpace: "nowrap" }}>{children}</span>);
};
const Pill = ({ children, color, bg }) => (<span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4, background: bg || C.bgS, color: color || C.tx, fontFamily: F.sans }}>{children}</span>);

// ── Confidence chips ──
const CONF_LEVELS = [
  { key: "no_idea", label: "no idea", bg: C.bgS, color: C.txT },
  { key: "learning", label: "learning", bg: C.yellowBg, color: "#856d0a" },
  { key: "learned", label: "learned", bg: C.blueBg, color: "#185FA5" },
  { key: "applied", label: "applied", bg: C.purpleBg, color: C.purple },
  { key: "confident", label: "confident", bg: C.greenBg, color: C.green },
];
const ConfChip = ({ level, onClick }) => {
  const conf = CONF_LEVELS.find((c) => c.key === level) || CONF_LEVELS[0];
  return (<span onClick={onClick} style={{ fontSize: 10, fontWeight: 500, padding: "2px 10px", borderRadius: 10, background: conf.bg, color: conf.color, whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", fontFamily: F.sans, flexShrink: 0 }}>{conf.label}</span>);
};
const Check = ({ checked, onClick }) => {
  if (checked) return (<div onClick={onClick} style={{ width: 13, height: 13, borderRadius: 3, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><svg width="7" height="5" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>);
  return <div onClick={onClick} style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${C.bdrH}`, cursor: "pointer", flexShrink: 0 }} />;
};

// ── Build status chips ──
const BUILD_LEVELS = [
  { key: "none", label: "none", bg: C.bgS, color: C.txT },
  { key: "building", label: "building", bg: C.yellowBg, color: "#856d0a" },
  { key: "testing", label: "testing", bg: C.blueBg, color: "#185FA5" },
  { key: "fixing", label: "fixing", bg: C.orangeBg, color: C.orange },
  { key: "shipped", label: "shipped", bg: C.greenBg, color: C.green },
  { key: "update", label: "updated", bg: C.purpleBg, color: C.purple },
];
const BuildChip = ({ level, onClick }) => {
  const s = BUILD_LEVELS.find((c) => c.key === level) || BUILD_LEVELS[0];
  return (<span onClick={onClick} style={{ fontSize: 10, fontWeight: 500, padding: "2px 10px", borderRadius: 10, background: s.bg, color: s.color, whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", fontFamily: F.sans, flexShrink: 0 }}>{s.label}</span>);
};

// ── Data ──
const TAG_COLORS = { red: { bg: C.redBg, c: C.red }, orange: { bg: C.orangeBg, c: C.orange }, green: { bg: C.greenBg, c: C.green }, purple: { bg: C.purpleBg, c: C.purple } };

const GP_PHASES = [
  { id: "p1", ph: "Phase 1", title: "Foundation Sprint", wk: "Week 1-3", color: "red", desc: "Learn API + Claude Code by rebuilding Evalynn OS.",
    actions: [
      { id: "a1", text: "Set up project. Install Claude Code", done: false },
      { id: "a2", text: "First API call - hello world", done: false },
      { id: "a3", text: "Rebuild Health module - streaming, structured output", done: false },
      { id: "a4", text: "Claude Code as dev tool. CLAUDE.md. Slash commands", done: false },
      { id: "a5", text: "JSON schemas. Error handling. Retry patterns", done: false },
    ],
    skills: [
      { id: "s1", text: "Prompt engineering fundamentals", conf: "no_idea" },
      { id: "s2", text: "Claude Code configuration", conf: "no_idea" },
      { id: "s3", text: "API streaming & structured output", conf: "no_idea" },
      { id: "s4", text: "Error handling & retry patterns", conf: "no_idea" },
    ],
    courses: ["Building with Claude API (8.1 hrs)", "Claude Code in Action (~3 hrs)"],
    dom: ["Prompt Engineering (20%)", "Claude Code Config (20%)"], ms: "Working app on Claude API, built with Claude Code." },
  { id: "p2", ph: "Phase 2", title: "Integration Sprint", wk: "Week 4-6", color: "orange", desc: "Wire app to real data through MCP. Add tool use.",
    actions: [
      { id: "b1", text: "MCP server to Google Sheets", done: false },
      { id: "b2", text: "Tool use - live data, calculations", done: false },
      { id: "b3", text: "Evalynn OS rules as Agent Skills", done: false },
      { id: "b4", text: "End-to-end testing", done: false },
    ],
    skills: [
      { id: "s5", text: "MCP server setup & connection", conf: "no_idea" },
      { id: "s6", text: "Tool use design patterns", conf: "no_idea" },
      { id: "s7", text: "Agent Skills configuration", conf: "no_idea" },
    ],
    courses: ["Intro to MCP (~2 hrs)", "Agent Skills (~2 hrs)", "GitHub: Tool Use (Self-paced)"],
    dom: ["Tool Design & MCP (18%)"], ms: "Live MCP connections, tool calling, Skills." },
  { id: "p3", ph: "Phase 3", title: "Architecture Sprint", wk: "Week 7-9", color: "green", desc: "Multi-agent orchestration. Highest CCA weight.",
    actions: [
      { id: "c1", text: "Sub-agents: Health, Finance, Career, Identity, Lifestyle, Relationship, Soul", done: false },
      { id: "c2", text: "Hub-and-spoke coordinator. Handoffs", done: false },
      { id: "c3", text: "HITL checkpoints. Graceful degradation", done: false },
    ],
    skills: [
      { id: "s8", text: "Multi-agent orchestration", conf: "no_idea" },
      { id: "s9", text: "Sub-agent delegation patterns", conf: "no_idea" },
      { id: "s10", text: "Human-in-the-loop design", conf: "no_idea" },
      { id: "s11", text: "Context management & reliability", conf: "no_idea" },
    ],
    courses: ["MCP Advanced (~3 hrs)", "Sub-agents (~2 hrs)"],
    dom: ["Agentic Architecture (27%)", "Context & Reliability (15%)"], ms: "Multi-agent system. All 5 CCA domains covered." },
  { id: "p4", ph: "Phase 4", title: "Cert + Portfolio", wk: "Week 10-12", color: "purple", desc: "Polish, anti-patterns, take the CCA.",
    actions: [
      { id: "d1", text: "Polish app. README. Deploy", done: false },
      { id: "d2", text: "Record demo video", done: false },
      { id: "d3", text: "Anti-patterns and exam scenarios", done: false },
      { id: "d4", text: "Take the CCA exam", done: false },
    ],
    skills: [
      { id: "s12", text: "Enterprise deployment patterns", conf: "no_idea" },
      { id: "s13", text: "Anti-pattern recognition", conf: "no_idea" },
      { id: "s14", text: "Portfolio presentation", conf: "no_idea" },
    ],
    courses: ["Enterprise Adoption (~2 hrs)", "Train-the-Trainer (~2 hrs)", "CCA Prep (~5 hrs)"],
    dom: ["All 5 domains - review"], ms: "CCA certified. Portfolio deployed." },
];

const AGENTS = [
  { id: "health", name: "Health Officer", tagColor: "coral", mode: "Dashboard + push",
    roles: ["Nutritionist", "Wellness consultant", "Supplement pharmacist", "Fitness coach", "Body image support"],
    courses: ["Building with Claude API (8.1 hrs)", "Intro to MCP (~2 hrs)", "Sub-agents (~2 hrs)"],
    domains: ["Prompt Engineering (20%)", "Tool Design & MCP (18%)", "Agentic Architecture (27%)"],
    dataExists: ["Golden Era sheet (Angkhana)", "Habit tracker (sleep, movement, water, vitamins)", "Supplement protocol knowledge"],
    dataMissing: [
      { id: "h1", text: "Daily body check-in (energy 1-5, sleep hrs, mood)" },
      { id: "h2", text: "Supplement intake log (tap to confirm)" },
      { id: "h3", text: "Food intake category (protein/carb/delivery/home)" },
      { id: "h4", text: "Cycle tracking" },
      { id: "h5", text: "Health test results (blood work, thyroid)" },
      { id: "h6", text: "Personal metabolic sheet (like Golden Era for you)" },
    ],
    steps: [
      { id: "hs1", text: "Build data input UIs (habit tracker + metrics + protocol)", skills: ["s3"] },
      { id: "hs1b", text: "Deploy to Supabase + Vercel (permanent storage + live app)", skills: ["s5"] },
      { id: "hs2", text: "First Claude API call - send 7 days of habits, get pattern analysis", skills: ["s3", "s4"] },
      { id: "hs3", text: "Structured output - API returns JSON with scores, flags, recommendation", skills: ["s3", "s1"] },
      { id: "hs4", text: "Error handling - retry when API fails, graceful fallback", skills: ["s4"] },
      { id: "hs6", text: "Tool use - Health Officer reads Supabase data, calculates trends", skills: ["s6"] },
      { id: "hs7", text: "First proactive alert - berberine skipped + glucose trending up", skills: ["s6", "s9"] },
      { id: "hs8", text: "Cross-agent query - ask Career Officer about stress sprint correlation", skills: ["s9"] },
      { id: "hs9", text: "Weekly health summary - auto-generated report of the week", skills: ["s3", "s6"] },
    ],
    skillRefs: ["s3", "s4", "s5", "s6", "s9"],
    voice: "Glucose trending up 3 entries. Habit log: berberine skipped twice. Career agent says mid-sprint. Take the berberine, eat protein, walk 20 minutes." },
  { id: "finance", name: "Finance Officer", tagColor: "yellow", mode: "Silent tool + alerts",
    roles: ["Bookkeeper", "Budget analyst", "Financial coach", "Income optimizer"],
    courses: ["Building with Claude API (8.1 hrs)", "Intro to MCP (~2 hrs)", "Agent Skills (~2 hrs)"],
    domains: ["Prompt Engineering (20%)", "Tool Design & MCP (18%)"],
    dataExists: ["Finance 2026 sheet", "Income tracker (streams/rates/hours)", "Monthly report table", "Debt tracking"],
    dataMissing: [
      { id: "f1", text: "Transaction log (amount, category, note)" },
      { id: "f2", text: "Recurring expenses list" },
      { id: "f3", text: "Financial goals with timelines" },
      { id: "f4", text: "Income received log (actual payments, date)" },
    ],
    steps: [
      { id: "fs1", text: "Build transaction log UI (amount, category, note)", skills: ["s1"] },
      { id: "fs2", text: "MCP to Finance 2026 Google Sheet", skills: ["s5"] },
      { id: "fs3", text: "Tool use - auto-categorize transactions, calculate monthly totals", skills: ["s6"] },
      { id: "fs4", text: "Agent Skill - spending pattern analysis as reusable skill", skills: ["s7"] },
      { id: "fs5", text: "Silent bookkeeping - auto-log without prompting", skills: ["s7"] },
      { id: "fs6", text: "Spending alert - food delivery up 40%, correlate with Reflection", skills: ["s6", "s1"] },
      { id: "fs7", text: "Income projection tool - weighted estimate across streams", skills: ["s6"] },
    ],
    skillRefs: ["s1", "s5", "s6", "s7"],
    voice: "Food delivery up 40% this month. Correlates with the burnout week in Reflection. Pattern, not laziness. But costs B12,000/month." },
  { id: "career", name: "Career Officer", tagColor: "teal", mode: "Dashboard + chat",
    roles: ["Career strategist", "Mentor", "Income optimizer", "Skill tracker", "Decision guide"],
    courses: ["Claude Code in Action (~3 hrs)", "Intro to MCP (~2 hrs)", "GitHub: Tool Use", "MCP Advanced (~3 hrs)"],
    domains: ["Claude Code Config (20%)", "Tool Design & MCP (18%)", "Agentic Architecture (27%)"],
    dataExists: ["Income tracker", "Growth Path (CCA phases)", "Career Compass (dual-path)", "Growth timelines"],
    dataMissing: [
      { id: "c1", text: "Daily time log (project, hours, stream)" },
      { id: "c2", text: "Project tracker (active projects, status, deadlines)" },
      { id: "c3", text: "Application/opportunity tracker" },
      { id: "c4", text: "Win log (quick capture of achievements)" },
    ],
    steps: [
      { id: "cs1", text: "Set up Claude Code for Evalynn OS project - CLAUDE.md, slash commands", skills: ["s2"] },
      { id: "cs2", text: "MCP to income/time tracking sheet", skills: ["s5"] },
      { id: "cs3", text: "Tool use - calculate weighted income projections", skills: ["s6"] },
      { id: "cs4", text: "CCA progress monitor - read Growth Path data, flag stalled skills", skills: ["s6"] },
      { id: "cs5", text: "Career decision framework - should I take this project? (multi-factor)", skills: ["s8"] },
      { id: "cs6", text: "Cross-agent - query Health Officer for energy-output correlation", skills: ["s8"] },
      { id: "cs7", text: "Mentor voice - rate floor enforcement, strategic nudges", skills: ["s1"] },
    ],
    skillRefs: ["s2", "s5", "s6", "s8"],
    voice: "Declining Scale projects for 3 weeks. Reflection mentions stagnation. Onyx pays 3x more per hour. Fewer hours, higher rate, more CCA time." },
  { id: "identity", name: "Identity Officer", tagColor: "pink", mode: "Deep chat",
    roles: ["Psychologist", "Pattern recognition", "Mirror holder", "Values auditor", "Processing companion"],
    courses: ["Building with Claude API (8.1 hrs)", "MCP Advanced (~3 hrs)", "Sub-agents (~2 hrs)"],
    domains: ["Prompt Engineering (20%)", "Agentic Architecture (27%)"],
    dataExists: ["Identity matrix (8 dimensions)", "Cause-effect journal", "Seven operating rules", "Life Compass", "Values framework"],
    dataMissing: [
      { id: "i1", text: "Quick pattern note (spotted a pattern, held a boundary)" },
      { id: "i2", text: "Values alignment check (periodic)" },
      { id: "i3", text: "Sovereign matrix score time series" },
    ],
    steps: [
      { id: "is1", text: "System prompt - Identity Officer persona with your values, rules, patterns", skills: ["s1"] },
      { id: "is2", text: "Feed cause-effect journal entries for pattern analysis", skills: ["s1", "s8"] },
      { id: "is3", text: "Values-behavior audit - pull data from ALL agents, check alignment", skills: ["s8", "s11"] },
      { id: "is4", text: "HITL checkpoint - confirm before any identity-level insight is stored", skills: ["s10"] },
      { id: "is5", text: "Pattern detection - fawn/fight/flight correlation across modules", skills: ["s11"] },
      { id: "is6", text: "Weekly alignment score with specific examples", skills: ["s8", "s1"] },
    ],
    skillRefs: ["s1", "s8", "s11", "s10"],
    voice: "You said autonomy is top value. This week: 3 unquestioned tasks, skipped meditation 4 days, texted someone you decided to stop texting. What's underneath?" },
  { id: "lifestyle", name: "Lifestyle Officer", tagColor: "blue", mode: "Companion + planner",
    roles: ["Daily planner", "Rotation awareness", "Reset day nudger", "Environment manager", "Habit orchestrator"],
    courses: ["Agent Skills (~2 hrs)", "Sub-agents (~2 hrs)", "MCP Advanced (~3 hrs)"],
    domains: ["Tool Design & MCP (18%)", "Agentic Architecture (27%)"],
    dataExists: ["Habit tracker", "Goals with practices", "Rotation concept (build/music/write/reflect)"],
    dataMissing: [
      { id: "l1", text: "Day type tag (build/music/write/reflect/rest)" },
      { id: "l2", text: "Joy/nourishment log (quick note)" },
      { id: "l3", text: "Environment check (space clean? yes/no)" },
    ],
    steps: [
      { id: "ls1", text: "Agent Skill - morning briefing pulls from all agents", skills: ["s7"] },
      { id: "ls2", text: "Rotation tracker - count consecutive build days, trigger rest nudge", skills: ["s9"] },
      { id: "ls3", text: "Energy-based planning - read Health data, suggest day type", skills: ["s9", "s11"] },
      { id: "ls4", text: "Context window - synthesize week of data into compact summary", skills: ["s11"] },
    ],
    skillRefs: ["s7", "s9", "s11"],
    voice: "Good morning. Build mode 8 days straight. Sleep dropped to 5.5 hours. Today is not a build day. Massage, slow food, maybe Muffin Diaries if it flows." },
  { id: "relationship", name: "Relationship Officer", tagColor: "purple", mode: "Coach + girlfriend",
    roles: ["Attachment coach", "24-hour rule enforcer", "Connection tracker", "Boundary monitor", "Girlfriend to giggle with"],
    courses: ["Building with Claude API (8.1 hrs)", "Sub-agents (~2 hrs)"],
    domains: ["Prompt Engineering (20%)", "Agentic Architecture (27%)"],
    dataExists: ["Cause-effect journal", "Attachment pattern knowledge", "Operating rules (24-hr rule, Venus awareness)"],
    dataMissing: [
      { id: "r1", text: "Connection log (who, quality: nourishing/neutral/draining)" },
      { id: "r2", text: "Boundary tracker (held/crossed)" },
      { id: "r3", text: "Impulse check-in button (before acting)" },
    ],
    steps: [
      { id: "rs1", text: "System prompt - dual mode (coach vs girlfriend), attachment-aware", skills: ["s1"] },
      { id: "rs2", text: "24-hour rule tool - intercept impulse, delay, check back", skills: ["s9"] },
      { id: "rs3", text: "HITL - confirm before any relationship action advice", skills: ["s10"] },
      { id: "rs4", text: "Pattern feed from Identity Officer - attachment triggers", skills: ["s9"] },
    ],
    skillRefs: ["s1", "s9", "s10"],
    voice: "You're thinking about texting him. Check your body - what does your stomach feel like? Yeah. That's not connection. That's anxiety wearing a connection costume." },
  { id: "soul", name: "Soul Officer / Astrologer", tagColor: "purple", mode: "Guidance + transit push",
    roles: ["Transit-aware guidance", "Timing advisor", "Context-enriched readings", "Pattern matcher", "Eclipse/cazimi alerts"],
    courses: ["Agent Skills (~2 hrs)", "MCP Advanced (~3 hrs)", "Enterprise Adoption (~2 hrs)"],
    domains: ["Tool Design & MCP (18%)", "Agentic Architecture (27%)", "Context Mgmt & Reliability (15%)"],
    dataExists: ["Full natal chart", "2026 transit calendar", "Three-act year overview", "Prediction vs reality tracking"],
    dataMissing: [
      { id: "s1t", text: "Intention tracking (new moon seeds, unfolding)" },
      { id: "s2t", text: "Transit-to-reality correlation log" },
    ],
    steps: [
      { id: "ss1", text: "Agent Skill - transit-aware context injection (today's astro + all agent data)", skills: ["s7"] },
      { id: "ss2", text: "Context-enriched reading - combine transit with actual life data", skills: ["s8", "s11"] },
      { id: "ss3", text: "Push notifications - eclipse/cazimi/major transit alerts", skills: ["s11"] },
      { id: "ss4", text: "Enterprise patterns - reliable scheduling, graceful degradation", skills: ["s12"] },
      { id: "ss5", text: "Deploy and polish the full multi-agent system", skills: ["s12"] },
    ],
    skillRefs: ["s7", "s8", "s11", "s12"],
    voice: "Saturn cazimi tomorrow. Career agent says CCA stalled for a week. Saturn is asking you to commit. Set the date, block the calendar, begin." },
];

const PHASE_WEEKS = [0, 3, 6, 9];

// ── Learning Plan tab (C1 layout) ──
function LearningPlan({ startDate, setStartDate, data, setData }) {
  const getDateRange = (phIdx) => {
    if (!startDate) return null;
    const sd = new Date(startDate);
    const ws = new Date(sd); ws.setDate(ws.getDate() + PHASE_WEEKS[phIdx] * 7);
    const we = new Date(ws); we.setDate(we.getDate() + 20);
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return fmt(ws) + " - " + fmt(we);
  };
  const getActions = (ph) => data[ph.id]?.actions || ph.actions;
  const getSkills = (ph) => data[ph.id]?.skills || ph.skills;
  const updAction = (phId, aId) => {
    const ph = GP_PHASES.find((p) => p.id === phId);
    const cur = data[phId]?.actions || ph.actions;
    const upd = cur.map((a) => (a.id === aId ? { ...a, done: !a.done } : a));
    setData((p) => ({ ...p, [phId]: { ...p[phId], actions: upd } }));
  };
  const cycleConf = (phId, sId) => {
    const ph = GP_PHASES.find((p) => p.id === phId);
    const cur = data[phId]?.skills || ph.skills;
    const upd = cur.map((s) => {
      if (s.id !== sId) return s;
      const idx = CONF_LEVELS.findIndex((c) => c.key === s.conf);
      return { ...s, conf: CONF_LEVELS[(idx + 1) % CONF_LEVELS.length].key };
    });
    setData((p) => ({ ...p, [phId]: { ...p[phId], skills: upd } }));
  };
  const totalActions = GP_PHASES.reduce((s, ph) => s + getActions(ph).length, 0);
  const doneActions = GP_PHASES.reduce((s, ph) => s + getActions(ph).filter((a) => a.done).length, 0);
  const totalSkills = GP_PHASES.reduce((s, ph) => s + getSkills(ph).length, 0);
  const confSkills = GP_PHASES.reduce((s, ph) => s + getSkills(ph).filter((a) => a.conf === "confident").length, 0);

  return (<div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
      {[{ l: "Actions", v: `${doneActions}/${totalActions} done`, c: doneActions === totalActions ? C.green : C.orange },
        { l: "Skills confident", v: `${confSkills}/${totalSkills}`, c: confSkills === totalSkills ? C.green : C.txS },
        { l: "Portfolio", v: "App + README + Demo video", c: C.txS }
      ].map((g, i) => (<div key={i} style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{g.l}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: g.c }}>{g.v}</div>
      </div>))}
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: C.txS }}>Start date</span>
        <input type="date" value={startDate || ""} onChange={(e) => setStartDate(e.target.value)} style={{ border: `1px solid ${C.bdr}`, borderRadius: 3, padding: "4px 8px", fontFamily: F.sans, fontSize: 12, color: C.tx, background: "transparent", outline: "none" }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: C.txT }}>Skill confidence (click to cycle):</span>
      {CONF_LEVELS.map((c) => (<span key={c.key} style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: c.bg, color: c.color, fontFamily: F.sans }}>{c.label}</span>))}
    </div>
    {GP_PHASES.map((ph, phIdx) => {
      const acts = getActions(ph); const skls = getSkills(ph); const dr = getDateRange(phIdx);
      return (<div key={ph.id} style={{ marginBottom: 0 }}>
        <div style={{ background: C.bgS, padding: "12px 16px", borderTop: phIdx === 0 ? `1px solid ${C.bdr}` : "none", borderBottom: `1px solid ${C.bdr}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <Tag color={ph.color}>{ph.ph}</Tag>
            <span style={{ fontFamily: F.sans, fontSize: 14, fontWeight: 600, color: C.tx }}>{ph.title}</span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: C.txS }}>{ph.wk}{dr && <span style={{ marginLeft: 6, fontSize: 11, color: C.txT }}>{dr}</span>}</span>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
            {ph.courses.map((c, i) => (<Pill key={i} color="#185FA5" bg={C.blueBg}>{c}</Pill>))}
            {ph.dom.map((d, i) => (<Pill key={"d" + i} color={C.purple} bg={C.purpleBg}>{d}</Pill>))}
          </div>
          <div style={{ fontSize: 11, color: C.txS }}>Milestone: {ph.ms}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0 6px" }}>Actions</div>
            {acts.map((a) => (<div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
              <Check checked={a.done} onClick={() => updAction(ph.id, a.id)} />
              <span style={{ fontSize: 13, fontFamily: F.sans, color: a.done ? C.txT : C.tx, textDecoration: a.done ? "line-through" : "none", lineHeight: 1.45 }}>{a.text}</span>
            </div>))}
          </div>
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em" }}>Skills to build</span>
              <span style={{ fontSize: 10, color: C.txT }}>confidence</span>
            </div>
            {skls.map((s) => (<div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
              <span style={{ fontSize: 13, fontFamily: F.sans, color: C.tx, lineHeight: 1.45 }}>{s.text}</span>
              <ConfChip level={s.conf} onClick={() => cycleConf(ph.id, s.id)} />
            </div>))}
          </div>
        </div>
        {phIdx < GP_PHASES.length - 1 && <div style={{ height: 20 }} />}
      </div>);
    })}
  </div>);
}

// ── Product Blueprint tab ──
function ProductBlueprint({ agentData, setAgentData, data, setData }) {
  // Resolve skill IDs to actual skill objects from GP_PHASES, reading confidence from shared data
  const allSkills = GP_PHASES.flatMap((ph) => {
    const saved = data[ph.id]?.skills || ph.skills;
    return saved.map((s) => ({ ...s, phaseId: ph.id, phaseColor: ph.color, phaseName: ph.ph }));
  });
  const getSkillById = (sId) => allSkills.find((s) => s.id === sId);
  const cycleSkillConf = (phId, sId) => {
    const ph = GP_PHASES.find((p) => p.id === phId);
    const cur = data[phId]?.skills || ph.skills;
    const upd = cur.map((s) => {
      if (s.id !== sId) return s;
      const idx = CONF_LEVELS.findIndex((c) => c.key === s.conf);
      return { ...s, conf: CONF_LEVELS[(idx + 1) % CONF_LEVELS.length].key };
    });
    setData((p) => ({ ...p, [phId]: { ...p[phId], skills: upd } }));
  };
  const cycleBuild = (agentId, itemId) => {
    const cur = agentData[agentId] || {};
    const items = cur.items || {};
    const level = items[itemId] || "none";
    const idx = BUILD_LEVELS.findIndex((b) => b.key === level);
    const next = BUILD_LEVELS[(idx + 1) % BUILD_LEVELS.length].key;
    setAgentData((p) => ({ ...p, [agentId]: { ...p[agentId], items: { ...(p[agentId]?.items || {}), [itemId]: next } } }));
  };
  const getBuildLevel = (agentId, itemId) => (agentData[agentId]?.items || {})[itemId] || "none";

  const builtItems = AGENTS.reduce((s, a) => s + a.dataMissing.length + a.dataExists.length, 0);
  const doneItems = AGENTS.reduce((s, a) => {
    const missingDone = a.dataMissing.filter((d) => { const l = getBuildLevel(a.id, d.id); return l === "shipped" || l === "update"; }).length;
    const existDone = a.dataExists.filter((d, i) => { const l = getBuildLevel(a.id, "e_" + i); return l === "shipped" || l === "update" || l === "none"; }).length;
    return s + missingDone + existDone;
  }, 0);

  return (<div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
      {[{ l: "Agents", v: "7", c: C.purple }, { l: "Data tools", v: `${doneItems}/${builtItems}`, c: doneItems === builtItems ? C.green : C.orange }, { l: "Daily input goal", v: "< 2 min total", c: C.txS }
      ].map((g, i) => (<div key={i} style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{g.l}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: g.c }}>{g.v}</div>
      </div>))}
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: C.txT }}>Build status (click to cycle):</span>
      {BUILD_LEVELS.map((c) => (<span key={c.key} style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 10, background: c.bg, color: c.color, fontFamily: F.sans }}>{c.label}</span>))}
    </div>

    {AGENTS.map((agent) => {
      const resolvedSkills = (agent.skillRefs || []).map(getSkillById).filter(Boolean);
      return (
      <div key={agent.id} style={{ marginBottom: 0 }}>
        <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <Tag color={agent.tagColor}>{agent.name}</Tag>
            <span style={{ fontSize: 12, color: C.txS }}>{agent.mode}</span>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {agent.roles.map((r, i) => (<Pill key={i} color={C.txS} bg={C.bgS}>{r}</Pill>))}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
            {(agent.courses || []).map((c, i) => (<Pill key={"c" + i} color="#185FA5" bg={C.blueBg}>{c}</Pill>))}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
            {(agent.domains || []).map((d, i) => (<Pill key={"d" + i} color={C.purple} bg={C.purpleBg}>{d}</Pill>))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em" }}>Data to build</span>
              <span style={{ fontSize: 10, color: C.txT }}>status</span>
            </div>
            {agent.dataMissing.map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                <span style={{ fontSize: 13, fontFamily: F.sans, color: C.tx, lineHeight: 1.45 }}>{d.text}</span>
                <BuildChip level={getBuildLevel(agent.id, d.id)} onClick={() => cycleBuild(agent.id, d.id)} />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 6px", marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em" }}>Data exists</span>
              <span style={{ fontSize: 10, color: C.txT }}>status</span>
            </div>
            {agent.dataExists.map((d, i) => (
              <div key={"e" + i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                <span style={{ fontSize: 13, fontFamily: F.sans, color: C.txS, lineHeight: 1.45 }}>{d}</span>
                <BuildChip level={getBuildLevel(agent.id, "e_" + i)} onClick={() => cycleBuild(agent.id, "e_" + i)} />
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0 6px" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em" }}>Skills needed</span>
              <span style={{ fontSize: 10, color: C.txT }}>confidence</span>
            </div>
            {resolvedSkills.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                <span style={{ fontSize: 13, fontFamily: F.sans, color: C.tx, lineHeight: 1.45 }}>{s.text}</span>
                <ConfChip level={s.conf} onClick={() => cycleSkillConf(s.phaseId, s.id)} />
              </div>
            ))}
          </div>
        </div>
        {/* Learning journey steps - always visible */}
        {(agent.steps || []).length > 0 && (() => {
          const getStepConf = (stepId) => (agentData[agent.id]?.stepConf || {})[stepId] || "no_idea";
          const cycleStepConf = (stepId) => {
            const cur = getStepConf(stepId);
            const idx = CONF_LEVELS.findIndex((c) => c.key === cur);
            const next = CONF_LEVELS[(idx + 1) % CONF_LEVELS.length].key;
            setAgentData((p) => ({ ...p, [agent.id]: { ...p[agent.id], stepConf: { ...(p[agent.id]?.stepConf || {}), [stepId]: next } } }));
          };
          const doneSteps = (agent.steps || []).filter((s) => getStepConf(s.id) === "confident").length;
          return (
            <div style={{ borderBottom: `1px solid ${C.bdr}` }}>
              <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, background: C.bgS }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em" }}>Learning journey</span>
                <span style={{ fontSize: 11, color: doneSteps === agent.steps.length ? C.green : C.txT, marginLeft: "auto" }}>{doneSteps}/{agent.steps.length}</span>
              </div>
              <div style={{ padding: "0 16px 8px" }}>
                {agent.steps.map((step, stepIdx) => (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.txT, minWidth: 18, textAlign: "right", fontFamily: F.mono, flexShrink: 0 }}>{stepIdx + 1}.</span>
                    <span style={{ fontSize: 13, fontFamily: F.sans, color: C.tx, flex: 1, lineHeight: 1.45 }}>{step.text}</span>
                    <ConfChip level={getStepConf(step.id)} onClick={() => cycleStepConf(step.id)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        <div style={{ padding: "8px 16px 12px", borderBottom: `1px solid ${C.bdr}` }}>
          <div style={{ fontSize: 12, color: C.txS, fontStyle: "italic", lineHeight: 1.5 }}>"{agent.voice}"</div>
        </div>
        <div style={{ height: 12 }} />
      </div>
    );})}
  </div>);
}

// ── Notes tab ──
function NotesTab({ notes, setNotes }) {
  const [activeNote, setActiveNote] = useState(null);
  const addNote = () => {
    const id = "n" + Date.now();
    const newNote = { id, title: "New note", content: "", created: new Date().toISOString(), tags: [] };
    setNotes((p) => [newNote, ...p]);
    setActiveNote(id);
  };
  const updateNote = (id, field, val) => setNotes((p) => p.map((n) => n.id === id ? { ...n, [field]: val } : n));
  const deleteNote = (id) => { setNotes((p) => p.filter((n) => n.id !== id)); if (activeNote === id) setActiveNote(null); };
  const active = notes.find((n) => n.id === activeNote);

  return (<div style={{ display: "flex", gap: 20, minHeight: 400 }}>
    <div style={{ width: 220, flexShrink: 0 }}>
      <button onClick={addNote} style={{ width: "100%", padding: "9px 18px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: F.sans, background: C.green, color: "#fff", marginBottom: 12 }}>+ New note</button>
      <div style={{ fontSize: 11, color: C.txT, marginBottom: 8 }}>{notes.length} notes</div>
      {notes.map((n) => (
        <div key={n.id} onClick={() => setActiveNote(n.id)} style={{
          border: `1px solid ${activeNote === n.id ? C.green : C.bdr}`, borderRadius: 4,
          padding: "8px 10px", marginBottom: 6, cursor: "pointer",
          background: activeNote === n.id ? C.bgS : C.bg,
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.tx, marginBottom: 2 }}>{n.title || "Untitled"}</div>
          <div style={{ fontSize: 10, color: C.txT }}>{new Date(n.created).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
          {n.tags && n.tags.length > 0 && (
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
              {n.tags.map((t, i) => (<span key={i} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: C.purpleBg, color: C.purple }}>{t}</span>))}
            </div>
          )}
        </div>
      ))}
    </div>
    <div style={{ flex: 1 }}>
      {!active ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div style={{ fontSize: 14, color: C.txT, marginBottom: 8 }}>Select a note or create a new one</div>
          <div style={{ fontSize: 12, color: C.txT }}>Use this space to document how-to processes, steps you've done, and reference material you want to come back to.</div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <input
              value={active.title}
              onChange={(e) => updateNote(active.id, "title", e.target.value)}
              style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 700, color: C.tx, border: "none", outline: "none", background: "transparent", width: "100%", padding: 0 }}
              placeholder="Note title..."
            />
            <button onClick={() => { if (confirm("Delete this note?")) deleteNote(active.id); }} style={{ padding: "4px 12px", borderRadius: 4, border: `1px solid ${C.bdr}`, background: "none", fontSize: 12, color: C.red, cursor: "pointer", fontFamily: F.sans, flexShrink: 0, marginLeft: 12 }}>Delete</button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: C.txT }}>Tags:</span>
            <input
              value={(active.tags || []).join(", ")}
              onChange={(e) => updateNote(active.id, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              style={{ border: `1px solid ${C.bdr}`, borderRadius: 3, padding: "4px 8px", fontFamily: F.sans, fontSize: 12, color: C.tx, background: "transparent", outline: "none", flex: 1 }}
              placeholder="e.g. MCP, API, how-to, setup"
            />
          </div>
          <textarea
            value={active.content}
            onChange={(e) => updateNote(active.id, "content", e.target.value)}
            placeholder={"Write your notes here...\n\nIdeas for what to document:\n- How I set up MCP server to Google Sheets\n- Steps to make my first API call\n- Claude Code slash commands I use\n- Error patterns and how I fixed them\n- What I learned from each course module"}
            rows={20}
            style={{
              width: "100%", border: `1px solid ${C.bdr}`, borderRadius: 4, padding: "12px 14px",
              fontFamily: F.sans, fontSize: 14, color: C.tx, background: C.bgS, outline: "none",
              resize: "vertical", lineHeight: 1.7, boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: 10, color: C.txT, marginTop: 6 }}>Created {new Date(active.created).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
      )}
    </div>
  </div>);
}

// ── CCA tab ──
const CCA_DOMAINS = [
  { name: "Agentic Architecture & Orchestration", weight: 27, color: C.green, desc: "Multi-agent systems, hub-and-spoke, handoffs, graceful degradation" },
  { name: "Prompt Engineering & Structured Output", weight: 20, color: C.blue, desc: "System prompts, JSON schemas, chain-of-thought, few-shot examples" },
  { name: "Claude Code Configuration & Workflows", weight: 20, color: C.purple, desc: "CLAUDE.md, slash commands, project setup, dev workflows" },
  { name: "Tool Design & MCP Integration", weight: 18, color: C.orange, desc: "MCP servers, tool use patterns, Agent Skills, error handling" },
  { name: "Context Management & Reliability", weight: 15, color: C.coral, desc: "Token limits, caching, retry patterns, HITL, testing" },
];
const CCA_COURSES = [
  { name: "Building with the Claude API", hrs: "~8 hrs", core: true, domain: "Prompt Engineering + Structured Output" },
  { name: "Claude Code in Action", hrs: "~3 hrs", core: true, domain: "Claude Code Config & Workflows" },
  { name: "Introduction to MCP", hrs: "~2 hrs", core: true, domain: "Tool Design & MCP Integration" },
  { name: "Introduction to Agent Skills", hrs: "~2 hrs", core: true, domain: "Tool Design & MCP Integration" },
  { name: "MCP Advanced", hrs: "~3 hrs", core: false, domain: "Agentic Architecture" },
  { name: "Sub-agents", hrs: "~2 hrs", core: false, domain: "Agentic Architecture" },
  { name: "Enterprise Adoption", hrs: "~2 hrs", core: false, domain: "Context Management & Reliability" },
  { name: "Train-the-Trainer", hrs: "~2 hrs", core: false, domain: "All domains" },
  { name: "CCA Exam Prep", hrs: "~5 hrs", core: false, domain: "All 5 domains - review" },
];
const CCA_PREP = [
  { id: "cp1", text: "Complete: Building with the Claude API", done: false },
  { id: "cp2", text: "Complete: Claude Code in Action", done: false },
  { id: "cp3", text: "Complete: Introduction to MCP", done: false },
  { id: "cp4", text: "Complete: Introduction to Agent Skills", done: false },
  { id: "cp5", text: "Complete: MCP Advanced", done: false },
  { id: "cp6", text: "Complete: Sub-agents", done: false },
  { id: "cp7", text: "Complete: Enterprise Adoption", done: false },
  { id: "cp8", text: "Complete: CCA Exam Prep course", done: false },
  { id: "cp9", text: "Score 900+ on Skilljar practice test (60 questions)", done: false },
  { id: "cp10", text: "Try Udemy practice set (360 questions)", done: false },
  { id: "cp11", text: "Build portfolio project (Evalynn OS)", done: false },
  { id: "cp12", text: "Request exam access", done: false },
  { id: "cp13", text: "Schedule exam date", done: false },
  { id: "cp14", text: "Take the exam", done: false },
];
function CCATab({ ccaData, setCcaData }) {
  const prep = ccaData.prep || CCA_PREP;
  const togglePrep = (id) => {
    const upd = prep.map((p) => p.id === id ? { ...p, done: !p.done } : p);
    setCcaData((prev) => ({ ...prev, prep: upd }));
  };
  const donePrep = prep.filter((p) => p.done).length;
  const lnk = { fontSize: 13, color: C.blue, textDecoration: "none", fontFamily: F.sans };

  return (<div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
      {[
        { l: "Exam", v: "CCA-F", c: C.purple },
        { l: "Questions", v: "60 proctored", c: C.txS },
        { l: "Pass score", v: "720 / 1,000", c: C.green },
        { l: "Cost", v: "$99 per attempt", c: C.txS },
      ].map((g, i) => (<div key={i} style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{g.l}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: g.c }}>{g.v}</div>
      </div>))}
    </div>

    <div style={{ fontSize: 14, color: C.txS, lineHeight: 1.6, marginBottom: 16 }}>
      Anthropic's first official technical certification, launched March 12, 2026. Free for the first 5,000 partner company employees.
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      <a href="https://anthropic.skilljar.com" target="_blank" rel="noopener" style={{ ...lnk, padding: "6px 14px", border: `1px solid ${C.bdr}`, borderRadius: 4 }}>All courses</a>
      <a href="https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request" target="_blank" rel="noopener" style={{ ...lnk, padding: "6px 14px", border: `1px solid ${C.bdr}`, borderRadius: 4 }}>Request exam access</a>
      <a href="https://claude.com/partners" target="_blank" rel="noopener" style={{ ...lnk, padding: "6px 14px", border: `1px solid ${C.bdr}`, borderRadius: 4 }}>Partner Network (free)</a>
    </div>

    <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.tx, marginBottom: 4 }}>5 exam domains</div>
    </div>
    {CCA_DOMAINS.map((d, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ width: 36, fontSize: 16, fontWeight: 600, color: d.color, fontFamily: F.mono, flexShrink: 0 }}>{d.weight}%</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.tx }}>{d.name}</div>
          <div style={{ fontSize: 12, color: C.txS }}>{d.desc}</div>
        </div>
      </div>
    ))}

    <div style={{ height: 20 }} />

    <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>Courses</div>
        <div style={{ fontSize: 12, color: C.txS }}>~29 hrs total</div>
      </div>
    </div>
    {CCA_COURSES.map((c, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px", borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: C.tx }}>
            {c.name}
            {c.core && <span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 8, background: C.redBg, color: C.red, marginLeft: 6 }}>core</span>}
          </div>
          <div style={{ fontSize: 11, color: C.txT }}>{c.domain}</div>
        </div>
        <div style={{ fontSize: 12, color: C.txS, fontFamily: F.mono, flexShrink: 0 }}>{c.hrs}</div>
      </div>
    ))}

    <div style={{ height: 20 }} />

    <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>Prep checklist</div>
        <div style={{ fontSize: 12, color: donePrep === prep.length ? C.green : C.txS }}>{donePrep}/{prep.length}</div>
      </div>
    </div>
    {prep.map((p) => (
      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderBottom: `1px solid ${C.bdr}`, cursor: "pointer" }} onClick={() => togglePrep(p.id)}>
        {p.done
          ? <div style={{ width: 14, height: 14, borderRadius: 4, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          : <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${C.bdrH}`, flexShrink: 0 }} />}
        <span style={{ fontSize: 13, color: p.done ? C.txT : C.tx, textDecoration: p.done ? "line-through" : "none" }}>{p.text}</span>
      </div>
    ))}

    <div style={{ height: 20 }} />

    <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>Roles this opens</div>
    </div>
    {["AI / Claude Solution Architect", "AI Engineer / Agentic Systems Engineer", "Forward Deployed Engineer", "AI Implementation Specialist", "Partner Delivery Architect (Accenture, Cognizant, etc.)"].map((r, i) => (
      <div key={i} style={{ padding: "6px 16px", borderBottom: `1px solid ${C.bdr}`, fontSize: 13, color: C.tx }}>{r}</div>
    ))}

    <div style={{ height: 20 }} />

    <div style={{ background: C.bgS, padding: "12px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>Pre-test baseline</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.red, fontFamily: F.mono }}>379 / 1,000</div>
      </div>
    </div>
    {[
      { domain: "Agentic Architecture & Orchestration", weight: 27, score: "2/5", pct: 40, color: C.green },
      { domain: "Prompt Engineering & Structured Output", weight: 20, score: "1/5", pct: 20, color: C.blue },
      { domain: "Claude Code Config & Workflows", weight: 20, score: "2/5", pct: 40, color: C.purple },
      { domain: "Tool Design & MCP Integration", weight: 18, score: "1/4", pct: 25, color: C.orange },
      { domain: "Context Management & Reliability", weight: 15, score: "1/4", pct: 25, color: C.coral },
    ].map((d, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px", borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ fontSize: 12, color: C.txS, flex: 1 }}>{d.domain} ({d.weight}%)</div>
        <div style={{ fontSize: 12, fontFamily: F.mono, color: C.txS, flexShrink: 0, width: 30, textAlign: "right" }}>{d.score}</div>
        <div style={{ width: 60, height: 5, background: C.bgS, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ width: `${d.pct}%`, height: "100%", background: d.pct >= 70 ? C.green : d.pct >= 50 ? C.orange : C.red, borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 12, fontFamily: F.mono, color: d.pct >= 70 ? C.green : d.pct >= 50 ? C.orange : C.red, flexShrink: 0, width: 30, textAlign: "right" }}>{d.pct}%</div>
      </div>
    ))}
    <div style={{ padding: "8px 16px", fontSize: 11, color: C.txT }}>Target: 720+ (need ~341 point improvement)</div>

    <div style={{ height: 20 }} />

    <div style={{ background: C.bgS, padding: "12px 16px", borderRadius: 4 }}>
      <div style={{ fontSize: 12, color: C.txS, lineHeight: 1.6 }}>
        Tip: Anthropic recommends scoring 900+ on the Skilljar practice test (60 questions) before sitting the real exam. Someone also created a Udemy practice set with 360 questions for additional prep.
      </div>
    </div>
  </div>);
}

// ── Reference tab - CCA cross-reference matrix ──
const REF_MATRIX = [
  { domain: "Agentic Architecture & Orchestration", weight: 27, color: C.green,
    skills: [
      { id: "s8", text: "Multi-agent orchestration" },
      { id: "s9", text: "Sub-agent delegation patterns" },
      { id: "s10", text: "Human-in-the-loop design" },
      { id: "s11", text: "Context management & reliability" },
    ],
    courses: ["MCP Advanced (~3 hrs)", "Sub-agents (~2 hrs)"],
    agents: ["Career Officer", "Identity Officer", "Lifestyle Officer", "Relationship Officer", "Soul Officer"],
    phase: "Phase 3",
  },
  { domain: "Prompt Engineering & Structured Output", weight: 20, color: C.blue,
    skills: [
      { id: "s1", text: "Prompt engineering fundamentals" },
      { id: "s3", text: "API streaming & structured output" },
    ],
    courses: ["Building with Claude API (~8 hrs)"],
    agents: ["Health Officer", "Finance Officer", "Identity Officer", "Relationship Officer"],
    phase: "Phase 1",
  },
  { domain: "Claude Code Configuration & Workflows", weight: 20, color: C.purple,
    skills: [
      { id: "s2", text: "Claude Code configuration" },
    ],
    courses: ["Claude Code in Action (~3 hrs)"],
    agents: ["Career Officer"],
    phase: "Phase 1",
  },
  { domain: "Tool Design & MCP Integration", weight: 18, color: C.orange,
    skills: [
      { id: "s4", text: "Error handling & retry patterns" },
      { id: "s5", text: "MCP server setup & connection" },
      { id: "s6", text: "Tool use design patterns" },
      { id: "s7", text: "Agent Skills configuration" },
    ],
    courses: ["Intro to MCP (~2 hrs)", "Agent Skills (~2 hrs)", "GitHub: Tool Use"],
    agents: ["Health Officer", "Finance Officer", "Career Officer", "Lifestyle Officer", "Soul Officer"],
    phase: "Phase 2",
  },
  { domain: "Context Management & Reliability", weight: 15, color: C.coral,
    skills: [
      { id: "s12", text: "Enterprise deployment patterns" },
      { id: "s13", text: "Anti-pattern recognition" },
      { id: "s14", text: "Portfolio presentation" },
    ],
    courses: ["Enterprise Adoption (~2 hrs)", "Train-the-Trainer (~2 hrs)", "CCA Prep (~5 hrs)"],
    agents: ["Soul Officer"],
    phase: "Phase 4",
  },
];

function ReferenceTab() {
  const allSkillIds = REF_MATRIX.flatMap((d) => d.skills.map((s) => s.id));
  const allAgentNames = [...new Set(REF_MATRIX.flatMap((d) => d.agents))];
  const allCourses = [...new Set(REF_MATRIX.flatMap((d) => d.courses))];

  // Check which skills are covered by agents
  const agentSkillMap = {};
  AGENTS.forEach((a) => { (a.skillRefs || []).forEach((sId) => { if (!agentSkillMap[sId]) agentSkillMap[sId] = []; agentSkillMap[sId].push(a.name); }); });

  // Check coverage gaps
  const allSkillsFromPhases = GP_PHASES.flatMap((ph) => ph.skills.map((s) => s.id));
  const coveredByAgents = new Set(AGENTS.flatMap((a) => a.skillRefs || []));
  const uncovered = allSkillsFromPhases.filter((id) => !coveredByAgents.has(id));

  const dot = (color) => <div style={{ width: 7, height: 7, borderRadius: 4, background: color, flexShrink: 0 }} />;

  return (<div>
    {/* Coverage summary */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
      <div style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>CCA skills</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.tx }}>{allSkillsFromPhases.length} total</div>
      </div>
      <div style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>Covered by agents</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: coveredByAgents.size === allSkillsFromPhases.length ? C.green : C.orange }}>{coveredByAgents.size}/{allSkillsFromPhases.length}</div>
      </div>
      <div style={{ background: C.bgS, borderRadius: 4, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>Gaps</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: uncovered.length === 0 ? C.green : C.red }}>{uncovered.length === 0 ? "None" : uncovered.length + " uncovered"}</div>
      </div>
    </div>

    {/* Domain by domain cross-reference */}
    {REF_MATRIX.map((domain, di) => (
      <div key={di} style={{ marginBottom: 0 }}>
        <div style={{ background: C.bgS, padding: "12px 16px", borderTop: di === 0 ? `1px solid ${C.bdr}` : "none", borderBottom: `1px solid ${C.bdr}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            {dot(domain.color)}
            <span style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>{domain.domain}</span>
            <span style={{ fontSize: 12, fontFamily: F.mono, color: domain.color, marginLeft: "auto" }}>{domain.weight}%</span>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <Pill color={C.txS} bg={C.bgS}>{domain.phase}</Pill>
            {domain.courses.map((c, i) => (<Pill key={i} color={C.purple} bg={C.purpleBg}>{c}</Pill>))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Skills in this domain */}
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0 6px" }}>Skills tested</div>
            {domain.skills.map((s) => {
              const agents = agentSkillMap[s.id] || [];
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                  <div style={{ width: 7, height: 7, borderRadius: 4, background: agents.length > 0 ? C.green : C.red, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontFamily: F.sans, color: C.tx, flex: 1, lineHeight: 1.45 }}>{s.text}</span>
                  <span style={{ fontSize: 10, color: agents.length > 0 ? C.green : C.red, flexShrink: 0 }}>{agents.length > 0 ? agents.length + " agents" : "gap"}</span>
                </div>
              );
            })}
          </div>

          {/* Which agents cover this domain */}
          <div style={{ padding: "8px 16px 4px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.txT, textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0 6px" }}>Covered by building</div>
            {domain.agents.map((name, i) => {
              const agent = AGENTS.find((a) => a.name === name);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${C.bdr}` }}>
                  {agent && <Tag color={agent.tagColor}>{agent.name}</Tag>}
                  {!agent && <span style={{ fontSize: 13, color: C.tx }}>{name}</span>}
                </div>
              );
            })}
            {domain.agents.length === 0 && (
              <div style={{ padding: "6px 0", fontSize: 12, color: C.red }}>No agent covers this domain yet</div>
            )}
          </div>
        </div>
        {di < REF_MATRIX.length - 1 && <div style={{ height: 12 }} />}
      </div>
    ))}

    <div style={{ height: 20 }} />

    {/* Uncovered skills detail */}
    {uncovered.length > 0 && (<div>
      <div style={{ background: C.redBg, padding: "12px 16px", borderRadius: 4, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.red, marginBottom: 4 }}>Uncovered skills</div>
        <div style={{ fontSize: 12, color: C.red, lineHeight: 1.5 }}>
          These CCA skills are not practiced by any agent you're building. Consider adding features that exercise them.
        </div>
        {uncovered.map((id) => {
          const skill = GP_PHASES.flatMap((p) => p.skills).find((s) => s.id === id);
          return skill ? <div key={id} style={{ fontSize: 13, color: C.red, padding: "4px 0" }}>{skill.text}</div> : null;
        })}
      </div>
    </div>)}

    {/* Full skill-to-agent mapping */}
    <div style={{ background: C.bgS, padding: "10px 16px", borderBottom: `1px solid ${C.bdr}` }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.tx }}>Full skill-to-agent map</span>
    </div>
    {GP_PHASES.flatMap((ph) => ph.skills).map((skill) => {
      const agents = agentSkillMap[skill.id] || [];
      const phase = GP_PHASES.find((p) => p.skills.some((s) => s.id === skill.id));
      return (
        <div key={skill.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderBottom: `1px solid ${C.bdr}` }}>
          <Tag color={phase?.color || "blue"}>{phase?.ph || "?"}</Tag>
          <span style={{ fontSize: 13, color: C.tx, flex: 1 }}>{skill.text}</span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {agents.length > 0 ? agents.map((a, i) => (
              <span key={i} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: C.greenBg, color: C.green }}>{a.replace(" Officer", "").replace(" / Astrologer", "")}</span>
            )) : (
              <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: C.redBg, color: C.red }}>no agent</span>
            )}
          </div>
        </div>
      );
    })}
  </div>);
}

// ── How To tab - step-by-step learning notes ──
const HOWTO_GUIDES = [
  { id: "deploy", title: "How to deploy Evalynn OS to Vercel + Supabase",
    context: "Right now your app lives inside Claude's chat window. If the chat breaks or you start a new one, your data could disappear. This guide gives your app a permanent home on the internet - like moving from renting a room to owning a house. After this, your app has its own website address and your data lives in a real database forever.",
    steps: [
      { step: "1. Create a place for your code (GitHub)",
        what: "> Go to **github.com/new**\n> Name it **eva-os**, choose **Public**, do NOT check **Add a README file**\n> Click **Create repository** - you'll see a setup page, leave it open",
        why: "GitHub is like Google Drive but for code. It saves every version of your files. When you change something, the old version is still there. Vercel (the website host) reads your code from GitHub to build your website. You already use GitHub for Golden Era - same thing." },
      { step: "2. Create a database (Supabase)",
        what: "> Go to **supabase.com**, sign in or sign up free\n> Click **New Project**, name it **Eva OS**, region **Asia-Pacific**\n> Click **Generate a password** and SAVE it somewhere\n> Keep **Enable Data API** checked, leave **Enable automatic RLS** unchecked\n> Click **Create new project** - wait about 1 minute for the dashboard",
        why: "Supabase is a free online database. Think of it as a Google Sheet that your app can read and write to automatically - but faster and more reliable. Right now your habit data lives in Claude's artifact storage (temporary). Supabase makes it permanent. Even if you delete your app and rebuild it, the data is still there waiting." },
      { step: "3. Create your table (SQL)",
        what: "> In Supabase left sidebar, click the **SQL Editor** icon (document with code brackets)\n> Delete anything in the editor, copy-paste this EXACTLY:\n\nCREATE TABLE IF NOT EXISTS kv_store (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \"Allow all\" ON kv_store\n  FOR ALL USING (true) WITH CHECK (true);\n\n> Click the green **Run** button. You should see **Success. No rows returned** - this is correct",
        why: "SQL is the language databases understand - like giving instructions in its own language. This creates one table called kv_store (key-value store). Simplest design: a name (key) and a value, like a dictionary. 'No rows returned' means it built the table but didn't add data yet - that happens when you use the app." },
      { step: "4. Get your connection keys (API Keys)",
        what: "> In Supabase left sidebar, click the **gear icon** (Settings) at the bottom\n> Click **API Keys** under Configuration\n> Copy the **Publishable key** (starts with **sb_publishable_...**) - label it ANON KEY\n> Click the **home icon** (top of sidebar) to go back to dashboard\n> Copy the **Project URL** under the project name (like **https://xxxxx.supabase.co**) - label it PROJECT URL\n> Save both somewhere safe",
        why: "Your app needs two pieces of info to talk to your database: WHERE it is (the URL) and a PASSWORD to get in (the publishable key). Like a phone number + PIN code. The publishable key only allows access through the security rules from step 3. The secret key has full admin access - don't use that one." },
      { step: "5. Upload your code to GitHub (Terminal)",
        what: "> Open **Terminal** (search 'Terminal' in Spotlight). It's a text-based way to control your computer - type a command, press Enter, one at a time.\n\n> Navigate to your project folder:\ncd ~/Downloads/Eva\\ OS/deploy/evalynn-os\n\n> Download code libraries:\nnpm install\n\n> Track files and upload to GitHub:\ngit init\ngit add .\ngit commit -m \"Initial deploy\"\ngit remote add origin **https://github.com/evajept/eva-os.git**\ngit branch -M main\ngit push -u origin main\n\n> **Username**: type your GitHub username\n> **Password**: paste your **Personal Access Token** (not regular password). Nothing shows when you paste - normal. Press Enter.\n> See **main -> main** = it worked!",
        why: "Terminal is how developers control their computer with text commands instead of clicking. Each command does one thing: 'cd' moves to a folder, 'npm install' downloads libraries, 'git' tracks and uploads code. Think of git like saving a document with a message about what you changed. The Personal Access Token is GitHub's security - regular passwords were turned off in 2021 because tokens are safer." },
      { step: "6. Put your app online (Vercel)",
        what: "> Go to **vercel.com**, sign in\n> Click **Add New** then **Project**, find **eva-os**, click **Import**\n> Framework Preset: **Vite**\n> Open **Environment Variables** and add:\n  Key: **VITE_SUPABASE_URL** / Value: your **Project URL**\n  Key: **VITE_SUPABASE_ANON_KEY** / Value: your **publishable key**\n> Click **Deploy** - wait about 1 minute\n> Click **Continue to Dashboard** then **Visit**",
        why: "Vercel is a free website host. It takes your code from GitHub and turns it into a real website. The environment variables are secret settings - they connect your app to Supabase but stay hidden from anyone looking at your code. The VITE_ prefix is required because Vite only shares variables starting with VITE_ - a safety feature." },
      { step: "7. You're live!",
        what: "> Open your app URL (like **eva-os-nine.vercel.app**)\n> Click around - **Habits**, **Metrics**, **Protocol**, **Health Officer** should all work\n\nFuture updates - just 3 commands:\ngit add .\ngit commit -m \"what you changed\"\ngit push\n\nVercel auto-rebuilds in ~30 seconds.",
        why: "This is your permanent workflow. Edit code, push to GitHub, Vercel auto-deploys. Every push creates a new version - if something breaks, go back. The artifact in Claude stays as your sandbox for testing new features first." },
    ],
    skills: ["Deployment", "Git", "Supabase", "Vercel", "Terminal"],
  },
  { id: "api-proxy", title: "How to set up Claude API on your deployed app",
    context: "The Health Officer needs to call Claude's API to analyze your habits. Inside Claude's chat, API calls work automatically. On your own website, you need a proxy - a middleman that adds your secret API key before forwarding the request to Anthropic. Without this, the browser blocks the call.",
    steps: [
      { step: "1. Get an Anthropic API key",
        what: "> Go to **console.anthropic.com**\n> Click **API Keys** in the sidebar\n> Click **Create Key**, give it a name like **eva-os**\n> Copy the key (starts with **sk-ant-...**) and save it somewhere safe\n> This key is like a password - never share it or put it in your code",
        why: "The API key tells Anthropic who is making the request and charges your account. It must stay secret - if someone gets it, they can use your credits. That's why we put it on the server (Vercel), not in the browser code." },
      { step: "2. Add the key to Vercel",
        what: "> Go to **vercel.com** -> your **eva-os** project -> **Settings** -> **Environment Variables**\n> Click **Add Another**\n> Key: **ANTHROPIC_API_KEY**\n> Value: paste your **sk-ant-...** key\n> Click **Save**",
        why: "Environment variables on Vercel are secret - they're available to your server code but never sent to the browser. This is the safe place for API keys, database passwords, and other secrets." },
      { step: "3. Create the proxy file",
        what: "> Go to your GitHub repo\n> Click **Add file** -> **Create new file**\n> Type filename: **api/analyze.js** (the / creates the folder)\n> Paste this code:\n\nexport default async function handler(req, res) {\n  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });\n  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;\n  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: 'Key not configured' });\n  try {\n    const response = await fetch('https://api.anthropic.com/v1/messages', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },\n      body: JSON.stringify(req.body),\n    });\n    const data = await response.json();\n    return res.status(response.ok ? 200 : response.status).json(data);\n  } catch (error) { return res.status(500).json({ error: error.message }); }\n}\n\n> Click **Commit changes**",
        why: "This file is a serverless function - it runs on Vercel's server, not in the browser. When your app calls /api/analyze, Vercel runs this function. It adds your secret API key to the request and forwards it to Anthropic. The browser never sees the key." },
      { step: "4. Update App.jsx to use the proxy",
        what: "> Go to **src/App.jsx** on GitHub, click edit\n> Find this line:\nfetch(\"https://api.anthropic.com/v1/messages\"\n> Change it to:\nfetch(\"/api/analyze\"\n> Click **Commit changes**\n> The app now calls your own server instead of Anthropic directly",
        why: "The browser can't call Anthropic directly because of CORS (a security rule that blocks cross-origin requests from browsers). By calling /api/analyze instead, the request goes to YOUR server first, which then calls Anthropic server-to-server - no CORS issue." },
      { step: "5. Update vercel.json for routing",
        what: "> Edit **vercel.json** on GitHub\n> Replace content with:\n{\n  \"rewrites\": [\n    { \"source\": \"/api/:path*\", \"destination\": \"/api/:path*\" },\n    { \"source\": \"/(.*)\", \"destination\": \"/\" }\n  ]\n}\n> Click **Commit changes**",
        why: "This tells Vercel: requests to /api/* go to the serverless functions, everything else goes to the main app. Without this, Vercel would try to serve /api/analyze as a page and get a 404." },
      { step: "6. Test it",
        what: "> Wait 30 seconds for Vercel to redeploy\n> Go to **eva-os-nine.vercel.app**\n> Click **Habits** tab, make sure some data is logged\n> Click **Health Officer** tab\n> Click **Run health analysis**\n> You should see score cards, patterns, wins, and flags",
        why: "The full chain: your browser sends habit data to /api/analyze on your Vercel server. The server adds the API key and sends it to Anthropic. Claude analyzes the data and responds with JSON. The server sends the JSON back to your browser. Your app parses it and displays the dashboard." },
    ],
    skills: ["API", "Serverless Functions", "Security", "CORS"],
  },
  { id: "troubleshoot", title: "Troubleshooting - things that went wrong and how to fix them",
    context: "These are real problems that happened during the first Evalynn OS deployment. If you hit any of these again (or someone else follows this guide), the fix is here.",
    steps: [
      { step: "Terminal: 'npm: command not found'",
        what: "This means Node.js is not installed on your Mac. Node.js is the engine that runs JavaScript outside a browser. npm comes bundled with it.\n\n> First install Homebrew (a tool that installs other tools):\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n\n> It will ask for your Mac password - type it and press Enter (nothing shows while typing, that's normal)\n> When it says 'Press RETURN/ENTER to continue' - press Enter\n> Wait 3-5 minutes for it to finish\n\n> Then add Homebrew to your path (so your Terminal can find it):\necho 'eval \"$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile\neval \"$(/opt/homebrew/bin/brew shellenv)\"\n\n> Then install Node.js:\nbrew install node\n\n> Now npm install should work",
        why: "Mac doesn't come with Node.js pre-installed. Homebrew is the standard way Mac developers install tools - it's like an App Store for Terminal. The 'path' step tells your Terminal where to find the brew command. Without it, Terminal doesn't know Homebrew exists even though it's installed." },
      { step: "Terminal: 'brew: command not found'",
        what: "Homebrew isn't installed yet, or the path wasn't set up.\n\n> If you just installed Homebrew but it says 'not found', run these two lines:\necho 'eval \"$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile\neval \"$(/opt/homebrew/bin/brew shellenv)\"\n\n> If you never installed Homebrew, start from the /bin/bash command in the step above",
        why: "When Homebrew installs, it puts itself in /opt/homebrew/ but your Terminal doesn't automatically know to look there. The 'eval' command tells Terminal: 'hey, Homebrew lives here, remember that.'" },
      { step: "Terminal: Homebrew install aborted or typed wrong command",
        what: "If the Homebrew installation asks 'Press RETURN/ENTER to continue' and you accidentally type something else (like a random word), it aborts.\n\n> Just run the install command again:\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"\n\n> This time, ONLY press Enter when it asks. Don't type anything else.",
        why: "The installer is cautious - it shows you what it's about to install and asks for confirmation. Any key other than Enter cancels it. If you accidentally hit a letter key, it treats that as 'abort'. Just restart the install." },
      { step: "Terminal: password doesn't show when typing",
        what: "When Terminal asks for your password (Mac password or GitHub token), NOTHING appears as you type. No dots, no stars, no characters. This is normal.\n\n> Just type your password and press Enter\n> If it says 'Sorry, try again' you typed the wrong password - try again\n> For GitHub, remember to use a Personal Access Token, not your regular password",
        why: "This is a security feature in Unix/Mac systems. If someone is looking over your shoulder, they can't even see how many characters your password has. It feels broken but it's working exactly as designed." },
      { step: "Git: 'Password authentication is not supported'",
        what: "GitHub stopped accepting regular passwords in 2021. You need a Personal Access Token instead.\n\n> Go to github.com/settings/tokens\n> Click 'Generate new token' then 'Generate new token (classic)'\n> Note: type anything (like 'eva-os')\n> Expiration: No expiration (or 90 days)\n> Check the 'repo' checkbox at the top\n> Click 'Generate token'\n> COPY THE TOKEN NOW - GitHub only shows it once!\n> The token starts with ghp_...\n> Use this token as your 'password' when git push asks",
        why: "Tokens are safer than passwords because you can limit what they can do (we only checked 'repo' = can push code, nothing else), you can revoke them anytime, and they have expiration dates. Your GitHub password gives full access to everything - a token gives limited access to just what you need." },
      { step: "Git: pasted token as a command instead of password",
        what: "If you paste your token at the wrong time (when Terminal shows your username prompt, not the password prompt), it tries to run the token as a command and says 'command not found'.\n\n> Just run git push again:\ngit push -u origin main\n\n> When it says 'Username for https://github.com': type your GitHub username and press Enter\n> When it says 'Password for https://...': THEN paste your token and press Enter\n> Wait for the username prompt first, then the password prompt. Two separate steps.",
        why: "Terminal processes one input at a time. The username and password are two separate questions. If you paste the token before it asks for the password, Terminal thinks you're typing a new command." },
      { step: "Git: 'remote origin already exists'",
        what: "You already set the remote URL once. To change it:\n\n> git remote set-url origin https://github.com/evajept/eva-os.git\n\nThen try git push again.",
        why: "Git remembers where to push. If you ran 'git remote add origin' twice, it complains the second time. 'set-url' updates the existing one instead of adding a new one." },
      { step: "Terminal: folder path errors / 'no such file or directory'",
        what: "The cd command can't find the folder you typed.\n\n> Spaces in folder names need special handling. Use backslash before spaces:\ncd ~/Downloads/Eva\\ OS/deploy/evalynn-os\n\n> Or wrap the whole path in quotes:\ncd \"~/Downloads/Eva OS/deploy/evalynn-os\"\n\n> Shortcut to find the right path: In Finder, navigate to the folder, hold the Option key, right-click the folder, click 'Copy as Pathname'. Then type 'cd ' (with a space) and paste.",
        why: "Terminal uses spaces to separate different parts of a command. So 'Eva OS' looks like two separate things: 'Eva' and 'OS'. The backslash or quotes tell Terminal: 'this space is part of the name, not a separator.'" },
      { step: "SQL Editor: typed filename instead of SQL code",
        what: "Don't type the filename 'supabase-setup.sql' into the SQL Editor. Paste the ACTUAL SQL code:\n\nCREATE TABLE IF NOT EXISTS kv_store (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY \"Allow all\" ON kv_store\n  FOR ALL USING (true) WITH CHECK (true);\n\n> Select all text in the editor, delete it, then paste the SQL above\n> Click the green Run button",
        why: "The SQL Editor runs SQL commands directly on your database - it's not a file uploader. When we say 'paste the contents of supabase-setup.sql', we mean paste the SQL code that was INSIDE that file, not the filename itself." },
      { step: "Vercel: app shows blank page after deploy",
        what: "Right-click the blank page, click 'Inspect', click 'Console' tab. Look at the red error messages.\n\n> 'React is not defined' - the code needs 'import React' at the top of App.jsx. Go to GitHub, edit src/App.jsx, change line 1 from:\nimport { useState, useEffect, useRef } from \"react\";\nto:\nimport React, { useState, useEffect, useRef } from \"react\";\nCommit the change. Vercel auto-redeploys.\n\n> 'MIME type text/html' - usually means the build output wasn't found. Check that Framework Preset is 'Vite' in Vercel settings. The output directory should be 'dist'.\n\n> If the preview thumbnail on Vercel dashboard shows your app but the URL is blank, try the other URL shown on the dashboard (like eva-os-nine.vercel.app instead of eva-os.vercel.app).",
        why: "The artifact version in Claude automatically provides React to your code. A standalone Vite app doesn't - you have to explicitly import it. This is one of the differences between building in Claude vs building a real app. The MIME error means Vercel can't find your built files - usually a configuration issue." },
      { step: "Vercel: Environment Variables - what goes where",
        what: "The Environment Variables section has a Key field and a Value field. Replace the example values (EXAMPLE_NAME / I9JU23NF394R6HH) with your real ones:\n\n> Key: VITE_SUPABASE_URL\n> Value: your Supabase URL (like https://xxxxx.supabase.co)\n> Click Add\n\n> Key: VITE_SUPABASE_ANON_KEY\n> Value: your publishable key (starts with sb_publishable_...)\n> Click Add\n\n> The VITE_ prefix is required - without it, your app can't see the values",
        why: "Environment variables are settings that live on the server, not in your code. This way your database credentials are hidden from anyone who looks at your GitHub repo. Vercel injects them when it builds your app." },
    ],
    skills: ["Terminal", "Git", "Debugging"],
  },
  { id: "api-proxy", title: "How to set up Claude API proxy on Vercel",
    context: "The Claude API can't be called directly from a browser (CORS security). You need a serverless function on Vercel that acts as a middleman - your app calls YOUR server, your server calls Anthropic. This keeps your API key secret and makes the API work on a deployed site.",
    steps: [
      { step: "1. Get an Anthropic API key",
        what: "> Go to **console.anthropic.com**\n> Click **API Keys** in the sidebar\n> Click **Create Key**, copy it (starts with **sk-ant-...**)\n> Never share this key publicly - if you do, delete it and create a new one",
        why: "This key is like a password that lets your app use Claude. Anthropic charges per use, so anyone with your key can run up your bill. That's why it goes in an environment variable on Vercel, not in your code." },
      { step: "2. Add the key to Vercel",
        what: "> Go to **vercel.com** -> your **eva-os** project -> **Settings** -> **Environment Variables**\n> Click **Add Another**\n> Key: **ANTHROPIC_API_KEY**\n> Value: paste your **sk-ant-...** key\n> Click **Save**",
        why: "Environment variables on Vercel are secret - they're only visible to your server-side code (the API proxy), never to the browser. Even if someone views your GitHub repo or inspects your website, they can't see the key." },
      { step: "3. Create the serverless function",
        what: "> On GitHub, go to your **eva-os** repo\n> Click **Add file** -> **Create new file**\n> Type filename: **api/analyze.js** (the / creates the folder)\n> Paste the proxy code - it receives requests from your app, adds the API key, forwards to Anthropic, returns the response\n> Click **Commit changes**",
        why: "Vercel automatically turns any .js file in the /api folder into a serverless function - a tiny server that runs only when called. Your app calls /api/analyze, Vercel runs this function, the function calls Anthropic with your secret key, and returns the result. The browser never sees the key." },
      { step: "4. Update App.jsx to use the proxy",
        what: "> In your **App.jsx**, change the API call from:\nfetch(\"https://api.anthropic.com/v1/messages\", ...)\n> To:\nfetch(\"/api/analyze\", ...)\n> Commit the change",
        why: "Instead of calling Anthropic directly (which the browser blocks), your app now calls your own /api/analyze endpoint. Same request, same response - but routed through your Vercel server which adds the API key." },
      { step: "5. Test it",
        what: "> Wait 30 seconds for Vercel to redeploy\n> Go to **eva-os-nine.vercel.app** -> **Health Officer** -> click **Run health analysis**\n> You should see the analysis with scores, patterns, and recommendations\n> If 'Failed to fetch' - check that the API key is correct in Vercel settings\n> If 'ANTHROPIC_API_KEY not configured' - the environment variable name is wrong",
        why: "The full chain: browser -> /api/analyze (your Vercel server) -> api.anthropic.com (Claude) -> response flows back the same way. You've just built what every production AI app does - a backend proxy for API calls." },
    ],
    skills: ["API", "Serverless", "Security", "Vercel"],
  },
  { id: "first-api-call", title: "How to make your first Claude API call",
    context: "The Health Officer sends your habit data to Claude and gets back a structured analysis. This is the core pattern for every AI feature you'll build - send data + instructions, get back a structured response.",
    steps: [
      { step: "1. Collect the data",
        what: "Read your habit data from storage (Supabase or localStorage). Loop through the last 7 days. Build a simple object:\n\n{ \"Day 20\": { \"Sleep\": \"6\", \"Work\": \"done\", \"Berberine\": \"skipped\" }, ... }\n\nThe key function is **loadHabitData** - it calls **osLoad** to get the stored data, then extracts the relevant days.",
        why: "You need to give Claude context about what to analyze. The cleaner the data format, the better the analysis. We convert internal storage keys (like '20_sleep') into readable labels (like 'Sleep: 6') so Claude can understand them." },
      { step: "2. Write the prompt",
        what: "The prompt has three parts:\n\n> **Role**: 'You are Evalynn's Health Officer - a sharp, direct health analyst'\n> **Data**: the habit data as JSON, pasted into the prompt\n> **Output format**: 'Respond ONLY with a JSON object with this exact structure: { overall_score, sleep_avg, wins, flags... }'\n\nTelling Claude the exact JSON shape is called **structured output** - you define what comes back.",
        why: "The role sets Claude's personality and expertise level. The data gives it something to analyze. The output format is crucial - without it, Claude returns free text which is hard to display in a UI. With a JSON schema, you can parse it and show scores, cards, and lists." },
      { step: "3. Make the fetch call",
        what: "Use JavaScript's **fetch** to send a POST request:\n\nfetch('/api/analyze', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    model: 'claude-sonnet-4-20250514',\n    max_tokens: 1000,\n    messages: [{ role: 'user', content: yourPrompt }]\n  })\n})\n\nThe response comes back as JSON with a **content** array.",
        why: "fetch is the standard way to make HTTP requests in JavaScript. The body contains: which model to use (Sonnet is fast and cheap), how long the response can be (1000 tokens), and your message. This is the exact same format the Anthropic API documentation uses." },
      { step: "4. Parse the response",
        what: "Claude's response has a **content** array with blocks. Find the text block:\n\nconst text = result.content.find(b => b.type === 'text')?.text\nconst parsed = JSON.parse(text)\n\nNow **parsed** is a JavaScript object you can use: parsed.overall_score, parsed.wins, etc.",
        why: "The API returns content blocks (text, tool_use, etc). For a simple text response, there's one text block. We parse the JSON string into an actual object so we can display parsed.overall_score as a number in a card, parsed.wins as a list, etc." },
      { step: "5. Handle errors",
        what: "Three things can go wrong:\n\n> **Network error** - 'Failed to fetch' - API is down or blocked\n> **Bad JSON** - Claude sometimes adds backticks or extra text. Strip them: text.replace(/```json/g, '').replace(/```/g, '').trim()\n> **API error** - status 401 (bad key), 429 (rate limited), 500 (server issue)\n\nWrap everything in try/catch. Retry up to 3 times with increasing delays (1s, 2s, 3s) - this is called **exponential backoff**.",
        why: "APIs fail. Networks glitch. Claude occasionally formats responses wrong. Production code always handles these cases. The retry with backoff is an industry standard pattern - if the first attempt fails, wait a bit and try again. Most transient errors resolve within a few seconds." },
    ],
    skills: ["API", "Prompt Engineering", "Error Handling", "JSON"],
  },
  { id: "big-picture", title: "How it all connects - the big picture",
    context: "You built all 9 steps. But what's actually happening when you click 'Run health analysis'? This breaks down the full flow - what runs in your browser, what runs on Vercel, and what runs on Anthropic's servers.",
    steps: [
      { step: "The three places your code runs",
        what: "Your app has three parts that live in different places:\n\n**Your browser** - the React app (App.jsx). This is what you see and click. It runs on your phone/laptop.\n\n**Vercel server** - the proxy (/api/analyze.js). This is a tiny server function that forwards requests. You never see it.\n\n**Anthropic servers** - Claude's brain. Receives your data, thinks, returns analysis.",
        why: "Your browser can't talk to Anthropic directly (security rule called CORS). So it talks to YOUR Vercel server first, which adds your secret API key and forwards the request. Like sending a letter through a trusted friend who stamps it with your return address." },
      { step: "Step 1-2: Saving habits to Supabase",
        what: "When you click a checkbox in the Habits tab, this happens:\n\n> You click -> React updates state -> osSave('habits2_2026-03', data) -> Supabase stores it in the kv_store table\n\nosLoad and osSave are your storage functions. They talk to Supabase (on your deployed site) or localStorage (in Claude's artifact). The data is a big object with keys like '20_sleep': '6' and '15_work': true.",
        why: "Every click saves immediately. The key format is 'day_habitId'. The kv_store table is like a dictionary - you give it a name (key) and it stores any data (value). All your habit data for March lives under one key: 'habits2_2026-03'." },
      { step: "Step 3-5: The API call chain",
        what: "When you click 'Run health analysis':\n\n> loadAllData() reads habits AND metrics from Supabase\n> Your browser sends a POST request to /api/analyze\n> Vercel proxy receives it, adds your ANTHROPIC_API_KEY header\n> Forwards to api.anthropic.com/v1/messages\n> Claude reads your prompt + data, generates JSON response\n> Response flows back: Anthropic -> Vercel proxy -> your browser\n> Your app parses the JSON and displays score cards\n\nIf it fails, it waits 1 second and tries again. Then 2 seconds. Then 3. After 3 failures, it shows an error.",
        why: "The prompt says 'respond ONLY with JSON in this exact structure'. This is called structured output - you tell the AI exactly what shape the answer should be. That way your code can do JSON.parse() and get a real object with .overall_score, .wins, .flags - not just a blob of text." },
      { step: "Step 6: Tool use - trends calculated locally",
        what: "BEFORE calling the API, your browser does math:\n\n> Reads this week's data (last 7 days) AND previous week's data\n> Calculates sleep average this week vs last week\n> Calculates supplement compliance percentage\n> Calculates work intensity percentage\n> Packages it all as a 'trends' object\n\nThis is 'tool use' - the agent (Health Officer) uses a tool (Supabase read + local calculation) to gather information before making a decision.",
        why: "The AI doesn't need to calculate averages - your JavaScript does that faster and cheaper. The AI's job is to interpret the patterns. By pre-calculating trends, you give Claude better context: 'sleep went from 7h to 6h this week' is more useful than raw data for 14 days." },
      { step: "Step 7: Proactive alerts - no AI needed",
        what: "Simple if/then rules that run in YOUR browser instantly:\n\n> IF berberine compliance < 50% AND glucose > 100 -> DANGER alert\n> IF sleep average < 6 hours -> DANGER alert\n> IF water average < 1.5L -> WARNING alert\n> IF supplements overall < 30% -> WARNING alert\n> IF work > 90% AND sleep < 7 -> WARNING (burnout risk)\n\nThese appear as red/yellow boxes BEFORE the API even responds.",
        why: "Not everything needs AI. These are rules YOU define based on what matters to your health. They fire instantly (no API wait), they're free (no API cost), and they're reliable (no AI hallucination). The AI analysis adds nuance on top." },
      { step: "Step 8: Cross-agent context",
        what: "Work intensity from the habit tracker gets packaged as 'career_context' and sent alongside health data:\n\n> career_context: 'Work intensity this week: 81% (last week: 75%)'\n\nClaude sees both health AND work data together, so it can say 'high work + low sleep = burnout risk'.",
        why: "In the full Evalynn OS vision, each agent (Health, Career, Finance, etc.) has its own data. Cross-agent means one agent reads another agent's data. Right now it's simple - Health reads work data. Later, Career could read health data to say 'you've been sick, postpone the deadline'." },
      { step: "Step 9: Weekly summary",
        what: "The API prompt asks Claude to return two extra fields:\n\n> 'weekly_summary': 2-3 sentence overview of the week\n> 'trend_insight': how this week compares to last week\n\nThese display in a blue highlighted box at the top of the results. The summary references trends, alerts, and cross-agent context to give you the full picture.",
        why: "The weekly summary is the Health Officer's 'report'. Instead of just scores and bullet points, it connects the dots: 'Your sleep dropped while work stayed high, and you stopped taking berberine - these three things together are the problem.' That's the value of an AI agent vs a simple dashboard." },
      { step: "The full flow in one sentence",
        what: "You click a habit checkbox -> it saves to Supabase -> you click Run Analysis -> your browser reads habits + metrics from Supabase, calculates trends, checks alert rules, packages work context -> sends it all to your Vercel proxy -> proxy adds API key, forwards to Claude -> Claude returns JSON with scores + summary -> your browser displays it with trend arrows, alert boxes, and a weekly report.",
        why: "That's 9 learning steps collapsed into one flow. Everything you built serves one purpose: turning raw habit clicks into an intelligent health analysis. The pieces work together like a pipeline - each step transforms the data a little more before the next step uses it." },
    ],
    skills: ["Architecture", "Data Flow", "Mental Model"],
  },
];

function HowToTab({ howtoData, setHowtoData }) {
  const [activeGuide, setActiveGuide] = useState(null);
  const guide = HOWTO_GUIDES.find((g) => g.id === activeGuide);

  const getStepDone = (guideId, stepIdx) => (howtoData[guideId]?.steps || {})[stepIdx] || false;
  const toggleStep = (guideId, stepIdx) => {
    setHowtoData((p) => ({
      ...p,
      [guideId]: {
        ...p[guideId],
        steps: { ...(p[guideId]?.steps || {}), [stepIdx]: !getStepDone(guideId, stepIdx) },
      },
    }));
  };

  return (<div>
    {HOWTO_GUIDES.map((g) => {
      const done = g.steps.filter((_, i) => getStepDone(g.id, i)).length;
      const isOpen = activeGuide === g.id;
      return (
        <div key={g.id} style={{ marginBottom: 12 }}>
          <div onClick={() => setActiveGuide(isOpen ? null : g.id)} style={{
            padding: "12px 16px", background: C.bgS, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, borderRadius: isOpen ? "4px 4px 0 0" : 4,
          }}>
            <span style={{ fontSize: 10, color: C.txT, transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s" }}>&#9654;</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.tx, flex: 1 }}>{g.title}</span>
            <span style={{ fontSize: 12, color: done === g.steps.length ? C.green : C.txT }}>{done}/{g.steps.length}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {g.skills.map((s, i) => (<Pill key={i} color={C.blue} bg={C.blueBg}>{s}</Pill>))}
            </div>
          </div>

          {isOpen && (<div>
            <div style={{ padding: "10px 16px", fontSize: 13, color: C.txS, lineHeight: 1.6, borderBottom: `1px solid ${C.bdr}` }}>{g.context}</div>

            {g.steps.map((step, i) => {
              const done2 = getStepDone(g.id, i);
              return (
                <div key={i} style={{ borderBottom: `1px solid ${C.bdr}` }}>
                  {/* Step header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: done2 ? C.greenBg : "transparent" }}>
                    <div onClick={() => toggleStep(g.id, i)} style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: "pointer",
                      background: done2 ? C.green : "transparent",
                      border: done2 ? "none" : `1.5px solid ${C.bdrH}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {done2 && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: done2 ? C.green : C.tx }}>{step.step}</span>
                  </div>
                  {/* 2-column: what | why */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, padding: "8px 16px 12px 42px" }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.tx, lineHeight: 1.7 }}>
                        {step.what.split("\n").map((line, li) => {
                          const renderBold = (text) => {
                            const parts = text.split(/\*\*(.*?)\*\*/g);
                            return parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi} style={{ fontWeight: 600 }}>{p}</strong> : p);
                          };
                          if (line.startsWith("> ")) return (
                            <div key={li} style={{ display: "flex", gap: 6, alignItems: "flex-start", padding: "2px 0" }}>
                              <span style={{ color: C.blue, flexShrink: 0, fontSize: 13, marginTop: 0 }}>{"\u2192"}</span>
                              <span>{renderBold(line.slice(2))}</span>
                            </div>
                          );
                          if (line.trim() === "") return <div key={li} style={{ height: 6 }} />;
                          return <div key={li}>{renderBold(line)}</div>;
                        })}
                      </div>
                    </div>
                    <div style={{ background: C.blueBg, borderRadius: 4, padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, color: C.txS, lineHeight: 1.7 }}>{step.why}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>)}
        </div>
      );
    })}
  </div>);
}

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("learn");
  const [startDate, setStartDate] = useState(null);
  const [data, setData] = useState({});
  const [agentData, setAgentData] = useState({});
  const [notes, setNotes] = useState([]);
  const [ccaData, setCcaData] = useState({});
  const [howtoData, setHowtoData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const saveGuard = useRef(false);

  useEffect(() => {
    (async () => {
      try { const r = await osLoad("gp-start", null); if (r) setStartDate(r); } catch (e) {}
      try { const r = await osLoad("gp-data", {}); if (Object.keys(r).length > 0) setData(r); } catch (e) {}
      try { const r = await osLoad("gp-agents", {}); if (Object.keys(r).length > 0) setAgentData(r); } catch (e) {}
      try { const r = await osLoad("gp-notes", []); if (r.length > 0) setNotes(r); } catch (e) {}
      try { const r = await osLoad("gp-cca", {}); if (Object.keys(r).length > 0) setCcaData(r); } catch (e) {}
      try { const r = await osLoad("gp-howto", {}); if (Object.keys(r).length > 0) setHowtoData(r); } catch (e) {}
      setLoaded(true);
      setTimeout(() => { saveGuard.current = true; }, 500);
    })();
  }, []);

  useEffect(() => {
    if (!loaded || !saveGuard.current) return;
    (async () => {
      try { if (startDate) await osSave("gp-start", startDate); } catch (e) {}
      try { if (Object.keys(data).length > 0) await osSave("gp-data", data); } catch (e) {}
      try { if (Object.keys(agentData).length > 0) await osSave("gp-agents", agentData); } catch (e) {}
      try { if (notes.length > 0) await osSave("gp-notes", notes); } catch (e) {}
      try { if (Object.keys(ccaData).length > 0) await osSave("gp-cca", ccaData); } catch (e) {}
      try { if (Object.keys(howtoData).length > 0) await osSave("gp-howto", howtoData); } catch (e) {}
    })();
  }, [startDate, data, agentData, notes, ccaData, howtoData, loaded]);

  const tabs = [
    { k: "learn", l: "Learning plan" },
    { k: "product", l: "Product blueprint" },
    { k: "cca", l: "CCA" },
    { k: "reference", l: "Reference" },
    { k: "howto", l: "How to" },
    { k: "notes", l: "Notes" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.tx }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 48px 60px" }}>
        <h1 style={{ fontFamily: F.serif, fontSize: 36, fontWeight: 700, color: C.tx, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>Growth Path</h1>
        <p style={{ fontFamily: F.sans, fontSize: 14, color: C.txS, margin: "4px 0 16px", lineHeight: 1.6 }}>Becoming an AI Implementation Specialist</p>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.bdr}`, marginBottom: 20 }}>
          {tabs.map((t, i) => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: `8px 16px 8px ${i === 0 ? 0 : 16}px`, border: "none", background: "none",
              fontFamily: F.sans, fontSize: 14, fontWeight: tab === t.k ? 600 : 400,
              color: tab === t.k ? C.tx : C.txT, cursor: "pointer",
              borderBottom: tab === t.k ? `2px solid ${C.tx}` : "2px solid transparent", marginBottom: -1,
            }}>{t.l}</button>
          ))}
        </div>
        {tab === "learn" && <LearningPlan startDate={startDate} setStartDate={setStartDate} data={data} setData={setData} />}
        {tab === "product" && <ProductBlueprint agentData={agentData} setAgentData={setAgentData} data={data} setData={setData} />}
        {tab === "cca" && <CCATab ccaData={ccaData} setCcaData={setCcaData} />}
        {tab === "reference" && <ReferenceTab />}
        {tab === "howto" && <HowToTab howtoData={howtoData} setHowtoData={setHowtoData} />}
        {tab === "notes" && <NotesTab notes={notes} setNotes={setNotes} />}
      </div>
    </div>
  );
}
