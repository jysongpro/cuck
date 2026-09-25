/* =========================================================================
 * 한국폴리텍대학 교과과정 개편 세부기준 검수 프로그램
 * data.js  -  운영과정 정의 및 세부기준 기본값
 *
 * ※ 아래 세부기준 기본값(defaults)은 화면 구성을 위한 예시값입니다.
 *    각 과정 담당 교수가 [세부기준설정] 메뉴에서 실제 편성지침에 맞게
 *    자유롭게 수정·저장할 수 있습니다. (브라우저에 자동 저장)
 * ========================================================================= */

/* 전체 운영과정(7개) 구조 정의 ------------------------------------------- */
const PROGRAM_TREE = {
  degree: {
    key: 'degree',
    title: '학위과정',
    icon: 'cap',
    desc: '학위 취득을 목표로 하는 정규 교육과정',
    courses: [
      { key: 'degree-regular',  name: '학위과정',     short: '학위' },
      { key: 'degree-advanced', name: '학위전공심화과정', short: '학위전공심화' },
    ],
  },
  vocational: {
    key: 'vocational',
    title: '직업교육과정',
    icon: 'tools',
    desc: '현장 직무능력 향상을 목표로 하는 직업교육과정',
    courses: [
      { key: 'voc-tech',     name: '전문기술과정',       short: '전문기술' },
      { key: 'voc-hitech',   name: '하이테크과정',       short: '하이테크' },
      { key: 'voc-senior',   name: '중장년특화장기과정', short: '중장년특화장기' },
      { key: 'voc-trust',    name: '일반계위탁과정',     short: '일반계위탁' },
      { key: 'voc-master',   name: '기능장과정',         short: '기능장' },
    ],
  },
};

/* 세부기준 항목 메타데이터 ----------------------------------------------- */
/* 각 항목: key, 라벨, 단위, 입력유형, 도움말 ------------------------------ */
const STANDARD_FIELDS = [
  { key: 'totalCreditsMin', label: '총 편성학점(최소)',  unit: '학점', type: 'number', group: '학점' },
  { key: 'totalCreditsMax', label: '총 편성학점(최대)',  unit: '학점', type: 'number', group: '학점' },
  { key: 'semesters',       label: '운영 학기 수',           unit: '학기', type: 'number', group: '운영' },
  { key: 'creditsPerSemMin',label: '학기당편성학점(최소)',  unit: '학점', type: 'number', group: '운영' },
  { key: 'creditsPerSemMax',label: '학기당편성학점(최대)',  unit: '학점', type: 'number', group: '운영' },
  { key: 'courseCreditMin', label: '교과목당 학점(최소)',    unit: '학점', type: 'number', group: '교과목' },
  { key: 'courseCreditMax', label: '교과목당 학점(최대)',    unit: '학점', type: 'number', group: '교과목' },
  { key: 'practiceRatioMin',label: '실습편성비율(최소)',  unit: '%',    type: 'number', group: '편성비율' },
  { key: 'requiredRatioMin',label: '필수과목 비율(최소)',    unit: '%',    type: 'number', group: '편성비율' },
  { key: 'fieldTraining',   label: '현장실습 포함 여부',     unit: '',     type: 'bool',   group: '필수요건' },
  { key: 'capstone',        label: '캡스톤(졸업작품) 포함',  unit: '',     type: 'bool',   group: '필수요건' },
];

/* 과정별 세부기준 기본값(예시) ------------------------------------------- */
const DEFAULT_STANDARDS = {
  'degree-regular':  { totalCreditsMin: 80, totalCreditsMax: 90, semesters: 4, creditsPerSemMin: 18, creditsPerSemMax: 24, courseCreditMin: 1, courseCreditMax: 4, practiceRatioMin: 50, requiredRatioMin: 60, fieldTraining: true,  capstone: true },
  'degree-advanced': { totalCreditsMin: 35, totalCreditsMax: 45, semesters: 2, creditsPerSemMin: 15, creditsPerSemMax: 24, courseCreditMin: 1, courseCreditMax: 4, practiceRatioMin: 40, requiredRatioMin: 50, fieldTraining: false, capstone: true },
  'voc-hitech':      { totalCreditsMin: 30, totalCreditsMax: 40, semesters: 1, creditsPerSemMin: 30, creditsPerSemMax: 40, courseCreditMin: 1, courseCreditMax: 6, practiceRatioMin: 60, requiredRatioMin: 70, fieldTraining: true,  capstone: false },
  'voc-tech':        { totalCreditsMin: 20, totalCreditsMax: 30, semesters: 1, creditsPerSemMin: 20, creditsPerSemMax: 30, courseCreditMin: 1, courseCreditMax: 6, practiceRatioMin: 60, requiredRatioMin: 70, fieldTraining: true,  capstone: false },
  'voc-senior':      { totalCreditsMin: 15, totalCreditsMax: 25, semesters: 1, creditsPerSemMin: 15, creditsPerSemMax: 25, courseCreditMin: 1, courseCreditMax: 6, practiceRatioMin: 55, requiredRatioMin: 60, fieldTraining: false, capstone: false },
  'voc-trust':       { totalCreditsMin: 20, totalCreditsMax: 35, semesters: 1, creditsPerSemMin: 20, creditsPerSemMax: 35, courseCreditMin: 1, courseCreditMax: 6, practiceRatioMin: 50, requiredRatioMin: 60, fieldTraining: false, capstone: false },
  'voc-master':      { totalCreditsMin: 25, totalCreditsMax: 40, semesters: 2, creditsPerSemMin: 12, creditsPerSemMax: 24, courseCreditMin: 1, courseCreditMax: 6, practiceRatioMin: 50, requiredRatioMin: 65, fieldTraining: true,  capstone: false },
};

