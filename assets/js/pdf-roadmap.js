/* =========================================================================
 * pdf-roadmap.js
 *  교육운영계획서(PDF) "8.교육훈련과정로드맵" 표 분석기
 *  - pdf.js로 텍스트 좌표를 추출하여 표를 재구성
 *  - 종합정보시스템 표준 로드맵(A4, 595.3pt) 열 좌표 기준
 *  - 교과구분(교양/전공) × 필수/선택, 교과목·NCS시간·이론/실습·주당시간·학점·개설시기 추출
 * ========================================================================= */

if (window.pdfjsLib) {
  // file:// 로 직접 열었을 때 브라우저가 Worker 생성을 차단해 '가짜 워커' 폴백이
  // 워커 스크립트를 다시 fetch/eval 하려다 실패(Uncaught SyntaxError)하는 문제를 방지하기 위해
  // 워커 자체를 비활성화하고 메인 스레드에서 직접 처리하도록 강제한다.
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdf.worker.min.js';
  pdfjsLib.GlobalWorkerOptions.disableWorker = true;
}

/* 표 열 경계 x좌표 (vertical edges) — 표준 로드맵 양식 기준 */
const ROADMAP_BOUNDS = [42.5, 70.9, 99.2, 240.9, 269.3, 283.5, 304.7, 326.0,
  340.2, 361.4, 382.7, 396.9, 418.1, 439.4, 453.5, 474.8, 496.1, 510.2, 531.5, 552.8];
/* 열 인덱스 의미 */
const COL = {
  GWAN: 0, REQ: 1, NAME: 2, NCS: 3, CR: 4, TH: 5, PR: 6,
  SEM_CR: [7, 10, 13, 16],   // 1-1, 1-2, 2-1, 2-2 학점열
};
const SEM_LABELS = ['1-1', '1-2', '2-1', '2-2'];
/* 과정별 시작학년(학위과정=1학년, 학위전공심화과정=3학년) — 로드맵 표의 학기 라벨을 실제 학년-학기로 변환 */
function semLabelsFor(startYear) {
  const y = startYear || 1;
  return [`${y}-1`, `${y}-2`, `${y + 1}-1`, `${y + 1}-2`];
}

const despace = (s) => String(s || '').replace(/\s+/g, '');
const isNumStr = (s) => /^-?\d+(\.\d+)?$/.test(String(s).trim());

/* x 중심좌표 → 열 인덱스 */
function colOf(cx) {
  const b = ROADMAP_BOUNDS;
  if (cx >= b[b.length - 1]) return cx < b[b.length - 1] + 14 ? b.length - 2 : -1;
  if (cx < b[0]) return cx > b[0] - 14 ? 0 : -1;
  for (let i = 0; i < b.length - 1; i++) if (cx >= b[i] && cx < b[i + 1]) return i;
  return -1;
}

/* 한 페이지의 텍스트 항목 추출 {str, x, cx, top} */
async function roadmapPageItems(page) {
  const tc = await page.getTextContent();
  const vp = page.getViewport({ scale: 1 });
  return tc.items
    .filter(it => it.str && it.str.trim())
    .map(it => {
      const x = it.transform[4];
      const w = it.width || 0;
      return { str: it.str.trim(), x, cx: x + w / 2, top: vp.height - it.transform[5], width: w };
    });
}

/* 항목들을 baseline(top) 기준으로 행 클러스터링 */
function clusterRows(items, tol = 4.5) {
  const sorted = items.slice().sort((a, b) => a.top - b.top || a.x - b.x);
  const rows = [];
  let cur = null;
  for (const it of sorted) {
    if (!cur || Math.abs(it.top - cur.top) > tol) {
      cur = { top: it.top, items: [it] };
      rows.push(cur);
    } else {
      cur.items.push(it);
      cur.top = (cur.top + it.top) / 2;
    }
  }
  return rows;
}

/* 한 행을 열 맵으로 변환 { colIndex: "텍스트" }
 * pdf.js는 "32"를 "3","2"처럼 글자 단위로 쪼개므로 같은 열의 조각은 공백 없이 이어붙인다. */
function rowToCols(row) {
  const cells = {};
  row.items.slice().sort((a, b) => a.x - b.x).forEach(it => {
    const c = colOf(it.cx);
    if (c < 0) return;
    cells[c] = (cells[c] || '') + it.str.replace(/\s+/g, '');
  });
  return cells;
}

const numCell = (cells, c) => {
  const v = (cells[c] || '').trim();
  return isNumStr(v) ? parseFloat(v) : 0;
};

/* 페이지 항목 → 줄 단위 문자열 배열(공백 제거) */
function pageLines(items) {
  return clusterRows(items).map(r =>
    r.items.slice().sort((a, b) => a.x - b.x).map(it => it.str).join('').replace(/\s+/g, ''));
}

/* 1페이지(표지)에서 교육운영계획서 기본정보 추출 */
function extractDocInfo(lines) {
  const find = (re) => { for (const l of lines) { const m = l.match(re); if (m) return (m[1] || '').trim(); } return ''; };
  const 과정 = find(/^과정[:：]?(.+)$/);
  const 계열 = find(/^계열[:：]?(.+)$/);
  const 전공 = find(/^전공[:：]?(.+)$/) || find(/^직종[:：]?(.+)$/);
  // 학과명: 표지의 "교육운영계획서" 바로 위 줄(괄호 안) 단어.
  //   ※ 이름 글자와 괄호 '(' ')'가 다른 baseline(줄)으로 분리 추출될 수 있어,
  //     날짜줄 전까지 윗줄 텍스트를 모아 괄호·공백을 제거한다.
  let 학과 = '';
  const eduIdx = lines.findIndex(l => l.includes('교육운영계획서'));
  if (eduIdx > 0) {
    const parts = [];
    for (let i = eduIdx - 1; i >= 0 && i >= eduIdx - 4; i--) {
      const raw = lines[i] || '';
      if (/개발일자|확정일자/.test(raw)) break;
      const cleaned = raw.replace(/[()（）\s]/g, '');
      if (cleaned) parts.unshift(cleaned);
    }
    학과 = parts.join('');
  }
  if (!학과) 학과 = find(/\(([^)]*과)\)/);   // 보조: '과'로 끝나는 괄호어
  // 모든 학과명은 '과'로 끝남. 표지에 '과'가 생략된 경우 보정.
  if (학과 && !/과$/.test(학과)) 학과 += '과';
  const 캠퍼스 = find(/대학(.+?캠퍼스)/) || find(/(?:^|[:：])([가-힣]{2,8}캠퍼스)/) || find(/([가-힣]{2,8}캠퍼스)/);
  const 확정 = find(/확정일자[:：]?([\d.]+)/) || find(/개발일자[:：]?([\d.]+)/);
  let 년도 = '';
  const dm = 확정.match(/(\d{4})\.(\d{1,2})/);
  if (dm) { const y = +dm[1], mo = +dm[2]; 년도 = (mo >= 3 ? y + 1 : y) + '학년도'; }
  return { 년도, 캠퍼스, 과정, 계열, 학과, 전공, 확정일자: 확정 };
}

