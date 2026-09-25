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
const VOC_GROUP_ORDER = ['교양교과', '기초기술', '계열공통', '특화전공'];

function extractVocTechCourses(items) {
  const rows = vocMergeAdjacent(vocClusterRows(items, 2.3), 1.6);
  // 구분(교양교과 등) 레이블 위치 수집 — 세로 병합 셀이라 그룹 첫 줄에 한 번만 나타남.
  // 요청대로 각 라벨이 "첫 줄에 잡히는" 순간의 값만으로 판단하고, 이후 줄바꿈 조각까지
  // 이어붙여 추측하지 않는다(과도한 재구성은 오히려 오탐을 유발할 수 있음).
  const labelPos = [];
  const seen = new Set();
  rows.forEach(r => {
    const t = despace(vocRowText(r, VOC_BOUNDS.GWAN));
    const hit = VOC_GWAN_LABELS.find(l => t.includes(l));
    if (hit && !seen.has(hit)) { labelPos.push({ top: r.top, label: hit }); seen.add(hit); }
  });
  labelPos.sort((a, b) => a.top - b.top);
  function gwanAt(top) {
    if (!labelPos.length) return '';
    let idx = -1;
    for (let i = 0; i < labelPos.length; i++) { if (top >= labelPos[i].top) idx = i; }
    if (idx === -1) return '';                     // 첫 구분 라벨보다 위쪽(표 맨 위 NCS 서술행 등)
    return VOC_GWAN_DISPLAY[labelPos[idx].label] || labelPos[idx].label;
  }

  const courses = [];
  rows.forEach(r => {
    const name = vocRowText(r, VOC_BOUNDS.NAME).trim();
    const hoursStr = vocRowText(r, VOC_BOUNDS.HOURS).trim();
    if (!name || !isNumStr(hoursStr)) return;
    if (name === '소계' || name === '총계') return;
    const ncsStr = vocRowText(r, VOC_BOUNDS.NCS_APPLIED || VOC_BOUNDS.SEM_TOTAL).trim();
    const semTotalStr = vocRowText(r, VOC_BOUNDS.SEM_TOTAL).trim();
    const sem1Str = vocRowText(r, VOC_BOUNDS.SEM1).trim();
    const sem2Str = vocRowText(r, VOC_BOUNDS.SEM2).trim();
    const ncsHours = isNumStr(ncsStr) ? Number(ncsStr) : '';
    const semTotal = isNumStr(semTotalStr) ? Number(semTotalStr) : Number(hoursStr);
    const sem1 = isNumStr(sem1Str) ? Number(sem1Str) : 0;
    const sem2 = isNumStr(sem2Str) ? Number(sem2Str) : 0;
    const gwan = gwanAt(r.top);
    if (sem1 > 0) courses.push({ name, gwan, semester: '1', ncsHours, semTotal, credit: sem1 });
    if (sem2 > 0) courses.push({ name, gwan, semester: '2', ncsHours, semTotal, credit: sem2 });
    if (sem1 <= 0 && sem2 <= 0) courses.push({ name, gwan, semester: '', ncsHours, semTotal, credit: Number(hoursStr) });
  });
  return courses;
}

/* 전문기술과정 PDF 분석 진입점 — "마.교과목구성" 표를 찾아 여러 페이지에 걸쳐 교과목을 수집 */
async function analyzeVocTech(file, locationText, aiPageRange) {
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
  const maxScan = Math.min(pdf.numPages, startPage + 3);
  for (let p = startPage; p <= maxScan; p++) {
    const page = await pdf.getPage(p);
    const items = await roadmapPageItems(page);
    const found = extractVocTechCourses(items);
    if (p > startPage && found.length === 0) break; // 표가 끝난 것으로 판단
    courses = courses.concat(found);
  }
  if (!courses.length) throw new Error('표는 찾았지만 교과목 데이터를 읽어오지 못했습니다. PDF 표 레이아웃을 확인해 주세요.');

  // 구분별(교양교과/기초기술/계열공통/특화전공) 편성시간 합계 + 총계
  const groupSum = {};
  VOC_GROUP_ORDER.forEach(g => { groupSum[g] = 0; });
  let grandTotal = 0;
  courses.forEach(c => {
    const g = VOC_GROUP_ORDER.includes(c.gwan) ? c.gwan : null;
    if (g) groupSum[g] += (c.credit || 0);
    grandTotal += (c.credit || 0);
  });
  const summary = { groups: VOC_GROUP_ORDER.map(g => ({ label: g, hours: groupSum[g] })), total: grandTotal };

  let narrative = null;
  if (aiPageRange) {
    try {
      const fullText = await extractFullText(pdf, aiPageRange);
      narrative = extractIndustrialAiNarrative(fullText);
    } catch (e) { narrative = null; }
  }

  return { info, courses, startPage, narrative, summary };
}
