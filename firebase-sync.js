/* =========================================================================
 * Firebase(Firestore) 백엔드 연동
 * -------------------------------------------------------------------------
 * 이 파일은 app.js가 사용하는 localStorage 저장소(세부기준·등록교과·검수이력 등)를
 * Firestore의 공유 문서 하나와 실시간으로 동기화한다.
 *   - 이 브라우저에서 저장(localStorage.setItem)이 발생하면 → Firestore로 자동 업로드
 *   - 다른 브라우저/기기에서 Firestore 문서가 바뀌면       → 실시간으로 내려받아 반영 + 화면 갱신
 *
 * firebase-config.js 에 실제 프로젝트 값을 넣지 않은 경우(placeholder 상태)에는
 * 이 스크립트는 아무 동작도 하지 않고, 앱은 기존처럼 브라우저 localStorage만 사용한다.
 * ========================================================================= */
(function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const notConfigured = !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY' || !cfg.projectId || cfg.projectId === 'YOUR_PROJECT_ID';

  if (notConfigured) {
    console.info('[FirebaseSync] firebase-config.js 가 설정되지 않아 로컬 저장소만 사용합니다.');
    window.FirebaseSync = { enabled: false };
    return;
  }
  if (typeof firebase === 'undefined') {
    console.warn('[FirebaseSync] Firebase SDK가 로드되지 않았습니다.');
    window.FirebaseSync = { enabled: false };
    return;
  }

  firebase.initializeApp(cfg);
  const db = firebase.firestore();
  const workspace = window.FIREBASE_WORKSPACE || 'default';
  const docRef = db.collection('curriculumChecker').doc(workspace);

  let applyingRemote = false;      // 원격 -> 로컬 반영 중에는 재업로드(에코) 방지
  let firstSnapshotDone = false;   // 최초 1회 원격 데이터 수신 여부
  const pendingPush = {};          // 키별 디바운스 타이머
  const PUSH_DELAY = 600;          // ms

  function safeParse(v) { try { return JSON.parse(v); } catch { return null; } }

  /* 로컬 setItem을 가로채서 Firestore 필드로 디바운스 업로드 */
  const origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (key, value) {
    origSetItem(key, value);
    if (applyingRemote) return;                       // 원격 반영 중 재전송 방지
    if (typeof allStorageKeys !== 'function') return;
    if (!allStorageKeys().includes(key)) return;
    clearTimeout(pendingPush[key]);
    pendingPush[key] = setTimeout(() => pushKey(key), PUSH_DELAY);
  };

  function pushKey(key) {
    const raw = localStorage.getItem(key);
    docRef.set(
      { [fieldName(key)]: raw == null ? null : raw, _updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    ).catch(err => console.error('[FirebaseSync] 업로드 실패:', key, err));
  }

  /* Firestore 필드명은 '.'을 경로 구분자로 해석하므로 안전하게 치환 */
  function fieldName(key) { return key.replace(/\./g, '__'); }
  function unfieldName(field) { return field.replace(/__/g, '.'); }

  /* 원격 문서를 통째로 localStorage에 반영 후 현재 화면을 다시 그린다 */
  function applyRemoteData(data) {
    if (!data) return;
    applyingRemote = true;
    try {
      Object.keys(data).forEach(field => {
        if (field === '_updatedAt') return;
        const key = unfieldName(field);
        if (typeof allStorageKeys === 'function' && !allStorageKeys().includes(key)) return;
        const val = data[field];
        if (val == null) localStorage.removeItem(key);
        else origSetItem(key, val);
      });
    } finally {
      applyingRemote = false;
    }
    if (typeof router === 'function') router();
  }

  /* 실시간 구독: 다른 사용자의 변경사항을 즉시 받아온다 */
  docRef.onSnapshot(
    snap => {
      if (!snap.exists) {
        firstSnapshotDone = true;
        if (typeof toast === 'function') toast('Firebase 연결됨 (공유 저장소: ' + workspace + ')');
        return;
      }
      applyRemoteData(snap.data());
      if (!firstSnapshotDone) {
        firstSnapshotDone = true;
        if (typeof toast === 'function') toast('Firebase에서 저장된 데이터를 불러왔습니다. (공유 저장소: ' + workspace + ')');
      }
    },
    err => {
      console.error('[FirebaseSync] 구독 실패:', err);
      if (typeof toast === 'function') toast('Firebase 연결에 실패했습니다. 로컬 저장소로 동작합니다.');
    }
  );

  window.FirebaseSync = {
    enabled: true,
    workspace,
    pushAll() { if (typeof allStorageKeys === 'function') allStorageKeys().forEach(pushKey); },
  };

  console.info('[FirebaseSync] 연결 시도 중... (공유 저장소: ' + workspace + ')');
})();
