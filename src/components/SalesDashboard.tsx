"use client";

import { FormEvent, useMemo, useState } from "react";

type ProjectType = "install" | "proc" | "cons" | "svc";
type ProjectStatus = "run" | "done";

type Stage = {
  name: string;
  documents: [string, string][];
};

type Project = {
  code: string;
  name: string;
  client: string;
  type: ProjectType;
  stage: number;
  status: ProjectStatus;
  due: string;
  owner: string;
  late?: boolean;
  amount?: string;
  docs: Record<string, boolean>;
  log: { date: string; author: string; text: string }[];
};

const TYPES: Record<ProjectType, { name: string; color: string; stages: Stage[] }> = {
  install: {
    name: "납품 · 현장설치",
    color: "sales-chip-mint",
    stages: [
      { name: "계약", documents: [["계약서", "02.영업본부/■영업관리"], ["과업지시서 · 사양서", "02.영업본부/■문서관리대장"]] },
      { name: "생산", documents: [["작업지시서", "05.생산팀/07. 작업지시서"], ["제작도면", "05.생산팀/08. 제작도면"]] },
      { name: "출하", documents: [["출하성적서", "05.생산팀/00. 출하성적서"], ["거래명세서", "확인 필요"]] },
      { name: "현장 설치", documents: [["설치확인서", "확인 필요"], ["설치 현장 사진", "03.홍보팀/시공사례"]] },
      { name: "검수", documents: [["검수조서", "확인 필요"]] },
      { name: "대금 청구", documents: [["대금청구서", "확인 필요"], ["세금계산서", "경영지원팀 (폴더 없음)"]] },
    ],
  },
  proc: {
    name: "납품 · 조달",
    color: "sales-chip-blue",
    stages: [
      { name: "조달 계약", documents: [["납품요구서", "02.영업본부/폴더_조달"], ["계약서", "02.영업본부/■영업관리"]] },
      { name: "생산", documents: [["작업지시서", "05.생산팀/07. 작업지시서"]] },
      { name: "납품", documents: [["납품서", "02.영업본부/폴더_조달"], ["출하성적서", "05.생산팀/00. 출하성적서"]] },
      { name: "검수", documents: [["검사 · 검수조서", "확인 필요"]] },
      { name: "대금 청구", documents: [["대금청구서", "확인 필요"], ["세금계산서", "경영지원팀 (폴더 없음)"]] },
    ],
  },
  cons: {
    name: "공사",
    color: "sales-chip-yellow",
    stages: [
      { name: "계약", documents: [["계약서", "02.영업본부/■영업관리"], ["설계도서 · 내역서", "07.설계감리팀/20XX년 설계"]] },
      { name: "착공", documents: [["착공계", "02.영업본부/20XX년 통신공사"], ["공정표", "확인 필요"], ["현장대리인계", "확인 필요"]] },
      { name: "시공", documents: [["작업일보", "확인 필요"], ["공사 사진", "02.영업본부/20XX년 통신공사"]] },
      { name: "준공", documents: [["준공계", "02.영업본부/20XX년 통신공사"], ["준공도면", "07.설계감리팀/도곽(소공)"]] },
      { name: "준공검사", documents: [["준공검사조서", "07.설계감리팀/20XX년 감리"]] },
      { name: "대금 청구", documents: [["대금청구서", "확인 필요"], ["세금계산서", "경영지원팀 (폴더 없음)"]] },
    ],
  },
  svc: {
    name: "용역",
    color: "sales-chip-olive",
    stages: [
      { name: "계약", documents: [["계약서", "02.영업본부/■영업관리"], ["과업지시서", "02.영업본부/■문서관리대장"]] },
      { name: "착수", documents: [["착수계", "확인 필요"], ["수행계획서", "06.기술영업팀/10. 정보통신 유지보수"]] },
      { name: "수행", documents: [["점검 · 중간보고서", "06.기술영업팀/10. 정보통신 유지보수"]] },
      { name: "완료 보고", documents: [["완료보고서", "06.기술영업팀/10. 정보통신 유지보수"]] },
      { name: "검수", documents: [["검수조서", "확인 필요"]] },
      { name: "대금 청구", documents: [["대금청구서", "확인 필요"], ["세금계산서", "경영지원팀 (폴더 없음)"]] },
    ],
  },
};

