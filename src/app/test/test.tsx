"use client";

/**
 * Navbar prototype (mock data only, no routing / auth).
 * Open /test to preview. Click menu items to see the placeholder panel.
 */

import { useState } from "react";

/* ───────────────────────── icons ───────────────────────── */

const ICONS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z",
  calendar: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18",
  report: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  box: "M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8",
  tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  briefcase: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18",
  doc: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M12 12v6M9 15h6",
  truck: "M1 4h14v12H1zM15 9h4l3 3v4h-7zM6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  gov: "M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10l10-6 10 6z",
  handshake: "M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75",
  package: "M16.5 9.4 7.5 4.2M21 16V8l-9-5-9 5v8l9 5zM3.3 7 12 12l8.7-5M12 22V12",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  palette: "M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22zM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  wallet: "M20 7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h15V7M16 14h.01",
  factory: "M2 20V9l6 4V9l6 4V4h8v16zM6 17h2M12 17h2M18 17h2",
  flask: "M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L14 9V3M7 15h10",
  chart: "M3 3v18h18M7 16l4-5 3 3 5-7",
  users: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  key: "M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7z",
  server: "M3 4h18v7H3zM3 13h18v7H3zM7 7.5h.01M7 16.5h.01",
  template: "M4 4h16v5H4zM4 13h7v7H4zM15 13h5M15 17h5",
  rule: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  undo: "M3 7v6h6M3.5 13A9 9 0 1 0 6 6.3L3 9",
  log: "M12 8v4l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M18 6 6 18M6 6l12 12",
  chevron: "m9 6 6 6-6 6",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
} as const;

type IconName = keyof typeof ICONS;

function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ───────────────────────── menu data ───────────────────────── */

type Item = {
  id: string;
  label: string;
  icon?: IconName;
  /** Feature list shown under the item / in the preview panel. */
  features: string[];
  badge?: string;
  disabled?: boolean;
  children?: Item[];
};

type Group = {
  id: string;
  title: string;
  tag?: string;
  tone?: "default" | "brand" | "muted" | "exec";
  /** Header becomes a dropdown toggle that shows/hides the group's items. */
  collapsible?: boolean;
  items: Item[];
};

