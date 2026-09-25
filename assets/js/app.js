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
/* ---------- 시간총량 트랙(1,200h/600h) 선택 저장소 -------------------- */
const VOC_TRACK_KEY = 'kpu-curri-voctrack-v1';
const VocTrackStore = {
  all() { try { return JSON.parse(localStorage.getItem(VOC_TRACK_KEY)) || {}; } catch { return {}; } },
  get(courseKey) { return this.all()[courseKey] || '1200'; },
  set(courseKey, track) {
    const all = this.all(); all[courseKey] = track;
    localStorage.setItem(VOC_TRACK_KEY, JSON.stringify(all));
  },
};
// courseKey의 스펙이 durationTracks를 가지면 현재 선택된 트랙의 하위 스펙을, 아니면 원 스펙을 반환
function effSpec(courseKey) {
  const spec = COURSE_SPECS[courseKey];
  if (spec && spec.durationTracks) return spec.durationTracks[VocTrackStore.get(courseKey)];
  return spec;
}
// 저장소 키 — durationTracks가 있는 과정은 트랙별로 분리 저장(예: 'voc-tech__1200')
function specStoreKey(courseKey) {
  const spec = COURSE_SPECS[courseKey];
  return (spec && spec.durationTracks) ? `${courseKey}__${VocTrackStore.get(courseKey)}` : courseKey;
}

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
  // 스펙 과정용 — { standards:{}, checklist:{} } (기본값 + 저장값 병합), 트랙별 분리
  getSpec(courseKey) {
    const spec = effSpec(courseKey);
    const skey = specStoreKey(courseKey);
    const d = { standards: {}, checklist: {} };
    spec.standardGroups.forEach(g => g.fields.forEach(f => d.standards[f.key] = f.def));
    spec.checklist.forEach(c => d.checklist[c.key] = c.def);
    const saved = this.all()[skey] || {};
    return {
      standards: Object.assign({}, d.standards, saved.standards || {}),
      checklist: Object.assign({}, d.checklist, saved.checklist || {}),
    };
  },
  saveSpec(courseKey, obj) {
    const all = this.all();
    all[specStoreKey(courseKey)] = obj;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
  isSet(courseKey) { return !!this.all()[specStoreKey(courseKey)]; },
  save(courseKey, data) {
    const all = this.all();
    all[courseKey] = data;
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
  reset(courseKey) {
    const all = this.all();
    delete all[specStoreKey(courseKey)];
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  },
};

/* ---------- 교과목 편성기준 저장소 ------------------------------------ */
const RULE_KEY = 'kpu-curri-courserules-v1';
const CourseRuleStore = {
  all() { try { return JSON.parse(localStorage.getItem(RULE_KEY)) || {}; } catch { return {}; } },
  get(courseKey) {
    const skey = specStoreKey(courseKey);
    const saved = this.all()[skey];
    const src = saved ? saved : (DEFAULT_COURSE_RULES[courseKey] || []);
    return src.map(r => {
      const o = Object.assign({}, r);
      if (o.creditMin == null && o.credit != null) o.creditMin = o.credit;  // 구버전 단일 credit → 최소
      if (o.creditMax == null && o.credit != null) o.creditMax = o.credit;  //                  → 최대
      return o;
    });
  },
  isSet(courseKey) { return !!this.all()[specStoreKey(courseKey)]; },
  save(courseKey, rules) {
    const all = this.all(); all[specStoreKey(courseKey)] = rules;
    localStorage.setItem(RULE_KEY, JSON.stringify(all));
  },
  reset(courseKey) {
    const all = this.all(); delete all[specStoreKey(courseKey)];
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
const SIMPLE_RULE_DEFAULT = { checkMinOne: true, minCount: 1, minTotalHours: 0, allowedSemesters: '' };
/* 과정별(특히 직업교육과정은 시간 기준) 기본 검수기준 — 관리자가 한번도 저장한 적 없을 때만 적용되는 초기값 */
const SIMPLE_RULE_COURSE_DEFAULTS = {
  'voc-tech': {
    safety:       { checkMinOne: true, minCount: 1, minTotalHours: 16, allowedSemesters: '2' },
    industrialAi: { checkMinOne: true, minCount: 1, minTotalHours: 20, allowedSemesters: '' },
    aiApplied:    { checkMinOne: true, minCount: 1, minTotalHours: 20, allowedSemesters: '' },
  },
};
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
  get(type, courseKey) {
    const saved = this.all(type)[courseKey];
    const base = (SIMPLE_RULE_COURSE_DEFAULTS[courseKey] && SIMPLE_RULE_COURSE_DEFAULTS[courseKey][type]) || SIMPLE_RULE_DEFAULT;
    return Object.assign({}, SIMPLE_RULE_DEFAULT, base, saved || {});
  },
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
  $('#brandSub').textContent = '교과과정개편 세부기준 검수 지원 도구';
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
            <h1 class="home-title">${esc(APP_META.name).replace('교과과정개편 세부기준 검수 지원 도구', '교과과정개편<br><span class="accent">세부기준</span> 검수 지원 도구')}</h1>

            <p class="home-sub">2027학년도 운영과정별 교과편성 기준을 설정하고, 실제 커리큘럼이 기준에 부합하는지
              자동으로 검수합니다.</p>

            <div class="menu-cards">
              <button class="menu-card" onclick="navigate('cat/degree')">
                <span class="num">1</span>
                <div class="icon-wrap">${ICON.cap}</div>
                <h3>학위과정</h3>
                <p>학위·학위전공심화 과정의<br>교과편성 기준 검수</p>
                <div class="tags"><span>학위과정</span><span>학위전공심화과정</span></div>
              </button>
              <button class="menu-card" onclick="navigate('cat/vocational')">
                <span class="num">2</span>
                <div class="icon-wrap">${ICON.tools}</div>
                <h3>직업교육과정</h3>
                <p>전문기술·하이테크·중장년특화장기<br>일반계위탁·기능장 과정 기준 검수</p>
                <div class="tags"><span>전문기술</span><span>하이테크</span><span>중장년특화장기</span><span>일반계위탁</span><span>기능장</span></div>
              </button>
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
          개발 · <b>${esc(APP_META.developer)}</b><br>
          <div class="copyright" style="margin-top:10px;font-size:11px;color:rgba(255,255,255,.55)">
            © ${new Date().getFullYear()} 학교법인 한국폴리텍. All rights reserved.
          </div>
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
        <button class="btn btn-soft" onclick="navigate('cat/${cat.key}/check/${courseKey}')">${ICON.check} 이 과정 세부기준 준수 체크하기</button>
      </div>
    </div>`;
}

/* ── 상세 세부기준(2개 카테고리: 세부기준 설정 / 커리큘럼 체크리스트) ── */
function renderSpecStandards(courseKey, found) {
  const { cat, course } = found;
  showChrome(true);
  const rawSpec = COURSE_SPECS[courseKey];
  const spec = effSpec(courseKey);
  const trackSwitchHtml = (rawSpec.durationTracks) ? `
    <div class="track-switch" style="display:flex;gap:8px;margin-bottom:16px">
      ${Object.keys(rawSpec.durationTracks).map(tk => `
        <button class="btn ${VocTrackStore.get(courseKey) === tk ? 'btn-primary' : 'btn-ghost'}"
          onclick="setVocTrack('${courseKey}','${tk}')">${esc(rawSpec.durationTracks[tk].trackLabel)}</button>
      `).join('')}
    </div>` : '';
  const saved = Store.getSpec(courseKey);
  const isSet = Store.isSet(courseKey);
  const onCount = Object.values(saved.checklist).filter(Boolean).length;

  // 교과목 편성기준(탭)
  courseRulesKey = courseKey;
  courseRules = CourseRuleStore.get(courseKey);
  const ruleOn = courseRules.filter(r => r.on).length;
  const rulesHtml = courseRules.map((r, i) => ruleRowHtml(r, i)).join('');

  // 카테고리 1: 세부기준 값 그룹 (항목 넘버링)
  let fno = 0;
  const groupsHtml = spec.standardGroups.map(g => `
    <div class="std-group">
      <h4>${esc(g.title)}</h4>
      <div class="field-grid">
        ${g.fields.map(f => {
          fno++;
          return `
          <div class="field">
            <label><span class="fno">${fno}</span>${esc(f.label)}</label>
            <div class="input-wrap">
              <input type="number" min="0" step="1" data-skey="${f.key}" value="${esc(saved.standards[f.key])}">
              ${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}
            </div>
            ${f.note ? `<div class="field-note">${esc(f.note)}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');

  // 카테고리 3: 커리큘럼 체크리스트 = 세부기준 + 교과목편성기준 합산 (미리보기)
  const criteria = buildCriteriaList(courseKey);

  $('#app').innerHTML = `
    <div class="container">
      ${breadcrumb([['home','홈'], [`cat/${cat.key}`, cat.title], [`cat/${cat.key}/standards`, '세부기준 설정'], [null, course.name]])}
      <div class="page-head">
        <span class="eyebrow">${esc(cat.title)} · 세부기준 설정</span>
        <h1>${esc(course.name)} — 교과편성 세부기준</h1>
        <p>${esc(rawSpec.sourceDoc)} 기준을 반영했습니다. 캠퍼스·학과 상황에 맞게 수정 후 저장하세요.</p>
      </div>

      ${trackSwitchHtml}

      <div class="notice info"><span class="n-ico">${ICON.info}</span>
        <div>출처: <b>${esc(rawSpec.sourceLabel)}</b> · ${isSet
          ? '현재 <b>저장된 기준</b>이 적용되어 있습니다.'
          : '아직 저장 전이라 <b>공식 문서 기본값</b>이 표시됩니다.'}</div></div>

      <div class="toolbar" style="margin-bottom:18px">
        ${['degree-regular','degree-advanced','voc-tech'].includes(courseKey) ? `<button class="btn btn-soft" onclick="navigate('cat/${cat.key}/liberal/${courseKey}')">${ICON.set} 교양교과 설정</button>` : ''}
        ${['degree-regular','degree-advanced','voc-tech'].includes(courseKey) ? `<button class="btn btn-soft" onclick="navigate('cat/${cat.key}/simplelist/safety/${courseKey}')">${ICON.set} 산업안전교과 설정</button>` : ''}
        ${['degree-regular','degree-advanced','voc-tech'].includes(courseKey) ? `<button class="btn btn-soft" onclick="navigate('cat/${cat.key}/simplelist/industrialAi/${courseKey}')">${ICON.set} 산업AI교과 설정</button>` : ''}
        ${['degree-regular','degree-advanced','voc-tech'].includes(courseKey) ? `<button class="btn btn-soft" onclick="navigate('cat/${cat.key}/simplelist/aiApplied/${courseKey}')">${ICON.set} AI활용교과 설정</button>` : ''}
        <div class="spacer"></div>
        <button class="btn btn-soft" onclick="navigate('cat/${cat.key}/check')">${ICON.check} 교과과정 체크 이동하기 ${ICON.arrow}</button>
      </div>

      <div class="tabs">
        <button class="tab active" data-tab="standards" onclick="stdTab('standards')">
          ${ICON.set} 세부기준 설정 <span class="tab-badge">${spec.standardGroups.reduce((n,g)=>n+g.fields.length,0)}</span>
        </button>
        <button class="tab" data-tab="courserule" onclick="stdTab('courserule')">
          ${ICON.list} 교과목 편성기준 <span class="tab-badge">${ruleOn}/${courseRules.length}</span>
        </button>
        <button class="tab" data-tab="checklist" onclick="stdTab('checklist')">
          ${ICON.check} 커리큘럼 체크리스트 <span class="tab-badge">${criteria.length}</span>
        </button>
      </div>

      <form id="specForm" onsubmit="return false">
        <div class="tab-panel" data-panel="standards">
          <div class="panel"><div class="panel-body">${groupsHtml}</div></div>
        </div>
        <div class="tab-panel" data-panel="courserule" style="display:none">
          <div class="notice"><span class="n-ico">${ICON.info}</span>
            <div>특정 교과목의 편성 여부를 검수 항목으로 추가합니다. (예: <b>AI와윤리</b> 교과) <b>적용</b>으로 켠 항목만 검수에 반영됩니다.</div></div>
          <div class="panel"><div class="panel-body">
            <div class="rule-table">
              <div class="rule-head"><span>순번</span><span>검수항목명</span><span>교과목 키워드</span><span>교과구분</span><span>학기</span><span>${courseKey === 'voc-tech' ? '최소시간' : '최소학점'}</span><span>${courseKey === 'voc-tech' ? '최대시간' : '최대학점'}</span><span>편성여부</span><span>그룹명</span><span>그룹조건</span><span>적용조건</span><span>적용</span><span></span></div>
              <div id="ruleRows">${rulesHtml}</div>
            </div>
            <div class="toolbar" style="margin-top:14px">
              <button type="button" class="btn btn-ghost btn-sm" onclick="addRule()">+ 항목 추가</button>
            </div>
          </div></div>
        </div>
        <div class="tab-panel" data-panel="checklist" style="display:none" id="checklistPanel">
          ${checklistPanelHtml(courseKey)}
        </div>
      </form>

      <div class="toolbar">
        <button class="btn btn-primary" onclick="saveSpecStandards('${courseKey}')">${ICON.ok} 설정정보 저장하기</button>
        <button class="btn btn-ghost" onclick="resetStandards('${courseKey}')">공식 기본값으로 초기화</button>
      </div>
    </div>`;
}

function stdTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = (p.dataset.panel === name ? '' : 'none'));
}

/* 커리큘럼 체크리스트 = 세부기준 설정 + 교과목 편성기준을 합한 실제 검수 항목 목록 */
function buildCriteriaList(courseKey) {
  const items = [];
  const add = (title, req) => items.push({ title, req, src: '세부기준' });

  const rawSpec0 = COURSE_SPECS[courseKey];
  if (rawSpec0 && rawSpec0.durationTracks) {
    // ── 시간총량 기반 과정(전문기술과정 등) — 학위과정(학점 기반)과 별개 체크리스트 ──
    const s = Store.getSpec(courseKey).standards;
    const trackLabel = (rawSpec0.durationTracks[VocTrackStore.get(courseKey)] || {}).trackLabel || '';
    add('총 운영시간', `${s.totalHours}시간(${trackLabel}, ${s.semesters}학기)`);
    add('이론:실습 비율', `이론 ${s.theoryRatio}% : 실습 ${s.practiceRatio}%(허용오차 ±${s.ratioTolerance}%p)`);
    add('전공교과 비율', `${s.majorRatioMin}% 이상`);
    add('과목당 편성시간', `${s.courseHoursMax}시간 이내(NCS 교과 제외)`);
    add('1개 교과 2학기 분할 편성', s.splitAllowed ? '허용' : '미허용');
    add('교양교과 편성시간', `${s.liberalHours}시간 이상`);
    add('계열공통교과 비율', `${s.seriesCommonRatioMin}~${s.seriesCommonRatioMax}%`);
    add('프로젝트실습 비율', `${s.projectRatioMin}~${s.projectRatioMax}%`);
    add('종합실습 편성시간', `${s.capstoneHours}시간 이상`);
    add('산업안전교과 편성시간', `${s.safetyHours}시간 이상`);
    add('AI활용교과 편성시간', `${s.aiAppliedHours}시간 이상`);
    add('산업AI교과 편성시간', `${s.industrialAiHoursMin}~${s.industrialAiHoursMax}시간`);
  } else {
    const std = Store.get(courseKey);
    add('총 편성학점', `${std.totalCreditsMin}~${std.totalCreditsMax}학점`);
    add('운영 학기 수', `${std.semesters}학기`);
    add('학기당편성학점', `학기당 ${std.creditsPerSemMin}~${std.creditsPerSemMax}학점`);
    add('교과목당 학점', `과목당 ${std.courseCreditMin}~${std.courseCreditMax}학점`);
    add('실습편성비율', `최소 ${std.practiceRatioMin}%`);
    if (std.requiredRatioMin > 0) add('필수과목 비율', `최소 ${std.requiredRatioMin}%`);
    if (std.majorReqMin > 0 || std.majorReqMax > 0) add('전공필수 편성학점', std.majorReqMax > 0 ? `${std.majorReqMin}~${std.majorReqMax}학점` : `최소 ${std.majorReqMin}학점`);
    if (std.majorOfferMin > 0 || std.majorOfferMax > 0) add('전공선택교과 편성학점', `${std.majorOfferMin}~${std.majorOfferMax}학점`);
    if (std.fieldTraining) add('현장실습 포함', '필수 포함');
    if (std.capstone) add('캡스톤(졸업작품) 포함', '필수 포함');
  }

  const ruleItemsRaw = [];
  CourseRuleStore.get(courseKey).forEach(r => {
    if (!r.on) return;
    if (!(r.keyword || r.label)) return;
    const gubun = (r.gubun || '').trim();
    const lo = Number(r.creditMin) || 0, hi = Number(r.creditMax) || 0;
    const creditReq = lo > 0 && hi > 0 ? ` · ${lo}~${hi}학점` : lo > 0 ? ` · ${lo}학점 이상` : hi > 0 ? ` · ${hi}학점 이하` : '';
    const presenceReq = (r.presence || 'Y') === 'Y' ? '편성(Y)' : '미편성(N)';
    const semTag = r.semester && r.semester.trim() ? `[${semSpecText(r.semester)}] ` : '';
    const condTag = r.condOptional ? '[편성시만 검수] ' : '';
    ruleItemsRaw.push({
      title: r.label || r.keyword,
      req: `${condTag}${gubun ? '[' + gubun + '] ' : ''}${semTag}${presenceReq}${creditReq}`,
      src: '교과목편성기준',
      group: (r.group || '').trim(),
      groupOp: r.groupOp || 'AND',
    });
  });
  // 그룹 결합: 같은 그룹명을 가진 항목을 하나의 검수항목으로 표시
  const groupMap2 = {};
  ruleItemsRaw.forEach(it => {
    if (!it.group) { items.push(it); return; }
    if (!groupMap2[it.group]) { groupMap2[it.group] = { title: `[그룹] ${it.group}`, req: '', src: it.src, _parts: [], op: it.groupOp }; items.push(groupMap2[it.group]); }
    groupMap2[it.group]._parts.push(`${it.title}: ${it.req}`);
  });
  Object.values(groupMap2).forEach(g => { g.req = g._parts.join(g.op === 'OR' ? ' 또는 ' : ' 그리고 '); delete g._parts; delete g.op; });

  // 교양교과 설정(교양필수교과 검수기준) — 등록된 경우에만 미리보기에 노출
  if (LiberalArtsStore.isSet(courseKey)) {
    const laRule = LiberalCheckRuleStore.get(courseKey);
    if (laRule.checkOffered) items.push({ title: '교양필수교과 편성 여부(역량군별)', req: '설정된 필수교과가 역량군별로 모두 편성', src: '교양교과설정' });
    if (laRule.checkMaxPerGroup) items.push({ title: '교양필수교과 역량군당 편성 수', req: `역량군당 최대 ${laRule.maxPerGroup}과목`, src: '교양교과설정' });
    if (laRule.checkTotal) items.push({ title: `교양필수교과 총 편성 역량군수/${courseKey === 'voc-tech' ? '시간' : '학점'}`, req: `${laRule.targetGroupCount}개 역량군 · ${laRule.targetTotalCredit}${courseKey === 'voc-tech' ? '시간' : '학점'}`, src: '교양교과설정' });
  }

  // 산업안전·산업AI·AI활용 교과편성 확인 — 등록된 경우에만 미리보기에 노출
  Object.keys(SIMPLE_LIST_TYPES).forEach(type => {
    if (!SimpleListStore.isSet(type, courseKey)) return;
    const meta = SIMPLE_LIST_TYPES[type];
    const rule = SimpleRuleStore.get(type, courseKey);
    if (!rule.checkMinOne) return;
    items.push({ title: meta.checkTitle, req: `최소 ${rule.minCount}과목 이상 편성`, src: meta.regTitle });
  });

  return items;
}

function checklistPanelHtml(courseKey) {
  const list = buildCriteriaList(courseKey);
  return `
    <div class="notice info"><span class="n-ico">${ICON.info}</span>
      <div><b>세부기준 설정</b>과 <b>교과목 편성기준</b>을 합한 <b>실제 검수 항목</b>입니다. 검수 실행 시 아래 순서대로 점검합니다.
      (탭에서 값을 바꾼 뒤 <b>저장</b>하면 갱신됩니다.)</div></div>
    <div class="panel"><div class="panel-body" style="padding:0">
      <div class="checklist-view">
        ${list.map((c, i) => `
          <div class="cl-item">
            <span class="cl-no">${i + 1}</span>
            <div class="cl-main">
              <span class="cl-title">${esc(c.title)}</span>
              <span class="cl-ref">기준 ${esc(c.req)}</span>
            </div>
            <span class="cl-src ${c.src === '세부기준' ? 'src-std' : 'src-rule'}">${esc(c.src)}</span>
          </div>`).join('')}
      </div>
    </div></div>`;
}

function saveSpecStandards(courseKey) {
  const standards = {}, checklist = {};
  document.querySelectorAll('#specForm [data-skey]').forEach(el => { standards[el.dataset.skey] = Number(el.value || 0); });
  document.querySelectorAll('#specForm [data-ckey]').forEach(el => { checklist[el.dataset.ckey] = el.checked; });
  Store.saveSpec(courseKey, { standards, checklist });
  // 교과목 편성기준도 함께 저장
  syncRulesFromDom();
  const cleanRules = courseRules.filter(r => (r.label || '').trim() || (r.keyword || '').trim());
  CourseRuleStore.save(courseKey, cleanRules);
  toast('세부기준·교과목 편성기준이 저장되었습니다.');
  // 커리큘럼 체크리스트(합산 목록) 재생성 + 탭 배지 갱신
  const clPanel = document.querySelector('#checklistPanel');
  if (clPanel) clPanel.innerHTML = checklistPanelHtml(courseKey);
  const clBadge = document.querySelector('.tab[data-tab="checklist"] .tab-badge');
  if (clBadge) clBadge.textContent = buildCriteriaList(courseKey).length;
  const ruleBadge = document.querySelector('.tab[data-tab="courserule"] .tab-badge');
  if (ruleBadge) ruleBadge.textContent = cleanRules.filter(r => r.on).length + '/' + cleanRules.length;
}

/* =========================================================================
 * 교양교과 설정 화면 (6개 교양교과역량군별 필수·선택 교과 등록)
 * 규칙: 교양필수는 5개 핵심 역량군(디지털AI능력 제외) 중 3개 역량군에서 각 1개 교과만 지정, 총 6학점
 * ========================================================================= */
let laState = null; // { [groupKey]: { required: [{name,credit}], elective: [{name,credit}] } }
let laCourseKey = null;
let laRule = null;   // 교양필수교과 검수로직 설정(편집중)
let laRuleOpen = false;

function laCopyFromRegular(courseKey) {
  if (!LiberalArtsStore.isSet('degree-regular')) { toast('학위과정(degree-regular)에 저장된 교양교과 설정이 없습니다.'); return; }
  if (!confirm('학위과정에 저장된 교양교과 설정을 그대로 복사합니다. 현재 전공심화과정 설정은 덮어씌워집니다. 계속할까요?')) return;
  LiberalArtsStore.save(courseKey, LiberalArtsStore.get('degree-regular'));
  LiberalCheckRuleStore.save(courseKey, LiberalCheckRuleStore.get('degree-regular'));
  toast('학위과정 교양교과 설정을 복사했습니다.');
  renderLiberalArts(courseKey);
}
function renderLiberalArts(courseKey) {
  const found = findCourse(courseKey);
  if (!found) { navigate('home'); return; }
  const { cat } = found;
  showChrome(true);
  laCourseKey = courseKey;
  laState = LiberalArtsStore.get(courseKey);
  laRule = LiberalCheckRuleStore.get(courseKey);
  laRuleOpen = false;
  const app = $('#app');
  app.innerHTML = `
    <section class="page">
      ${breadcrumb([['home', '홈'], [`cat/${cat.key}`, cat.title], [`cat/${cat.key}/standards/${courseKey}`, '세부기준설정'], [null, '교양교과 설정']])}
      <div class="panel-head">
        <h2>교양교과 설정</h2>
        <span class="desc">교양교과역량군(의사소통능력·창의생활예술융합능력·자기관리능력·대인관계협업능력·경제생활활용능력·디지털AI능력) 6개 역량군별로 필수교과·선택교과를 등록합니다.</span>
      </div>
      <div class="toolbar" style="margin-bottom:12px">
        <button class="btn btn-soft" onclick="laToggleRulePanel()">${ICON.set} 교양필수교과 검수기준 설정</button>
        <span style="font-size:12.5px;color:var(--c-text-soft)">향후 검수로직(역량군당 허용 과목수 · 목표 역량군수 · 목표 총학점)이 변경될 경우 여기서 수정하세요.</span>
        ${courseKey === 'degree-advanced' ? `<button class="btn btn-ghost" onclick="laCopyFromRegular('${courseKey}')">${ICON.set || ''} 학위과정 설정 그대로 가져오기</button>` : ''}
      </div>
      <div id="laRulePanel">${laRuleOpen ? laRulePanelHtml() : ''}</div>
      <div id="laGroups">${LIBERAL_GROUPS.map(g => laGroupHtml(g)).join('')}</div>
      <div class="toolbar" style="margin:16px 0 40px">
        <button class="btn btn-primary" onclick="laSave('${courseKey}')">${ICON.ok} 교양교과 설정 저장</button>
        <button class="btn btn-ghost" onclick="navigate('cat/${cat.key}/standards/${courseKey}')">세부기준설정으로 돌아가기</button>
      </div>
    </section>`;
}

/* 교양필수교과 검수로직 설정 패널 */
function laRulePanelHtml() {
  const r = laRule;
  return `
    <div class="panel la-rule-panel" style="margin-bottom:16px">
      <div class="la-group-head"><h3>교양필수교과 검수기준 설정</h3></div>
      <div class="la-rule-row">
        <label class="switch"><input type="checkbox" id="laR_checkOffered" ${r.checkOffered ? 'checked' : ''}><span class="track"></span><span class="switch-label">적용</span></label>
        <span class="la-rule-label">설정된 필수교과가 역량군별로 실제 편성되어 있는지 검수</span>
      </div>
      <div class="la-rule-row">
        <label class="switch"><input type="checkbox" id="laR_checkMaxPerGroup" ${r.checkMaxPerGroup ? 'checked' : ''}><span class="track"></span><span class="switch-label">적용</span></label>
        <span class="la-rule-label">역량군당 허용 초과 편성 여부 검수 · 역량군당 최대</span>
        <input type="number" min="1" step="1" id="laR_maxPerGroup" value="${esc(r.maxPerGroup)}" style="width:70px"> 과목
      </div>
      <div class="la-rule-row">
        <label class="switch"><input type="checkbox" id="laR_checkTotal" ${r.checkTotal ? 'checked' : ''}><span class="track"></span><span class="switch-label">적용</span></label>
        <span class="la-rule-label">총 편성 역량군수/학점 검수 · 목표</span>
        <input type="number" min="0" step="1" id="laR_targetGroupCount" value="${esc(r.targetGroupCount)}" style="width:70px"> 역량군 ·
        <input type="number" min="0" step="1" id="laR_targetTotalCredit" value="${esc(r.targetTotalCredit)}" style="width:70px"> ${laCourseKey === 'voc-tech' ? '시간' : '학점'}
      </div>
      <div class="toolbar" style="margin-top:12px">
        <button class="btn btn-primary btn-sm" onclick="laSaveRule('${laCourseKey}')">${ICON.ok} 검수기준 저장</button>
        <button class="btn btn-ghost btn-sm" onclick="laResetRule('${laCourseKey}')">기본값으로 초기화</button>
      </div>
    </div>`;
}

function laToggleRulePanel() {
  laRuleOpen = !laRuleOpen;
  const el = $('#laRulePanel');
  if (el) el.innerHTML = laRuleOpen ? laRulePanelHtml() : '';
}

function laSyncRuleFromDom() {
  laRule = {
    checkOffered: !!($('#laR_checkOffered') || {}).checked,
    checkMaxPerGroup: !!($('#laR_checkMaxPerGroup') || {}).checked,
    maxPerGroup: Number((($('#laR_maxPerGroup') || {}).value) || 1),
    checkTotal: !!($('#laR_checkTotal') || {}).checked,
    targetGroupCount: Number((($('#laR_targetGroupCount') || {}).value) || 0),
    targetTotalCredit: Number((($('#laR_targetTotalCredit') || {}).value) || 0),
  };
}

function laSaveRule(courseKey) {
  laSyncRuleFromDom();
  LiberalCheckRuleStore.save(courseKey, laRule);
  toast('교양필수교과 검수기준이 저장되었습니다.');
}

function laResetRule(courseKey) {
  laRule = Object.assign({}, LIBERAL_RULE_DEFAULT);
  LiberalCheckRuleStore.save(courseKey, laRule);
  const el = $('#laRulePanel');
  if (el) el.innerHTML = laRuleOpen ? laRulePanelHtml() : '';
  toast('검수기준을 기본값으로 초기화했습니다.');
}

function laRowHtml(g, type, row, idx) {
  const unitLabel = laCourseKey === 'voc-tech' ? '시간' : '학점';
  return `
    <div class="la-row">
      <input type="text" data-g="${g.key}" data-t="${type}" data-i="${idx}" data-k="name" value="${esc(row.name || '')}" placeholder="교과명">
      <input type="number" min="0" step="1" data-g="${g.key}" data-t="${type}" data-i="${idx}" data-k="credit" value="${esc(row.credit || '')}" placeholder="${unitLabel}">
      <button type="button" class="del-row" onclick="laDelRow('${g.key}','${type}',${idx})" title="삭제">×</button>
    </div>`;
}

function laGroupHtml(g) {
  const data = laState[g.key] || { required: [], elective: [] };
  return `
    <div class="panel la-group">
      <div class="la-group-head">
        <h3>${esc(g.label)}</h3>
      </div>
      <div class="la-sub">
        <div class="la-sub-head"><b>필수교과</b></div>
        <div id="laRows-${g.key}-required">${data.required.map((r, i) => laRowHtml(g, 'required', r, i)).join('')}</div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="laAddRow('${g.key}','required')">${ICON.plus || '+'} 필수교과 추가</button>
      </div>
      <div class="la-sub">
        <div class="la-sub-head"><b>선택교과</b></div>
        <div id="laRows-${g.key}-elective">${data.elective.map((r, i) => laRowHtml(g, 'elective', r, i)).join('')}</div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="laAddRow('${g.key}','elective')">${ICON.plus || '+'} 선택교과 추가</button>
      </div>
    </div>`;
}

function laSyncFromDom() {
  document.querySelectorAll('.la-row [data-g]').forEach(el => {
    const g = el.dataset.g, t = el.dataset.t, i = +el.dataset.i, k = el.dataset.k;
    if (!laState[g] || !laState[g][t] || !laState[g][t][i]) return;
    laState[g][t][i][k] = k === 'credit' ? Number(el.value || 0) : el.value;
  });
}

function laAddRow(groupKey, type) {
  laSyncFromDom();
  laState[groupKey][type].push({ name: '', credit: type === 'required' ? 2 : 0 });
  laRefresh();
}
function laDelRow(groupKey, type, idx) {
  laSyncFromDom();
  laState[groupKey][type].splice(idx, 1);
  laRefresh();
}
function laRefresh() {
  const gp = $('#laGroups'); if (gp) gp.innerHTML = LIBERAL_GROUPS.map(g => laGroupHtml(g)).join('');
}

function laSave(courseKey) {
  laSyncFromDom();
  const clean = {};
  LIBERAL_GROUPS.forEach(g => {
    clean[g.key] = {
      required: (laState[g.key].required || []).filter(r => (r.name || '').trim()),
      elective: (laState[g.key].elective || []).filter(r => (r.name || '').trim()),
    };
  });
  LiberalArtsStore.save(courseKey, clean);
  laState = LiberalArtsStore.get(courseKey);
  laRefresh();
  toast('교양교과 설정이 저장되었습니다.');
}

/* =========================================================================
 * 단순 교과등록 화면(산업안전·산업AI 공통) — 교양교과 설정과 동일한 패턴(등록 + 검수기준 설정)
 * ========================================================================= */
let slState = null;   // [{name}]
let slRule = null;
let slRuleOpen = false;
let slType = null, slCourseKey = null;

function slCopyFromRegular(type, courseKey) {
  const meta = SIMPLE_LIST_TYPES[type];
  const found = findCourse(courseKey);
  const targetName = (found && found.course && found.course.name) || courseKey;
  if (!SimpleListStore.isSet(type, 'degree-regular')) { toast(`학위과정(degree-regular)에 저장된 ${meta.itemLabel} 설정이 없습니다.`); return; }
  if (!confirm(`학위과정에 저장된 ${meta.itemLabel} 설정을 그대로 복사합니다. 현재 ${targetName} 설정은 덮어씌워집니다. 계속할까요?`)) return;
  SimpleListStore.save(type, courseKey, SimpleListStore.get(type, 'degree-regular'));
  SimpleRuleStore.save(type, courseKey, SimpleRuleStore.get(type, 'degree-regular'));
  toast(`학위과정 ${meta.itemLabel} 설정을 복사했습니다.`);
  renderSimpleList(type, courseKey);
}
function renderSimpleList(type, courseKey) {
  const meta = SIMPLE_LIST_TYPES[type];
  const found = findCourse(courseKey);
  if (!meta || !found) { navigate('home'); return; }
  const { cat } = found;
  showChrome(true);
  slType = type; slCourseKey = courseKey;
  slState = SimpleListStore.get(type, courseKey).slice();
  if (!slState.length) slState = [{ name: '' }];
  slRule = SimpleRuleStore.get(type, courseKey);
  slRuleOpen = false;
  const app = $('#app');
  app.innerHTML = `
    <section class="page">
      ${breadcrumb([['home', '홈'], [`cat/${cat.key}`, cat.title], [`cat/${cat.key}/standards/${courseKey}`, '세부기준설정'], [null, meta.regTitle]])}
      <div class="panel-head">
        <h2>${esc(meta.regTitle)}</h2>
        <span class="desc">${esc(meta.itemLabel)}로 인정할 교과명을 등록합니다. 검수 시 해당 교과명을 포함하는 교과가 실제 편성되었는지 대조합니다.</span>
      </div>
      <div class="toolbar" style="margin-bottom:12px">
        <button class="btn btn-soft" onclick="slToggleRulePanel()">${ICON.set} ${esc(meta.checkLabel)} 검수기준 설정</button>
        <span style="font-size:12.5px;color:var(--c-text-soft)">향후 검수로직(최소 편성 과목수)이 변경될 경우 여기서 수정하세요.</span>
        ${(courseKey === 'degree-advanced' || courseKey === 'voc-tech') ? `<button class="btn btn-ghost" onclick="slCopyFromRegular('${type}','${courseKey}')">${ICON.set || ''} 학위과정 설정 그대로 가져오기</button>` : ''}
      </div>
      <div id="slRulePanel">${slRuleOpen ? slRulePanelHtml() : ''}</div>
      <div class="panel la-group">
        <div class="la-group-head"><h3>${esc(meta.itemLabel)} 목록</h3></div>
        <div id="slRows">${slState.map((r, i) => slRowHtml(r, i)).join('')}</div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="slAddRow()">${ICON.plus || '+'} 교과 추가</button>
      </div>
      <div class="toolbar" style="margin:16px 0 40px">
        <button class="btn btn-primary" onclick="slSave()">${ICON.ok} ${esc(meta.regTitle)} 저장</button>
        <button class="btn btn-ghost" onclick="navigate('cat/${cat.key}/standards/${courseKey}')">세부기준설정으로 돌아가기</button>
      </div>
    </section>`;
}

function slRowHtml(row, idx) {
  return `
    <div class="la-row" style="grid-template-columns:1fr 38px">
      <input type="text" data-i="${idx}" data-k="name" value="${esc(row.name || '')}" placeholder="교과명">
      <button type="button" class="del-row" onclick="slDelRow(${idx})" title="삭제">×</button>
    </div>`;
}

function slSyncFromDom() {
  document.querySelectorAll('#slRows [data-i]').forEach(el => {
    const i = +el.dataset.i, k = el.dataset.k;
    if (!slState[i]) return;
    slState[i][k] = el.value;
  });
}
function slRefreshRows() { const el = $('#slRows'); if (el) el.innerHTML = slState.map((r, i) => slRowHtml(r, i)).join(''); }
function slAddRow() { slSyncFromDom(); slState.push({ name: '' }); slRefreshRows(); }
function slDelRow(idx) { slSyncFromDom(); slState.splice(idx, 1); if (!slState.length) slState = [{ name: '' }]; slRefreshRows(); }

function slSave() {
  slSyncFromDom();
  const clean = slState.filter(r => (r.name || '').trim());
  SimpleListStore.save(slType, slCourseKey, clean);
  slState = clean.length ? clean : [{ name: '' }];
  slRefreshRows();
  toast(`${SIMPLE_LIST_TYPES[slType].regTitle}이 저장되었습니다.`);
}

function slRulePanelHtml() {
  const meta = SIMPLE_LIST_TYPES[slType];
  const r = slRule;
  return `
    <div class="panel la-rule-panel" style="margin-bottom:16px">
      <div class="la-group-head"><h3>${esc(meta.checkLabel)} 검수기준 설정</h3></div>
      <div class="la-rule-row">
        <label class="switch"><input type="checkbox" id="slR_checkMinOne" ${r.checkMinOne ? 'checked' : ''}><span class="track"></span><span class="switch-label">적용</span></label>
        <span class="la-rule-label">등록된 ${esc(meta.itemLabel)} 중 최소 편성 수 검수 · 최소</span>
        <input type="number" min="0" step="1" id="slR_minCount" value="${esc(r.minCount)}" style="width:70px"> 과목
      </div>
      <div class="la-rule-row">
        <span class="la-rule-label">시간(직업교육과정 등 시간 기반 과정용) · 매칭된 교과의 총 편성시간 합계 최소</span>
        <input type="number" min="0" step="1" id="slR_minTotalHours" value="${esc(r.minTotalHours || 0)}" style="width:70px"> 시간
        <span style="font-size:12px;color:var(--c-text-soft)">(0 = 검수 안 함, 업로드된 교과의 학점/시간 입력값 합산)</span>
      </div>
      <div class="la-rule-row">
        <span class="la-rule-label">편성 허용 학기(직업교육과정 등에서 특정 학기로 제한할 때 사용)</span>
        <input type="text" id="slR_allowedSemesters" value="${esc(r.allowedSemesters || '')}" placeholder="예: 2 또는 2,4 (비우면 전체 학기 허용)" style="width:180px">
      </div>
      <div class="toolbar" style="margin-top:12px">
        <button class="btn btn-primary btn-sm" onclick="slSaveRule()">${ICON.ok} 검수기준 저장</button>
        <button class="btn btn-ghost btn-sm" onclick="slResetRule()">기본값으로 초기화</button>
      </div>
    </div>`;
}
function slToggleRulePanel() {
  slRuleOpen = !slRuleOpen;
  const el = $('#slRulePanel'); if (el) el.innerHTML = slRuleOpen ? slRulePanelHtml() : '';
}
function slSaveRule() {
  slRule = {
    checkMinOne: !!($('#slR_checkMinOne') || {}).checked,
    minCount: Number((($('#slR_minCount') || {}).value) || 1),
    minTotalHours: Number((($('#slR_minTotalHours') || {}).value) || 0),
    allowedSemesters: (($('#slR_allowedSemesters') || {}).value || '').trim(),
  };
  SimpleRuleStore.save(slType, slCourseKey, slRule);
  toast('검수기준이 저장되었습니다.');
}
function slResetRule() {
  slRule = Object.assign({}, SIMPLE_RULE_DEFAULT);
  SimpleRuleStore.save(slType, slCourseKey, slRule);
  const el = $('#slRulePanel'); if (el) el.innerHTML = slRuleOpen ? slRulePanelHtml() : '';
  toast('검수기준을 기본값으로 초기화했습니다.');
}

function renderField(f, value) {
  if (f.type === 'bool') {
    const onLabel = f.trueLabel || '포함함';
    const offLabel = f.falseLabel || '포함 안 함';
    return `
      <div class="field">
        <label>${esc(f.label)}</label>
        <label class="switch">
          <input type="checkbox" data-key="${f.key}" ${value ? 'checked' : ''}>
          <span class="track"></span>
          <span class="switch-label">${value ? esc(onLabel) : esc(offLabel)}</span>
        </label>
      </div>`;
  }
  return `
    <div class="field">
      <label>${esc(f.label)}</label>
      <div class="input-wrap">
        <input type="number" min="0" step="1" data-key="${f.key}" value="${esc(value)}">
        ${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}
      </div>
    </div>`;
}

function collectStandards() {
  const data = {};
  document.querySelectorAll('#stdForm [data-key]').forEach(el => {
    const k = el.dataset.key;
    data[k] = el.type === 'checkbox' ? el.checked : Number(el.value || 0);
  });
  return data;
}

function saveStandards(courseKey) {
  Store.save(courseKey, collectStandards());
  toast('세부기준이 저장되었습니다.');
}
function resetStandards(courseKey) {
  Store.reset(courseKey);
  if (COURSE_SPECS[courseKey]) CourseRuleStore.reset(courseKey);
  toast('기본값으로 초기화되었습니다.');
  renderStandards(courseKey);
}

// 토글 라벨 실시간 갱신
document.addEventListener('change', (e) => {
  if (e.target.matches('.switch input[type=checkbox]')) {
    const lbl = (e.target.closest('.switch') || e.target.parentElement).querySelector('.switch-label');
    if (lbl) lbl.textContent = (e.target.dataset.ckey || e.target.dataset.k === 'on')
      ? (e.target.checked ? '적용' : '미적용')
      : (e.target.checked ? '포함함' : '포함 안 함');
  }
});

/* =========================================================================
 * 교과목 편성기준 설정 (교과목 편성여부 점검 항목)
 * ========================================================================= */
let courseRules = [];
let courseRulesKey = null;

function ruleRowHtml(r, i) {
  const presence = r.presence || 'Y';
  return `
    <div class="rule-row">
      <span class="rno">${i + 1}</span>
      <input type="text" data-i="${i}" data-k="label" value="${esc(r.label || '')}" placeholder="예: AI와윤리 교과 편성">
      <input type="text" data-i="${i}" data-k="keyword" value="${esc(r.keyword || '')}" placeholder="예: AI와윤리">
      <select data-i="${i}" data-k="gubun">
        <option value="" ${!r.gubun ? 'selected' : ''}>전체</option>
        ${courseRulesKey === 'voc-tech' ? `
        <option value="교양교과" ${r.gubun === '교양교과' ? 'selected' : ''}>교양교과</option>
        <option value="기초기술교과" ${r.gubun === '기초기술교과' ? 'selected' : ''}>기초기술교과</option>
        <option value="계열공통교과" ${r.gubun === '계열공통교과' ? 'selected' : ''}>계열공통교과</option>
        <option value="특화전공교과" ${r.gubun === '특화전공교과' ? 'selected' : ''}>특화전공교과</option>
        ` : `
        <option value="전공필수" ${r.gubun === '전공필수' ? 'selected' : ''}>전공필수</option>
        <option value="전공선택" ${r.gubun === '전공선택' ? 'selected' : ''}>전공선택</option>
        <option value="교양필수" ${r.gubun === '교양필수' ? 'selected' : ''}>교양필수</option>
        <option value="교양선택" ${r.gubun === '교양선택' ? 'selected' : ''}>교양선택</option>
        `}
      </select>
      <input type="text" data-i="${i}" data-k="semester" value="${esc(r.semester || '')}" placeholder="학기(예: 3 또는 학년-학기형식 2-1)" title="편성 학기 조건. 순차 학기번호(1,2,3…) 또는 학년-학기 표기(예: 2-1 = 2학년 1학기, 순차 3학기와 동일). 쉼표(,)로 OR 연결. 비우면 전체 학기 대상.">
      <input type="number" min="0" step="1" data-i="${i}" data-k="creditMin" value="${esc(r.creditMin || '')}" placeholder="${courseRulesKey === 'voc-tech' ? '최소시간' : '최소'}">
      <input type="number" min="0" step="1" data-i="${i}" data-k="creditMax" value="${esc(r.creditMax || '')}" placeholder="${courseRulesKey === 'voc-tech' ? '최대시간' : '최대'}">
      <select data-i="${i}" data-k="presence">
        <option value="Y" ${presence === 'Y' ? 'selected' : ''}>편성(Y)</option>
        <option value="N" ${presence === 'N' ? 'selected' : ''}>미편성(N)</option>
      </select>
      <input type="text" data-i="${i}" data-k="group" value="${esc(r.group || '')}" placeholder="그룹명(선택)" title="같은 그룹명을 가진 여러 항목을 하나의 검수항목으로 결합합니다">
      <select data-i="${i}" data-k="groupOp" title="그룹 결합 조건">
        <option value="AND" ${(r.groupOp || 'AND') === 'AND' ? 'selected' : ''}>AND(모두 충족)</option>
        <option value="OR" ${r.groupOp === 'OR' ? 'selected' : ''}>OR(하나만 충족)</option>
      </select>
      <label class="switch" title="체크 시, 해당 교과목 키워드가 전체 교과과정 어디에도 편성되어 있지 않으면 이 검수항목 자체를 적용하지 않습니다(선택 편성 교과에 사용)">
        <input type="checkbox" data-i="${i}" data-k="condOptional" ${r.condOptional ? 'checked' : ''}>
        <span class="track"></span><span class="switch-label">${r.condOptional ? '편성시만 검수' : '항상 검수'}</span>
      </label>
      <label class="switch">
        <input type="checkbox" data-i="${i}" data-k="on" ${r.on ? 'checked' : ''}>
        <span class="track"></span><span class="switch-label">${r.on ? '적용' : '미적용'}</span>
      </label>
      <button type="button" class="del-row" onclick="delRule(${i})" title="삭제">×</button>
    </div>`;
}

function syncRulesFromDom() {
  document.querySelectorAll('#ruleRows [data-i]').forEach(el => {
    const i = +el.dataset.i, k = el.dataset.k;
    if (!courseRules[i]) return;
    if (el.type === 'checkbox') courseRules[i][k] = el.checked;
    else if (k === 'creditMin' || k === 'creditMax') courseRules[i][k] = Number(el.value || 0);
    else courseRules[i][k] = el.value;
  });
}
function refreshRules() { const h = $('#ruleRows'); if (h) h.innerHTML = courseRules.map((r, i) => ruleRowHtml(r, i)).join(''); }
function addRule() { syncRulesFromDom(); courseRules.push({ label: '', keyword: '', gubun: '', semester: '', creditMin: 0, creditMax: 0, presence: 'Y', group: '', groupOp: 'AND', condOptional: false, on: true }); refreshRules(); }
function delRule(i) { syncRulesFromDom(); courseRules.splice(i, 1); refreshRules(); }

/* 학기 조건 문자열(예: "2", "1,2", "3-4") → Set<number> 파싱. 비어있으면 null(전체 학기) */
function parseSemSpec(spec) {
  const s = (spec || '').trim();
  if (!s) return null;
  const set = new Set();
  s.split(',').forEach(part => {
    const p = part.trim();
    if (!p) return;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      // 학년-학기 표기(예: "2-1" = 2학년 1학기) → 순차 학기번호로 변환 (범위가 아니라 단일 학기를 가리킴)
      // 학기당 학생가 2개학기 기준: 1-1=1, 1-2=2, 2-1=3, 2-2=4 ...
      const year = +m[1], term = +m[2];
      set.add((year - 1) * 2 + term);
    } else if (/^\d+$/.test(p)) {
      set.add(+p);
    }
  });
  return set.size ? set : null;
}
function semSpecText(spec) {
  const s = (spec || '').trim();
  return s ? `${s}학기` : '';
}

/* =========================================================================
 * 커리큘럼 체크
 * ========================================================================= */
let curriculumRows = [];

function setVocTrack(courseKey, track) {
  VocTrackStore.set(courseKey, track);
  router();  // location.hash가 바뀌지 않으므로 hashchange가 발생하지 않아 직접 재렌더링 호출
}

function renderCheck(courseKey) {
  const found = findCourse(courseKey);
  if (!found) return renderHome();
  const { cat, course } = found;
  showChrome(true);
  if (curriculumRows.length === 0) curriculumRows = [emptyRow()];
  const rawSpec0 = COURSE_SPECS[courseKey];
  const checkTrackSwitchHtml = (rawSpec0 && rawSpec0.durationTracks) ? `
    <div class="track-switch" style="display:flex;gap:8px;margin-bottom:16px">
      ${Object.keys(rawSpec0.durationTracks).map(tk => `
        <button class="btn ${VocTrackStore.get(courseKey) === tk ? 'btn-primary' : 'btn-ghost'}"
          onclick="setVocTrack('${courseKey}','${tk}')">${esc(rawSpec0.durationTracks[tk].trackLabel)}</button>
      `).join('')}
    </div>` : '';

  $('#app').innerHTML = `
    <div class="container">
      ${breadcrumb([['home','홈'], [`cat/${cat.key}`, cat.title], [`cat/${cat.key}/check`, '교과과정 체크하기'], [null, course.name]])}
      <div class="page-head">
        <span class="eyebrow">${esc(cat.title)} · 커리큘럼 검수</span>
        <h1>${COURSE_SPECS[courseKey] && COURSE_SPECS[courseKey].checkTitle
          ? esc(COURSE_SPECS[courseKey].checkTitle)
          : esc(course.name) + ' — 커리큘럼 검수'}</h1>
        <p>${COURSE_SPECS[courseKey]
          ? '교육운영계획서(PDF)를 업로드해 교과과정을 읽어온 뒤, 설정된 세부기준과 대조하여 검수합니다.'
          : '편성한 교과목을 입력하거나 CSV 파일로 업로드한 뒤, 설정된 세부기준과 대조하여 검수합니다.'}</p>
      </div>

      ${checkTrackSwitchHtml}

      ${Store.isSet(courseKey)
        ? `<div class="notice info"><span class="n-ico">${ICON.info}</span><div>이 과정의 <b>저장된 세부기준</b>으로 검수합니다.
            <a href="#/cat/${cat.key}/standards/${courseKey}" style="color:var(--c-blue-600);font-weight:700">기준 보기·수정</a></div></div>`
        : `<div class="notice"><span class="n-ico">${ICON.info}</span><div>이 과정의 세부기준이 아직 저장되지 않아 <b>기본 예시 기준</b>으로 검수합니다.
            <a href="#/cat/${cat.key}/standards/${courseKey}" style="color:#8a5e10;font-weight:700">기준 먼저 설정하기</a></div></div>`}

      ${COURSE_SPECS[courseKey] ? `
      <div class="panel">
        <div class="panel-head">
          <h2>교육운영계획서 업로드(PDF 파일)</h2>
          <span class="desc">PDF 로드맵을 분석해 교양/전공·필수/선택을 자동 추출</span>
        </div>
        <div class="panel-body">
          <label class="dropzone" ondragover="event.preventDefault()" ondrop="onPdfDrop(event)">
            <div style="color:var(--c-blue-600)">${ICON.upload}</div>
            <div><b id="pdfName">교육운영계획서(PDF) 선택</b> 또는 이곳에 파일을 끌어다 놓기</div>
            <small>예: 학위과정 교육운영계획서.pdf</small>
            <input type="file" accept="application/pdf,.pdf" style="display:none" id="pdfInput" onchange="onPdfPick(event)">
          </label>
          <div class="analyze-bar">
            <div class="field" style="flex:1;margin:0">
              <label>분석할 파일 내 위치</label>
              <div class="input-wrap">
                <input type="text" id="pdfLoc" value="${courseKey === 'voc-tech' ? '마.교과목구성' : '8.교육훈련과정로드맵'}" placeholder="예: 8.교육훈련과정로드맵">
              </div>
            </div>
            <div class="field" style="flex:0 0 220px;margin:0">
              <label>산업AI교과 분석 페이지 <span style="font-weight:400;color:var(--c-text-soft)">(선택)</span></label>
              <div class="input-wrap">
                <input type="text" id="pdfAiPages" value="${courseKey === 'voc-tech' ? '2~3' : '3'}" placeholder="예: 12 또는 12-14, 비우면 전체">
              </div>
            </div>
            <button class="btn btn-primary" id="analyzeBtn" onclick="runRoadmapAnalyze('${courseKey}')" disabled>${ICON.check} 교과과정 읽어오기</button>
          </div>
          <div id="analyzeMsg"></div>
        </div>
      </div>
      <div id="roadmapResult" style="margin-bottom:22px"></div>` : ''}

      ${!COURSE_SPECS[courseKey] ? `
      <div class="panel">
        <div class="panel-head">
          <h2>커리큘럼 입력</h2>
          <span class="desc">교과목명 · 학기 · 구분 · 학점 · 이론/실습 시수</span>
        </div>
        <div class="panel-body">
          <div class="toolbar" style="margin-bottom:16px">
            <label class="btn btn-ghost btn-sm" style="cursor:pointer">${ICON.upload} CSV 업로드
              <input type="file" accept=".csv,text/csv" style="display:none" onchange="importCsv(event)">
            </label>
            <button class="btn btn-soft btn-sm" onclick="loadSample()">샘플 데이터 불러오기</button>
            <button class="btn btn-ghost btn-sm" onclick="downloadTemplate()">CSV 양식 받기</button>
            <div class="spacer"></div>
            <button class="btn btn-danger-ghost btn-sm" onclick="clearRows()">전체 비우기</button>
          </div>

          <div class="curri-table">
            <div class="curri-head">
              <span></span>
              ${CURRICULUM_COLUMNS.map(c => `<span>${esc(c.label)}</span>`).join('')}
              <span></span>
            </div>
            <div id="curriRows">${curriculumRows.map((r, i) => rowHtml(r, i)).join('')}</div>
          </div>

          <div class="toolbar" style="margin-top:14px">
            <button class="btn btn-ghost btn-sm" onclick="addRow()">+ 교과목 추가</button>
          </div>
        </div>
      </div>

      <div class="toolbar" style="margin-bottom:24px">
        <button class="btn btn-primary" onclick="runCheck('${courseKey}')">${ICON.check} 기준 적합성 검수 실행</button>
      </div>` : ''}

      <div id="resultArea"></div>
    </div>`;
}

function emptyRow() { return { name: '', gwan: '전공', semester: '', category: '필수', credit: '', theory: '', practice: '' }; }

/* ---------- 교육운영계획서(PDF) 로드맵 분석 ---------------------------- */
let selectedPdf = null;
let lastDocInfo = {};   // 마지막 분석한 교육운영계획서 정보(저장 파일명·헤더용)
let lastNarrative = {}; // 마지막 분석 시 추출된 서술형 본문·표 기반 산업AI교과 목록
let lastCheck = null;   // 마지막 검수 결과(저장용)
function onPdfPick(ev) { const f = ev.target.files[0]; if (f) setPdf(f); }
function onPdfDrop(ev) { ev.preventDefault(); const f = ev.dataTransfer.files && ev.dataTransfer.files[0]; if (f) setPdf(f); }
function setPdf(f) {
  if (!/\.pdf$/i.test(f.name)) { toast('PDF 파일을 선택하세요.'); return; }
  selectedPdf = f;
  const nm = $('#pdfName'); if (nm) nm.textContent = f.name;
  const btn = $('#analyzeBtn'); if (btn) btn.disabled = false;
}
/* 학년-학기 라벨(예: '3-1') → 순차 학기번호(courseRules의 학년-학기 표기와 동일한 계산식: (학년-1)*2+학기) */
function semLabelToNum(label) {
  const m = String(label || '').match(/^(\d+)-(\d+)$/);
  if (!m) return '';
  return (+m[1] - 1) * 2 + +m[2];
}
/* 과정별 로드맵 시작 학년 — 학위과정(degree-regular)=1학년, 학위전공심화과정(degree-advanced)=3학년 (3,4학년 과정) */
function roadmapStartYear(courseKey) { return courseKey === 'degree-advanced' ? 3 : 1; }
/* "12", "12-14", "12,14" 같은 페이지 지정 문자열 → { from, to } 또는 null(전체 페이지 대상) */
function parsePageRange(text) {
  const s = String(text || '').replace(/\s+/g, '');
  if (!s) return null;
  const m = s.match(/^(\d+)\s*-\s*(\d+)$/);
  if (m) return { from: +m[1], to: +m[2] };
  const n = s.match(/^(\d+)(?:,(\d+))*$/);
  if (n) { const nums = s.split(',').map(Number); return { from: Math.min(...nums), to: Math.max(...nums) }; }
  return null;
}

async function runRoadmapAnalyze(courseKey) {
  if (!selectedPdf) { toast('먼저 교육운영계획서 PDF를 선택하세요.'); return; }
  const loc = ($('#pdfLoc').value || '').trim();
  const aiPagesRaw = ($('#pdfAiPages') && $('#pdfAiPages').value || '').trim();
  const aiPages = parsePageRange(aiPagesRaw);
  const msg = $('#analyzeMsg'), btn = $('#analyzeBtn');
  msg.innerHTML = `<div class="notice info"><span class="n-ico">${ICON.info}</span><div><b>${esc(selectedPdf.name)}</b> 분석 중입니다… (수십 페이지 PDF는 잠시 걸릴 수 있습니다)</div></div>`;
  if (btn) btn.disabled = true;
  try {
    const res = await analyzeRoadmap(selectedPdf, loc, roadmapStartYear(courseKey), aiPages);
    msg.innerHTML = '';
    lastDocInfo = res.info || {};
    lastNarrative = res.narrative || {};
    renderRoadmapResult(courseKey, res);
    // 읽어온 교과과정을 검수용 데이터로 보관 (세부기준 체크 시 사용)
    curriculumRows = res.courses.map(c => ({
      name: c.name,
      gwan: c.gwan,
      semester: semLabelToNum(c.semesters[0]) || '',
      category: c.req,
      credit: c.credit,
      theory: c.theory,
      practice: c.practice,
    }));
    refreshRows();
    // 이전 검수 결과는 지워, '세부기준 체크' 버튼을 눌렀을 때만 출력되도록 함
    const ra = $('#resultArea'); if (ra) ra.innerHTML = '';
    toast(res.courses.length + '개 교과목을 읽어왔습니다. [세부기준 체크]로 검수하세요.');
  } catch (e) {
    msg.innerHTML = `<div class="notice"><span class="n-ico">${ICON.info}</span><div>${esc(e.message || '분석에 실패했습니다.')}</div></div>`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderRoadmapResult(courseKey, res) {
  const s = res.summary, g = res.groups;
  const y0 = roadmapStartYear(courseKey);
  const chip = (label, o) => `<div class="stat"><div class="s-label">${label}</div>
    <div class="s-val">${o.credit}<small> 학점</small></div><div class="s-sub">NCS ${o.ncs}시간</div></div>`;
  const semCell = (v) => v > 0 ? `<td class="rc-n">${v}</td>` : `<td></td>`;
  // 컬럼: 교과구분 | 교과목 | 이론/실습 | NCS시간 | 학점 | 1-1 | 1-2 | 2-1 | 2-2
  const courseTr = (c) => `<tr>
    <td class="rc-gb ${c.gwan === '교양' ? 'gb-lib' : 'gb-maj'}">${esc(c.gwan)} ${esc(c.req)}</td>
    <td class="rc-name">${esc(c.name)}</td>
    <td class="rc-c">${c.type === '-' ? '' : esc(c.type)}</td>
    <td class="rc-n">${c.ncs || ''}</td>
    <td class="rc-n">${c.credit || ''}</td>
    ${(c.semCredits || [0, 0, 0, 0]).map(semCell).join('')}</tr>`;
  const sumTr = (cls, label, o) => `<tr class="${cls}"><td colspan="2">${label}</td>
    <td></td><td class="rc-n">${o.ncs || ''}</td><td class="rc-n">${o.credit || ''}</td>
    ${(o.sems || [0, 0, 0, 0]).map(semCell).join('')}</tr>`;
  const secTr = (t) => `<tr class="rc-sec"><td colspan="9">${t}</td></tr>`;
  const noTr = `<tr><td colspan="9" class="rc-empty">해당 교과 없음</td></tr>`;

  const body =
    // 맨 상단: 총계 (= 교양교과 계 + 전공교과 계)
    sumTr('rc-total', '총계', s.총계) +
    // 교양교과: 구분선 → 교양교과 계 → 소계+교과목
    secTr('교양교과') +
    sumTr('rc-grp', '교양교과 계', s.교양) +
    sumTr('rc-sub', '교양필수 소계', s.교양필수) + (g.교양.필수.map(courseTr).join('') || noTr) +
    sumTr('rc-sub', '교양선택 소계', s.교양선택) + (g.교양.선택.map(courseTr).join('') || noTr) +
    // 전공교과: 구분선 → 전공교과 계 → 소계+교과목
    secTr('전공교과') +
    sumTr('rc-grp', '전공교과 계', s.전공) +
    sumTr('rc-sub', '전공필수 소계', s.전공필수) + (g.전공.필수.map(courseTr).join('') || noTr) +
    sumTr('rc-sub', '전공선택 소계', s.전공선택) + (g.전공.선택.map(courseTr).join('') || noTr);

  const info = res.info || {};
  const infoItem = (k, v) => `<div class="info-item"><span class="ik">${k}</span><span class="iv">${esc(v || '-')}</span></div>`;

  $('#roadmapResult').innerHTML = `
    <div class="panel-head" style="border:0;padding:18px 0 12px"><h2>교육운영계획서 정보</h2></div>
    <div class="panel info-card"><div class="info-grid">
      ${infoItem('년도', info.년도)}
      ${infoItem('캠퍼스', info.캠퍼스)}
      ${infoItem('과정', info.과정)}
      ${infoItem('계열', info.계열)}
      ${infoItem('학과', info.학과)}
      ${infoItem('전공', info.전공)}
    </div></div>

    <div class="panel-head" style="border:0;padding:18px 0 12px">
      <h2>교과과정 보기</h2>
      <span class="desc">${res.startPage}페이지 로드맵 · 총 ${res.courses.length}개 교과목</span>
    </div>
    <div class="stat-row">${chip('교양교과', s.교양)}${chip('전공교과', s.전공)}${chip('총계', s.총계)}</div>
    <div class="rm-grid">${chip('교양필수', s.교양필수)}${chip('교양선택', s.교양선택)}${chip('전공필수', s.전공필수)}${chip('전공선택', s.전공선택)}</div>
    <div class="panel" style="overflow-x:auto">
      <table class="rc-table">
        <thead>
          <tr>
            <th rowspan="2">교과구분</th><th rowspan="2">교과목</th><th rowspan="2">이론/실습</th>
            <th rowspan="2">NCS<br>시간</th><th rowspan="2">학점</th><th colspan="2" class="rc-year">${y0}학년</th><th colspan="2" class="rc-year">${y0+1}학년</th>
          </tr>
          <tr><th>${y0}-1</th><th>${y0}-2</th><th>${y0+1}-1</th><th>${y0+1}-2</th></tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${res.narrative && res.narrative.industrialAi ? `
    <div class="panel-head" style="border:0;padding:18px 0 8px"><h2>산업AI교과 서술 확인 결과 (나.AI교과 섹션)</h2></div>
    <div class="panel" style="padding:14px 16px;font-size:13.5px;line-height:1.6">${esc(res.narrative.industrialAi)}</div>
    ` : (res.narrative ? `
    <div class="panel-head" style="border:0;padding:18px 0 8px"><h2>산업AI교과 서술 확인 결과</h2></div>
    <div class="notice warn" style="margin:0 0 4px"><span class="n-ico">${ICON.warn || ''}</span><div>문서에서 'AI교과' 섹션 내 '산업AI' 서술 내용을 찾지 못했습니다. 위 '산업AI교과 분석 페이지' 입력칸에 해당 내용이 있는 페이지 번호를 지정해 다시 읽어오세요.</div></div>
    ` : '')}
    <div class="toolbar" style="margin:18px 0 4px">
      <button class="btn btn-primary" onclick="runCheck('${courseKey}')">${ICON.check} 세부기준 체크 (기준 적합성 검수)</button>
      <span style="font-size:12.5px;color:var(--c-text-soft)">분석된 커리큘럼을 저장된 세부기준과 대조합니다.</span>
    </div>`;
  $('#roadmapResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function rowHtml(r, i) {
  const cell = (c) => {
    if (c.type === 'select') {
      return `<select data-i="${i}" data-k="${c.key}">${c.options.map(o =>
        `<option ${o === r[c.key] ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    }
    const type = c.type === 'number' ? 'number' : 'text';
    return `<input type="${type}" data-i="${i}" data-k="${c.key}" value="${esc(r[c.key])}"
              placeholder="${c.key === 'name' ? '교과목명 입력' : ''}">`;
  };
  return `
    <div class="curri-row">
      <span class="idx">${i + 1}</span>
      ${CURRICULUM_COLUMNS.map(cell).join('')}
      <button class="del-row" onclick="delRow(${i})" title="삭제">×</button>
    </div>`;
}

function syncRowsFromDom() {
  document.querySelectorAll('#curriRows [data-i]').forEach(el => {
    const i = +el.dataset.i, k = el.dataset.k;
    if (!curriculumRows[i]) return;
    curriculumRows[i][k] = el.value;
  });
}
function refreshRows() {
  const host = $('#curriRows');
  if (host) host.innerHTML = curriculumRows.map((r, i) => rowHtml(r, i)).join('');
}
function addRow() { syncRowsFromDom(); curriculumRows.push(emptyRow()); refreshRows(); }
function delRow(i) { syncRowsFromDom(); curriculumRows.splice(i, 1); if (!curriculumRows.length) curriculumRows = [emptyRow()]; refreshRows(); }
function clearRows() { curriculumRows = [emptyRow()]; refreshRows(); const ra = $('#resultArea'); if (ra) ra.innerHTML = ''; }
function loadSample() { curriculumRows = SAMPLE_CURRICULUM.map(r => Object.assign({}, r)); refreshRows(); toast('샘플 커리큘럼을 불러왔습니다.'); }

/* CSV 양식/업로드 */
function downloadTemplate() {
  const header = CURRICULUM_COLUMNS.map(c => c.label).join(',');
  const sample = '예) 프로그래밍기초,전공,1,필수,3,1,4';
  downloadFile('교과과정_입력양식.csv', '﻿' + header + '\n' + sample + '\n');
  toast('CSV 양식을 내려받았습니다.');
}
function importCsv(ev) {
  const file = ev.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const lines = String(reader.result).replace(/﻿/g, '').split(/\r?\n/).filter(l => l.trim());
      const rows = [];
      lines.forEach((line, idx) => {
        const cols = line.split(',').map(s => s.trim());
        // 헤더 추정: 첫 줄에 '교과목' 또는 숫자가 아닌 값
        if (idx === 0 && /교과목|과목명|name/i.test(line)) return;
        if (!cols[0] || /^예\)/.test(cols[0])) return;
        // 구버전(6컬럼: 교과목명,학기,구분,학점,이론,실습)과 신버전(7컬럼: 교과목명,교양/전공,학기,구분,학점,이론,실습) 모두 지원
        const hasGwanCol = cols.length >= 7 && /^(교양|전공)$/.test(cols[1]);
        if (hasGwanCol) {
          if (cols.length < 7) return;
          rows.push({ name: cols[0], gwan: /교양/.test(cols[1]) ? '교양' : '전공', semester: cols[2],
                      category: /선택/.test(cols[3]) ? '선택' : '필수',
                      credit: cols[4], theory: cols[5], practice: cols[6] });
        } else {
          if (cols.length < 6) return;
          rows.push({ name: cols[0], gwan: '전공', semester: cols[1], category: /선택/.test(cols[2]) ? '선택' : '필수',
                      credit: cols[3], theory: cols[4], practice: cols[5] });
        }
      });
      if (!rows.length) { toast('읽을 수 있는 데이터가 없습니다. 양식을 확인하세요.'); return; }
      curriculumRows = rows; refreshRows();
      toast(rows.length + '개 교과목을 불러왔습니다. (구버전 양식은 교양/전공을 \'전공\'으로 자동 지정했으니 필요 시 확인해 주세요.)');
    } catch { toast('CSV 파일을 읽지 못했습니다.'); }
  };
  reader.readAsText(file, 'utf-8');
  ev.target.value = '';
}
function downloadFile(name, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

/* ---------- 검수 엔진 -------------------------------------------------- */
function runCheck(courseKey) {
  syncRowsFromDom();
  const std = Store.get(courseKey);
  const rows = curriculumRows
    .map(r => ({
      name: r.name, gwan: r.gwan, semester: +r.semester || 0,
      category: r.category, credit: +r.credit || 0,
      theory: +r.theory || 0, practice: +r.practice || 0,
    }))
    .filter(r => r.name && r.credit > 0);

  if (!rows.length) { toast('검수할 교과목을 1개 이상 입력하세요.'); return; }

  // 집계
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  const totalTheory = rows.reduce((s, r) => s + r.theory, 0);
  const totalPractice = rows.reduce((s, r) => s + r.practice, 0);
  const totalHours = totalTheory + totalPractice;
  const reqCredit = rows.filter(r => r.category === '필수').reduce((s, r) => s + r.credit, 0);
  const semesters = [...new Set(rows.map(r => r.semester).filter(Boolean))].sort((a, b) => a - b);
  const practiceRatio = totalHours ? Math.round(totalPractice / totalHours * 1000) / 10 : 0;
  const requiredRatio = totalCredit ? Math.round(reqCredit / totalCredit * 1000) / 10 : 0;

  // 학기별 학점
  const semCredits = {};
  rows.forEach(r => { if (r.semester) semCredits[r.semester] = (semCredits[r.semester] || 0) + r.credit; });
  const semOver = Object.entries(semCredits).filter(([, c]) => c > std.creditsPerSemMax);
  const semUnder = Object.entries(semCredits).filter(([, c]) => c < std.creditsPerSemMin);
  const semVals = Object.values(semCredits);
  const semLo = semVals.length ? Math.min(...semVals) : 0;
  const semHi = semVals.length ? Math.max(...semVals) : 0;
  // 교과목 학점 범위
  const badCourses = rows.filter(r => r.credit < std.courseCreditMin || r.credit > std.courseCreditMax);
  const ccLo = Math.min(...rows.map(r => r.credit));
  const ccHi = Math.max(...rows.map(r => r.credit));

  const checks = [];
  const add = (ok, title, val, req, detail = '') => checks.push({ ok, title, val, req, detail });

  add(totalCredit >= std.totalCreditsMin && totalCredit <= std.totalCreditsMax,
      '총 편성학점', totalCredit + '학점',
      `${std.totalCreditsMin}~${std.totalCreditsMax}학점`);

  add(semesters.length === std.semesters,
      '운영 학기 수', semesters.length + '학기',
      std.semesters + '학기',
      semesters.length ? `편성 학기: ${semesters.join(', ')}학기` : '학기 정보 없음');

  add(semOver.length === 0 && semUnder.length === 0,
      '학기당편성학점', `${semLo}~${semHi}학점`,
      `학기당 ${std.creditsPerSemMin}~${std.creditsPerSemMax}학점`,
      (semOver.length || semUnder.length)
        ? `기준 외: ${[...semOver, ...semUnder].map(([s, c]) => `${s}학기(${c})`).join(', ')}` : '모든 학기 적합');

  add(badCourses.length === 0,
      '교과목당 학점', `${ccLo}~${ccHi}학점`,
      `과목당 ${std.courseCreditMin}~${std.courseCreditMax}학점`,
      badCourses.length ? `기준 외 과목: ${badCourses.map(c => c.name).join(', ')}` : '모든 과목 적합');

  add(practiceRatio >= std.practiceRatioMin,
      '실습편성비율', practiceRatio + '%',
      '최소 ' + std.practiceRatioMin + '%',
      `이론 ${totalTheory}시수 · 실습 ${totalPractice}시수`);

  if (std.requiredRatioMin > 0) {
    add(requiredRatio >= std.requiredRatioMin,
        '필수과목 비율', requiredRatio + '%',
        '최소 ' + std.requiredRatioMin + '%',
        `필수 ${reqCredit}학점 / 전체 ${totalCredit}학점`);
  }

  // 전공필수 편성학점 — 교과구분(전공) 정보가 있을 때만 점검 (최소/최대 범위 점검)
  if ((std.majorReqMin > 0 || std.majorReqMax > 0) && rows.some(r => r.gwan)) {
    const majorReqCredit = rows.filter(r => r.gwan === '전공' && r.category === '필수').reduce((s, r) => s + r.credit, 0);
    const okMin = std.majorReqMin <= 0 || majorReqCredit >= std.majorReqMin;
    const okMax = std.majorReqMax <= 0 || majorReqCredit <= std.majorReqMax;
    const ok = okMin && okMax;
    const refText = std.majorReqMax > 0 ? `${std.majorReqMin}~${std.majorReqMax}학점` : `최소 ${std.majorReqMin}학점`;
    add(ok,
        '전공필수 편성학점', majorReqCredit + '학점',
        refText,
        ok ? '' : `전공필수 ${majorReqCredit}학점 — 기준(${refText}) 미충족`);
  }

  if (std.capstone) {
    const has = rows.some(r => /캡스톤|capstone|졸업작품|졸업과제|프로젝트/i.test(r.name));
    add(has, '캡스톤(졸업작품) 포함', has ? '포함됨' : '미포함', '필수 포함', has ? '' : "'캡스톤/졸업작품' 관련 교과목이 필요합니다.");
  }

  // 교과목 편성기준(사용자 정의) — 교과구분 내 키워드 교과의 편성여부(Y/N) + 학점수 점검
  const GUBUN_MAP = { '전공필수': ['전공', '필수'], '전공선택': ['전공', '선택'], '교양필수': ['교양', '필수'], '교양선택': ['교양', '선택'] };
  const ruleEvalResults = [];
  CourseRuleStore.get(courseKey).forEach(r => {
    if (!r.on) return;
    const kw = (r.keyword || r.label || '').replace(/\s+/g, '');
    if (!kw) return;
    // 편성시만 검수: 해당 키워드가 전체 교과과정 어디에도 편성되어 있지 않으면 이 검수항목 자체를 적용하지 않음
    if (r.condOptional) {
      const anyOffered = rows.some(c => c.name.replace(/\s+/g, '').includes(kw));
      if (!anyOffered) return;
    }
    const gubun = (r.gubun || '').trim();
    let pool = rows;
    if (gubun) {
      if (courseKey === 'voc-tech') {
        // 직업교육과정: 교양교과/기초기술교과/계열공통교과/특화전공교과 — 단일 구분값을 gwan에 직접 매칭
        pool = rows.filter(c => (c.gwan || '').trim() === gubun);
      } else if (GUBUN_MAP[gubun]) {
        const [g, cat] = GUBUN_MAP[gubun];
        pool = rows.filter(c => (c.gwan || '').trim() === g && (c.category || '').trim() === cat);
      }
    }
    const semSet = parseSemSpec(r.semester);
    if (semSet) pool = pool.filter(c => semSet.has(Number(c.semester)));
    const matched = pool.filter(c => c.name.replace(/\s+/g, '').includes(kw));
    // '산업AI' 관련 규칙은 교과명 자체에 '산업AI'라는 말이 들어가지 않고(예: AI로봇제어실습),
    // 대신 '나.AI교과' 표의 '산업AI' 행에만 적힌다 — 이 행에서 추출된 실제 교과명(lastNarrative.industrialAiCourses)을
    // 별도로 매칭해 전공선택 편성으로 인정한다(학점은 표에 함께 적힌 값 사용).
    const isIndustrialAiRule = /산업\s*AI/.test(kw) || /산업\s*AI/.test(r.label || r.keyword || '');
    const narrativeCourses = (isIndustrialAiRule && lastNarrative && lastNarrative.industrialAiCourses) || [];
    const narrativeCredit = (isIndustrialAiRule && lastNarrative && lastNarrative.industrialAiCredit) || 0;
    const present = matched.length > 0 || narrativeCourses.length > 0;
    const actualCredit = matched.reduce((s, c) => s + c.credit, 0) + (matched.length === 0 ? narrativeCredit : 0);
    const wantPresent = (r.presence || 'Y') === 'Y';
    const lo = Number(r.creditMin) || 0;
    const hi = Number(r.creditMax) || 0;
    const creditActive = lo > 0 || hi > 0;
    const creditReqText = lo > 0 && hi > 0 ? `${lo}~${hi}학점` : lo > 0 ? `${lo}학점 이상` : `${hi}학점 이하`;
    const title = r.label || r.keyword;
    const gubunTag = gubun ? `[${gubun}] ` : '';
    const semTag = semSet ? `[${semSpecText(r.semester)}] ` : '';
    const condTag = r.condOptional ? '[편성시만 검수] ' : '';
    const tagPrefix = `${condTag}${gubunTag}${semTag}`;

    let ok, val, req, detail;
    if (wantPresent) {
      const creditOk = !creditActive ? true
        : (present && (lo === 0 || actualCredit >= lo) && (hi === 0 || actualCredit <= hi));
      ok = present && creditOk;
      val = present ? `편성됨${creditActive ? ` · ${actualCredit}학점` : ''}` : '미편성';
      req = `${tagPrefix}편성(Y)${creditActive ? ` · ${creditReqText}` : ''}`;
      detail = ok ? '' : (!present
        ? `${tagPrefix}'${r.keyword || title}' 교과가 편성되지 않았습니다.`
        : `학점 미충족 (실제 ${actualCredit}학점 / 기준 ${creditReqText})`);
    } else {
      ok = !present;
      val = present ? `편성됨${actualCredit > 0 ? ` · ${actualCredit}학점` : ''}` : '미편성';
      req = `${tagPrefix}미편성(N)`;
      detail = ok ? '' : `${tagPrefix}'${r.keyword || title}' 교과가 편성되어 있습니다(미편성 기준).`;
    }
    ruleEvalResults.push({ ok, title, val, req, detail, group: (r.group || '').trim(), groupOp: r.groupOp || 'AND' });
  });

  // 그룹 결합: 같은 그룹명을 가진 여러 검수항목을 AND/OR 조건으로 하나로 결합
  const groupMap = {};
  ruleEvalResults.forEach(res => {
    if (!res.group) { add(res.ok, res.title, res.val, res.req, res.detail); return; }
    if (!groupMap[res.group]) groupMap[res.group] = { op: res.groupOp, items: [] };
    groupMap[res.group].items.push(res);
  });
  Object.keys(groupMap).forEach(g => {
    const { op, items } = groupMap[g];
    const ok = op === 'OR' ? items.some(it => it.ok) : items.every(it => it.ok);
    const val = items.map(it => `${it.title}: ${it.val}`).join(' / ');
    const req = items.map(it => it.req).join(op === 'OR' ? ' 또는 ' : ' 그리고 ');
    const failed = items.filter(it => !it.ok);
    const detail = ok ? '' : `[${op === 'OR' ? '모두 미충족' : '일부 미충족'}] ` + failed.map(it => it.detail || `${it.title} 미충족`).join(' / ');
    add(ok, `[그룹] ${g}`, val, req, detail);
  });

  // 교양필수교과 검수 — 교양교과 설정(LiberalArtsStore)에 저장된 역량군별 필수교과 목록 기준으로 대조 (검수기준은 LiberalCheckRuleStore에서 사용자가 변경 가능)
  if (LiberalArtsStore.isSet(courseKey)) {
    const la = LiberalArtsStore.get(courseKey);
    const rule = LiberalCheckRuleStore.get(courseKey);
    const norm = (s) => (s || '').replace(/\s+/g, '');
    const groupInfo = LIBERAL_GROUPS.map(g => {
      const reqNames = (la[g.key] && la[g.key].required || []).map(r => (r.name || '').trim()).filter(Boolean);
      if (!reqNames.length) return { g, configured: false };
      const matched = rows.filter(r => r.gwan === '교양' && r.category === '필수'
        && reqNames.some(rn => norm(r.name).includes(norm(rn))));
      return { g, configured: true, reqNames, matched, offered: matched.length > 0, over: matched.length > rule.maxPerGroup, credit: matched.reduce((s, r) => s + r.credit, 0) };
    }).filter(x => x.configured);

    if (groupInfo.length) {
      // 1) 역량군별 저장된 필수교과가 실제 편성되어 있는지
      if (rule.checkOffered) {
        const missing = groupInfo.filter(x => !x.offered);
        add(missing.length === 0,
            '교양필수교과 편성 여부(역량군별)',
            groupInfo.map(x => `${x.g.label}: ${x.offered ? '편성' : '미편성'}`).join(' / '),
            '설정된 필수교과가 역량군별로 모두 편성',
            missing.length ? `미편성 역량군: ${missing.map(x => x.g.label + '(' + x.reqNames.join(',') + ')').join(', ')}` : '');
      }

      // 2) 역량군당 허용 초과 편성 여부
      if (rule.checkMaxPerGroup) {
        const over = groupInfo.filter(x => x.over);
        add(over.length === 0,
            '교양필수교과 역량군당 편성 수',
            groupInfo.map(x => `${x.g.label}: ${x.matched.length}과목`).join(' / '),
            `역량군당 최대 ${rule.maxPerGroup}과목`,
            over.length ? `초과 편성 역량군: ${over.map(x => x.g.label + '(' + x.matched.length + '과목)').join(', ')}` : '');
      }

      // 3) 총 편성 역량군수 · 총학점 검수
      if (rule.checkTotal) {
        const offeredGroups = groupInfo.filter(x => x.offered);
        const totalGroupCount = offeredGroups.length;
        const totalCredit = offeredGroups.reduce((s, x) => s + x.credit, 0);
        const okTotal = totalGroupCount === rule.targetGroupCount && totalCredit === rule.targetTotalCredit;
        add(okTotal,
            '교양필수교과 총 편성 역량군수/학점',
            `${totalGroupCount}개 역량군 · ${totalCredit}학점`,
            `${rule.targetGroupCount}개 역량군 · ${rule.targetTotalCredit}학점`,
            okTotal ? '' : `편성 현황: ${offeredGroups.map(x => x.g.label + ' ' + x.credit + '학점').join(', ')}`);
      }
    }
  }

  // 산업안전·산업AI 교과편성확인 — 등록된 교과명 중 가장 현재 검수기준(최소 편성수)을 만족하는지 확인
  Object.keys(SIMPLE_LIST_TYPES).forEach(type => {
    if (!SimpleListStore.isSet(type, courseKey)) return;
    const meta = SIMPLE_LIST_TYPES[type];
    const rule = SimpleRuleStore.get(type, courseKey);
    if (!rule.checkMinOne) return;
    const names = SimpleListStore.get(type, courseKey).map(r => (r.name || '').trim()).filter(Boolean);
    const norm = (s) => (s || '').replace(/\s+/g, '');
    // 리포팅 표시용: 괄호(및 괄호 안 내용) 제거 — 예: '산업안전교과(50ㄱ0)' → '산업안전교과' (매칭 로직에는 영향 없음)
    const displayName = (s) => (s || '').replace(/\(.*?\)/g, '').trim();
    const matched = rows.filter(r => names.some(n => norm(r.name).includes(norm(n))));
    // 산업AI교과: '나.AI교과' 표의 '산업AI교과' 행(1~4학기 셀)에서 직접 추출된 교과명은
    // 등록된 50개 풀에 없어도(학과 자율편성) 편성된 것으로 인정한다.
    const tableCourses = (type === 'industrialAi' && lastNarrative && lastNarrative.industrialAiCourses) || [];
    const alreadyCounted = (nm) => matched.some(r => norm(r.name).includes(norm(nm))) ;
    const extraFromTable = tableCourses.filter(nm => !alreadyCounted(nm));
    const totalCount = matched.length + extraFromTable.length;
    const ok = totalCount >= rule.minCount;
    const matchedLabel = [
      ...matched.map(m => displayName(m.name)),
      ...extraFromTable.map(nm => displayName(nm) + '(자율편성·표확인)'),
    ];
    add(ok,
        type === 'industrialAi' ? meta.checkTitle + '(자체편성포함)' : meta.checkTitle,
        `편성된 ${meta.itemLabel}: ${totalCount}과목${matchedLabel.length ? ' (' + matchedLabel.join(', ') + ')' : ''}`,
        `최소 ${rule.minCount}과목 이상 편성`,
        ok ? '' : `등록된 ${meta.itemLabel} 및 '나.AI교과' 표(산업AI교과 행) 확인 결과, 편성된 교과가 없거나 기준에 미달합니다. (최소 기준 ${rule.minCount}과목, 등록 과목수 ${names.length}과목)`);
  });

  const passCount = checks.filter(c => c.ok).length;
  const allPass = passCount === checks.length;
  const rate = Math.round(passCount / checks.length * 100);

  // 저장용 보관
  const courseName = (findCourse(courseKey) || {}).course ? findCourse(courseKey).course.name : courseKey;
  lastCheck = { checks, allPass, passCount, courseName, info: lastDocInfo };

  $('#resultArea').innerHTML = `
    <div class="panel-head" style="border:0;padding:8px 0 14px">
      <h2>검수 결과</h2>
      <span class="desc">적합 ${passCount}/${checks.length} 항목 (${rate}%)</span>
    </div>

    <div class="result-banner ${allPass ? 'pass' : 'fail'}">
      <div class="rb-ico">${allPass ? ICON.big_ok : ICON.big_no}</div>
      <div>
        <h3>${allPass ? '교과편성 기준에 적합합니다' : '일부 기준에 부적합합니다'}</h3>
        <p>${allPass ? '설정된 모든 세부기준을 충족했습니다.' : `${checks.length - passCount}개 항목이 기준을 충족하지 못했습니다.`}</p>
      </div>
      <div class="score"><b>${passCount}/${checks.length}</b><span>적합 항목 (${rate}%)</span></div>
    </div>

    <div class="panel" style="overflow-x:auto">
      <table class="vtable">
        <thead><tr>
          <th style="width:52px">순번</th><th>검수항목</th><th>값</th><th>검수기준</th><th style="width:84px">검수결과</th>
        </tr></thead>
        <tbody>
          ${checks.map((c, i) => `<tr class="${c.ok ? '' : 'no'}">
            <td>${i + 1}</td>
            <td class="vt-item">${esc(c.title)}${(!c.ok && c.detail) ? `<div class="vt-note">${esc(c.detail)}</div>` : ''}</td>
            <td>${esc(c.val)}</td>
            <td>${esc(c.req)}</td>
            <td class="${c.ok ? 'vt-y' : 'vt-n'}">${c.ok ? 'Y' : 'N'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="toolbar" style="margin:16px 0 4px">
      <button class="btn btn-soft" onclick="saveCheckResultToHistory('${courseKey}')">${ICON.check} 검수결과 저장</button>
      <button class="btn btn-soft" onclick="saveCheckResult('${courseKey}')">${ICON.upload} 검수결과 저장(CSV)</button>
      <button class="btn btn-primary" onclick="openPrintPreview('${courseKey}')">${ICON.book} 검수결과 출력하기</button>
      <span style="font-size:12.5px;color:var(--c-text-soft)">미리보기 후 PDF 저장 / 프린터 인쇄 · 검수결과 저장은 이 프로그램의 <a href="#/history">검수내역</a>에 누적됩니다</span>
    </div>`;

  $('#resultArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* 검수결과를 내부 내역(localStorage)에 누적 저장 — 검수한 모든 학과의 결과를 별도 화면에서 관리 */
function saveCheckResultToHistory(courseKey) {
  if (!lastCheck || !lastCheck.checks) { toast('먼저 세부기준 체크를 실행하세요.'); return; }
  const info = lastCheck.info || {};
  const record = {
    id: 'h' + Date.now() + Math.random().toString(36).slice(2, 7),
    savedAt: nowStamp(),
    courseKey,
    courseName: lastCheck.courseName,
    info: {
      년도: info.년도 || '', 캠퍼스: info.캠퍼스 || '', 과정: info.과정 || lastCheck.courseName || '',
      대학: info.대학 || lookupUnivByCampus(info.캠퍼스) || '', 계열: info.계열 || '', 학과: info.학과 || '', 전공: info.전공 || '',
    },
    pathwayEval: false,   // 과정평가형 여부(체크박스, 검수내역 화면에서 직접 설정)
    remark: '',           // 비고(검수내역 화면에서 직접 입력)
    trackKey: (COURSE_SPECS[courseKey] && COURSE_SPECS[courseKey].durationTracks) ? VocTrackStore.get(courseKey) : '',
    allPass: lastCheck.allPass,
    passCount: lastCheck.passCount,
    total: lastCheck.checks.length,
    checks: lastCheck.checks,
  };
  HistoryStore.add(record);
  toast('검수결과를 검수내역에 저장했습니다.');
}

/* =========================================================================
 * 검수결과 내역(전체 학과 누적 관리 화면)
 * ========================================================================= */
let historyFilter = { cat: 'degree', univ: '', campus: '' };
/* 검수내역 각 건의 시간총량 트랙(1,200h/600h) 표시 라벨 — 해당 없는 과정은 '-' */
function historyTrackLabel(r) {
  const spec = COURSE_SPECS[r.courseKey];
  if (!spec || !spec.durationTracks || !r.trackKey) return '-';
  const t = spec.durationTracks[r.trackKey];
  return t ? t.trackLabel : '-';
}
/* 검수내역 각 건이 학위과정/직업교육과정 중 어느 카테고리인지 조회 */
function historyCatKey(r) {
  const found = findCourse(r.courseKey);
  return found && found.cat ? found.cat.key : '';
}
function setHistoryFilter(field, value) {
  historyFilter[field] = value;
  if (field === 'cat') { historyFilter.univ = ''; historyFilter.campus = ''; }
  if (field === 'univ') { historyFilter.campus = ''; }
  renderHistory();
}
function resetHistoryFilter() {
  historyFilter.univ = '';
  historyFilter.campus = '';
  renderHistory();
}
function setHistoryTab(tabKey) {
  historyFilter = { cat: tabKey, univ: '', campus: '' };
  renderHistory();
}
function renderHistory() {
  showChrome(true);
  const app = $('#app');
  const allList = HistoryStore.all();

  /* ---- 탭(과정 구분) 옵션 — 학위과정/직업교육과정을 완전히 분리된 탭으로 구성 ---- */
  const tabOptions = Object.keys(PROGRAM_TREE).map(k => ({ key: k, title: PROGRAM_TREE[k].title }));
  if (!historyFilter.cat) historyFilter.cat = tabOptions[0].key;
  const tabScope = allList.filter(r => historyCatKey(r) === historyFilter.cat);

  /* ---- 필터 옵션 구성(현재 탭 범위 내에서만) ---- */
  const univOptions = [...new Set(tabScope.map(r => r.info.대학).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko'));
  const campusScope = historyFilter.univ ? tabScope.filter(r => r.info.대학 === historyFilter.univ) : tabScope;
  const campusOptions = [...new Set(campusScope.map(r => r.info.캠퍼스).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko'));

  /* ---- 필터 적용 ---- */
  const list = tabScope.filter(r =>
    (!historyFilter.univ || r.info.대학 === historyFilter.univ) &&
    (!historyFilter.campus || r.info.캠퍼스 === historyFilter.campus)
  );

  const rows = list.map((r, i) => `
    <tr>
      ${isAdmin() ? `<td><input type="checkbox" class="hist-check" data-id="${r.id}"></td>` : ''}
      <td>${i + 1}</td>
      <td class="l">${esc(r.info.과정 || r.courseName)}</td>
      ${historyFilter.cat === 'vocational' ? `<td>${esc(historyTrackLabel(r))}</td>` : ''}
      <td class="l">${esc(r.info.대학 || '-')}</td>
      <td>${esc(r.info.캠퍼스 || '-')}</td>
      <td>${esc(r.info.학과 || '-')}</td>
      <td>${esc(r.info.전공 || '-')}</td>
      <td style="text-align:center"><input type="checkbox" ${r.pathwayEval ? 'checked' : ''} ${isAdmin() ? '' : 'disabled'} onchange="updateHistoryField('${r.id}','pathwayEval',this.checked)" title="과정평가형 여부"></td>
      <td>${esc(r.savedAt)}</td>
      <td><span class="chip ${r.allPass ? 'chip-ok' : 'chip-no'}">${r.allPass ? '적합' : '부적합'}</span></td>
      <td>${r.passCount}/${r.total}</td>
      <td class="l">${isAdmin() ? `<input type="text" class="hist-inline-input" data-id="${r.id}" data-field="remark" value="${esc(r.remark || '')}" placeholder="비고 입력" onchange="updateHistoryField('${r.id}','remark',this.value)">` : esc(r.remark || '-')}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="navigate('history/${r.id}')">보기</button>
        ${isAdmin() ? `<button class="btn btn-ghost btn-sm" onclick="deleteHistoryOne('${r.id}')">삭제</button>` : ''}
      </td>
    </tr>`).join('');

  app.innerHTML = `
    <section class="page">
      <div class="panel-head">
        <h2>검수내역</h2>
        <span class="desc">저장된 학과·전공별 검수결과를 모아 확인하고 관리합니다. (${esc(PROGRAM_TREE[historyFilter.cat].title)} — 전체 ${tabScope.length}건 중 ${list.length}건 표시)</span>
      </div>

      <div class="hist-tabs" style="display:flex;gap:8px;margin-bottom:16px;border-bottom:2px solid var(--c-border,#e5e7eb);">
        ${tabOptions.map(t => `
          <button class="btn ${historyFilter.cat === t.key ? 'btn-primary' : 'btn-ghost'}"
            style="border-radius:10px 10px 0 0;border-bottom:none;font-weight:700;"
            onclick="setHistoryTab('${t.key}')">${esc(t.title)}</button>
        `).join('')}
      </div>

      ${allList.length === 0 ? `
        <div class="notice info"><span class="n-ico">${ICON.info}</span>
          <div>아직 저장된 검수결과가 없습니다. 커리큘럼 체크 실행 후 <b>검수결과 저장</b> 버튼으로 내역을 쌓아보세요.</div></div>
      ` : `
        <div class="panel" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px;padding:14px 16px;">
          <div class="field" style="margin:0;min-width:180px">
            <label>대학</label>
            <div class="input-wrap">
              <select onchange="setHistoryFilter('univ', this.value)">
                <option value="">전체</option>
                ${univOptions.map(u => `<option value="${esc(u)}" ${historyFilter.univ === u ? 'selected' : ''}>${esc(u)}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field" style="margin:0;min-width:180px">
            <label>캠퍼스</label>
            <div class="input-wrap">
              <select onchange="setHistoryFilter('campus', this.value)">
                <option value="">전체</option>
                ${campusOptions.map(c => `<option value="${esc(c)}" ${historyFilter.campus === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
              </select>
            </div>
          </div>
          ${(historyFilter.univ || historyFilter.campus) ? `<button class="btn btn-ghost btn-sm" onclick="resetHistoryFilter()">필터 초기화</button>` : ''}
        </div>
        ${isAdmin() ? `
        <div class="toolbar" style="margin-bottom:10px">
          <button class="btn btn-ghost btn-sm" onclick="toggleAllHistory(this)">전체 선택/해제</button>
          <button class="btn btn-danger btn-sm" onclick="deleteHistorySelected()">${ICON.no} 선택 삭제</button>
          <button class="btn btn-primary btn-sm" onclick="exportHistoryToExcel()">${ICON.set || ''} 전체 목록 엑셀로 저장</button>
          <span style="font-size:12.5px;color:var(--c-text-soft)">체크박스로 여러 건을 선택해 한번에 삭제할 수 있습니다. 대학·과정평가형·비고는 표에서 직접 입력·수정할 수 있습니다.</span>
        </div>` : `
        <div class="notice info" style="margin-bottom:10px"><span class="n-ico">${ICON.info}</span>
          <div>검수결과 보기만 가능합니다. 삭제·엑셀 내려받기는 관리자 로그인 후 이용할 수 있습니다.</div></div>`}
        <div class="panel" style="overflow-x:auto">
          <table class="vtable">
            <thead><tr>
              ${isAdmin() ? '<th style="width:34px"></th>' : ''}<th style="width:44px">순번</th><th>과정</th>${historyFilter.cat === 'vocational' ? '<th style="width:100px">구분(시간)</th>' : ''}<th style="width:130px">대학</th><th>캠퍼스</th><th>학과</th><th>전공</th>
              <th style="width:80px">과정평가형</th><th>저장일시</th><th style="width:70px">판정</th><th style="width:70px">충족률</th><th style="width:150px">비고</th><th style="width:130px">관리</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `}
    </section>`;
}

/* 검수내역 표에서 직접 수정하는 필드(대학·과정평가형·비고)를 저장 */
function updateHistoryField(id, field, value) {
  if (!isAdmin()) { toast('수정은 관리자만 이용할 수 있습니다.'); renderHistory(); return; }
  const r = HistoryStore.get(id);
  if (!r) return;
  if (field === '대학') {
    HistoryStore.update(id, { info: { ...r.info, 대학: value } });
  } else if (field === '캠퍼스') {
    // 캠퍼스가 바뀌면 매핑표를 참조해 대학 값도 함께 자동 갱신
    HistoryStore.update(id, { info: { ...r.info, 캠퍼스: value, 대학: lookupUnivByCampus(value) || r.info.대학 || '' } });
  } else {
    HistoryStore.update(id, { [field]: value });
  }
}

/* 검수내역 전체 목록을 엑셀(.xls, HTML 표 기반 — 별도 라이브러리 없이 오프라인에서도 엑셀로 정상 열림)로 내보낸다 */
function exportHistoryToExcel() {
  if (!isAdmin()) { toast('엑셀 내려받기는 관리자만 이용할 수 있습니다.'); return; }
  const tabKey = historyFilter.cat || Object.keys(PROGRAM_TREE)[0];
  const list = HistoryStore.all().filter(r => historyCatKey(r) === tabKey);
  if (!list.length) { toast(`${PROGRAM_TREE[tabKey].title}에 저장된 검수내역이 없습니다.`); return; }
  const headers = historyFilter.cat === 'vocational'
    ? ['순번', '과정', '구분(시간)', '대학', '캠퍼스', '학과', '전공', '과정평가형', '저장일시', '판정', '충족률', '비고']
    : ['순번', '과정', '대학', '캠퍼스', '학과', '전공', '과정평가형', '저장일시', '판정', '충족률', '비고'];
  const bodyRows = list.map((r, i) => {
    const cells = [
      i + 1,
      r.info.과정 || r.courseName || '',
      ...(tabKey === 'vocational' ? [historyTrackLabel(r)] : []),
      r.info.대학 || '',
      r.info.캠퍼스 || '',
      r.info.학과 || '',
      r.info.전공 || '',
      r.pathwayEval ? 'Y' : '',
      r.savedAt || '',
      r.allPass ? '적합' : '부적합',
      `${r.passCount}/${r.total}`,
      r.remark || '',
    ];
    return '<tr>' + cells.map(c => `<td>${esc(String(c))}</td>`).join('') + '</tr>';
  }).join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>검수내역</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
<body><table border="1"><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${bodyRows}</tbody></table></body></html>`;
  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  a.href = url;
  a.download = `CurriculumChecker-검수내역-${PROGRAM_TREE[tabKey].title}-${ts}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast(`${PROGRAM_TREE[tabKey].title} 검수내역 목록을 엑셀 파일로 저장했습니다.`);
}

function toggleAllHistory(btn) {
  const boxes = document.querySelectorAll('.hist-check');
  const allChecked = [...boxes].every(b => b.checked);
  boxes.forEach(b => b.checked = !allChecked);
}

function deleteHistoryOne(id) {
  if (!isAdmin()) { toast('삭제는 관리자만 이용할 수 있습니다.'); return; }
  if (!confirm('이 검수결과 내역을 삭제하시겠습니까?')) return;
  HistoryStore.remove([id]);
  toast('삭제했습니다.');
  renderHistory();
}

function deleteHistorySelected() {
  if (!isAdmin()) { toast('삭제는 관리자만 이용할 수 있습니다.'); return; }
  const ids = [...document.querySelectorAll('.hist-check:checked')].map(b => b.dataset.id);
  if (!ids.length) { toast('삭제할 항목을 선택하세요.'); return; }
  if (!confirm(`선택한 ${ids.length}건의 검수결과 내역을 삭제하시겠습니까?`)) return;
  HistoryStore.remove(ids);
  toast(`${ids.length}건을 삭제했습니다.`);
  renderHistory();
}

function renderHistoryDetail(id) {
  showChrome(true);
  const app = $('#app');
  const r = HistoryStore.get(id);
  if (!r) { app.innerHTML = `<section class="page"><div class="notice info"><span class="n-ico">${ICON.info}</span><div>해당 검수결과 내역을 찾을 수 없습니다.</div></div></section>`; return; }
  const rows = r.checks.map((c, i) => `<tr class="${c.ok ? '' : 'no'}">
    <td>${i + 1}</td>
    <td class="vt-item">${esc(c.title)}${(!c.ok && c.detail) ? `<div class="vt-note">${esc(c.detail)}</div>` : ''}</td>
    <td>${esc(c.val)}</td>
    <td>${esc(c.req)}</td>
    <td class="${c.ok ? 'vt-y' : 'vt-n'}">${c.ok ? 'Y' : 'N'}</td>
  </tr>`).join('');

  app.innerHTML = `
    <section class="page">
      <div class="panel-head">
        <h2>검수결과 상세</h2>
        <span class="desc"><a href="#/history">&larr; 검수내역 목록으로</a></span>
      </div>
      <div class="panel" style="padding:16px 20px;margin-bottom:14px">
        <table class="vtable" style="border:0">
          <tr><th style="width:90px">년도</th><td>${esc(r.info.년도 || '-')}</td><th style="width:90px">캠퍼스</th><td>${esc(r.info.캠퍼스 || '-')}</td></tr>
          <tr><th>과정</th><td>${esc(r.info.과정 || r.courseName)}</td><th>계열</th><td>${esc(r.info.계열 || '-')}</td></tr>
          <tr><th>학과</th><td>${esc(r.info.학과 || '-')}</td><th>전공</th><td>${esc(r.info.전공 || '-')}</td></tr>
          <tr><th>저장일시</th><td colspan="3">${esc(r.savedAt)}</td></tr>
        </table>
      </div>
      <div class="result-banner ${r.allPass ? 'pass' : 'fail'}">
        <div class="rb-ico">${r.allPass ? ICON.big_ok : ICON.big_no}</div>
        <div>
          <h3>${r.allPass ? '교과편성 기준에 적합합니다' : '일부 기준에 부적합합니다'}</h3>
          <p>${r.allPass ? '저장 당시 모든 세부기준을 충족했습니다.' : `${r.total - r.passCount}개 항목이 기준을 충족하지 못했습니다.`}</p>
        </div>
        <div class="score"><b>${r.passCount}/${r.total}</b><span>적합 항목</span></div>
      </div>
      <div class="panel" style="overflow-x:auto">
        <table class="vtable">
          <thead><tr><th style="width:52px">순번</th><th>검수항목</th><th>값</th><th>검수기준</th><th style="width:84px">검수결과</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="toolbar" style="margin:16px 0 4px">
        <button class="btn btn-danger btn-sm" onclick="deleteHistoryOne('${r.id}')">${ICON.no} 이 내역 삭제</button>
      </div>
    </section>`;
}

/* 검수 결과를 CSV로 저장 */
function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function sanitizeFileName(s) {
  return String(s || '').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
}
function nowStamp() {
  const n = new Date();
  const p = (x) => String(x).padStart(2, '0');
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} ${p(n.getHours())}:${p(n.getMinutes())}`;
}
// 파일명: 과정-캠퍼스-계열-학과-전공-검수결과
function reportFileBase() {
  const info = (lastCheck && lastCheck.info) || {};
  const parts = [(lastCheck && lastCheck.courseName) || info.과정, info.캠퍼스, info.계열, info.학과, info.전공]
    .map(sanitizeFileName).filter(Boolean);
  parts.push('검수결과');
  return parts.join('-');
}

function saveCheckResult(courseKey) {
  if (!lastCheck || !lastCheck.checks) { toast('먼저 세부기준 체크를 실행하세요.'); return; }
  const info = lastCheck.info || {};
  const lines = [];
  lines.push(['교육운영계획서 정보']);
  lines.push(['년도', info.년도 || '']);
  lines.push(['캠퍼스', info.캠퍼스 || '']);
  lines.push(['과정', info.과정 || lastCheck.courseName || '']);
  lines.push(['계열', info.계열 || '']);
  lines.push(['학과', info.학과 || '']);
  lines.push(['전공', info.전공 || '']);
  lines.push(['검수일시', nowStamp()]);
  lines.push([]);
  lines.push(['검수 결과', `${lastCheck.allPass ? '적합' : '부적합'} (${lastCheck.passCount}/${lastCheck.checks.length})`]);
  lines.push(['순번', '검수항목', '값', '검수기준', '검수결과', '비고']);
  lastCheck.checks.forEach((c, i) => {
    lines.push([i + 1, c.title, c.val, c.req, c.ok ? 'Y' : 'N', c.ok ? '' : (c.detail || '')]);
  });
  const csv = '﻿' + lines.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  downloadFile(reportFileBase() + '.csv', csv);
  toast('검수결과를 저장했습니다.');
}

/* ---- 검수결과 출력(미리보기 → PDF / 프린터) ---- */
function buildReportHtml() {
  const c = lastCheck, info = c.info || {};
  const rows = c.checks.map((ch, i) => `<tr>
    <td>${i + 1}</td><td class="l">${esc(ch.title)}${(!ch.ok && ch.detail) ? `<div class="rn">${esc(ch.detail)}</div>` : ''}</td>
    <td>${esc(ch.val)}</td><td>${esc(ch.req)}</td><td class="${ch.ok ? 'y' : 'n'}">${ch.ok ? 'Y' : 'N'}</td></tr>`).join('');
  return `<div class="report">
    <h1 class="rep-title">${esc(c.courseName)} 교과과정 검수결과</h1>
    <div class="rep-prog">한국폴리텍대학 교과과정 개편 세부기준 검수 프로그램</div>
    <table class="rep-info">
      <tr><th>년도</th><td>${esc(info.년도 || '-')}</td><th>캠퍼스</th><td>${esc(info.캠퍼스 || '-')}</td></tr>
      <tr><th>과정</th><td>${esc(info.과정 || '-')}</td><th>계열</th><td>${esc(info.계열 || '-')}</td></tr>
      <tr><th>학과</th><td>${esc(info.학과 || '-')}</td><th>전공</th><td>${esc(info.전공 || '-')}</td></tr>
      <tr><th>검수일시</th><td colspan="3">${nowStamp()}</td></tr>
    </table>
    <div class="rep-verdict ${c.allPass ? 'pass' : 'fail'}">종합 판정 : ${c.allPass ? '적합' : '부적합'} (${c.passCount}/${c.checks.length} 항목 충족)</div>
    <table class="rep-table">
      <thead><tr><th style="width:48px">순번</th><th>검수항목</th><th>값</th><th>검수기준</th><th style="width:72px">검수결과</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function openPrintPreview(courseKey) {
  if (!lastCheck || !lastCheck.checks) { toast('먼저 세부기준 체크를 실행하세요.'); return; }
  closePrintPreview();
  const ov = document.createElement('div');
  ov.id = 'printPreview';
  ov.className = 'print-overlay';
  ov.innerHTML = `
    <div class="print-dialog">
      <div class="print-toolbar no-print">
        <b>검수결과 미리보기</b>
        <span class="pt-hint">내용 확인 후 저장/인쇄하세요</span>
        <div class="spacer"></div>
        <button class="btn btn-primary btn-sm" onclick="exportReportPdf()">PDF로 저장</button>
        <button class="btn btn-soft btn-sm" onclick="printReport()">프린터로 인쇄</button>
        <button class="btn btn-ghost btn-sm" onclick="closePrintPreview()">닫기</button>
      </div>
      <div id="printArea" class="print-scroll">${buildReportHtml()}</div>
    </div>`;
  ov.addEventListener('click', (e) => { if (e.target === ov) closePrintPreview(); });
  document.body.appendChild(ov);
}
function closePrintPreview() { const ov = document.getElementById('printPreview'); if (ov) ov.remove(); }
function printReport() { window.print(); }

async function exportReportPdf() {
  const area = document.getElementById('printArea');
  if (!area) { toast('미리보기를 먼저 여세요.'); return; }
  if (!window.html2canvas || !window.jspdf) { toast('PDF 도구를 불러오지 못했습니다. 프린터 인쇄를 이용하세요.'); return; }
  toast('PDF를 생성 중입니다…');
  try {
    const canvas = await html2canvas(area, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
    const margin = 10, imgW = pw - margin * 2, imgH = canvas.height * imgW / canvas.width;
    let heightLeft = imgH, position = margin;
    pdf.addImage(imgData, 'JPEG', margin, position, imgW, imgH);
    heightLeft -= (ph - margin * 2);
    while (heightLeft > 0) {
      position = margin - (imgH - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgW, imgH);
      heightLeft -= (ph - margin * 2);
    }
    pdf.save(reportFileBase() + '.pdf');
    toast('PDF로 저장했습니다.');
  } catch (e) {
    toast('PDF 생성 실패 — 프린터 인쇄를 이용하세요.');
  }
}

/* ---------- 공통 컴포넌트 --------------------------------------------- */
function breadcrumb(items) {
  return `<nav class="breadcrumb">${items.map((it, i) => {
    const [href, label] = it;
    const sep = i < items.length - 1 ? `<span class="sep">${ICON.arrow}</span>` : '';
    return href !== null
      ? `<a onclick="navigate('${href}')">${esc(label)}</a>${sep}`
      : `<span>${esc(label)}</span>`;
  }).join('')}</nav>`;
}

/* 노출 함수 — 인라인 핸들러용 */
Object.assign(window, {
  navigate, saveStandards, resetStandards, renderStandards,
  renderSpecStandards, stdTab, saveSpecStandards,
  addRule, delRule,
  addRow, delRow, clearRows, loadSample, runCheck, importCsv, downloadTemplate,
  onPdfPick, onPdfDrop, runRoadmapAnalyze, saveCheckResult, saveCheckResultToHistory,
  openPrintPreview, closePrintPreview, printReport, exportReportPdf,
  renderLiberalArts, laAddRow, laDelRow, laSave,
  laToggleRulePanel, laSaveRule, laResetRule,
  renderSimpleList, slAddRow, slDelRow, slSave,
  slToggleRulePanel, slSaveRule, slResetRule,
  toggleAllHistory, deleteHistoryOne, deleteHistorySelected,
  exportAllData, importAllData,
  updateHistoryField, exportHistoryToExcel,
});