/* 지정된 페이지 범위(1-based, inclusive)의 텍스트를 이어붙여 반환. range가 없으면 문서 전체 */
async function extractFullText(pdf, range) {
  const from = range && range.from > 0 ? range.from : 1;
  const to = range && range.to > 0 ? Math.min(range.to, pdf.numPages) : pdf.numPages;
  let out = '';
  for (let p = from; p <= to; p++) {
    const page = await pdf.getPage(p);
    const items = await roadmapPageItems(page);
    const rows = clusterRows(items, 4.5);
    rows.forEach(row => {
      const sorted = row.items.slice().sort((a, b) => a.x - b.x);
      out += sorted.map(it => it.str).join(' ') + '\n';
    });
    out += '\n';
  }
  return out;
}

/* "나.AI교과"(또는 유사 표기) 섹션 안에서 "산업AI" 하위 문단을 찾아 해당 본문(교과명 포함)을 반환한다.
 * 자체편성(표에는 없지만 문서 서술에는 기재된) 교과를 확인하기 위한 용도. */
function extractIndustrialAiNarrative(fullText) {
  const text = String(fullText || '');
  // "나. AI교과" 헤딩 (스페이스/점 변형 허용)
  const headRe = /나\s*\.\s*AI\s*교과/;
  const headM = headRe.exec(text);
  if (!headM) return '';
  const afterHead = text.slice(headM.index + headM[0].length);
  // 그 다음 대문자 헤딩(다., 라. 등)까지를 "나.AI교과" 섹션 범위로 간주
  const nextHeadRe = /\n\s*[다-하]\s*\.\s*[^\n]/;
  const nextM = nextHeadRe.exec(afterHead);
  const sectionText = nextM ? afterHead.slice(0, nextM.index) : afterHead.slice(0, 1200);
  // 섹션 내에서 "산업AI" 하위 문단 찾기
  const subRe = /산업\s*AI/;
  const subM = subRe.exec(sectionText);
  if (!subM) return '';
  const afterSub = sectionText.slice(subM.index + subM[0].length);
  // 다음 소제목처럼 보이는 구간(예: "AI활용", 항목번호(1),2) 등) 전까지만 자르거나, 없으면 최대 400자를 이어붙임
  const nextSubRe = /\n\s*(AI활용|\(\d\)|\d\)|\d\.)/;
  const nextSubM = nextSubRe.exec(afterSub);
  const raw = nextSubM ? afterSub.slice(0, nextSubM.index) : afterSub.slice(0, 400);
  return raw.replace(/\s+/g, ' ').trim();
}

/* "나.AI교과" 표 안에서 "산업AI" 행(구분 셀이 "산업AI" 또는 "산업AI교과")을 찾아,
 * 그 행의 1~4학기 구간에 적힌 교과명을 모두 추출한다(학점 숨자 칸은 제외).
 * 표 자체를 루프 대상으로 보기 때문에 50개 풀 여부와 무관하게 학과 자율편성 교과도 그대로 검출된다. */
function extractIndustrialAiTableCourses(items) {
  const rows = clusterRows(items, 5);
  const names = [];
  const credits = [];
  const rowLabelRe = /^산업\s*AI(\s*교과)?$/;   // 구분 셀 라벨: "산업AI" 또는 "산업AI교과"

  rows.forEach(row => {
    const sorted = row.items.slice().sort((a, b) => a.x - b.x);

    // 행 왕쪽 구분 셀 텍스트를 순차적으로 이어붙여 라벨과 일치하는지 확인 (라벨은 짧으므로 6자 넘으면 포기)
    let acc = '', labelEnd = -1;
    for (let i = 0; i < sorted.length; i++) {
      acc += despace(sorted[i].str);
      if (rowLabelRe.test(acc)) { labelEnd = i; break; }
      if (acc.length > 6) break;
    }
    if (labelEnd < 0) return;

    const rest = sorted.slice(labelEnd + 1);
    if (!rest.length) return;

    // x좌표 간격(gap)이 크면 서로 다른 셀, 작으면 같은 값의 일부로 간주해 이어붙임(pdf.js가 글자 단위로 쪼갌는 문제 대응)
    const cells = [];
    let cur = null;
    for (const it of rest) {
      const w = it.width || (it.str.length * 6.2);
      if (!cur || (it.x - cur.endX) > 8) {
        cur = { text: it.str, endX: it.x + w };
        cells.push(cur);
      } else {
        cur.text += it.str;
        cur.endX = Math.max(cur.endX, it.x + w);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      const name = cells[i].text.replace(/\s+/g, '').trim();
      if (!name) continue;
      if (isNumStr(name)) continue;              // 학점 숨자만 있는 칸은 제외
      if (/^[-–—·.\s]*$/.test(name)) continue;   // 장식선·점만 있는 칸 제외
      if (['해당없음', '미편성'].includes(name)) continue;
      // 교과명 바로 다음 칸이 숨자면 해당 교과의 학점으로 간주
      const nextName = cells[i + 1] ? cells[i + 1].text.replace(/\s+/g, '').trim() : '';
      const credit = isNumStr(nextName) ? Number(nextName) : 0;
      names.push(name);
      credits.push(credit);
    }
  });

  return names.map((n, i) => ({ name: n, credit: credits[i] || 0 }))
    .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i);
}

