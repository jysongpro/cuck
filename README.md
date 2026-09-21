# CurriculumChecker

교육과정 세부기준 검수 웹앱 (정적 HTML/JS, 별도 서버·빌드 불필요)

## GitHub Pages로 배포하기

이 저장소에는 `.github/workflows/deploy.yml` GitHub Actions 워크플로우가 포함되어 있어
`main` 브랜치에 push할 때마다 **자동으로 GitHub Pages에 배포**됩니다. 아래 두 가지 방법 중 편한 쪽을 사용하세요.

### 방법 A. GitHub Actions 자동 배포 (권장, 이미 설정됨)

1. GitHub에 새 저장소를 만들고, 이 폴더(`CurriculumChecker`) 안의 파일 전체(`.github` 폴더 포함)를 저장소 루트에 그대로 올립니다.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<사용자명>/<저장소명>.git
   git push -u origin main
   ```
2. GitHub 저장소 페이지에서 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Source**를 `GitHub Actions`로 설정합니다.
4. `main`에 push하면 `.github/workflows/deploy.yml`이 자동 실행되어 배포됩니다. 저장소의 **Actions** 탭에서 진행 상황을 확인할 수 있습니다.
5. 배포가 끝나면 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속하면 앱이 열립니다.

### 방법 B. 브랜치에서 바로 배포 (Actions 없이)

1. 방법 A의 1번과 동일하게 파일을 올립니다(`.github` 폴더는 없어도 무방).
2. **Settings → Pages → Source**를 `Deploy from a branch`로 설정합니다.
3. **Branch**를 `main`, 폴더는 `/ (root)`로 선택 후 **Save**를 누릅니다.
   - 저장소 안에서 이 앱을 하위 폴더(예: `/docs`)에 두었다면 폴더 선택을 `/docs`로 지정하세요.
4. 몇 분 후 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속하면 앱이 정상적으로 열립니다.

### 참고
- 이 프로젝트는 순수 정적 파일(HTML/CSS/JS)로만 구성되어 있어 별도의 빌드 과정이나 Node.js 서버가 필요 없습니다.
- 모든 리소스 경로가 상대경로(`assets/...`)로 되어 있어 저장소 루트든 하위 경로(`/저장소명/`)든 그대로 정상 동작합니다.
- `.nojekyll` 파일은 GitHub Pages가 Jekyll 처리(파일 필터링)를 하지 않도록 막아, `assets` 폴더 등이 정상적으로 배포되게 해줍니다. 반드시 함께 올려주세요.
- 사용자가 입력한 검수기준·등록교과·검수이력 데이터는 서버가 아니라 **접속한 브라우저의 localStorage**에 저장됩니다. 즉 배포된 사이트라도 접속 브라우저(기기)마다 저장된 데이터가 다를 수 있습니다. 여러 사람이 함께 쓰는 경우 이 점을 참고해 주세요.
- 커스텀 도메인을 연결하려면 GitHub Pages 설정 화면에서 `Custom domain`에 도메인을 입력하면 됩니다.