const initialProjects: Project[] = [
  { code: "프젝3", name: "프젝3", client: "프젝3", type: "cons", stage: 0, status: "run", due: "확인 필요", owner: "확인 필요", docs: {}, log: [{ date: "11/12", author: "확인 필요", text: "사업 등록 · 공사 폴더 생성" }] },
  { code: "프젝2", name: "프젝2", client: "프젝2", type: "cons", stage: 0, status: "run", due: "확인 필요", owner: "확인 필요", docs: {}, log: [{ date: "11/12", author: "확인 필요", text: "사업 등록 · 공사 폴더 생성" }] },
  { code: "프젝1", name: "프젝1", client: "프젝1", type: "cons", stage: 0, status: "run", due: "확인 필요", owner: "확인 필요", docs: {}, log: [{ date: "11/12", author: "확인 필요", text: "사업 등록 · 공사 폴더 생성" }] },
  { code: "R26TB02253316-00", name: "클린하우스 CCTV 구입(노와3리)", client: "평택시 팽성읍", type: "proc", stage: 0, status: "run", due: "2026-10-24", owner: "확인 필요", amount: "700760", docs: { "0-0": true }, log: [{ date: "11/12", author: "확인 필요", text: "납기(2026-10-24)가 지났음 — 납품·검수 여부 확인 필요" }] },
  { code: "26-01", name: "장비이설공사", client: "평택시청 교통행정과", type: "cons", stage: 0, status: "run", due: "확인 필요", owner: "확인 필요", docs: {}, log: [{ date: "11/11", author: "확인 필요", text: "사업 등록" }] },
];

const today = () => {
  const date = new Date();
  return `${date.getMonth() + 1}/${String(date.getDate()).padStart(2, "0")}`;
};

function documentTotal(project: Project) {
  return TYPES[project.type].stages.reduce((total, stage) => total + stage.documents.length, 0);
}

function documentReady(project: Project) {
  return Object.values(project.docs).filter(Boolean).length;
}

function percent(project: Project) {
  return Math.round((documentReady(project) / documentTotal(project)) * 100);
}

function money(value?: string) {
  return value ? `${Number(value).toLocaleString("ko-KR")}원` : "";
}