/* =========================================================================
 * 과정별 "상세 세부기준 스펙" (공식 편성기준 문서 반영)
 *  - 해당 과정은 세부기준설정 화면이 2개 카테고리(탭)로 구성됨
 *      ① 세부기준 설정(값)   ② 커리큘럼 체크리스트(규칙 점검)
 *  - 출처: 2027학년도 학위과정 교과과정개편 세부기준 v6(2026.8) / 2026학년도 학위전공심화과정 세부기준
 * ========================================================================= */
const COURSE_SPECS = {
  'degree-regular': {
    sourceLabel: '2년제 학위과정(주간)',
    sourceDoc: '2027학년도 학위과정 교과과정개편 세부기준 v6 (2026.8)',
    checkTitle: '2년제 학위과정 교과과정 검수',
    // ── 카테고리 1: 세부기준 설정(값) ────────────────────────────────
    standardGroups: [
      {
        title: '학점 기준',
        fields: [
          { key: 'gradCredits',   label: '졸업이수학점',          unit: '학점', def: 90,  note: '학생이 졸업을 위해 이수하는 학점' },
          { key: 'totalOfferMax', label: '총 편성학점(상한)',     unit: '학점', def: 116, note: '116학점 이내로 편성' },
          { key: 'semesters',     label: '운영 학기 수',          unit: '학기', def: 4,   note: '2년제 주간 = 4학기' },
          { key: 'semOfferMax',   label: '학기별 편성학점(최대)', unit: '학점', def: 34,  note: '학기당 최대 34학점' },
          { key: 'semTakeMin',    label: '학기별 수강학점(최소)', unit: '학점', def: 15 },
          { key: 'semTakeMax',    label: '학기별 수강학점(최대)', unit: '학점', def: 28 },
        ],
      },
      {
        title: '편성 비율',
        fields: [
          { key: 'ncsMin',         label: 'NCS 적용 비율(참고, 2027 자율)', unit: '%', def: 0, note: '2027학년도부터 학과별 자율 편성(의무비율 폐지, 2026은 20% 이상)' },
          { key: 'practiceRatioMin', label: '실습 비율(최소)',   unit: '%', def: 60, note: '이론:실습 = 4:6(교양 포함)' },
          { key: 'theoryRatioMax', label: '이론교과 비율(최대)', unit: '%', def: 40, note: '교양+전공이론, 학점 기준 40% 이하' },
        ],
      },
      {
        title: '교양 교과',
        fields: [
          { key: 'liberalOfferMin', label: '교양 편성학점(최소)', unit: '학점', def: 12, note: '2027: 12~20학점(2026: 10~17학점)' },
          { key: 'liberalOfferMax', label: '교양 편성학점(최대)', unit: '학점', def: 20 },
          { key: 'liberalReq',      label: '교양필수 학점',       unit: '학점', def: 6, note: '2027: 교양교과역량군 3개 영역에서 각 1개, 총 6학점(2026: 4학점)' },
          { key: 'liberalElecMin',  label: '교양선택(최소)',      unit: '학점', def: 6 },
          { key: 'liberalElecMax',  label: '교양선택(최대)',      unit: '학점', def: 14, note: '2027: 6~14학점(2026: 6~13학점)' },
        ],
      },
      {
        title: '전공 교과',
        fields: [
          { key: 'majorOfferMin',  label: '전공선택교과 편성(최소)', unit: '학점', def: 75, note: '2027: 75~87학점(2026: 77~89학점) · 전공필수 학점은 별도 산정' },
          { key: 'majorOfferMax',  label: '전공선택교과 편성(최대)', unit: '학점', def: 87 },
          { key: 'majorReqMin',    label: '전공필수 편성학점(최소)', unit: '학점', def: 6, note: '2027: 전공교과 내 전공필수 6학점(융합프로젝트실습 학점은 별도 산정, 2026: 14학점)' },
          { key: 'majorReqMax',    label: '전공필수 편성학점(최대)', unit: '학점', def: 6, note: '상한 없이 두려면 0 입력' },
          { key: 'courseCreditMax',label: '교과목당 학점(이내)', unit: '학점', def: 3, note: '2개 교과까지 4학점 가능' },
          { key: 'over3Allow',     label: '4학점 허용 과목수',   unit: '과목', def: 2 },
        ],
      },
      {
        title: '필수 편성 교과(학점)',
        fields: [
          { key: 'convergeCredit', label: '융합프로젝트실습 학점', unit: '학점', def: 8, note: '1·2 합산, 비NCS 필수' },
          { key: 'fieldCredit',    label: '현장실습 학점',         unit: '학점', def: 4, note: '1·2 합산, 선택·Pass/Fail' },
          { key: 'safetyCredit',   label: '산업안전 교과 학점',     unit: '학점', def: 1, note: '2027: 1-2학기 1학점 편성, 법정 연구실안전관리 온라인교육 수강 가능(2026: 2학점)' },
          { key: 'industrialAiCredit', label: '산업AI 교과 학점',  unit: '학점', def: 2, note: '2027: 전공선택 필수 편성, 2~3학점(계열별 Pool 활용 또는 전공+AI 자체 개발)' },
        ],
      },
    ],
    // ── 카테고리 2: 커리큘럼 체크리스트(규칙 점검) ──────────────────
    checklist: [
      { key: 'c_grad',      label: '졸업이수학점 90학점 충족',                   ref: '90학점',         def: true },
      { key: 'c_offerMax',  label: '총 편성학점 116학점 이내',                   ref: '≤ 116학점',      def: true },
      { key: 'c_semOffer',  label: '학기별 편성학점 34학점 이하',                ref: '≤ 34학점/학기',  def: true },
      { key: 'c_semTake',   label: '학기별 수강학점 15~28학점',                  ref: '15~28학점/학기', def: true },
      { key: 'c_ncs',       label: '(2027) NCS 적용 비율 학과별 자율 편성',      ref: '자율',           def: false },
      { key: 'c_ratio',     label: '이론:실습 4:6 (이론교과 40% 이하)',          ref: '실습 ≥ 60%',     def: true },
      { key: 'c_liberalReq',label: '교양필수 6학점 편성(3개 역량군 각 1개 교과)', ref: '6학점',          def: true },
      { key: 'c_liberal',   label: '교양교과 12~20학점 편성',                    ref: '12~20학점',      def: true },
      { key: 'c_major',     label: '전공교과 75~87학점, 과목당 3학점 이내(2과목까지 4)', ref: '75~87학점', def: true },
      { key: 'c_majorReq',  label: '전공교과 내 전공필수 학점 편성(세부기준 최소~최대 참조)', ref: '설정값 참조',  def: true },
      { key: 'c_converge',  label: '융합프로젝트실습1·2 비NCS 필수 편성(총 8학점)', ref: '8학점 필수',  def: true },
      { key: 'c_field',     label: '현장실습1·2 편성(각 2학점, Pass/Fail)',      ref: '4학점',          def: true },
      { key: 'c_ai',        label: 'AI활용 교과 1과목(2학점) 이상 필수 편성(교양선택 디지털AI능력군)', ref: '≥ 2학점', def: true },
      { key: 'c_industrialAi', label: '산업AI 교과 전공선택 필수 편성(2~3학점, Pool 또는 자체개발)', ref: '2~3학점', def: true },
      { key: 'c_safety',    label: '산업안전 교과 1-2학기 1학점 편성(2학년 편성 불가)', ref: '1학점',       def: true },
      { key: 'c_newLiberal',label: '신규 교양필수 교과「직장생활필수노동법」「알기쉬운청년창업」반영', ref: '신규교과', def: false },
      { key: 'c_converge9', label: '융합전공제 9학점 이상 이수(해당 학과)',      ref: '≥ 9학점',        def: false },
      { key: 'c_vision',    label: '참人폴리텍생활과비전 1-1 편성(Pass/Fail)',   ref: '권역대학 자율',  def: false },
      { key: 'c_precollege',label: '프리칼리지 자율 편성(1-1, Pass/Fail)',       ref: '자율',           def: false },
    ],
  },

  'voc-tech': {
    sourceLabel: '전문기술과정(직업교육과정·시간 기반)',
    sourceDoc: '전문기술과정 교과편성 세부기준(PDF)',
    checkTitle: '전문기술과정 교과과정 검수',
    durationTracks: {
      '1200': {
        trackLabel: '1,200시간',
        standardGroups: [
          {
            title: '운영 총시간 기준',
            fields: [
              { key: 'totalHours',     label: '총 운영시간', unit: '시간', def: 1200, note: '1년(2학기) 과정 기준' },
              { key: 'semesters',      label: '운영 학기 수', unit: '학기', def: 2 },
              { key: 'theoryRatio',    label: '이론 비율(기준)', unit: '%', def: 20, note: '이론:실습 = 20:80' },
              { key: 'practiceRatio', label: '실습 비율(기준)', unit: '%', def: 80 },
              { key: 'ratioTolerance', label: '비율 허용오차(±)', unit: '%p', def: 10 },
            ],
          },
          {
            title: '전공교과 기준',
            fields: [
              { key: 'majorRatioMin',  label: '전공교과비율(최소) 이상',     unit: '%',    def: 85,  note: '총 편성시간 대비 전공교과 비율 이상' },
              { key: 'courseHoursMax', label: '과목당 편성시간(이내)',   unit: '시간', def: 120, note: 'NCS 교과 제외' },
              { key: 'splitAllowed',   label: '1개 교과 2학기 분할 편성', unit: '',     def: false, type: 'bool', trueLabel: '허용', falseLabel: '미허용', note: '허용/미허용 선택' },
            ],
          },
          {
            title: '교양·계열공통 교과',
            fields: [
              { key: 'liberalHours',       label: '교양교과편성시간 이상',        unit: '시간', def: 34, note: '직업과사회 17h + 건강과능력개발 17h 필수 포함' },
              { key: 'seriesCommonRatioMin', label: '계열공통교과 비율(최소)', unit: '%', def: 10 },
              { key: 'seriesCommonRatioMax', label: '계열공통교과 비율(최대)', unit: '%', def: 20 },
            ],
          },
          {
            title: '프로젝트·종합실습',
            fields: [
              { key: 'projectRatioMin', label: '프로젝트실습 비율(최소)', unit: '%',    def: 5,  note: '2학기 비NCS 필수' },
              { key: 'projectRatioMax', label: '프로젝트실습 비율(최대)', unit: '%',    def: 10 },
              { key: 'capstoneHours',   label: '종합실습편성시간 이상',       unit: '시간', def: 40, note: '2학기 마지막 교과로 필수 편성' },
            ],
          },
          {
            title: '필수 편성 교과(시간)',
            fields: [
              { key: 'safetyHours',        label: '산업안전교과 편성시간 이상', unit: '시간', def: 16, note: '온라인 6시간 포함, 2학기 편성만 허용(1학기 편성 불가)' },
              { key: 'aiAppliedHours',     label: 'AI활용교과 편성시간 이상',   unit: '시간', def: 20, note: '지정 9개 교과 중 1개 이상' },
              { key: 'industrialAiHoursMin', label: '산업AI 교과 편성시간(최소)', unit: '시간', def: 20 },
              { key: 'industrialAiHoursMax', label: '산업AI 교과 편성시간(최대)', unit: '시간', def: 40 },
            ],
          },
        ],
        checklist: [
          { key: 'c_totalHours', label: '총 운영시간 1,200시간 충족', ref: '1,200h', def: true },
          { key: 'c_ratio',      label: '이론:실습 = 20:80(±10%p) 충족',                    ref: '실습 70~90%',      def: true },
          { key: 'c_major',      label: '전공교과 85% 이상 편성',                          ref: '≥ 85%',           def: true },
          { key: 'c_courseMax',  label: '과목당 120시간 이내 편성(NCS 제외)',              ref: '≤ 120h',          def: true },
          { key: 'c_split',      label: '1개 교과 2개 학기 분할 편성 금지',                 ref: '분할 불가',        def: true },
          { key: 'c_liberal',    label: '교양교과 34시간(직업과사회17h+건강과능력개발17h) 편성', ref: '34h',           def: true },
          { key: 'c_seriesCommon', label: '계열공통교과 10~20% 편성',                      ref: '10~20%',          def: true },
          { key: 'c_project',    label: '프로젝트실습 5~10% 비중, 2학기 비NCS 필수 편성',   ref: '5~10%',           def: true },
          { key: 'c_capstone',   label: '종합실습 2학기 마지막 40시간 편성',               ref: '40h',             def: true },
          { key: 'c_safety',     label: '산업안전교과 16시간(온라인6h포함) 2학기 편성',    ref: '16h/2학기',       def: true },
          { key: 'c_aiApplied',  label: 'AI활용교과 20시간 이상 편성(9개 교과 중 1개)',    ref: '≥ 20h',           def: true },
          { key: 'c_industrialAi', label: '산업AI교과 20~40시간 편성',                     ref: '20~40h',          def: true },
        ],
      },
      '600': {
        trackLabel: '600시간',
        standardGroups: [
          {
            title: '운영 총시간 기준',
            fields: [
              { key: 'totalHours',     label: '총 운영시간', unit: '시간', def: 600, note: '6개월(단기) 과정 기준' },
              { key: 'semesters',      label: '운영 학기 수', unit: '학기', def: 1 },
              { key: 'theoryRatio',    label: '이론 비율(기준)', unit: '%', def: 20, note: '이론:실습 = 20:80' },
              { key: 'practiceRatio', label: '실습 비율(기준)', unit: '%', def: 80 },
              { key: 'ratioTolerance', label: '비율 허용오차(±)', unit: '%p', def: 10 },
            ],
          },
          {
            title: '전공교과 기준',
            fields: [
              { key: 'majorRatioMin',  label: '전공교과비율(최소) 이상',     unit: '%',    def: 85,  note: '총 편성시간 대비 전공교과 비율 이상' },
              { key: 'courseHoursMax', label: '과목당 편성시간(이내)',   unit: '시간', def: 120, note: 'NCS 교과 제외' },
              { key: 'splitAllowed',   label: '1개 교과 2학기 분할 편성', unit: '',     def: false, type: 'bool', trueLabel: '허용', falseLabel: '미허용', note: '허용/미허용 선택' },
            ],
          },
          {
            title: '교양·계열공통 교과',
            fields: [
              { key: 'liberalHours',       label: '교양교과편성시간 이상',        unit: '시간', def: 34, note: '직업과사회 17h + 건강과능력개발 17h 필수 포함' },
              { key: 'seriesCommonRatioMin', label: '계열공통교과 비율(최소)', unit: '%', def: 10 },
              { key: 'seriesCommonRatioMax', label: '계열공통교과 비율(최대)', unit: '%', def: 20 },
            ],
          },
          {
            title: '프로젝트·종합실습',
            fields: [
              { key: 'projectRatioMin', label: '프로젝트실습 비율(최소)', unit: '%',    def: 5,  note: '비NCS 필수' },
              { key: 'projectRatioMax', label: '프로젝트실습 비율(최대)', unit: '%',    def: 10 },
              { key: 'capstoneHours',   label: '종합실습편성시간 이상',       unit: '시간', def: 40, note: '마지막 교과로 필수 편성' },
            ],
          },
          {
            title: '필수 편성 교과(시간)',
            fields: [
              { key: 'safetyHours',        label: '산업안전교과 편성시간 이상', unit: '시간', def: 16, note: '온라인 6시간 포함' },
              { key: 'aiAppliedHours',     label: 'AI활용교과 편성시간 이상',   unit: '시간', def: 20, note: '지정 9개 교과 중 1개 이상' },
              { key: 'industrialAiHoursMin', label: '산업AI 교과 편성시간(최소)', unit: '시간', def: 20 },
              { key: 'industrialAiHoursMax', label: '산업AI 교과 편성시간(최대)', unit: '시간', def: 40 },
            ],
          },
        ],
        checklist: [
          { key: 'c_totalHours', label: '총 운영시간 600시간 충족', ref: '600h', def: true },
          { key: 'c_ratio',      label: '이론:실습 = 20:80(±10%p) 충족',                    ref: '실습 70~90%',      def: true },
          { key: 'c_major',      label: '전공교과 85% 이상 편성',                          ref: '≥ 85%',           def: true },
          { key: 'c_courseMax',  label: '과목당 120시간 이내 편성(NCS 제외)',              ref: '≤ 120h',          def: true },
          { key: 'c_split',      label: '1개 교과 2개 학기 분할 편성 금지',                 ref: '분할 불가',        def: true },
          { key: 'c_liberal',    label: '교양교과 34시간(직업과사회17h+건강과능력개발17h) 편성', ref: '34h',           def: true },
          { key: 'c_seriesCommon', label: '계열공통교과 10~20% 편성',                      ref: '10~20%',          def: true },
          { key: 'c_project',    label: '프로젝트실습 5~10% 비중 필수 편성',   ref: '5~10%',           def: true },
          { key: 'c_capstone',   label: '종합실습 마지막 40시간 편성',               ref: '40h',             def: true },
          { key: 'c_safety',     label: '산업안전교과 16시간(온라인6h포함) 편성',    ref: '16h',       def: true },
          { key: 'c_aiApplied',  label: 'AI활용교과 20시간 이상 편성(9개 교과 중 1개)',    ref: '≥ 20h',           def: true },
          { key: 'c_industrialAi', label: '산업AI교과 20~40시간 편성',                     ref: '20~40h',          def: true },
        ],
      },
    },
  },

  'degree-advanced': {
    sourceLabel: '학위전공심화과정(4학년)',
    sourceDoc: '2027학년도 학위전공심화과정 교과과정개편 세부기준 v6 (2026.8)',
    checkTitle: '학위전공심화과정 교과과정 검수',
    standardGroups: [
      {
        title: '학점 기준',
        fields: [
          { key: 'gradCredits',   label: '졸업이수학점',          unit: '학점', def: 140, note: '전적(대학)학점 포함' },
          { key: 'totalOfferMin', label: '총 편성학점(최소)',     unit: '학점', def: 66 },
          { key: 'totalOfferMax', label: '총 편성학점(상한)',     unit: '학점', def: 74,  note: '74학점 이내' },
          { key: 'semesters',     label: '운영 학기 수',          unit: '학기', def: 2,   note: '4학년(1·2학기)' },
          { key: 'semTakeMin',    label: '학기별 수강학점(최소)', unit: '학점', def: 10 },
          { key: 'semTakeMax',    label: '학기별 수강학점(최대)', unit: '학점', def: 18 },
          { key: 'semOfferMax',   label: '학기별 편성학점(상한)', unit: '학점', def: 40,  note: '편성 점검용 참고값' },
        ],
      },
      {
        title: '졸업 기준',
        fields: [
          { key: 'liberalGradMin', label: '교양 졸업이수(최소)', unit: '학점', def: 6, note: '교양 8학점 편성 중 6학점 이상 이수' },
          { key: 'majorGradMin',   label: '전공 졸업이수(최소)', unit: '학점', def: 54 },
        ],
      },
      {
        title: '편성 비율',
        fields: [
          { key: 'ncsCreditMin',     label: 'NCS 적용 학점(참고, 2027 자율)', unit: '학점', def: 0, note: '2027학년도부터 자율 편성(2026: 16학점/256시간 이상)' },
          { key: 'practiceRatioMin', label: '실습 비율(최소)',     unit: '%',    def: 60, note: '이론:실습 = 4:6' },
        ],
      },
      {
        title: '교양 교과',
        fields: [
          { key: 'liberalOfferMin', label: '교양 편성학점(최소)', unit: '학점', def: 8 },
          { key: 'liberalOfferMax', label: '교양 편성학점(최대)', unit: '학점', def: 8, note: '교양 Pool에서 8학점 선정' },
          { key: 'liberalReq',      label: '교양필수 학점',       unit: '학점', def: 2, note: '실무영어 필수 편성' },
        ],
      },
      {
        title: '전공 교과',
        fields: [
          { key: 'majorOfferMin',  label: '전공교과 편성(최소)', unit: '학점', def: 44 },
          { key: 'majorOfferMax',  label: '전공교과 편성(최대)', unit: '학점', def: 56 },
          { key: 'majorReqMin',    label: '전공필수 편성학점', unit: '학점', def: 8, note: '전공프로젝트실습 포함' },
          { key: 'courseCreditMax',label: '교과목당 학점(이내)', unit: '학점', def: 3, note: '2과목까지 4학점 가능' },
          { key: 'over3Allow',     label: '4학점 허용 과목수',   unit: '과목', def: 2 },
        ],
      },
      {
        title: '필수 편성 교과(학점)',
        fields: [
          { key: 'projectCredit', label: '전공프로젝트실습 학점', unit: '학점', def: 8, note: '1·2 각 4학점, 4-1·4-2 필수' },
          { key: 'fieldCredit',   label: '현장종합실습 학점',     unit: '학점', def: 6, note: '3학점씩 총 6, 비NCS 선택·5주 이상' },
          { key: 'safetyCredit',   label: '산업안전 교과 학점',     unit: '학점', def: 1, note: '3학년 2학기 1학점 편성, 4학년 편성 불가' },
          { key: 'industrialAiCredit', label: '산업AI 교과 학점', unit: '학점', def: 2, note: '전공선택 필수 편성, 2~3학점(계열별 Pool 활용 또는 전공+AI 자체 개발)' },
        ],
      },
    ],
    checklist: [
      { key: 'c_grad',       label: '졸업이수학점 140학점(전적 포함)',                  ref: '140학점',       def: true },
      { key: 'c_offerMax',   label: '총 편성학점 74학점 이내',                          ref: '≤ 74학점',      def: true },
      { key: 'c_libGrad',    label: '교양 졸업 6학점 이상 이수',                        ref: '≥ 6학점',       def: true },
      { key: 'c_majGrad',    label: '전공 졸업 54학점 이상 이수',                       ref: '≥ 54학점',      def: true },
      { key: 'c_semTake',    label: '학기별 수강학점 10~18학점',                        ref: '10~18학점',     def: true },
      { key: 'c_ncs',        label: '(2027) NCS 적용 자율 편성',                        ref: '자율',          def: false },
      { key: 'c_ratio',      label: '이론:실습 4:6 (실습 60% 이상)',                    ref: '실습 ≥ 60%',    def: true },
      { key: 'c_liberal',    label: '교양 8학점 편성(실무영어 2학점 필수)',              ref: '8학점/필수2',   def: true },
      { key: 'c_major',      label: '전공교과 44~56학점, 과목당 3학점 이내(2과목까지 4)', ref: '44~56학점',    def: true },
      { key: 'c_project',    label: '전공프로젝트실습1·2 필수 편성(총 8학점, 4-1·4-2)',  ref: '8학점 필수',    def: true },
      { key: 'c_field',      label: '현장종합실습1·2 편성(각 3학점, 총 6·5주 이상)',      ref: '6학점',        def: true },
      { key: 'c_precollege', label: '프리칼리지 교과 편성 불가',                        ref: '편성 불가',     def: true },
      { key: 'c_ai',         label: 'AI활용 교과 1과목 이상 편성(교양선택 디지털AI능력군)', ref: '≥ 1과목',    def: true },
      { key: 'c_industrialAi', label: '산업AI 교과 전공선택 필수 편성(2~3학점, Pool 또는 자체개발)', ref: '2~3학점', def: true },
      { key: 'c_safety',     label: '산업안전 교과 3학년 2학기 1학점 편성(4학년 편성 불가)', ref: '1학점',    def: true },
    ],
  },
};

