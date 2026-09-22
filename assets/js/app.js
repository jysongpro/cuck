/* =========================================================================
 * 한국폴리텍대학 교과과정 개편 세부기준 검수 프로그램
 * app.js  -  라우팅 / 화면 렌더링 / 검수 엔진
 * ========================================================================= */

/* ---------- 아이콘(SVG) 라이브러리 ------------------------------------- */
const ICON = {
  cap: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5"/><path d="M22 10v6"/></svg>',
  tools: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0 5 5l-7.6 7.6a2.1 2.1 0 0 1-3-3l7.6-7.6a4 4 0 0 0-2-2.6"/><path d="m3 21 4-4"/><path d="M14.5 5.5 18 2l4 4-3.5 3.5"/></svg>',
  set: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></svg>',
  check: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  list: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>',
  home: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>',
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  ok: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  no: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  big_ok: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  big_no: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  upload: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>',
  logo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
};

/* ---------- 저장소(localStorage) -------------------------------------- */
const STORE_KEY = 'kpu-curri-standards-v1';
const Store = {
  all() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
  },
  // 검수 엔진용 — 평면(legacy) 기준값 반환. 스펙 과정은 매핑하여 호환 제공.
  get(courseKey) {
    if (COURSE_SPECS[courseKey]) return legacyFromSpec(courseKey);
    const saved = this.all()[courseKey];
    return saved ? Object.assign({}, DEFAULT_STANDARDS[courseKey], saved)
                 : Object.assign({}, DEFAULT_STANDARDS[courseKey]);
  },
  // 스펙 과정용 — { standards:{}, checklist:{} } (기본값 + 저장값 병합)
  getSpec(courseKey) {
    const spec = COURSE_SPECS[courseKey];
    const d = { standards: {}, checklist: {} };
    spec.standardGroups.forEach(g => g.fields.forEach(f => d.standards[f.key] = f.def));
    spec.checklist.forEach(c => d.checklist[c.key] = c.def);
    const saved = this.all()[courseKey] || {};
    return {
      standards: Object.assign({}, d.standards, saved.standards || {}),
      checklist: Object.assign({}, d.checklist, saved.checklist || {}),
    };
  },
  saveSpec(courseKey, obj) {
    const all = this.all();
    all[courseKey] = obj;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
  isSet(courseKey) { return !!this.all()[courseKey]; },
  save(courseKey, data) {
    const all = this.all();
    all[courseKey] = data;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
  reset(courseKey) {
    const all = this.all();
    delete all[courseKey];
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
};

/* ---------- 교과목 편성기준 저장소 ------------------------------------ */
const RULE_KEY = 'kpu-curri-courserules-v1';
const CourseRuleStore = {
  all() { try { return JSON.parse(localStorage.getItem(RULE_KEY)) || {}; } catch { return {}; } },
  get(courseKey) {
    const saved = this.all()[courseKey];
    const src = saved ? saved : (DEFAULT_COURSE_RULES[courseKey] || []);
    return src.map(r => {
      const o = Object.assign({}, r);
      if (o.creditMin == null && o.credit != null) o.creditMin = o.credit;  // 구버전 단일 credit → 최소
      if (o.creditMax == null && o.credit != null) o.creditMax = o.credit;  //                  → 최대
      return o;
    });
  },
  isSet(courseKey) { return !!this.all()[courseKey]; },
  save(courseKey, rules) {
    const all = this.all(); all[courseKey] = rules;
    localStorage.setItem(RULE_KEY, JSON.stringify(all));
  },
  reset(courseKey) {
    const all = this.all(); delete all[courseKey];
    localStorage.setItem(RULE_KEY, JSON.stringify(all));
  },
};

/* ---------- 검수결과 내역 저장소(localStorage) ------------------------- */
const HISTORY_KEY = 'kpu-curri-history-v1';
const HistoryStore = {
  all() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  },
  save(list) { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); },
  add(record) {
    const list = this.all();
    list.unshift(record);
    this.save(list);
    return record;
  },
  remove(ids) {
    const idSet = new Set(ids);
    const list = this.all().filter(r => !idSet.has(r.id));
    this.save(list);
    return list;
  },
  get(id) { return this.all().find(r => r.id === id) || null; },
  update(id, patch) {
    const list = this.all();
    const idx = list.findIndex(r => r.id === id);
    if (idx < 0) return null;
    list[idx] = { ...list[idx], ...patch };
    this.save(list);
    return list[idx];
  },
};