const WORK_GROUPS: Group[] = [
  {
    id: "common",
    title: "공통",
    tag: "모든 직원",
    items: [
      { id: "home", label: "홈", icon: "home", badge: "개인비서", features: ["오늘 할 일", "내 요청", "일정", "알림", "Claude 대화창"] },
      { id: "find", label: "자료 찾기", icon: "search", features: ["서버 검색 (RAG)", "경로 복사", "폴더 열기", "미리보기"] },
      { id: "requests", label: "요청함", icon: "inbox", badge: "3", features: ["받은 요청", "보낸 요청", "요청 → 접수 → 진행 → 완료/지연"] },
      { id: "schedule", label: "일정", icon: "calendar", features: ["내 일정", "팀 일정", "납기·출고", "연차/출장"] },
      { id: "daily", label: "업무보고", icon: "report", features: ["일일 입력", "주간 자동 정리"] },
      { id: "minutes", label: "회의록", icon: "mic", badge: "v1.5", features: ["녹음", "전사", "요약"] },
      { id: "products", label: "제품", icon: "box", features: ["제품 목록", "사양", "조달식별번호", "카탈로그 (조회)"] },
      { id: "tools", label: "도구", icon: "tool", features: ["번역", "계산기"] },
    ],
  },
  {
    id: "sales",
    title: "영업본부",
    tag: "v1",
    tone: "brand",
    collapsible: true,
    items: [
      { id: "s-dash", label: "대시보드", icon: "grid", features: ["진행·멈춘 사업", "단계별 파이프라인", "매출·미수금"] },
      { id: "s-biz", label: "사업", icon: "briefcase", features: ["목록", "상세 (기본정보 · 단계 · 서류 · 폴더 · 이력 · 요청)", "+ 새 사업"] },
      { id: "s-docs", label: "서류 생성", icon: "doc", features: ["착수계", "출고요청서", "납품계", "준공계", "대금청구 세트"] },
      { id: "s-cal", label: "납기·출고 캘린더", icon: "truck", features: ["납기", "출고"] },
      { id: "s-proc", label: "조달", icon: "gov", features: ["납품요구 수신함", "MAS/식별번호", "만료 알림"] },
      { id: "s-client", label: "거래처", icon: "handshake", features: ["발주처", "수요기관", "협력업체", "구매 이력"] },
      { id: "s-mat", label: "자재 발주·입고", icon: "package", badge: "보드 흡수", features: ["발주", "입고"] },
      {
        id: "t-tech",
        label: "기술영업팀",
        icon: "wrench",
        features: [],
        children: [
          { id: "t-tech-1", label: "유지보수 요청", features: ["요청 접수", "처리 현황"] },
          { id: "t-tech-2", label: "현장 작업", features: ["사진 업로드", "사진대지 자동 생성"] },
          { id: "t-tech-3", label: "점검보고서", features: ["보고서 작성"] },
          { id: "t-tech-4", label: "현장·장비 이력", features: ["현장 이력", "장비 이력"] },
        ],
      },
      {
        id: "t-pr",
        label: "홍보팀",
        icon: "palette",
        features: [],
        children: [
          { id: "t-pr-1", label: "시안 요청함", features: ["시안 요청", "진행 현황"] },
          { id: "t-pr-2", label: "관리번호 이력", features: ["관리번호 조회"] },
          { id: "t-pr-3", label: "지자체 디자인 규칙", features: ["지자체별 규칙"] },
          { id: "t-pr-4", label: "카탈로그·자료실", features: ["카탈로그", "자료실"] },
        ],
      },
    ],
  },
  {
    id: "soon",
    title: "준비 중",
    tag: "2027 상반기",
    tone: "muted",
    items: [
      { id: "x-mgmt", label: "경영지원팀", icon: "wallet", disabled: true, features: ["구매·발주대장", "계산서 요청", "입금 확인", "인증/계약 만료", "인사"] },
      { id: "x-prod", label: "생산팀", icon: "factory", disabled: true, features: ["작업 목록", "재고", "BOM", "출하검사"] },
      { id: "x-lab", label: "기업부설연구소", icon: "flask", disabled: true, features: ["제품 DB 편집", "연동 개발 요청 (Jira)", "인증"] },
    ],
  },
  {
    id: "exec",
    title: "임원",
    tag: "조회 전용",
    tone: "exec",
    items: [{ id: "e-overview", label: "전사 현황", icon: "chart", badge: "조회", features: ["단계(창고)별 건수·지연", "매출", "주간 요약"] }],
  },
];

const ADMIN_GROUPS: Group[] = [
  {
    id: "admin",
    title: "관리자",
    tag: "관리자 모드",
    tone: "brand",
    items: [
      { id: "a-users", label: "사용자 · 팀", icon: "users", badge: "있음", features: ["사용자 관리", "팀 관리"] },
      { id: "a-perm", label: "권한", icon: "key", features: ["역할", "프로세스 권한 (누가 어떤 요청을 보내고 처리하나)"] },
      { id: "a-prod", label: "제품", icon: "box", badge: "있음", features: ["제품 관리", "나중에 편집권을 연구소로 이관"] },
      { id: "a-server", label: "서버 연결", icon: "server", features: ["회사별 NAS 소스", "읽기 전용", "제외 규칙", "마지막 스캔"] },
      { id: "a-tpl", label: "서식 관리", icon: "template", features: ["템플릿", "기본정보 필드 매핑"] },
      { id: "a-rule", label: "규칙", icon: "rule", features: ["사업 단계 판정 규칙", "지연 기준", "알림 규칙"] },
      { id: "a-fix", label: "상태 바로잡기", icon: "undo", features: ["잘못 넘어간 요청·사업 단계 수정", "이력 남김"] },
      { id: "a-log", label: "기록", icon: "log", features: ["접속·열람·다운로드 로그", "AI 사용량"] },
      { id: "a-int", label: "연동 설정", icon: "plug", features: ["Telegram", "나라장터 API", "M365", "Jira", "메일 (IMAP/SMTP)"] },
    ],
  },
];