/* =========================================================================
 * 과정별 "교과목 편성기준"(특정 교과목 편성 여부 점검) 기본값
 *  - 검수 시 커리큘럼에 해당 키워드의 교과목이 편성됐는지 확인
 *  - 사용자가 [교과목 편성기준 설정]에서 자유롭게 추가·수정·저장
 * ========================================================================= */
const DEFAULT_COURSE_RULES = {
  'degree-regular': [
    { label: 'AI활용 교과 편성(교양선택·디지털AI능력군)', keyword: 'AI활용', gubun: '교양선택', presence: 'Y', creditMin: 2, creditMax: 0, on: true },
    { label: '산업AI 교과 편성(전공선택 필수)', keyword: '산업AI', gubun: '전공선택', presence: 'Y', creditMin: 2, creditMax: 3, on: true },
    { label: 'AI와윤리 교과 편성',    keyword: 'AI와윤리',      gubun: '',         presence: 'Y', creditMin: 0, creditMax: 0, on: false },
    { label: '산업안전 교과 편성(1학점, 1-2학기)', keyword: '산업안전', gubun: '전공선택', presence: 'Y', creditMin: 1, creditMax: 0, on: true },
    { label: '융합프로젝트실습 편성', keyword: '융합프로젝트실습', gubun: '전공필수', presence: 'Y', creditMin: 8, creditMax: 8, on: true },
    { label: '직장생활필수노동법 편성(신규)', keyword: '직장생활필수노동법', gubun: '교양필수', presence: 'Y', creditMin: 0, creditMax: 0, on: false },
    { label: '알기쉬운청년창업 편성(신규)',   keyword: '알기쉬운청년창업', gubun: '교양필수', presence: 'Y', creditMin: 0, creditMax: 0, on: false },
    { label: '캡스톤디자인 편성',     keyword: '캡스톤',        gubun: '전공필수', presence: 'Y', creditMin: 0, creditMax: 0, on: false },
  ],
  'degree-advanced': [
    { label: '실무영어 교양필수 편성',  keyword: '실무영어',        gubun: '교양필수', presence: 'Y', creditMin: 2, creditMax: 2, on: true },
    { label: '전공프로젝트실습 편성',   keyword: '전공프로젝트실습', gubun: '전공필수', presence: 'Y', creditMin: 8, creditMax: 8, on: true },
    { label: '현장종합실습 편성',       keyword: '현장종합실습',     gubun: '전공선택', presence: 'Y', creditMin: 6, creditMax: 6, on: true },
    { label: 'AI활용 교과 편성(교양선택·디지털AI능력군)', keyword: 'AI활용', gubun: '교양선택', presence: 'Y', creditMin: 0, creditMax: 0, on: true },
    { label: '산업AI 교과 편성(전공선택 필수)', keyword: '산업AI', gubun: '전공선택', presence: 'Y', creditMin: 2, creditMax: 3, on: true },
    { label: '산업안전 교과 편성(1학점, 3학년 2학기)', keyword: '산업안전', gubun: '전공선택', presence: 'Y', creditMin: 1, creditMax: 0, on: true },
    { label: '프리칼리지 편성 불가',    keyword: '프리칼리지',       gubun: '',         presence: 'N', creditMin: 0, creditMax: 0, on: true },
  ],
};