/* PDF 파일 + 위치 텍스트 → 로드맵 분석 결과 */
async function analyzeRoadmap(file, locationText, startYear, aiPageRange) {
  const semLabels = semLabelsFor(startYear);
  if (!window.pdfjsLib) throw new Error('PDF 라이브러리를 불러오지 못했습니다.');
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf, disableWorker: true }).promise;
  const locKey = despace(locationText) || '교육훈련과정로드맵';

  // 0) 교육운영계획서 기본정보 (1~2페이지에서 탐색 — 캠퍼스가 2페이지에 있을 수 있음)
  let info = {};
  try {
    let infoLines = [];
    for (let p = 1; p <= Math.min(2, pdf.numPages); p++) {
      infoLines = infoLines.concat(pageLines(await roadmapPageItems(await pdf.getPage(p))));
    }
    info = extractDocInfo(infoLines);
  } catch (e) { info = {}; }

  // 1) 위치(로드맵) 시작 페이지 탐색 — 제목이 여러 텍스트 조각으로 분리될 수 있어
  //    페이지 전체 텍스트를 합쳐서 매칭한다.
  const core = locKey.replace(/^\d+[.\s]*/, '');   // 앞 '8.' 등 제거
  const anchor = core.length >= 3 ? core : locKey;
  let startPage = -1, startTop = 0;
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const items = await roadmapPageItems(page);
    const joined = despace(items.map(it => it.str).join(''));
    if (joined.includes(locKey) || (core.length >= 3 && joined.includes(core))) {
      let hit = items.find(it => despace(it.str).includes(anchor));
      if (!hit) {
        const frags = items.filter(it => { const d = despace(it.str); return d.length >= 2 && anchor.includes(d); });
        if (frags.length) hit = frags.reduce((a, b) => (a.top <= b.top ? a : b));
      }
      startPage = p; startTop = hit ? hit.top : 0;
      break;
    }
  }
  if (startPage < 0) throw new Error(`'${locationText}' 항목을 PDF에서 찾지 못했습니다. 위치 텍스트를 확인하세요.`);

  // 2) 로드맵 페이지(+연속 페이지) 행 수집
  let allRows = [];
  for (let p = startPage; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    let items = await roadmapPageItems(page);
    if (p === startPage) items = items.filter(it => it.top > startTop + 2);
    // 연속 페이지 판정: 표 상단에 '계학점' 열과 '이론/실습' 열 숫자가 동시에 있어야 로드맵 계속
    if (p !== startPage) {
      const topNums = items.filter(it => it.top < 220 && isNumStr(it.str));
      const hasCR = topNums.some(it => colOf(it.cx) === COL.CR);
      const hasThPr = topNums.some(it => { const c = colOf(it.cx); return c === COL.TH || c === COL.PR; });
      if (!(hasCR && hasThPr)) break;
    }
    allRows = allRows.concat(clusterRows(items));
  }

  // 3) 행 순회하며 분류
  const SECTION_GWAN = ['교양', '전공'];
  let section = 0;           // 0:전, 1:교양, 2:전공
  let blockCount = 0;        // 현재 구분 내 소계 블록 수 (1=필수, ≥2=선택)
  let curReq = '필수';
  const courses = [];

  for (const row of allRows) {
    const cells = rowToCols(row);
    const nameTxt = despace(cells[COL.NAME] || '');

    if (nameTxt === '총계') continue;                 // 총계 행
    if (nameTxt === '계') { section++; if (section > 2) break; blockCount = 0; continue; } // 그룹 계 → 구분 전환(교양→전공). 3회 이상이면 로드맵 종료
    if (nameTxt === '소계') {                          // 소계 → 블록 전환
      blockCount++;
      curReq = blockCount === 1 ? '필수' : '선택';
      continue;
    }
    if (!cells[COL.NAME]) continue;                    // 마커/빈 행
    if (['교과구분', '교과목', '교과목명'].includes(nameTxt)) continue; // 헤더
    if (section < 1) continue;                          // 표 본문 진입 전

    const credit = numCell(cells, COL.CR);
    const th = numCell(cells, COL.TH);
    const pr = numCell(cells, COL.PR);
    // 학기별 학점 + 개설시기
    const semCr = COL.SEM_CR.map(c => numCell(cells, c));
    const sems = [];
    semCr.forEach((v, i) => { if (v > 0) sems.push(semLabels[i]); });
    if (credit <= 0 && sems.length === 0) continue;     // 숫자 없는 비-교과 행 제외

    const rowName = (cells[COL.NAME] || '').replace(/\s+/g, ' ').trim();
    // 전공프로젝트실습(1,2)은 표 내 위치와 무관하게 항상 전공필수로 강제 분류
    const rowReq = /전공프로젝트실습/.test(rowName) ? '필수' : curReq;
    courses.push({
      gwan: SECTION_GWAN[Math.min(section, 2) - 1] || '전공',
      req: rowReq,
      name: rowName,
      ncs: numCell(cells, COL.NCS),
      type: pr > 0 ? '실습' : (th > 0 ? '이론' : '-'),
      weekly: th + pr,
      theory: th,
      practice: pr,
      credit,
      semesters: sems,
      semCredits: semCr,   // [1-1, 1-2, 2-1, 2-2] 학점
    });
  }

  if (!courses.length) throw new Error('로드맵 표에서 교과목을 추출하지 못했습니다. 위치/문서 형식을 확인하세요.');

  // 4) 집계
  const groups = { 교양: { 필수: [], 선택: [] }, 전공: { 필수: [], 선택: [] } };
  courses.forEach(c => { (groups[c.gwan] && groups[c.gwan][c.req] || (groups[c.gwan][c.req] = [])).push(c); });

  const sum = (arr) => arr.reduce((a, c) => ({
    credit: a.credit + c.credit,
    ncs: a.ncs + c.ncs,
    sems: a.sems.map((v, i) => v + ((c.semCredits && c.semCredits[i]) || 0)),
  }), { credit: 0, ncs: 0, sems: [0, 0, 0, 0] });
  const combine = (a, b) => ({
    credit: a.credit + b.credit,
    ncs: a.ncs + b.ncs,
    sems: a.sems.map((v, i) => v + b.sems[i]),
  });
  const summary = {
    교양필수: sum(groups.교양.필수), 교양선택: sum(groups.교양.선택),
    전공필수: sum(groups.전공.필수), 전공선택: sum(groups.전공.선택),
  };
  summary.교양 = combine(summary.교양필수, summary.교양선택);
  summary.전공 = combine(summary.전공필수, summary.전공선택);
  summary.총계 = combine(summary.교양, summary.전공);

  const narrative = {};
  try {
    const fullText = await extractFullText(pdf, aiPageRange);
    narrative.industrialAi = extractIndustrialAiNarrative(fullText);
    narrative.aiPageRange = aiPageRange || null;
    // "나.AI교과" 표 내 "산업AI교과" 행의 1~4학기 셀에 적힌 교과명을 모두 수집(50개 풀 외 학과 자율편성 포함)
    const from = aiPageRange && aiPageRange.from > 0 ? aiPageRange.from : 1;
    const to = aiPageRange && aiPageRange.to > 0 ? Math.min(aiPageRange.to, pdf.numPages) : pdf.numPages;
    let tableCourses = [];
    for (let p = from; p <= to; p++) {
      const page = await pdf.getPage(p);
      const items = await roadmapPageItems(page);
      tableCourses = tableCourses.concat(extractIndustrialAiTableCourses(items));
    }
    // 중복 교과명 제거(페이지 범위가 여러 페이지이면 동일 행이 준복될 수 있음)
    const seen = new Set();
    const uniqTableCourses = tableCourses.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });
    narrative.industrialAiCourses = uniqTableCourses.map(c => c.name);
    narrative.industrialAiCredit = uniqTableCourses.reduce((s, c) => s + (c.credit || 0), 0);
  } catch (e) { console.error('[narrative extract error]', e); }

  return { info, startPage, courses, groups, summary, narrative };
}

