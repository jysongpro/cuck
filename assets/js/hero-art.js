/* =========================================================================
 * hero-art.js  -  시작 페이지 히어로 일러스트 (AI + 교과편성, 미래지향)
 * 외부 이미지 의존 없이 인라인 SVG로 렌더링됩니다.
 * ========================================================================= */
const HERO_ART = `
<svg viewBox="0 0 480 460" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="AI 기반 교과편성 검수 일러스트">
  <defs>
    <linearGradient id="gCard" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.97"/>
      <stop offset="1" stop-color="#dff3fb" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="gCyan" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2dd4bf"/>
      <stop offset="1" stop-color="#00b4d8"/>
    </linearGradient>
    <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b7fd0"/>
      <stop offset="1" stop-color="#173b73"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#04122e" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- 배경 글로우 -->
  <circle cx="240" cy="220" r="200" fill="url(#glow)"/>

  <!-- 신경망(노드 + 연결선) -->
  <g stroke="#5fd6c8" stroke-opacity="0.45" stroke-width="1.4">
    <line x1="60" y1="90" x2="150" y2="150"/>
    <line x1="60" y1="90" x2="120" y2="210"/>
    <line x1="120" y1="210" x2="150" y2="150"/>
    <line x1="120" y1="210" x2="95" y2="320"/>
    <line x1="95" y1="320" x2="180" y2="360"/>
    <line x1="420" y1="110" x2="360" y2="180"/>
    <line x1="420" y1="110" x2="400" y2="230"/>
    <line x1="400" y1="230" x2="360" y2="180"/>
    <line x1="400" y1="230" x2="380" y2="330"/>
    <line x1="380" y1="330" x2="300" y2="370"/>
  </g>
  <g fill="#2dd4bf">
    <circle cx="60" cy="90" r="6"/><circle cx="150" cy="150" r="5"/>
    <circle cx="120" cy="210" r="7"/><circle cx="95" cy="320" r="5"/>
    <circle cx="180" cy="360" r="6"/>
    <circle cx="420" cy="110" r="6"/><circle cx="360" cy="180" r="5"/>
    <circle cx="400" cy="230" r="7"/><circle cx="380" cy="330" r="5"/>
    <circle cx="300" cy="370" r="6"/>
  </g>
  <g fill="#7ef0d8">
    <circle cx="60" cy="90" r="2.4"/><circle cx="120" cy="210" r="2.4"/>
    <circle cx="400" cy="230" r="2.4"/><circle cx="180" cy="360" r="2.4"/>
  </g>

  <!-- 학사모(graduation cap) -->
  <g transform="translate(240 70)">
    <path d="M0 -22 L52 4 L0 30 L-52 4 Z" fill="url(#gBlue)"/>
    <path d="M0 -22 L52 4 L0 30 L-52 4 Z" fill="#ffffff" fill-opacity="0.08"/>
    <path d="M-30 14 L-30 40 Q0 56 30 40 L30 14" fill="#173b73"/>
    <path d="M52 4 L52 34" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round"/>
    <circle cx="52" cy="38" r="5" fill="#2dd4bf"/>
  </g>

  <!-- 커리큘럼 체크리스트 카드 -->
  <g filter="url(#soft)" transform="translate(140 150)">
    <rect x="0" y="0" width="200" height="240" rx="20" fill="url(#gCard)"/>
    <!-- 헤더 바 -->
    <rect x="0" y="0" width="200" height="46" rx="20" fill="url(#gBlue)"/>
    <rect x="0" y="26" width="200" height="20" fill="url(#gBlue)"/>
    <circle cx="26" cy="23" r="9" fill="#ffffff" fill-opacity="0.95"/>
    <path d="M22 23 l3 3 l6 -6" stroke="#1e6fb8" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="44" y="18" width="96" height="10" rx="5" fill="#ffffff" fill-opacity="0.9"/>

    <!-- 체크 항목들 -->
    <g transform="translate(22 72)">
      <g>
        <rect x="0" y="0" width="22" height="22" rx="7" fill="url(#gCyan)"/>
        <path d="M5 11 l4 4 l8 -9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="34" y="3" width="118" height="8" rx="4" fill="#cdd9e8"/>
        <rect x="34" y="15" width="78" height="6" rx="3" fill="#e2e9f2"/>
      </g>
      <g transform="translate(0 44)">
        <rect x="0" y="0" width="22" height="22" rx="7" fill="url(#gCyan)"/>
        <path d="M5 11 l4 4 l8 -9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="34" y="3" width="104" height="8" rx="4" fill="#cdd9e8"/>
        <rect x="34" y="15" width="92" height="6" rx="3" fill="#e2e9f2"/>
      </g>
      <g transform="translate(0 88)">
        <rect x="0" y="0" width="22" height="22" rx="7" fill="url(#gCyan)"/>
        <path d="M5 11 l4 4 l8 -9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="34" y="3" width="118" height="8" rx="4" fill="#cdd9e8"/>
        <rect x="34" y="15" width="64" height="6" rx="3" fill="#e2e9f2"/>
      </g>
      <g transform="translate(0 132)">
        <rect x="0" y="0" width="22" height="22" rx="7" fill="#eef1f6" stroke="#cdd6e4" stroke-width="1.5"/>
        <rect x="34" y="3" width="96" height="8" rx="4" fill="#dde4ee"/>
        <rect x="34" y="15" width="108" height="6" rx="3" fill="#eaeff6"/>
      </g>
    </g>
  </g>

  <!-- AI 칩(돋보기/회로) -->
  <g transform="translate(330 300)">
    <circle cx="0" cy="0" r="40" fill="url(#gCyan)"/>
    <circle cx="0" cy="0" r="40" fill="#ffffff" fill-opacity="0.08"/>
    <text x="0" y="7" font-family="Pretendard, sans-serif" font-size="22" font-weight="800"
          fill="#06303b" text-anchor="middle">AI</text>
    <g stroke="#06303b" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round">
      <line x1="-40" y1="-14" x2="-52" y2="-14"/><line x1="-40" y1="14" x2="-52" y2="14"/>
      <line x1="40" y1="-14" x2="52" y2="-14"/><line x1="40" y1="14" x2="52" y2="14"/>
      <line x1="-14" y1="-40" x2="-14" y2="-52"/><line x1="14" y1="-40" x2="14" y2="-52"/>
      <line x1="-14" y1="40" x2="-14" y2="52"/><line x1="14" y1="40" x2="14" y2="52"/>
    </g>
  </g>

  <!-- 떠다니는 체크 배지 -->
  <g transform="translate(118 132)">
    <circle cx="0" cy="0" r="20" fill="url(#gBlue)"/>
    <path d="M-8 0 l5 5 l10 -11" stroke="#2dd4bf" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