/* 커리큘럼 체크 입력 컬럼 정의 ------------------------------------------- */
const CURRICULUM_COLUMNS = [
  { key: 'name',      label: '교과목명',      type: 'text',   width: '2fr' },
  { key: 'gwan',      label: '교양/전공',     type: 'select', width: '0.85fr', options: ['전공', '교양'] },
  { key: 'semester',  label: '학기',          type: 'number', width: '0.7fr' },
  { key: 'category',  label: '구분',          type: 'select', width: '0.9fr', options: ['필수', '선택'] },
  { key: 'credit',    label: '학점',          type: 'number', width: '0.7fr' },
  { key: 'theory',    label: '이론시수',      type: 'number', width: '0.9fr' },
  { key: 'practice',  label: '실습시수',      type: 'number', width: '0.9fr' },
];

/* 데모용 샘플 커리큘럼(체크 화면 미리보기) ------------------------------- */
const SAMPLE_CURRICULUM = [
  { name: '공학수학',         gwan: '전공', semester: 1, category: '필수', credit: 3, theory: 3, practice: 0 },
  { name: '프로그래밍 기초',  gwan: '전공', semester: 1, category: '필수', credit: 3, theory: 1, practice: 4 },
  { name: '회로이론 실습',    gwan: '전공', semester: 1, category: '필수', credit: 3, theory: 1, practice: 4 },
  { name: '디지털논리회로',   gwan: '전공', semester: 1, category: '선택', credit: 3, theory: 2, practice: 2 },
  { name: '데이터구조',       gwan: '전공', semester: 2, category: '필수', credit: 3, theory: 2, practice: 2 },
  { name: '센서공학 실습',    gwan: '전공', semester: 2, category: '필수', credit: 3, theory: 1, practice: 4 },
  { name: '임베디드시스템',   gwan: '전공', semester: 2, category: '필수', credit: 3, theory: 1, practice: 4 },
  { name: '산업안전',         gwan: '교양', semester: 2, category: '선택', credit: 2, theory: 2, practice: 0 },
  { name: 'IoT 프로젝트',     gwan: '전공', semester: 3, category: '필수', credit: 4, theory: 1, practice: 6 },
  { name: 'AI 응용 실습',     gwan: '전공', semester: 3, category: '필수', credit: 4, theory: 1, practice: 6 },
  { name: '현장실습',         gwan: '전공', semester: 4, category: '필수', credit: 6, theory: 0, practice: 12 },
  { name: '캡스톤디자인',     gwan: '전공', semester: 4, category: '필수', credit: 6, theory: 1, practice: 10 },
];