/* =========================================================================
 * 전문기술과정 "마.교과목구성" 표 전용 분석기 (시간총량 기반, 학위과정 로드맵과 열 구조가 다름)
 * ========================================================================= */
const VOC_BOUNDS = { GWAN: [55, 100], NAME: [100, 200], HOURS: [200, 225],
  NCS_APPLIED: [370, 400], SEM_TOTAL: [400, 430], SEM1: [430, 460], SEM2: [460, 500] };
// 주의: 실제 PDF에는 "계열공통", "특화전공"과 같이 "교과" 없이 인쇄되는 경우가 있어,
// 실제 표기와 일치하는 문자열로 맞추고(끝에 "교과"가 붙는 경우도 despace 후 includes()로 여분히 잡힌다)
const VOC_GWAN_LABELS = ['교양교과', '기초기술교과', '계열공통', '특화전공'];

function vocInRange(x, r) { return x >= r[0] && x < r[1]; }

function vocClusterRows(items, tol) {
  const sorted = items.slice().sort((a, b) => a.top - b.top || a.x - b.x);
  const rows = [];
  let cur = null;
  for (const it of sorted) {
    if (!cur || it.top - cur.top > tol) { cur = { top: it.top, items: [] }; rows.push(cur); }
    cur.items.push(it);
  }
  return rows;
}

/* 인접한 두 클러스터(같은 시각적 행이 baseline 차이로 분리된 경우)를 하나로 합침 */
function vocMergeAdjacent(rows, gapTol) {
  const merged = [];
  for (let i = 0; i < rows.length; i++) {
    if (i + 1 < rows.length && (rows[i + 1].top - rows[i].top) <= gapTol) {
      merged.push({ top: rows[i].top, items: rows[i].items.concat(rows[i + 1].items) });
      i++;
    } else {
      merged.push(rows[i]);
    }
  }
  return merged;
}

function vocRowText(row, range) {
  return row.items.filter(it => vocInRange(it.cx != null ? it.cx : it.x, range))
    .sort((a, b) => a.x - b.x).map(it => it.str).join('');
}

/* 한 페이지에서 "마.교과목구성" 표의 교과목 행을 추출 */
/* 표 라벨(정식 4구분) → 화면 표시용 축약 라벨 */
/* 표에 실제 인쇄된 라벨(좌: 정식 4구분 표기) → 화면에 표시할 축약 라벨(우) */
const VOC_GWAN_DISPLAY = {
  '교양교과': '교양교과', '기초기술교과': '기초기술',
  '계열공통': '계열공통', '특화전공': '특화전공',
};
/* 화면 표시 축약 라벨 목록(= 소계/정렬 기준 순서) */
// 구분(교양교과/기초기술/계열공통/특화전공) 순서는 과정마다 다르다.
// 전문기술과정(voc-tech)은 4개 구분(교양교과 포함)이지만,
// 하이테크과정(voc-hitech)은 교양교과를 편성하지 않아 3개 구분(기초기술/계열공통/특화전공)만 존재한다.
// 이 순서가 PDF의 소계 등장 순서와 그대로 일치해야 각 소계/교과목이 올바른 구분으로 배치된다.
const VOC_GROUP_ORDER = ['교양교과', '기초기술', '계열공통', '특화전공'];
const VOC_GROUP_ORDER_HITECH = ['기초기술', '계열공통', '특화전공'];
function vocGroupOrderFor(courseKey) { return courseKey === 'voc-hitech' ? VOC_GROUP_ORDER_HITECH : VOC_GROUP_ORDER; }

/* 구분 셀이 세로 병합되어 있어 라벨 문자열이 그룹 중간(혹은 끝쪽)에 찍히는 경우가 많아, 라벨 위치로 구분을 판단하면
 * 그룹 초반부 교과목이 이전 구분으로 잘못 붙는 오류가 발생한다.
 * 대신 표에 이미 인쇄된 "소계" 행이 항상 그 구분의 교과목 바로 위에 먼저 나오고(예: 소계(60)→교양교과 3개교과,
 * 소계(110)→기초기술 3개교과 …), 그 순서는 VOC_GROUP_ORDER와 항상 일치하므로,
 * "소계" 행을 만날 때마다 다음 구분으로 넘어가면서 그 이후 교과목을 배치한다.
 * state.groupIdx를 호출자(analyzeVocTech)가 여러 페이지에 걸쳐 공유해야, 표가 페이지를 넘어가도 구분이 유지된다. */
/* 표의 NCS적용시간·편성시간(계/1학기/2학기/3학기) 컬럼 x좌표는 학과·직종·과정(전문기술/하이테크)마다 실제 인쇄 위치가
 * 조금씩 달라, 고정된 픽셀 범위(VOC_BOUNDS)로는 일부 문서에서 값이 다른 컬럼으로 밀려 읽히거나 아예 인식되지 않는다.
 * 이를 막기 위해, 각 페이지의 실제 헤더 텍스트("NCS", "계", "1학기", "2학기", "3학기", "비고") 위치를 직접 찾아
 * 그 페이지에 맞는 컬럼 경계를 동적으로 계산한다. 헤더를 찾지 못한 페이지(표 헤더가 없는 이어지는 페이지 등)는
 * 이전에 감지된 경계를 그대로 이어받아 사용한다(호출자가 마지막 성공 경계를 캐시해 넘겨줌). */
/* v1.9.0 — 헤더 인식 전면 재작성
 *  - 표 헤더가 페이지 상단(top<=150)에만 있다고 가정하던 제한 제거: "마.교과목구성" 제목 아래 페이지 중간에서 시작하는 표도 인식
 *  - 글자 단위 x좌표를 아이템 폭(width)으로 보간하고, 라벨 "시작점"이 아닌 "중심"을 컬럼 기준으로 사용(값 셀은 가운데 정렬)
 *  - 헤더 탐색 범위를 편성시간 하위행(계/1학기/2학기) 주변 밴드로 한정 → 본문 설명문의 "NCS 적용" 등 오검출 방지
 *  - 시간(교과목 총 시간) 컬럼·교과목명 컬럼도 헤더 위치로 동적 산출(찾지 못하면 기존 고정값 사용)
 *  - 편성시간 하위 컬럼이 "기초/심화/특화"로 인쇄된 문서는 layout='alt'로 표시(호출자가 하이테크과정 검수 불가 처리) */