/* ---------- 교양교과(역량군별 필수·선택 교과) 저장소 ------------------------------ */
const LIBERAL_KEY = 'kpu-curri-liberalarts-v1';
const LIBERAL_GROUPS = [
  { key: 'comm',        label: '의사소통능력',        core: true },
  { key: 'creative',    label: '창의생활예술융합능력',  core: true },
  { key: 'selfmgmt',    label: '자기관리능력',        core: true },
  { key: 'interp',      label: '대인관계협업능력',      core: true },
  { key: 'econ',        label: '경제생활활용능력',      core: true },
  { key: 'digitalai',   label: '디지털AI능력',          core: false },
];
const LiberalArtsStore = {
  all() { try { return JSON.parse(localStorage.getItem(LIBERAL_KEY)) || {}; } catch { return {}; } },
  get(courseKey) {
    const saved = this.all()[courseKey];
    const base = {};
    LIBERAL_GROUPS.forEach(g => { base[g.key] = { required: [], elective: [] }; });
    if (!saved) return base;
    LIBERAL_GROUPS.forEach(g => {
      base[g.key].required = (saved[g.key] && saved[g.key].required) || [];
      base[g.key].elective = (saved[g.key] && saved[g.key].elective) || [];
    });
    return base;
  },
  isSet(courseKey) { return !!this.all()[courseKey]; },
  save(courseKey, data) {
    const all = this.all(); all[courseKey] = data;
    localStorage.setItem(LIBERAL_KEY, JSON.stringify(all));
  },
  reset(courseKey) {
    const all = this.all(); delete all[courseKey];
    localStorage.setItem(LIBERAL_KEY, JSON.stringify(all));
  },
};

/* ---------- 교양필수교과 검수로직(사용자 설정 가능) 저장소 ------------------------------ */
const LIBERAL_RULE_KEY = 'kpu-curri-liberal-checkrule-v1';
const LIBERAL_RULE_DEFAULT = {
  checkOffered: true,       // 설정된 필수교과가 역량군별로 실제 편성되어있는지 검수
  checkMaxPerGroup: true,   // 역량군당 초과 편성 여부 검수
  maxPerGroup: 1,           // 역량군당 허용 최대 과목수
  checkTotal: true,         // 총 편성 역량군수/학점 검수
  targetGroupCount: 3,      // 목표 편성 역량군 수
  targetTotalCredit: 6,     // 목표 총학점
};
const LiberalCheckRuleStore = {
  all() { try { return JSON.parse(localStorage.getItem(LIBERAL_RULE_KEY)) || {}; } catch { return {}; } },
  get(courseKey) {
    const saved = this.all()[courseKey];
    return Object.assign({}, LIBERAL_RULE_DEFAULT, saved || {});
  },
  save(courseKey, rule) {
    const all = this.all(); all[courseKey] = rule;
    localStorage.setItem(LIBERAL_RULE_KEY, JSON.stringify(all));
  },
};