export default function SalesDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [tab, setTab] = useState<ProjectStatus>("run");
  const [selectedCode, setSelectedCode] = useState(initialProjects[0].code);
  const [showNew, setShowNew] = useState(false);
  const [logAuthor, setLogAuthor] = useState("");
  const [logText, setLogText] = useState("");
  const [now] = useState(() => Date.now());

  const visibleProjects = projects.filter((project) => project.status === tab);
  const selected = projects.find((project) => project.code === selectedCode) ?? visibleProjects[0];
  const running = projects.filter((project) => project.status === "run");
  const average = running.length ? Math.round(running.reduce((sum, project) => sum + percent(project), 0) / running.length) : 0;

  const updateSelected = (update: (project: Project) => Project) => {
    if (!selected) return;
    setProjects((current) => current.map((project) => project.code === selected.code ? update(project) : project));
  };

  const toggleDocument = (key: string, checked: boolean) => {
    updateSelected((project) => ({ ...project, docs: { ...project.docs, [key]: checked } }));
  };

  const moveStage = (direction: -1 | 1) => {
    updateSelected((project) => {
      const max = TYPES[project.type].stages.length - 1;
      const stage = Math.min(max, Math.max(0, project.stage + direction));
      return stage === project.stage ? project : { ...project, stage, log: [{ date: today(), author: "현황판", text: `단계 변경: ${TYPES[project.type].stages[stage].name}` }, ...project.log] };
    });
  };

  const finish = (status: ProjectStatus) => {
    updateSelected((project) => ({
      ...project,
      status,
      stage: status === "done" ? TYPES[project.type].stages.length - 1 : project.stage,
      late: false,
      log: [{ date: today(), author: "현황판", text: status === "done" ? "사업 완료 처리" : "사업을 다시 진행으로 변경" }, ...project.log],
    }));
    setTab(status);
  };

  const addLog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!logAuthor.trim() || !logText.trim()) return;
    updateSelected((project) => ({ ...project, log: [{ date: today(), author: logAuthor.trim(), text: logText.trim() }, ...project.log] }));
    setLogAuthor("");
    setLogText("");
  };

  const addProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const client = String(form.get("client") ?? "").trim();
    if (!name || !client) return;
    const code = String(form.get("code") ?? "").trim() || `26-${String(projects.length + 1).padStart(2, "0")}`;
    if (projects.some((project) => project.code === code)) return;
    const project: Project = { code, name, client, type: (form.get("type") as ProjectType) || "cons", stage: 0, status: "run", due: String(form.get("due") ?? "") || "확인 필요", owner: String(form.get("owner") ?? "") || "확인 필요", docs: {}, log: [{ date: today(), author: String(form.get("owner") ?? "") || "현황판", text: "사업 등록" }] };
    setProjects((current) => [project, ...current]);
    setSelectedCode(code);
    setTab("run");
    setShowNew(false);
  };

  const soon = useMemo(() => running.filter((project) => {
    const date = Date.parse(project.due);
    return !Number.isNaN(date) && (date - now) / 86400000 <= 45 && date >= now;
  }).length, [now, running]);

  return (
    <div className="sales-dashboard">
      <header className="sales-band">
        <div className="sales-inner">
          <div className="sales-brand-row">
            <div>
              <div className="sales-mark">비전정보통신 · 업무 허브</div>
              <h1>사업 현황판</h1>
              <p>사업별 진행 단계, 필요 서류, 진행 사항을 한 화면에서 봅니다.</p>
            </div>
            <div className="sales-slogan">안전과 환경이 공존하는 미래 가치를 추구합니다</div>
          </div>
          <div className="sales-kpis">
            <div><small>진행 중 사업</small><strong>{running.length}건</strong></div>
            <div><small>지연</small><strong>{running.filter((project) => project.late).length}건</strong></div>
            <div><small>평균 서류 준비율</small><strong>{average}%</strong></div>
            <div><small>45일 안 납기</small><strong>{soon}건</strong></div>
          </div>
        </div>
      </header>

      <main className="sales-inner sales-main">
        <div className="sales-note">사업은 영업본부에서 관리합니다. 체크와 기록은 현재 화면에서 바로 확인할 수 있습니다.</div>
        <div className="sales-toolbar">
          <div className="sales-tabs">
            <button className={tab === "run" ? "active" : ""} onClick={() => setTab("run")}>진행 중 {running.length}</button>
            <button className={tab === "done" ? "active" : ""} onClick={() => setTab("done")}>완료 {projects.length - running.length}</button>
          </div>
          <button className="sales-button primary" onClick={() => setShowNew((value) => !value)}>+ 새 사업</button>
        </div>

        {showNew && (
          <form className="sales-panel sales-form" onSubmit={addProject}>
            <h2>새 사업 등록</h2>
            <label>사업명 *<input name="name" required placeholder="예: 클린하우스 CCTV 구입" /></label>
            <label>발주처 *<input name="client" required placeholder="예: 평택시 팽성읍" /></label>
            <label>유형<select name="type" defaultValue="cons">{Object.entries(TYPES).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select></label>
            <label>납기<input name="due" type="date" /></label>
            <label>담당<input name="owner" placeholder="예: 영업본부 담당자" /></label>
            <label>계약번호<input name="code" placeholder="예: 26-02" /></label>
            <div className="sales-form-actions"><button className="sales-button primary" type="submit">추가</button><button className="sales-button" type="button" onClick={() => setShowNew(false)}>취소</button></div>
          </form>
        )}

        <div className="sales-project-grid">
          {visibleProjects.length ? visibleProjects.map((project) => {
            const type = TYPES[project.type];
            return <button key={project.code} className={`sales-project-card ${selected?.code === project.code ? "selected" : ""}`} onClick={() => setSelectedCode(project.code)}>
              <div className="sales-project-top"><span className="sales-code">{project.code}</span><span className={`sales-chip ${type.color}`}>{type.name}</span></div>
              <strong>{project.client} · {project.name}</strong>
              <small>{project.status === "done" ? "완료" : `현재: ${type.stages[project.stage].name}`} · 납기 {project.due || "-"}</small>
              <div className="sales-progress"><span style={{ width: `${percent(project)}%` }} /></div>
              <div className="sales-card-footer"><span>서류 {documentReady(project)} / {documentTotal(project)}</span>{project.status === "done" && <span className="sales-chip sales-chip-done">완료</span>}</div>
            </button>;
          }) : <div className="sales-empty">{tab === "run" ? "진행 중인 사업이 없습니다." : "아직 완료된 사업이 없습니다."}</div>}
        </div>

        {selected && <section className="sales-panel sales-detail">
          <div className="sales-detail-header">
            <div><div className="sales-project-top"><span className="sales-code">{selected.code}</span><span className={`sales-chip ${TYPES[selected.type].color}`}>{TYPES[selected.type].name}</span></div><h2>{selected.client} · {selected.name}</h2><div className="sales-facts"><span>담당 {selected.owner}</span><span>납기 {selected.due}</span><span>서류 준비 {percent(selected)}%</span>{selected.amount && <span>계약금액 {money(selected.amount)}</span>}</div></div>
            <div className="sales-actions">{selected.status === "done" ? <button className="sales-button" onClick={() => finish("run")}>다시 진행</button> : <><button className="sales-button" disabled={selected.stage === 0} onClick={() => moveStage(-1)}>이전 단계</button><button className="sales-button" disabled={selected.stage === TYPES[selected.type].stages.length - 1} onClick={() => moveStage(1)}>다음 단계</button><button className="sales-button primary" onClick={() => finish("done")}>완료 처리</button></>}</div>
          </div>
          <div className="sales-steps">{TYPES[selected.type].stages.map((stage, index) => <div className={`sales-step ${selected.status === "done" || index < selected.stage ? "done" : ""} ${selected.status !== "done" && index === selected.stage ? "current" : ""}`} key={stage.name}><i /><span>{stage.name}</span></div>)}</div>
          <div className="sales-columns">
            <div className="sales-box"><div className="sales-box-heading"><h3>필요 서류</h3><small>체크 = 준비됨 · 옆은 저장 위치</small></div>{TYPES[selected.type].stages.map((stage, stageIndex) => <div className={`sales-document-group ${selected.status !== "done" && stageIndex === selected.stage ? "current" : ""}`} key={stage.name}><b>{stage.name}</b>{stage.documents.map(([name, location], documentIndex) => { const key = `${stageIndex}-${documentIndex}`; return <label className={selected.docs[key] ? "checked" : ""} key={key}><input type="checkbox" checked={Boolean(selected.docs[key])} onChange={(event) => toggleDocument(key, event.target.checked)} /><span>{name} <small>· {location}</small></span></label>; })}</div>)}</div>
            <div className="sales-box"><div className="sales-box-heading"><h3>진행 사항</h3><small>최신순</small></div><div className="sales-log">{selected.log.map((entry, index) => <div key={`${entry.date}-${index}`}><span>{entry.text}</span><small>{entry.date} · {entry.author}</small></div>)}</div><form className="sales-log-form" onSubmit={addLog}><input value={logAuthor} onChange={(event) => setLogAuthor(event.target.value)} placeholder="작성자" required /><input value={logText} onChange={(event) => setLogText(event.target.value)} placeholder="진행 사항 한 줄" required /><button className="sales-button" type="submit">추가</button></form></div>
          </div>
        </section>}
      </main>
    </div>
  );
}