function vocNum(s) {
  const t = despace(s).replace(/,/g, '');
  return isNumStr(t) ? Number(t) : null;
}
function vocHeaderRows(items, tol) {
  const sorted = items.slice().sort((a, b) => a.top - b.top || a.x - b.x);
  const rows = [];
  sorted.forEach(it => {
    let row = rows.find(r => Math.abs(r.top - it.top) <= tol);
    if (!row) { row = { top: it.top, items: [] }; rows.push(row); }
    row.items.push(it);
  });
  rows.forEach(row => {
    row.items.sort((a, b) => a.x - b.x);
    let buf = ''; const cx = [];
    row.items.forEach(it => {
      const s = despace(it.str);
      const w = it.width || 0;
      for (let k = 0; k < s.length; k++) cx.push(it.x + (s.length ? (k + 0.5) * w / s.length : 0));
      buf += s;
    });
    row.buf = buf; row.charX = cx;
  });
  return rows;
}
/* row 안에서 label의 모든 출현 위치(중심 x) 반환 */
function vocFindAll(row, label) {
  const out = [];
  let idx = row.buf.indexOf(label);
  while (idx !== -1) {
    const a = row.charX[idx], b = row.charX[idx + label.length - 1];
    out.push({ x: (a + b) / 2, top: row.top, idx });
    idx = row.buf.indexOf(label, idx + 1);
  }
  return out;
}
function detectVocTimeBounds(items) {
  if (!items || !items.length) return null;
  const rows = vocHeaderRows(items, 2.2);
  // 1) 편성시간 하위 헤더행 찾기: "1학기"+"2학기" 또는 "기초"+"심화"(+"특화")가 표 오른쪽 영역(x>250)에 함께 있는 행
  let semRow = null, layout = 'semester';
  for (const r of rows) {
    const s1 = vocFindAll(r, '1학기').filter(p => p.x > 250), s2 = vocFindAll(r, '2학기').filter(p => p.x > 250);
    if (s1.length && s2.length) { semRow = r; layout = 'semester'; break; }
    const a1 = vocFindAll(r, '기초').filter(p => p.x > 250), a2 = vocFindAll(r, '심화').filter(p => p.x > 250);
    if (a1.length && a2.length) { semRow = r; layout = 'alt'; break; }
  }
  if (!semRow) return null;
  const pick = (label) => { const f = vocFindAll(semRow, label).filter(p => p.x > 250); return f.length ? f[0] : null; };
  const sem1 = layout === 'alt' ? pick('기초') : pick('1학기');
  const sem2 = layout === 'alt' ? pick('심화') : pick('2학기');
  const sem3 = layout === 'alt' ? pick('특화') : pick('3학기');
  // 2) 헤더 밴드: 하위 헤더행 위 50pt ~ 아래 6pt (병합 헤더 "NCS/적용시간", "편성시간", "시간", "교과목명" 등이 걸치는 범위)
  const band = rows.filter(r => r.top >= semRow.top - 50 && r.top <= semRow.top + 6);
  const inBand = (label) => band.reduce((acc, r) => acc.concat(vocFindAll(r, label)), []);
  // 3) 편성시간(계): 1학기(기초) 왼쪽에서 가장 가까운 "계"
  const leftNearest = (cands, xMax, xMin) => cands.filter(c => c.x < xMax && c.x > (xMin == null ? -1 : xMin)).sort((a, b) => b.x - a.x)[0] || null;
  let total = leftNearest(vocFindAll(semRow, '계'), sem1.x);
  if (!total) total = leftNearest(inBand('계'), sem1.x, sem1.x - 70);
  if (!total) return null;
  // 4) NCS적용시간: 계 왼쪽에서 가장 가까운 "적용"(없으면 "NCS")
  let ncs = leftNearest(inBand('적용'), total.x - 5) || leftNearest(inBand('NCS'), total.x - 5);
  if (!ncs) return null;
  // 5) 교과목명 / 시간 컬럼(선택): "교과목" 라벨과, 그 오른쪽 첫 "시간"(적용시간·편성시간 제외)
  let nameLbl = null, hoursLbl = null;
  const nameC = inBand('교과목').filter(c => c.x < ncs.x).sort((a, b) => a.x - b.x);
  if (nameC.length) nameLbl = nameC[0];
  band.forEach(r => vocFindAll(r, '시간').forEach(c => {
    const pre = r.buf.slice(Math.max(0, c.idx - 2), c.idx);
    if (pre === '적용' || pre === '편성' || pre.endsWith('S')) return;
    if (c.x >= ncs.x - 10) return;
    if (nameLbl && c.x <= nameLbl.x) return;
    if (!hoursLbl || c.x < hoursLbl.x) hoursLbl = c;
  }));
  const remark = inBand('비고').filter(c => c.x > total.x).sort((a, b) => a.x - b.x)[0] || null;

  const cols = [{ key: 'NCS_APPLIED', x: ncs.x }, { key: 'SEM_TOTAL', x: total.x }, { key: 'SEM1', x: sem1.x }];
  if (sem2) cols.push({ key: 'SEM2', x: sem2.x });
  if (sem3) cols.push({ key: 'SEM3', x: sem3.x });
  cols.sort((a, b) => a.x - b.x);
  const bounds = { layout };
  for (let i = 0; i < cols.length; i++) {
    const gapL = i > 0 ? (cols[i].x - cols[i - 1].x) / 2 : (cols.length > 1 ? (cols[1].x - cols[0].x) / 2 : 15);
    const gapR = i < cols.length - 1 ? (cols[i + 1].x - cols[i].x) / 2 : gapL;
    let right = cols[i].x + gapR;
    if (i === cols.length - 1 && remark) right = Math.min(right, (cols[i].x + remark.x) / 2);
    bounds[cols[i].key] = [cols[i].x - gapL, right];
  }
  if (!bounds.SEM2) bounds.SEM2 = [-2, -1];
  if (hoursLbl) {
    const w = 11;
    bounds.HOURS = [hoursLbl.x - w, hoursLbl.x + w];
    const nameLeft = nameLbl ? Math.min(VOC_BOUNDS.NAME[0], nameLbl.x - 60) : VOC_BOUNDS.NAME[0];
    bounds.NAME = [Math.max(nameLeft, VOC_BOUNDS.GWAN[1] - 5), hoursLbl.x - w];
  }
  return bounds;
}