/* ---------- 단순 교과등록(산업안전·산업AI 등) — 1과목 이상 편성 검수용 공통 저장소/검수기준 -------------- */
const SIMPLE_LIST_TYPES = {
  safety: { storeKey: 'kpu-curri-simplelist-safety-v1', ruleKey: 'kpu-curri-simplerule-safety-v1', regTitle: '산업안전교과 등록', checkTitle: '산업안전교과 편성확인', itemLabel: '산업안전교과', checkLabel: '산업안전교과 편성 여부' },
  industrialAi: { storeKey: 'kpu-curri-simplelist-industrialai-v1', ruleKey: 'kpu-curri-simplerule-industrialai-v1', regTitle: '산업AI교과 등록', checkTitle: '산업AI교과 편성확인', itemLabel: '산업AI교과', checkLabel: '산업AI교과 편성 여부' },
  aiApplied: { storeKey: 'kpu-curri-simplelist-aiapplied-v1', ruleKey: 'kpu-curri-simplerule-aiapplied-v1', regTitle: 'AI활용교과 등록', checkTitle: 'AI활용교과 편성확인', itemLabel: 'AI활용교과', checkLabel: 'AI활용교과 편성 여부' },
};
const SIMPLE_RULE_DEFAULT = { checkMinOne: true, minCount: 1 };
/* 이 앱이 사용하는 모든 localStorage 키 — 내보내기/가져오기(백업·복원) 대상 */
function allStorageKeys() {
  const keys = [STORE_KEY, RULE_KEY, HISTORY_KEY, LIBERAL_KEY, LIBERAL_RULE_KEY];
  Object.keys(SIMPLE_LIST_TYPES).forEach(type => {
    keys.push(SIMPLE_LIST_TYPES[type].storeKey, SIMPLE_LIST_TYPES[type].ruleKey);
  });
  return keys;
}
/* 현재 브라우저(localStorage)에 저장된 세부기준·등록교과·검수이력 등 모든 데이터를 하나의 JSON 파일로 내보낸다.
 * 다른 컴퓨터(브라우저)에서 importAllData()로 불러오면 지금과 동일한 상태로 복원된다. */
