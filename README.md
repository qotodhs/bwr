# BWR Study

컴퓨터활용능력 2급과 영어를 위한 독립 정적 학습 웹사이트입니다.

- 공개 경로: `https://www.bso.name/bwr/study/`
- 원래 홈페이지와 별도 저장소로 운영
- 기존 `bso.name` 및 `bso.name/study`와 소스·학습 데이터를 공유하지 않음
- 컴활: 플래시카드 24개, 2026 기출 경향 기반 창작 문제 24개, 오답노트
- 문제별 개인 해설과 오답 원인을 기기 브라우저에 저장
- 영어: 초등 수준 낱말, 짧은 문장, 미니 퀴즈
- 학습 진도와 오답은 방문자의 브라우저 `localStorage`에만 저장

## 구조

- `index.html`: `/bwr/`에서 `/bwr/study/`로 이동
- `study/`: 학습 페이지의 HTML, CSS, JavaScript
- `.github/workflows/pages.yml`: GitHub Pages 배포