/* 편성시간 하위 헤더가 "기초/심화/특화"인지 독립 판정(계·NCS 헤더 인식 실패와 무관하게 동작) */
function vocHasAltHeader(items) {
  return vocHeaderRows(items || [], 2.2).some(r =>
    vocFindAll(r, '기초').some(p => p.x > 250) && vocFindAll(r, '심화').some(p => p.x > 250) && vocFindAll(r, '특화').some(p => p.x > 250));
}

function vocReadCounts(r, bounds) {
  const b = bounds || VOC_BOUNDS;
  const rd = (rg) => rg ? vocNum(vocRowText(r, rg)) : null;
  const ncsV = rd(b.NCS_APPLIED), totV = rd(b.SEM_TOTAL);
  const sem1 = rd(b.SEM1) || 0, sem2 = rd(b.SEM2) || 0, sem3 = rd(b.SEM3) || 0;
  let semTotal = totV != null ? totV : '';
  // 계가 미인식/0이면 학기 합으로 보정(계 = 1학기 + 2학기 [+ 3학기])
  if ((semTotal === '' || semTotal === 0) && (sem1 > 0 || sem2 > 0 || sem3 > 0)) semTotal = sem1 + sem2 + sem3;
  let ncsHours = ncsV != null ? ncsV : '';
  // NCS적용시간은 편성시간(계)을 초과할 수 없음 → 초과 시 컬럼 밀림으로 보고 무시
  if (ncsHours !== '' && semTotal !== '' && ncsHours > semTotal) ncsHours = '';
  return { ncsHours, semTotal, sem1, sem2, sem3 };
}

function extractVocTechCourses(items, state, groupOrder, bounds) {
  const rows = vocMergeAdjacent(vocClusterRows(items, 2.3), 1.6);
  // 능력단위가 2~4개인 교과목은 교과목명·편성시간(HOURS)만 자기 행에 있고, 능력단위별 NCS적용시간·학기시간은
  // 그 위/아래의 별도 행(능력단위분류번호가 적힌 행)에 나뉘어 인쇄된다. 이런 "능력단위 서브행"은 이름이 없고
  // NCS적용시간/학기시간 값만 가지므로, 가장 가까운(세로 거리) 실제 교과목 행에 합산해 붙여준다.
  const parsed = rows.map(r => {
    const bb = bounds || VOC_BOUNDS;
    let name = vocRowText(r, bb.NAME || VOC_BOUNDS.NAME).trim();
    if (despace(name) === '소계' || despace(name) === '총계') name = despace(name);   // "소 계", "총 계" 표기 대응
    const hv = vocNum(vocRowText(r, bb.HOURS || VOC_BOUNDS.HOURS));
    const hoursStr = hv != null ? String(hv) : '';   // "1,200" 같은 천단위 쉼표 대응
    const cnt = vocReadCounts(r, bounds);
    return { top: r.top, name, hoursStr, cnt };
  });
  // v1.9.1 — 능력단위 2~4개 교과목 처리
  //  실제 PDF(예: 하이테크 반도체신뢰성테스트)는 교과목명이 능력단위 행들의 세로 가운데에 "이름만" 인쇄되고,
  //  시간·NCS적용시간·편성시간(계/1학기/2학기)은 능력단위마다 별도 행(이름 없음)에 인쇄된다.
  //  → 이름만 있는 행을 "다중 능력단위 교과목"으로 인정하고, 이름 없는 데이터 행(능력단위 행)을
  //    가장 가까운 이름-only 교과목에 우선 합산한다(최대 4개 능력단위, 세로 거리 40pt 이내).
  const HEADER_RE = /^(교과목명?|교과구분|구분|시간|능력단위.*|NCS.*|편성시간|비고)$/;
  parsed.forEach(p => {
    if (p.name === '총' || p.name === '소') p.name = p.name + '계';   // "계" 글자가 시간 칸으로 밀린 경우
    p.hasData = isNumStr(p.hoursStr) || p.cnt.ncsHours !== '' || p.cnt.sem1 > 0 || p.cnt.sem2 > 0 || p.cnt.sem3 > 0 || (p.cnt.semTotal !== '' && p.cnt.semTotal > 0);
    p.isTotal = p.name === '총계' || p.name === '소계';
    p.nameOnly = !!p.name && !p.isTotal && !p.hasData && !HEADER_RE.test(despace(p.name)) && /[가-힣A-Za-z]/.test(p.name);
  });
  const boundaries = parsed
    .map((p, idx) => ({ idx, ...p, extraNcs: 0, extraSem1: 0, extraSem2: 0, extraSem3: 0, extraHours: 0, units: 0 }))
    .filter(p => p.isTotal || p.nameOnly || (p.name && p.hasData && !HEADER_RE.test(despace(p.name))));

  parsed.forEach(p => {
    if (p.name || !p.hasData) return;                      // 이름 없는 데이터 행 = 능력단위 행
    const near = (list) => {
      let best = null, bestDist = Infinity;
      list.forEach(b => { const d = Math.abs(b.top - p.top); if (d < bestDist) { bestDist = d; best = b; } });
      return { best, bestDist };
    };
    // 1순위: 이름-only 교과목(다중 능력단위, 4개 미만 합산된 것), 2순위: 자기 값이 있는 교과목(구형 레이아웃)
    let { best, bestDist } = near(boundaries.filter(b => b.nameOnly && b.units < 4));
    if (!best || bestDist > 40) {
      // 이름이 가운데 능력단위 행에 함께 인쇄된 경우(홀수 개 능력단위: 3개 등) — 위·아래 능력단위 행은 약 15~20pt 떨어져 있다.
      // 교과목당 최대 4개(자기 행 1 + 추가 3) 까지, 세로 30pt 이내에서 가장 가까운 교과목에 합산한다.
      ({ best, bestDist } = near(boundaries.filter(b => !b.isTotal && !b.nameOnly && b.units < 3)));
      if (bestDist > 30) best = null;
    }
    if (!best) return;
    best.units++;
    if (p.cnt.ncsHours !== '') best.extraNcs += p.cnt.ncsHours;
    best.extraSem1 += p.cnt.sem1;
    best.extraSem2 += p.cnt.sem2;
    best.extraSem3 += p.cnt.sem3;
    best.extraHours += isNumStr(p.hoursStr) ? Number(p.hoursStr) : (p.cnt.semTotal || 0);
  });
  // 능력단위 행이 하나도 붙지 않은 이름-only 행(설명문 줄바꿈 등)은 교과목이 아니므로 제외
  for (let i = boundaries.length - 1; i >= 0; i--) if (boundaries[i].nameOnly && !boundaries[i].units) boundaries.splice(i, 1);

  const courses = [];
  const subtotals = [];
  let totalRow = null;
  boundaries.forEach(b => {
    const { name, hoursStr, cnt } = b;
    if (name === '총계') {
      const ncsHours = cnt.ncsHours !== '' ? cnt.ncsHours : (b.extraNcs || '');
      totalRow = { label: '총계', ncsHours, total: cnt.semTotal !== '' ? cnt.semTotal : Number(hoursStr) || 0, sem1: cnt.sem1 || b.extraSem1, sem2: cnt.sem2 || b.extraSem2, sem3: cnt.sem3 || b.extraSem3 };
      return;
    }
    if (name === '소계') {
      state.groupIdx++;
      const label = groupOrder[state.groupIdx] || `구분${state.groupIdx + 1}`;
      const ncsHours = cnt.ncsHours !== '' ? cnt.ncsHours : (b.extraNcs || '');
      subtotals.push({ label, ncsHours, total: cnt.semTotal !== '' ? cnt.semTotal : Number(hoursStr) || 0, sem1: cnt.sem1 || b.extraSem1, sem2: cnt.sem2 || b.extraSem2, sem3: cnt.sem3 || b.extraSem3 });
      return;
    }
    // 실제 교과목 행: 자기 행의 값 + 능력단위 서브행에서 합산된 값을 더한다(단일 능력단위 교과는 extra가 0이라 영향 없음)
    const ncsHours = (cnt.ncsHours !== '' ? cnt.ncsHours : 0) + b.extraNcs;
    const sem1 = cnt.sem1 + b.extraSem1;
    const sem2 = cnt.sem2 + b.extraSem2;
    const sem3 = cnt.sem3 + b.extraSem3;
    const gwan = groupOrder[state.groupIdx] || '';
    let semTotal = cnt.semTotal !== '' ? cnt.semTotal : (isNumStr(hoursStr) ? Number(hoursStr) : 0);
    if (b.nameOnly) semTotal = (sem1 + sem2 + sem3) || b.extraHours;   // 다중 능력단위(이름만 있는 행): 능력단위 합계
    else if (b.units > 0) semTotal = (sem1 + sem2 + sem3) || ((semTotal || 0) + b.extraHours);   // 이름 행 자체에도 능력단위 값이 있는 경우: 자기 행 + 나머지 능력단위 합계
    const finalNcs = ncsHours || '';
    if (sem1 > 0) courses.push({ name, gwan, semester: '1', ncsHours: finalNcs, semTotal, credit: sem1 });
    if (sem2 > 0) courses.push({ name, gwan, semester: '2', ncsHours: finalNcs, semTotal, credit: sem2 });
    if (sem3 > 0) courses.push({ name, gwan, semester: '3', ncsHours: finalNcs, semTotal, credit: sem3 });
    if (sem1 <= 0 && sem2 <= 0 && sem3 <= 0) courses.push({ name, gwan, semester: '', ncsHours: finalNcs, semTotal, credit: semTotal });
  });
  return { courses, subtotals, totalRow };
}

