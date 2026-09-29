/* =========================================================================
 * v2.0.0 서버 전용 저장소(AppStorage)
 * -------------------------------------------------------------------------
 * 브라우저 저장기능(localStorage·sessionStorage)을 사용하지 않는다.
 * 모든 설정·검수내역은 Firestore 서버에만 저장되며, 이 객체는 서버에서 받아온 값을
 * 현재 페이지 메모리에만 들고 있는 "창구" 역할만 한다(새로고침하면 서버에서 다시 받음).
 *   - getItem/setItem/removeItem : localStorage와 동일한 인터페이스
 *   - setItem/removeItem 발생 시 → firebase-sync.js가 서버로 즉시 업로드
 * ========================================================================= */
(function () {
  const mem = new Map();
  const listeners = [];
  window.AppStorage = {
    getItem(k) { return mem.has(k) ? mem.get(k) : null; },
    setItem(k, v) { mem.set(k, String(v)); listeners.forEach(fn => fn('set', k, String(v))); },
    removeItem(k) { mem.delete(k); listeners.forEach(fn => fn('remove', k, null)); },
    keys() { return Array.from(mem.keys()); },
    /* 서버 → 메모리 반영(업로드 이벤트를 발생시키지 않음) */
    _applyRemote(k, v) { if (v == null) mem.delete(k); else mem.set(k, String(v)); },
    _onChange(fn) { listeners.push(fn); },
  };
  /* 서버 데이터 수신 완료 시 resolve — app.js는 이 이후에 첫 화면을 그린다 */
  let _resolve, _reject;
  window.ServerStoreReady = new Promise((res, rej) => { _resolve = res; _reject = rej; });
  window.ServerStoreReady._resolve = _resolve;
  window.ServerStoreReady._reject = _reject;
})();