function exportAllData() {
  const data = {};
  allStorageKeys().forEach(k => {
    const v = localStorage.getItem(k);
    if (v !== null) data[k] = v;
  });
  const payload = {
    app: 'CurriculumChecker',
    version: (typeof APP_META !== 'undefined' && APP_META.version) || '',
    exportedAt: new Date().toISOString(),
    data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  a.href = url;
  a.download = `CurriculumChecker-backup-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('현재 설정·데이터를 파일로 내보냈습니다. 다른 컴퓨터에서 이 파일을 "데이터 가져오기"로 불러오면 동일하게 적용됩니다.');
}
/* exportAllData()가 만든 백업 JSON 파일을 읽어 현재 브라우저의 localStorage에 그대로 복원(덮어쓰기)한다. */
function importAllData(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (!confirm('파일에 저장된 설정·데이터로 현재 브라우저의 모든 저장값(세부기준, 등록교과, 검수이력 등)을 덮어씁니다. 계속할까요?')) { ev.target.value = ''; return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      const data = payload && payload.data ? payload.data : payload; // 구버전 형식 호환
      if (!data || typeof data !== 'object') throw new Error('invalid');
      let count = 0;
      allStorageKeys().forEach(k => {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          localStorage.setItem(k, data[k]);
          count++;
        }
      });
      toast(`데이터를 불러왔습니다 (${count}개 항목). 화면을 새로고침합니다.`);
      setTimeout(() => location.reload(), 800);
    } catch (e) {
      toast('파일을 읽는 데 실패했습니다. 올바른 백업 파일인지 확인해주세요.');
    } finally {
      ev.target.value = '';
    }
  };
  reader.readAsText(file);
}
const SimpleListStore = {
  all(type) { try { return JSON.parse(localStorage.getItem(SIMPLE_LIST_TYPES[type].storeKey)) || {}; } catch { return {}; } },
  get(type, courseKey) { const saved = this.all(type)[courseKey]; return saved || []; },
  save(type, courseKey, list) {
    const all = this.all(type); all[courseKey] = list;
    localStorage.setItem(SIMPLE_LIST_TYPES[type].storeKey, JSON.stringify(all));
  },
  isSet(type, courseKey) { const l = this.get(type, courseKey); return l.some(r => (r.name || '').trim()); },
};
const SimpleRuleStore = {
  all(type) { try { return JSON.parse(localStorage.getItem(SIMPLE_LIST_TYPES[type].ruleKey)) || {}; } catch { return {}; } },
  get(type, courseKey) { const saved = this.all(type)[courseKey]; return Object.assign({}, SIMPLE_RULE_DEFAULT, saved || {}); },
  save(type, courseKey, rule) { const all = this.all(type); all[courseKey] = rule; localStorage.setItem(SIMPLE_LIST_TYPES[type].ruleKey, JSON.stringify(all)); },
};

/* 스펙(상세) 기준값 → 검수 엔진용 평면 기준값 매핑 */
function legacyFromSpec(courseKey) {
  const s = Store.getSpec(courseKey).standards;
  return {
    totalCreditsMin: s.totalOfferMin != null ? s.totalOfferMin : s.gradCredits,
    totalCreditsMax: s.totalOfferMax,
    semesters: s.semesters || 4,
    creditsPerSemMin: s.semTakeMin,
    creditsPerSemMax: s.semOfferMax || s.semTakeMax,   // 업로드본=편성학점 → 학기별 편성 상한(34)으로 점검
    courseCreditMin: 1,
    courseCreditMax: Math.max(s.courseCreditMax || 3, 4),
    practiceRatioMin: s.practiceRatioMin,
    requiredRatioMin: 0,      // 공식문서 미지정 → 비율 점검 제외
    fieldTraining: true,      // 현장실습 필수
    capstone: false,
    majorReqMin: s.majorReqMin || 0,   // 전공필수 편성학점(최소)
    majorReqMax: s.majorReqMax || 0,   // 전공필수 편성학점(최대)
    majorOfferMin: s.majorOfferMin || 0,  // 전공선택교과 편성(최소)
    majorOfferMax: s.majorOfferMax || 0,  // 전공선택교과 편성(최대)
  };
}

/* ---------- 유틸 ------------------------------------------------------- */
const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._tmr); t._tmr = setTimeout(() => t.classList.remove('show'), 2200);
}

function findCourse(courseKey) {
  for (const cat of Object.values(PROGRAM_TREE)) {
    const c = cat.courses.find(x => x.key === courseKey);
    if (c) return { cat, course: c };
  }
  return null;
}

/* =========================================================================
 * 관리자 인증 — 세부기준 설정 / 교과목 등록 기능은 관리자만 접근 가능
 * ========================================================================= */
const ADMIN_PASS_KEY = 'kpu-curri-adminpass-v1';
const ADMIN_SESSION_KEY = 'kpu-curri-adminsession-v1';
function getAdminPassword() { return localStorage.getItem(ADMIN_PASS_KEY) || '1234'; }
function setAdminPassword(pw) { localStorage.setItem(ADMIN_PASS_KEY, pw); }
function isAdmin() { return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; }
let _adminPendingCallback = null;
let _adminLoginIsStandalone = false; // 홈에서 직접 '관리자 로그인' 버튼을 눌러 연 경우(취소해도 이동 없음)

function requireAdmin(fn) {
  if (isAdmin()) { fn(); return; }
  _adminPendingCallback = fn;
  _adminLoginIsStandalone = false;
  openAdminModal();
}
function openAdminLoginStandalone() {
  _adminPendingCallback = null;
  _adminLoginIsStandalone = true;
  openAdminModal();
}
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  const input = document.getElementById('adminPwInput');
  if (!modal || !input) return;
  input.value = '';
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}
function closeAdminModal(cancelled) {
  const modal = document.getElementById('adminModal');
  if (modal) modal.style.display = 'none';
  if (cancelled && _adminPendingCallback && !_adminLoginIsStandalone) navigate('home');
  _adminPendingCallback = null;
}
function submitAdminLogin() {
  const input = document.getElementById('adminPwInput');
  const val = input ? input.value : '';
  if (val === getAdminPassword()) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    document.getElementById('adminModal').style.display = 'none';
    toast('관리자 모드로 전환되었습니다.');
    updateAdminBadge();
    const cb = _adminPendingCallback;
    _adminPendingCallback = null;
    if (cb) cb(); else router();
  } else {
    toast('비밀번호가 올바르지 않습니다.');
    input.value = '';
    input.focus();
  }
}
function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  toast('관리자 모드가 종료되었습니다.');
  updateAdminBadge();
  navigate('home');
}
function changeAdminPassword() {
  if (!isAdmin()) return;
  const cur = prompt('현재 관리자 비밀번호를 입력하세요.');
  if (cur === null) return;
  if (cur !== getAdminPassword()) { toast('현재 비밀번호가 일치하지 않습니다.'); return; }
  const next = prompt('새 관리자 비밀번호를 입력하세요.');
  if (next === null) return;
  if (!next.trim()) { toast('비밀번호를 입력해주세요.'); return; }
  const confirmNext = prompt('새 비밀번호를 한 번 더 입력하세요.');
  if (confirmNext !== next) { toast('입력한 비밀번호가 서로 다릅니다.'); return; }
  setAdminPassword(next.trim());
  toast('관리자 비밀번호가 변경되었습니다.');
}
/* 상단바의 관리자 로그인/로그아웃 영역을 현재 상태에 맞게 다시 그린다 */
function updateAdminBadge() {
  const area = document.getElementById('adminArea');
  if (!area) return;
  if (isAdmin()) {
    area.innerHTML = `
      <button class="home-btn" onclick="changeAdminPassword()" title="관리자 비밀번호 변경">${ICON.set} 비밀번호 변경</button>
      <button class="home-btn" onclick="adminLogout()" title="관리자 모드 종료">${ICON.check} 관리자 로그아웃</button>
    `;
  } else {
    area.innerHTML = `<button class="home-btn" onclick="openAdminLoginStandalone()" title="세부기준 설정 등 관리자 기능 이용">${ICON.set} 관리자 로그인</button>`;
  }
}

/* ---------- 라우터 ----------------------------------------------------- */
const routes = [];
function route(pattern, handler) {
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:([^/]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ rx, keys, handler });
}

route('',                              () => renderHome());
route('home',                          () => renderHome());
route('cat/:cat',                      (p) => renderHub(p.cat));
route('cat/:cat/standards',            (p) => requireAdmin(() => renderCoursePicker(p.cat, 'standards')));
route('cat/:cat/standards/:course',    (p) => requireAdmin(() => renderStandards(p.course)));
route('cat/:cat/check',                (p) => renderCoursePicker(p.cat, 'check'));
route('cat/:cat/check/:course',        (p) => renderCheck(p.course));
route('cat/:cat/liberal/:course',      (p) => requireAdmin(() => renderLiberalArts(p.course)));
route('cat/:cat/simplelist/:type/:course', (p) => requireAdmin(() => renderSimpleList(p.type, p.course)));
route('history',                       () => renderHistory());
route('history/:id',                   (p) => renderHistoryDetail(p.id));

function navigate(hash) { location.hash = '#/' + hash; }

function router() {
  const raw = location.hash.replace(/^#\/?/, '');
  for (const r of routes) {
    const m = raw.match(r.rx);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
      window.scrollTo(0, 0);
      r.handler(params);
      document.body.classList.toggle('is-home', raw === '' || raw === 'home');
      return;
    }
  }
  renderHome();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  // 상단바 텍스트 채우기
  $('#brandTitle').textContent = '한국폴리텍대학';
  $('#brandSub').textContent = '교과과정 개편 세부기준 검수 프로그램';
  updateAdminBadge();
  router();
});

/* 상단바 노출 제어 */
function showChrome(show) {
  $('#topbar').style.display = show ? 'flex' : 'none';
}

/* =========================================================================
 * 1. 시작 페이지(홈)
 * ========================================================================= */
function renderHome() {
  showChrome(false);
  const app = $('#app');
  app.innerHTML = `
    <section class="home">
      <div class="home-inner">
        <div class="home-hero">
          <div class="home-copy">
            <span class="badge">● AI 기반 교과편성 검수 시스템</span>
            <h1 class="home-title">${esc(APP_META.name).replace('교과과정 개편 세부기준', '교과과정개편<br><span class="accent">세부기준</span>')}</h1>

            <p class="home-sub">운영과정별 교과편성 기준을 설정하고, 실제 커리큘럼이 기준에 부합하는지
              자동으로 검수합니다. 교과편성 담당 교수님을 위한 도구입니다.</p>

            <div class="menu-cards">
              <button class="menu-card" onclick="navigate('cat/degree')">
                <span class="num">1</span>
                <div class="icon-wrap">${ICON.cap}</div>
                <h3>학위과정</h3>
                <p>학위·학위전공심화 과정의<br>교과편성 기준 검수</p>
                <div class="tags"><span>학위과정</span><span>학위전공심화과정</span></div>
              </button>
              <!-- 직업교육과정 아이콘은 숨김 처리(요청에 따라). 라우트(cat/vocational) 자체는 유지됨. -->
            </div>
          </div>
          <div class="home-art">${HERO_ART}</div>
        </div>
      </div>
      <div class="quick-links" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:24px 0 8px;">
        <button class="btn btn-quick" onclick="navigate('cat/degree/check/degree-regular')"
                style="display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;
                       border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);
                       color:#fff;font-weight:600;cursor:pointer;">
          ${ICON.check} 학위과정 체크하기
        </button>
        <button class="btn btn-quick" onclick="navigate('cat/degree/check/degree-advanced')"
                style="display:inline-flex;align-items:center;gap:6px;padding:10px 16px;border-radius:10px;
                       border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);
                       color:#fff;font-weight:600;cursor:pointer;">
          ${ICON.check} 학위전공심화과정 체크하기
        </button>
      </div>
      <div class="home-footer">
        <div class="prog-info">
          <b>${esc(APP_META.name)}</b><br>
          개발버전 <b>${esc(APP_META.version)}</b><br>
          개발 · <b>${esc(APP_META.developer)}</b>
        </div>
      </div>
    </section>`;
}

/* =========================================================================
 * 2. 허브 — 과정 선택 후 (세부기준설정 / 커리큘럼 체크)
 * ========================================================================= */
function renderHub(catKey) {
  const cat = PROGRAM_TREE[catKey];
  if (!cat) return renderHome();
  showChrome(true);
  $('#app').innerHTML = `
    <div class="container">
      ${breadcrumb([['home', '홈'], [null, cat.title]])}
      <div class="page-head">
        <span class="eyebrow">${catKey === 'degree' ? '1. 학위과정' : '2. 직업교육과정'}</span>
        <h1>${esc(cat.title)}</h1>
        <p>${esc(cat.desc)} · 세부 운영과정 ${cat.courses.length}개</p>
      </div>
      <div class="hub-grid">
        ${isAdmin() ? `
        <div class="hub-card ico-set" onclick="navigate('cat/${catKey}/standards')">
          <div class="hub-ico">${ICON.set}</div>
          <h3>세부기준 설정</h3>
          <p>과정별 졸업이수학점, 실습비율, 필수과목 비율 등 교과편성 기준을 설정합니다.</p>
          <span class="go">기준 설정하기 ${ICON.arrow}</span>
        </div>` : `
        <div class="hub-card ico-set" style="opacity:.55;cursor:pointer" onclick="requireAdmin(() => navigate('cat/${catKey}/standards'))">
          <div class="hub-ico">${ICON.set}</div>
          <h3>세부기준 설정 <span style="font-size:12px;font-weight:600;color:var(--c-text-soft)">(관리자 전용)</span></h3>
          <p>세부기준 설정 및 교과목 등록 기능은 관리자만 이용할 수 있습니다. 클릭 시 관리자 로그인이 필요합니다.</p>
          <span class="go">관리자 로그인 ${ICON.arrow}</span>
        </div>`}
        <div class="hub-card ico-check" onclick="navigate('cat/${catKey}/check')">
          <div class="hub-ico">${ICON.check}</div>
          <h3>교과과정 체크하기</h3>
          <p>편성한 커리큘럼을 업로드·입력하여 설정된 기준에 부합하는지 자동 검수합니다.</p>
          <span class="go">교과과정 개편 세부기준 준수 체크하기 ${ICON.arrow}</span>
        </div>
      </div>
    </div>`;
}

/* =========================================================================
 * 과정 선택(세부 과정 칩)
 * ========================================================================= */
function renderCoursePicker(catKey, mode) {
  const cat = PROGRAM_TREE[catKey];
  if (!cat) return renderHome();
  showChrome(true);
  const M = {
    standards:  { crumb: '세부기준 설정',       tileSub: '세부기준 설정',     head: '기준을 설정할 과정 선택',       desc: '세부기준을 설정할 운영과정을 선택하세요.',           setStore: Store },
    check:      { crumb: '교과과정 체크하기',     tileSub: '교과과정 검수',     head: '검수할 과정 선택',             desc: '교과과정을 검수할 운영과정을 선택하세요. 검수에는 해당 과정의 세부기준이 필요합니다.', setStore: null },
  }[mode] || {};
  const tiles = cat.courses.map(c => {
    const set = M.setStore ? M.setStore.isSet(c.key) : false;
    return `
      <div class="course-tile" onclick="navigate('cat/${catKey}/${mode}/${c.key}')">
        <div class="ct-ico">${ICON.book}</div>
        <div class="ct-body">
          <b>${esc(c.name)}</b>
          <small>${esc(M.tileSub)}</small>
        </div>
        ${M.setStore ? `<span class="ct-status ${set ? 'set' : 'unset'}">${set ? '설정됨' : '미설정'}</span>` : ''}
      </div>`;
  }).join('');

  $('#app').innerHTML = `
    <div class="container">
      ${breadcrumb([['home', '홈'], [`cat/${catKey}`, cat.title], [null, M.crumb]])}
      <div class="page-head">
        <span class="eyebrow">${esc(cat.title)} · ${esc(M.crumb)}</span>
        <h1>${esc(M.head)}</h1>
        <p>${esc(M.desc)}</p>
      </div>
      ${mode === 'check' ? `<div class="notice info"><span class="n-ico">${ICON.info}</span>
        <div>검수 전, 먼저 <b>세부기준 설정</b>·<b>교과목 편성기준 설정</b>에서 해당 과정의 기준을 저장해 두면 정확한 검수가 가능합니다.</div></div>` : ''}
      <div class="course-grid">${tiles}</div>
    </div>`;
}

/* =========================================================================
 * 세부기준 설정 폼
 * ========================================================================= */
function renderStandards(courseKey) {
  const found = findCourse(courseKey);
  if (!found) return renderHome();
  if (COURSE_SPECS[courseKey]) return renderSpecStandards(courseKey, found);
  const { cat, course } = found;
  showChrome(true);
  const std = Store.get(courseKey);

  // 그룹별 필드 묶기
  const groups = {};
  STANDARD_FIELDS.forEach(f => { (groups[f.group] = groups[f.group] || []).push(f); });

  const groupsHtml = Object.entries(groups).map(([gname, fields]) => `
    <div class="std-group">
      <h4>${esc(gname)}</h4>
      <div class="field-grid">
        ${fields.map(f => renderField(f, std[f.key])).join('')}
      </div>
    </div>`).join('');

  $('#app').innerHTML = `
    <div class="container">
      ${breadcrumb([['home','홈'], [`cat/${cat.key}`, cat.title], [`cat/${cat.key}/standards`, '세부기준 설정'], [null, course.name]])}
      <div class="page-head">
        <span class="eyebrow">${esc(cat.title)} · 세부기준 설정</span>
        <h1>${esc(course.name)} — 교과편성 세부기준</h1>
        <p>아래 항목을 해당 과정의 편성지침에 맞게 입력 후 저장하세요. 저장된 기준은 커리큘럼 검수에 사용됩니다.</p>
      </div>

      <div class="notice info"><span class="n-ico">${ICON.info}</span>
        <div>표시된 값은 <b>예시 기본값</b>입니다. 실제 운영지침에 맞게 수정하여 저장해 주세요.
        ${Store.isSet(courseKey) ? '현재 <b>저장된 기준</b>이 적용되어 있습니다.' : '아직 저장되지 않아 <b>기본값</b>이 표시됩니다.'}</div></div>

      <form id="stdForm" class="panel">
        <div class="panel-body">${groupsHtml}</div>
      </form>

      <div class="toolbar">
        <button class="btn btn-primary" onclick="saveStandards('${courseKey}')">${ICON.ok} 기준 저장</button>
        <button class="btn btn-ghost" onclick="resetStandards('${courseKey}')">기본값으로 초기화</button>
        <div class="spacer"></div>
        <button