/* v1.9.3 — 교과목구성 표 끝 판정
 * 표 바로 아래(같은 페이지/다음 페이지)의 다른 표·본문(예: 안전교육 내용 "원리/폭발/장비및안전…" 등)이
 * 같은 컬럼 좌표에 걸려 교과목으로 잘못 추가되는 오류 방지.
 * 교과목 편성시간(계) 누적합이 총계(없으면 구분별 소계 합)에 도달하면 표가 끝난 것으로 보고 그 뒤 행은 버린다. */
function vocTableTarget(totalRow, subtotalByLabel, groupOrder) {
  if (totalRow && Number(totalRow.total) > 0) return Number(totalRow.total);
  const subs = groupOrder.map(g => subtotalByLabel[g]).filter(Boolean);
  if (subs.length === groupOrder.length) return subs.reduce((a, x) => a + (Number(x.total) || 0), 0);
  return 0;
}
function vocCourseCutIndex(courses, target) {
  if (!target) return -1;
  let sum = 0; const seen = new Set();
  for (let i = 0; i < courses.length; i++) {
    const c = courses[i];
    const key = c.gwan + '|' + c.name;                // 1·2학기로 나뉜 같은 교과목은 한 번만 합산
    if (!seen.has(key)) { seen.add(key); sum += Number(c.semTotal) || 0; }
    if (sum >= target) {
      let j = i;                                       // 같은 교과목의 다른 학기 행까지 포함
      while (j + 1 < courses.length && courses[j + 1].gwan + '|' + courses[j + 1].name === key) j++;
      return j;
    }
  }
  return -1;
}
function vocTableComplete(courses, totalRow, subs, groupOrder) {
  return vocCourseCutIndex(courses, vocTableTarget(totalRow, subs, groupOrder)) >= 0;
}
function vocTrimAfterTableEnd(courses, totalRow, subs, groupOrder) {
  const idx = vocCourseCutIndex(courses, vocTableTarget(totalRow, subs, groupOrder));
  return idx >= 0 ? courses.slice(0, idx + 1) : courses;
}