/** In the real app this comes from the login session (getSession). */
const MOCK_USER = { name: "케이디", initial: "케", company: "비전", team: "경영지원팀" };
type Mode = "work" | "admin";

function findItem(groups: Group[], id: string): { item: Item; group: Group; parent?: Item } | null {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.id === id) return { item, group };
      for (const child of item.children ?? []) if (child.id === id) return { item: child, group, parent: item };
    }
  }
  return null;
}

/* ───────────────────────── top bar ───────────────────────── */

/* Navbar palette (matches the 자재 발주·입고 board): dark navy bar + bright blue bottom border. */
const NAV = {
  bar: "bg-[#13293d] text-white",
  border: "border-b-[3px] border-[#1e90d0]",
  borderAdmin: "border-b-[3px] border-red-500",
  muted: "text-[#a9c3d6]",
  hover: "hover:bg-white/10 hover:text-white",
  accentBtn: "bg-[#2a7fa8] hover:bg-[#3190c0] text-white",
};

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const opts: { m: Mode; label: string; icon: IconName }[] = [
    { m: "work", label: "내 업무", icon: "briefcase" },
    { m: "admin", label: "관리자", icon: "shield" },
  ];
  return (
    <div role="group" aria-label="모드 전환" className="flex h-full items-stretch gap-1">
      {opts.map(({ m, label, icon }) => {
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(m)}
            title={`${label} 모드`}
            className={`my-2 flex items-center gap-1.5 rounded-md border-b-2 px-3 text-sm font-semibold transition-colors ${
              active
                ? m === "admin"
                  ? "border-red-500 bg-white/10 text-white"
                  : "border-[#1e90d0] bg-white/10 text-white"
                : `border-transparent text-[#d5e3ee] ${NAV.hover}`
            }`}
          >
            <Icon name={icon} className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({
  mode,
  setMode,
  onMenu,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  onMenu: () => void;
}) {
  const [bellOpen, setBellOpen] = useState(false);
  return (
    <header className={`sticky top-0 z-30 ${NAV.bar} ${mode === "admin" ? NAV.borderAdmin : NAV.border}`}>
      <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
        <button type="button" onClick={onMenu} aria-label="메뉴 열기" className={`rounded-md p-1.5 text-white md:hidden ${NAV.hover}`}>
          <Icon name="menu" className="size-5" />
        </button>

        <div className="flex shrink-0 items-center gap-2 border-r border-white/20 pr-4">
          <span className="text-lg font-extrabold tracking-tight whitespace-nowrap">
            VISION <span className="text-[#4fb3ea]">OS</span>
          </span>
          {mode === "admin" && <span className="rounded bg-red-500 px-1.5 py-0.5 text-[11px] font-semibold">관리자 모드</span>}
        </div>

        <ModeToggle mode={mode} onChange={setMode} />

        {/* search */}
        <label className="relative ml-auto hidden max-w-sm flex-1 sm:block">
          <span className="sr-only">검색</span>
          <Icon name="search" className={`pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 ${NAV.muted}`} />
          <input
            type="search"
            placeholder="사업, 서류, 서버 자료 검색…"
            className="h-9 w-full rounded-md border border-white/15 bg-white/10 pr-14 pl-8 text-sm text-white outline-none placeholder:text-[#8fa9bd] focus:border-[#1e90d0] focus:bg-white/15"
          />
          <kbd className={`pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-white/20 px-1.5 text-[10px] ${NAV.muted}`}>Ctrl K</kbd>
        </label>
        <button type="button" aria-label="검색" className={`ml-auto rounded-md p-2 text-white sm:hidden ${NAV.hover}`}>
          <Icon name="search" />
        </button>

        {/* notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="알림"
            aria-expanded={bellOpen}
            onClick={() => setBellOpen((v) => !v)}
            className={`relative rounded-md p-2 text-[#d5e3ee] ${NAV.hover}`}
          >
            <Icon name="bell" />
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">2</span>
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              <div className="flex items-center justify-between bg-[#13293d] px-3 py-2 text-white">
                <span className="text-xs font-semibold">알림</span>
                <button type="button" className={`rounded px-2 py-0.5 text-[11px] font-medium ${NAV.accentBtn}`}>모두 확인</button>
              </div>
              <div className="p-1.5">
                {[
                  ["요청 접수", "출고요청서 검토 요청이 도착했습니다."],
                  ["납기 임박", "○○시 CCTV 설치 사업 — 납기 D-3"],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-md px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <p className="font-medium">{t}</p>
                    <p className="text-xs text-zinc-500">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* profile */}
        <button type="button" className={`flex items-center gap-2 rounded-md p-1 pr-2 ${NAV.hover}`} aria-label="프로필">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#2a7fa8] text-xs font-semibold text-white">{MOCK_USER.initial}</span>
          <span className="hidden text-left leading-tight lg:block">
            <span className="block text-xs font-semibold text-white">{MOCK_USER.name}</span>
            <span className={`block text-[11px] ${NAV.muted}`}>
              {MOCK_USER.company} · {MOCK_USER.team}
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}

/* ───────────────────────── sidebar ───────────────────────── */

const TONE: Record<NonNullable<Group["tone"]>, string> = {
  default: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  brand: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  muted: "bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500",
  exec: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function NavRow({
  item,
  active,
  depth = 0,
  expanded,
  onClick,
}: {
  item: Item;
  active: boolean;
  depth?: number;
  expanded?: boolean;
  onClick: () => void;
}) {
  const hasChildren = !!item.children?.length;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-disabled={item.disabled || undefined}
      title={item.disabled ? "2027 상반기 예정" : undefined}
      className={`group flex w-full items-center gap-2.5 rounded-lg py-1.5 text-left text-sm transition-colors ${depth ? "pr-2 pl-9" : "px-3"} ${
        item.disabled
          ? "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
          : active
            ? "bg-zinc-200/70 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-white"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
      }`}
    >
      {depth === 0 && (item.icon ? <Icon name={item.icon} /> : <span className="size-4 shrink-0" />)}
      {depth > 0 && <span className={`size-1.5 shrink-0 rounded-full ${active ? "bg-red-600" : "bg-zinc-300 dark:bg-zinc-700"}`} />}
      <span className="flex-1 truncate">{item.label}</span>
      {item.disabled && <Icon name="lock" className="size-3.5" />}
      {item.badge && !item.disabled && (
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
            /^\d+$/.test(item.badge) ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {item.badge}
        </span>
      )}
      {hasChildren && <Icon name="chevron" className={`size-3.5 text-zinc-400 transition-transform ${expanded ? "rotate-90" : ""}`} />}
    </button>
  );
}

function Sidebar({
  groups,
  selected,
  onSelect,
  onDisabled,
}: {
  groups: Group[];
  selected: string;
  onSelect: (id: string) => void;
  onDisabled: (item: Item) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ "t-tech": true });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  return (
    <nav aria-label="주 메뉴" className="flex flex-col gap-5">
      {groups.map((g) => {
        const isCollapsed = !!collapsed[g.id];
        const titleCls = `text-xs font-semibold ${g.tone === "muted" ? "text-zinc-400" : "text-zinc-500"}`;
        const tag = g.tag && <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${TONE[g.tone ?? "default"]}`}>{g.tag}</span>;
        return (
        <div key={g.id}>
          {g.collapsible ? (
            <button
              type="button"
              aria-expanded={!isCollapsed}
              aria-controls={`group-${g.id}`}
              onClick={() => setCollapsed((c) => ({ ...c, [g.id]: !c[g.id] }))}
              className="mb-1.5 flex w-full items-center gap-2 rounded-md px-3 py-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <span className={titleCls}>{g.title}</span>
              {tag}
              <Icon name="chevron" className={`ml-auto size-3.5 text-zinc-400 transition-transform ${isCollapsed ? "" : "rotate-90"}`} />
            </button>
          ) : (
            <div className="mb-1.5 flex items-center gap-2 px-3">
              <p className={titleCls}>{g.title}</p>
              {tag}
            </div>
          )}
          <ul id={`group-${g.id}`} className={`flex flex-col gap-0.5 ${isCollapsed ? "hidden" : ""}`}>
            {g.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const expanded = !!open[item.id];
              const childActive = item.children?.some((c) => c.id === selected);
              return (
                <li key={item.id} className={hasChildren ? "relative" : undefined}>
                  <NavRow
                    item={item}
                    active={selected === item.id || (!expanded && !!childActive)}
                    expanded={expanded}
                    onClick={() => {
                      if (item.disabled) return onDisabled(item);
                      if (hasChildren) return setOpen((o) => ({ ...o, [item.id]: !o[item.id] }));
                      onSelect(item.id);
                    }}
                  />
                  {hasChildren && expanded && (
                    <ul className="relative mt-0.5 flex flex-col gap-0.5 before:absolute before:top-0 before:bottom-1 before:left-[1.2rem] before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
                      {item.children!.map((c) => (
                        <li key={c.id}>
                          <NavRow item={c} depth={1} active={selected === c.id} onClick={() => onSelect(c.id)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        );
      })}
    </nav>
  );
}

/* ───────────────────────── preview panel ───────────────────────── */

function Preview({ groups, selected, mode }: { groups: Group[]; selected: string; mode: Mode }) {
  const found = findItem(groups, selected);
  if (!found) return null;
  const { item, group, parent } = found;
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs text-zinc-500">
        {MOCK_USER.company} · {mode === "admin" ? "관리자" : "내 업무"} · {group.title}
        {parent ? ` · ${parent.label}` : ""}
      </p>
      <div className="mt-1 flex items-center gap-3">
        {(item.icon ?? parent?.icon) && <Icon name={(item.icon ?? parent?.icon)!} className="size-6 text-red-600" />}
        <h1 className="text-2xl font-bold">{item.label}</h1>
        {item.badge && <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">{item.badge}</span>}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {item.features.map((f) => (
          <div key={f} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium">{f}</p>
            <div className="mt-3 space-y-1.5">
              <div className="h-2 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-2 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>

      {item.id === "home" && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="sparkle" className="size-4 text-red-600" /> Claude 대화창
          </p>
          <div className="mt-3 flex gap-2">
            <input placeholder="무엇을 도와드릴까요?" className="h-10 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900" />
            <button type="button" className="rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">보내기</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function NavbarTest() {
  const [mode, setModeState] = useState<Mode>("work");
  const [selected, setSelected] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const groups = mode === "admin" ? ADMIN_GROUPS : WORK_GROUPS;

  const setMode = (m: Mode) => {
    setModeState(m);
    setSelected(m === "admin" ? "a-users" : "home");
  };
  const select = (id: string) => {
    setSelected(id);
    setMobileOpen(false);
  };
  const showDisabled = (item: Item) => {
    setToast(`${item.label} — 2027 상반기 예정`);
    window.setTimeout(() => setToast(null), 2200);
  };

  const sidebar = <Sidebar key={mode} groups={groups} selected={selected} onSelect={select} onDisabled={showDisabled} />;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <TopBar mode={mode} setMode={setMode} onMenu={() => setMobileOpen(true)} />

      <div className="flex flex-1">
        {/* desktop sidebar */}
        <aside className="sticky top-[59px] hidden h-[calc(100vh-59px)] w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white px-3 py-5 md:block dark:border-zinc-800 dark:bg-zinc-950">
          {sidebar}
        </aside>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button type="button" aria-label="메뉴 닫기" className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white px-3 py-4 shadow-xl dark:bg-zinc-950">
              <div className="mb-4 flex items-center justify-between px-3">
                <span className="text-sm font-semibold">메뉴</span>
                <button type="button" aria-label="닫기" onClick={() => setMobileOpen(false)} className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <Icon name="close" />
                </button>
              </div>
              {sidebar}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Preview groups={groups} selected={selected} mode={mode} />
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm text-white shadow-lg dark:bg-white dark:text-zinc-900">
          {toast}
        </div>
      )}
    </div>
  );
}
