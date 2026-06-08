# Worktalk

익명으로 짧게 대화할 수 있는 휘발성 채팅 서비스입니다. 회원가입 없이 접속하면 브라우저 세션 기반 익명 닉네임이 부여되고, 메시지는 설정된 TTL 이후 자동으로 사라집니다.

## 운영 URL

- Production: https://front-gilt-seven-63.vercel.app
- Vercel project alias: https://front-cox-s-projects.vercel.app
- Latest deployment URL: https://front-5i20qtjh6-cox-s-projects.vercel.app

## 주요 기능

- 공개 익명 채팅방
- 초대코드 기반 비공개 채팅방
- 방 유지 시간 설정
- 메시지 유지 시간 설정: 5초, 10초, 30초
- Upstash Realtime 기반 메시지 수신
- Redis TTL 기반 메시지 자동 삭제
- 스프레드시트처럼 보이는 위장 UI
- 관리자 비밀번호 인증
- 날짜별 채팅 로그 JSON 다운로드

## 기술 스택

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Upstash Redis
- Upstash Realtime
- Upstash Ratelimit
- Vercel
- OpenSpec

## 프로젝트 구조

```text
worktalk/
  front/      Next.js 애플리케이션
  openspec/   기능 스펙과 archived change
  doc/        참고 이미지
```

## 로컬 실행

```bash
cd front
npm install
cp .env.local.example .env.local
npm run dev
```

필수 환경변수:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
ADMIN_PASSWORD
```

## 검증

```bash
cd front
npm run lint
npm run build
```

OpenSpec 검증:

```bash
openspec validate --all --strict
```

## 배포

현재 Vercel 프로젝트는 `front/` 디렉터리 기준으로 배포됩니다.

```bash
cd front
vercel deploy --prod
```

Vercel Production 환경변수에 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`가 등록되어 있어야 합니다.