/* 전문기술과정 PDF 분석 진입점 — "마.교과목구성" 표를 찾아 여러 페이지에 걸쳐 교과목을 수집 */
async function analyzeVocTech(file, locationText, aiPageRange, courseKey, trackKey) {
  if (!window.pdfjsLib) throw new Error('PDF 라이브러리를 불러오지 못했습니다.');
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf, disableWorker: true }).promise;
  const locKey = despace(locationText) || '교과목구성';
  const core = locKey.replace(/^[가-힣]\.\s*/, '');
  const anchor = core.length >= 3 ? core : locKey;

  let info = {};
  try {
    let infoLines = [];
    for (let p = 1; p <= Math.min(2, pdf.numPages); p++) {
      infoLines = infoLines.concat(pageLines(await roadmapPageItems(await pdf.getPage(p))));
    }
    info = extractDocInfo(infoLines);
  } catch (e) { info = {}; }

  let startPage = -1;
  for (let p = 1; p <= pdf.numPages; p++) {
    const items = await roadmapPageItems(await pdf.getPage(p));
    const joined = despace(items.map(it => it.str).join(''));
    if (joined.includes(locKey) || (core.length >= 3 && joined.includes(core))) { startPage = p; break; }
  }
  if (startPage === -1) throw new Error(`분석할 파일 위치("${locationText}")를 PDF에서 찾지 못했습니다. 표 제목이 정확히 일치하는지 확인해 주세요.`);

  let courses = [];
  const subtotalByLabel = {};
  let totalRow = null;
  const state = { groupIdx: -1 };
  let vocBoundsCache = null;   // 표 헤더가 없는 이어지는 페이지에서도 직전에 감지한 컬럼 경계를 계속 사용
  const maxScan = Math.min(pdf.numPages, startPage + 3);
  for (let p = startPage; p <= maxScan; p++) {
    const page = await pdf.getPage(p);
    const items = await roadmapPageItems(page);
    const detected = detectVocTimeBounds(items);
    if (detected) vocBoundsCache = detected;
    // 하이테크과정: 편성시간이 (계/기초/심화/특화)로 구분된 문서는 (계/1학기/2학기) 기준 검수 로직을 적용할 수 없으므로 검수 불가
    if (courseKey === 'voc-hitech' && p <= startPage + 1 && ((detected && detected.layout === 'alt') || vocHasAltHeader(items))) {
      const err = new Error('이 교육운영계획서의 교과목구성 표는 편성시간이 "계/기초/심화/특화"로 구분되어 있습니다. 하이테크과정 검수는 편성시간 "계/1학기/2학기" 구분 문서만 지원하므로 검수할 수 없습니다.');
      err.vocBlocked = true;
      throw err;
    }
    const found = extractVocTechCourses(items, state, vocGroupOrderFor(courseKey), vocBoundsCache || VOC_BOUNDS);
    if (p > startPage && found.courses.length === 0 && found.subtotals.length === 0 && !found.totalRow) break; // 표가 끝난 것으로 판단
    courses = courses.concat(found.courses);
    found.subtotals.forEach(s => { subtotalByLabel[s.label] = s; });
    if (found.totalRow) totalRow = found.totalRow;
    if (vocTableComplete(courses, totalRow, subtotalByLabel, vocGroupOrderFor(courseKey))) break;   // 표 합계 도달 → 이후 페이지 스캔 중단
  }
  courses = vocTrimAfterTableEnd(courses, totalRow, subtotalByLabel, vocGroupOrderFor(courseKey));
  if (!courses.length) throw new Error('표는 찾았지만 교과목 데이터를 읽어오지 못했습니다. PDF 표 레이아웃을 확인해 주세요.');

  // 하이테크과정 1,200시간 트랙은 "2학기제 운영"을 전제로 세부기준이 설계되어 있어, 실제로 3개 학기(10개월형 등)로
  // 운영되는 교육운영계획서는 이 트랙의 시간기준 검수 로직으로 판정할 수 없다. 총계 행의 3학기 편성시간이 실제로
  // 존재하면(0시간 초과) 검수를 진행하지 않고 명확한 안내 메시지와 함께 즉시 중단한다.
  if (courseKey === 'voc-hitech' && trackKey === '1200' && totalRow && (totalRow.sem3 || 0) > 0) {
    const err = new Error('하이테크과정 1,200시간 트랙은 2학기(1년) 운영 기준입니다. 이 교육운영계획서는 3개 학기(총 ' + (totalRow.sem3) + '시간)로 편성되어 있어 검수 대상이 아닙니다. 3학기제 운영 과정은 별도 트랙/기준이 마련되기 전까지 이 화면에서 검수할 수 없습니다.');
    err.vocBlocked = true;
    throw err;
  }

  // 구분별(교양교과/기초기술/계열공통/특화전공) 소계는 PDF에 이미 인쇄된 값(계/1학기/2학기/NCS적용)을 그대로 사용하고,
  // 만약 해당 구분의 소계 행을 읽어오지 못한 경우에만 안전망(fallback)으로 교과목 합계로 대체한다.
  const groups = vocGroupOrderFor(courseKey).map(label => {
    const sub = subtotalByLabel[label];
    if (sub) return { label, hours: sub.total, ncsHours: sub.ncsHours, sem1: sub.sem1, sem2: sub.sem2, sem3: sub.sem3 || 0 };
    const own = courses.filter(c => c.gwan === label);
    const uniq = {};
    own.forEach(c => { const k = c.name; if (!uniq[k]) uniq[k] = c.semTotal || 0; });
    const hours = Object.values(uniq).reduce((s, v) => s + v, 0);
    const sem1 = own.filter(c => c.semester === '1').reduce((s, c) => s + (c.credit || 0), 0);
    const sem2 = own.filter(c => c.semester === '2').reduce((s, c) => s + (c.credit || 0), 0);
    const sem3 = own.filter(c => c.semester === '3').reduce((s, c) => s + (c.credit || 0), 0);
    return { label, hours, ncsHours: '', sem1, sem2, sem3 };
  });
  const total = totalRow
    ? { hours: totalRow.total, ncsHours: totalRow.ncsHours, sem1: totalRow.sem1, sem2: totalRow.sem2, sem3: totalRow.sem3 || 0 }
    : {
        hours: groups.reduce((s, g) => s + (g.hours || 0), 0),
        ncsHours: groups.reduce((s, g) => s + (isNumStr(String(g.ncsHours)) ? Number(g.ncsHours) : 0), 0),
        sem1: groups.reduce((s, g) => s + (g.sem1 || 0), 0),
        sem2: groups.reduce((s, g) => s + (g.sem2 || 0), 0),
        sem3: groups.reduce((s, g) => s + (g.sem3 || 0), 0),
      };
  const summary = { groups, total: total.hours, totalInfo: total };

  const narrative = {};
  if (aiPageRange) {
    try {
      const fullText = await extractFullText(pdf, aiPageRange);
      narrative.industrialAi = extractIndustrialAiNarrative(fullText);
      narrative.aiPageRange = aiPageRange || null;
      // "나.AI교과" 표 내 "산업AI교과" 행의 1~4학기 셀에 적힌 교과명을 모두 수집(50개 풀 외 학과 자율편성 포함)
      const from = aiPageRange && aiPageRange.from > 0 ? aiPageRange.from : 1;
      const to = aiPageRange && aiPageRange.to > 0 ? Math.min(aiPageRange.to, pdf.numPages) : pdf.numPages;
      let tableCourses = [];
      for (let p = from; p <= to; p++) {
        const page = await pdf.getPage(p);
        const items = await roadmapPageItems(page);
        tableCourses = tableCourses.concat(extractIndustrialAiTableCourses(items));
      }
      const seen = new Set();
      const uniqTableCourses = tableCourses.filter(c => {
        if (seen.has(c.name)) return false;
        seen.add(c.name);
        return true;
      });
      narrative.industrialAiCourses = uniqTableCourses.map(c => c.name);
      narrative.industrialAiCredit = uniqTableCourses.reduce((s, c) => s + (c.credit || 0), 0);
    } catch (e) { console.error('[voc-tech narrative extract error]', e); }
  }

  return { info, courses, startPage, narrative, summary };
}
