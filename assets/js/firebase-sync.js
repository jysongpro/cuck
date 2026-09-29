/* =========================================================================
 * v2.0.0 Firebase(Firestore) 서버 저장 — 브라우저 저장 없음
 * -------------------------------------------------------------------------
 *  1) 페이지를 열면 서버 문서(curriculumChecker/{workspace})를 먼저 받아온 뒤 화면을 그린다.
 *  2) 설정·검수결과를 저장하면 즉시 서버로 업로드한다(실패 시 안내).
 *  3) 다른 사용자가 변경하면 실시간으로 받아 화면을 갱신한다.
 *  4) 서버에 연결되지 않으면 데이터를 쓰지 않고 연결 오류 화면을 표시한다(브라우저 대체 저장 없음).
 *  5) 이전 버전이 브라우저(localStorage)에 남긴 데이터는 서버에 없는 항목만 1회 이관한 뒤 브라우저에서 삭제한다.
 * ========================================================================= */
(function () {
  const ready = window.ServerStoreReady;
  const cfg = window.FIREBASE_CONFIG || {};
  const notConfigured = !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !cfg.projectId || cfg.projectId === 'YOUR_PROJECT_ID';

  function showFatal(msg) {
    const html = `<div style="max-width:560px;margin:80px auto;padding:28px 30px;border-radius:14px;background:#fff;
      box-shadow:0 8px 30px rgba(15,35,80,.15);font-family:inherit;color:#13233f;line-height:1.7">
      <h2 style="margin:0 0 10px;color:#0b3d91;font-size:20px">서버에 연결할 수 없습니다</h2>
      <p style="margin:0 0 14px">${msg}</p>
      <p style="margin:0 0 18px;font-size:13px;color:#56657f">이 프로그램은 모든 설정과 검수내역을 서버에만 저장합니다.
      네트워크 상태를 확인한 뒤 다시 시도해 주세요.</p>
      <button onclick="location.reload()" style="padding:9px 18px;border:0;border-radius:8px;background:#0b3d91;color:#fff;font-weight:700;cursor:pointer">다시 연결</button>
    </div>`;
    const go = () => { const app = document.getElementById('app') || document.body; app.innerHTML = html; };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    if (ready && ready._reject) ready._reject(new Error(msg));
  }
  function showLoading() {
    const go = () => {
      const app = document.getElementById('app');
      if (app && !app.dataset.loaded) app.innerHTML =
        '<div style="text-align:center;padding:120px 20px;color:#dbe6ff;font-size:15px">서버에서 데이터를 불러오는 중입니다…</div>';
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }

  if (notConfigured) { window.FirebaseSync = { enabled: false }; showFatal('서버(Firebase) 설정값이 없습니다. firebase-config.js를 확인해 주세요.'); return; }
  if (typeof firebase === 'undefined') { window.FirebaseSync = { enabled: false }; showFatal('서버 연결 모듈(Firebase SDK)을 불러오지 못했습니다.'); return; }

  firebase.initializeApp(cfg);
  const db = firebase.firestore();   // 오프라인 캐시(IndexedDB) 미사용 — enablePersistence 호출하지 않음
  const workspace = window.FIREBASE_WORKSPACE || 'default';
  const docRef = db.collection('curriculumChecker').doc(workspace);

  const fieldName = (key) => key.replace(/\./g, '__');
  const unfieldName = (field) => field.replace(/__/g, '.');
  const USER_PREFIX = 'kpu-curri-histfilter-v1::';
  const HISTORY_KEY_ = 'kpu-curri-history-v1';
  const LEGACY_SHARED_DATE_KEY = 'kpu-curri-histdate-v1';
  const appKeys = () => (typeof allStorageKeys === 'function' ? allStorageKeys() : []);
  const isAppKey = (k) => k !== HISTORY_KEY_ && appKeys().includes(k);   // v2.0.2: 사용자별 검색조건 저장 폐지

  /* ---- v2.0.1 검수내역: 1건 = 1문서(서브컬렉션 history) — 문서 1MB 한도와 무관하게 수천 건 저장 가능 ---- */
  const histCol = docRef.collection('history');
  let histMap = new Map();          // id -> JSON string (서버 기준)
  const histDocId = (r) => String(r.id || '').replace(/[\/]/g, '_') || ('h' + Date.now());
  function histSorted() {
    return Array.from(histMap.values()).map(v => JSON.parse(v))
      .sort((a, b) => String(b.savedAt || '').localeCompare(String(a.savedAt || '')) || String(b.id).localeCompare(String(a.id)));
  }
  function refreshHistMem() { AppStorage._applyRemote(HISTORY_KEY_, JSON.stringify(histSorted())); }
  /* 앱이 검수내역 전체 목록을 저장하면 → 이전 목록과 비교해 추가·변경·삭제된 건만 서버에 반영 */
  function pushHistoryDiff(newJson) {
    let list = []; try { list = JSON.parse(newJson) || []; } catch {}
    const next = new Map(list.map(r => [histDocId(r), JSON.stringify(r)]));
    const ops = [];
    next.forEach((v, id) => { if (histMap.get(id) !== v) ops.push(['set', id, v]); });
    histMap.forEach((_, id) => { if (!next.has(id)) ops.push(['del', id]); });
    histMap = next;
    if (!ops.length) return Promise.resolve();
    const chunks = []; for (let i = 0; i < ops.length; i += 400) chunks.push(ops.slice(i, i + 400));   // 배치 한도 500
    inflight = inflight.then(() => chunks.reduce((p, ch) => p.then(() => {
      const b = db.batch();
      ch.forEach(([t, id, v]) => {
        if (t === 'set') { const r = JSON.parse(v); b.set(histCol.doc(id), { data: v, savedAt: r.savedAt || '', courseKey: r.courseKey || '' }); }
        else b.delete(histCol.doc(id));
      });
      return b.commit();
    }), Promise.resolve())).catch(err => {
      console.error('[Server] 검수내역 저장 실패:', err);
      if (typeof toast === 'function') toast('검수내역 서버 저장에 실패했습니다. (' + (err.code || err.message) + ')');
    });
    return inflight;
  }

  /* ---- 업로드: 변경 즉시(짧은 디바운스) 서버 반영 ---- */
  const pending = new Map();   // key -> value|null
  let timer = null, inflight = Promise.resolve(), failNotified = false;
  function flush() {
    clearTimeout(timer); timer = null;
    if (!pending.size) return inflight;
    const patch = { _updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    pending.forEach((v, k) => { patch[fieldName(k)] = v == null ? firebase.firestore.FieldValue.delete() : v; });
    pending.clear();
    inflight = inflight.then(() => docRef.set(patch, { merge: true })).then(() => { failNotified = false; })
      .catch(err => {
        console.error('[Server] 저장 실패:', err);
        if (!failNotified && typeof toast === 'function') toast('서버 저장에 실패했습니다. 네트워크를 확인한 뒤 다시 저장해 주세요.');
        failNotified = true;
      });
    return inflight;
  }
  AppStorage._onChange((type, key, val) => {
    if (key === HISTORY_KEY_) { pushHistoryDiff(type === 'remove' ? '[]' : val); return; }
    if (!isAppKey(key)) return;
    pending.set(key, type === 'remove' ? null : val);
    clearTimeout(timer); timer = setTimeout(flush, 300);
  });
  window.addEventListener('beforeunload', (e) => { if (pending.size) { flush(); e.preventDefault(); e.returnValue = ''; } });

  /* ---- 서버 → 메모리 반영 ---- */
  function applyRemote(data) {
    const seen = new Set();
    Object.keys(data || {}).forEach(f => {
      if (f === '_updatedAt') return;
      const k = unfieldName(f);
      if (!isAppKey(k)) return;
      if (pending.has(k)) return;              // 아직 올리지 않은 내 변경은 유지
      seen.add(k); AppStorage._applyRemote(k, data[f]);
    });
    appKeys().filter(k => k !== HISTORY_KEY_).forEach(k => { if (!seen.has(k) && !pending.has(k)) AppStorage._applyRemote(k, null); });
  }

  /* ---- 이전 버전 브라우저 데이터 1회 이관 후 삭제 ---- */
  function migrateLegacy(data) {
    let ls; try { ls = window.localStorage; } catch { return 0; }
    if (!ls) return 0;
    let moved = 0;
    appKeys().forEach(k => {
      const v = ls.getItem(k);
      if (v == null) return;
      if (k === HISTORY_KEY_) {   // 검수내역은 서버 목록과 병합(서버에 없는 건만 추가)
        let old = []; try { old = JSON.parse(v) || []; } catch {}
        const merged = histSorted(); const have = new Set(merged.map(histDocId)); let add = 0;
        old.forEach(r => { if (!have.has(histDocId(r))) { merged.push(r); add++; } });
        if (add) { pushHistoryDiff(JSON.stringify(merged)); refreshHistMem(); moved++; }
        return;
      }
      if (!data || data[fieldName(k)] == null) { AppStorage.setItem(k, v); moved++; }
    });
    try {
      [ls, window.sessionStorage].forEach(st => {
        if (!st || typeof st.key !== 'function') return;
        const ks = []; for (let i = 0; i < st.length; i++) ks.push(st.key(i));
        ks.filter(k => /^kpu-curri-/.test(k || '')).forEach(k => st.removeItem(k));
      });
    } catch {}
    return moved;
  }

  showLoading();
  let booted = false;
  const bootTimeout = setTimeout(() => { if (!booted) showFatal('서버 응답이 없습니다(15초 초과).'); }, 15000);

  /* 서버 수신: 설정 문서 + 검수내역 서브컬렉션 — 둘 다 받은 뒤 첫 화면 */
  let mainData = null, histReady = false;
  function tryBoot() {
    if (booted || mainData == null || !histReady) return;
    booted = true; clearTimeout(bootTimeout);
    // v2.0.1 구버전(v2.0.0) — 설정 문서 안에 통째로 저장된 검수내역을 서브컬렉션으로 1회 이관
    const legacyField = mainData[fieldName(HISTORY_KEY_)];
    if (legacyField) {
      let old = []; try { old = JSON.parse(legacyField) || []; } catch {}
      const merged = histSorted(); const have = new Set(merged.map(histDocId));
      old.forEach(r => { if (!have.has(histDocId(r))) merged.push(r); });
      pushHistoryDiff(JSON.stringify(merged)); refreshHistMem();
      pending.set(HISTORY_KEY_ + '', null); // 필드 삭제
      if (typeof toast === 'function') toast(`기존 검수내역 ${old.length}건을 서버의 개별 저장 구조로 옮겼습니다.`);
    }
    if (mainData[fieldName(LEGACY_SHARED_DATE_KEY)] != null) pending.set(LEGACY_SHARED_DATE_KEY, null);
    // v2.0.2: v2.0.1에서 저장된 사용자별 검색조건 필드 정리(서버에서 삭제)
    Object.keys(mainData).forEach(f => { const k = unfieldName(f); if (k.indexOf(USER_PREFIX) === 0) pending.set(k, null); });
    const moved = migrateLegacy(mainData);
    const app = document.getElementById('app'); if (app) app.dataset.loaded = '1';
    ready._resolve();
    if (pending.size) flush();
    if (moved && typeof toast === 'function') toast(`이전 브라우저에 남아 있던 데이터 ${moved}개 항목을 서버로 옮겼습니다.`);
  }
  histCol.onSnapshot(
    qs => {
      if (qs.metadata && qs.metadata.hasPendingWrites) return;
      const m = new Map(); qs.forEach(d => { const v = d.data(); if (v && v.data) m.set(d.id, v.data); });
      histMap = m; refreshHistMem();
      if (!histReady) { histReady = true; tryBoot(); return; }
      if (booted && typeof router === 'function') router();
    },
    err => {
      console.error('[Server] 검수내역 구독 실패:', err);
      if (!booted) { clearTimeout(bootTimeout); showFatal('검수내역 서버 접근이 거부되었습니다. Firestore 보안규칙에 history 하위 컬렉션 권한을 추가해 주세요. (' + (err.code || err.message) + ')'); }
    }
  );

  docRef.onSnapshot(
    snap => {
      const data = snap.exists ? snap.data() : {};
      applyRemote(data);
      if (!booted) {
        mainData = data; tryBoot(); return;
      }
      if (snap.metadata.hasPendingWrites) return;   // 내 업로드의 에코
      if (typeof router === 'function') router();
    },
    err => {
      console.error('[Server] 구독 실패:', err);
      if (!booted) { clearTimeout(bootTimeout); showFatal('서버 연결이 거부되었습니다. (' + (err.code || err.message) + ')'); }
      else if (typeof toast === 'function') toast('서버와의 연결이 끊어졌습니다. 새로고침 후 다시 시도해 주세요.');
    }
  );

  window.FirebaseSync = { enabled: true, workspace, flush, pushAll() { appKeys().forEach(k => { const v = AppStorage.getItem(k); if (v == null) return; if (k === HISTORY_KEY_) pushHistoryDiff(v); else pending.set(k, v); }); return flush(); } };
})();
