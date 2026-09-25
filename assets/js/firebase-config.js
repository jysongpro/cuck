/* =========================================================================
 * Firebase 프로젝트 설정
 * -------------------------------------------------------------------------
 * 아래 값을 Firebase 콘솔(https://console.firebase.google.com)에서
 * "프로젝트 설정 → 일반 → 내 앱 → SDK 설정 및 구성"에서 복사해 그대로 넣으세요.
 *
 * 1) Firebase 콘솔에서 새 프로젝트 생성
 * 2) "Firestore Database" 메뉴 → 데이터베이스 만들기 (프로덕션 모드 권장)
 * 3) "빌드 → Authentication"은 사용하지 않아도 됩니다(공유 문서 방식).
 *    보안이 필요하면 Firestore 보안 규칙에서 접근을 제한하세요.
 * 4) "프로젝트 설정 → 일반" 하단의 "내 앱"에서 웹 앱(</>) 추가 후
 *    표시되는 firebaseConfig 값을 아래에 붙여넣습니다.
 * ========================================================================= */
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyCZI83_8mOYcBJoFvcb6D4MV5DNOBGJjIQ",
    authDomain: "cuck-3907f.firebaseapp.com",
    projectId: "cuck-3907f",
    storageBucket: "cuck-3907f.firebasestorage.app",
    messagingSenderId: "991339973082",
    appId: "1:991339973082:web:aac5db7950efd3498418e3",
    measurementId: "G-QHK8HJPQBG" 
};
/* 여러 학과/캠퍼스가 데이터를 분리해서 쓰고 싶다면 URL에 ?ws=학과코드 를 붙이면
 * 서로 다른 문서에 저장됩니다. 지정하지 않으면 'default' 공유 문서를 사용합니다. */
window.FIREBASE_WORKSPACE =
  new URLSearchParams(location.search).get('ws') || 'default';