/* 메타 정보 -------------------------------------------------------------- */
const APP_META = {
  name: '한국폴리텍대학 교과과정개편 세부기준 검수 지원 도구',
  version: '1.7.4',
  developer: '학교법인 한국폴리텍대학 AI혁신부',
};


/* 캠퍼스명 → 대학(권역) 매핑표 — 2027 폴리텍대학 학과리스트 기준.
 * 검수내역에서 캠퍼스명을 입력/저장하면 이 표를 참조해 대학 값을 자동으로 채운다. */
const CAMPUS_UNIV_MAP = {
  "서울정수": "Ⅰ",
  "서울강서": "Ⅰ",
  "성남": "Ⅰ",
  "제주": "Ⅰ",
  "분당융합기술교육원": "Ⅰ",
  "인천": "Ⅱ",
  "남인천": "Ⅱ",
  "화성": "Ⅱ",
  "광명융합기술교육원": "Ⅱ",
  "춘천": "Ⅲ",
  "원주": "Ⅲ",
  "강릉": "Ⅲ",
  "대전": "Ⅳ",
  "청주": "Ⅳ",
  "아산": "Ⅳ",
  "충남": "Ⅳ",
  "충주": "Ⅳ",
  "광주": "Ⅴ",
  "전북": "Ⅴ",
  "전남": "Ⅴ",
  "전력기술교육원": "Ⅴ",
  "익산": "Ⅴ",
  "순천": "Ⅴ",
  "대구": "Ⅵ",
  "구미": "Ⅵ",
  "남대구": "Ⅵ",
  "포항": "Ⅵ",
  "영주": "Ⅵ",
  "영남융합기술": "Ⅵ",
  "창원": "Ⅶ",
  "부산": "Ⅶ",
  "울산": "Ⅶ",
  "동부산": "Ⅶ",
  "진주": "Ⅶ",
  "석유화학공정기술교육원": "Ⅶ",
  "바이오": "특성화",
  "항공": "특성화",
  "반도체융합": "특성화",
  "로봇": "특성화",
  "신기술교육원": "법인부설"
};
function lookupUnivByCampus(campus) {
  const key = String(campus || '').replace(/\s+/g, '').trim();
  if (!key) return '';
  if (CAMPUS_UNIV_MAP[key]) return CAMPUS_UNIV_MAP[key];
  // 정확히 일치하지 않으면 부분 포함 매칭도 시도(예: '서울정수캠퍼스' 등 접미사가 붙은 경우)
  const found = Object.keys(CAMPUS_UNIV_MAP).find(k => key.includes(k) || k.includes(key));
  return found ? CAMPUS_UNIV_MAP[found] : '';
}
