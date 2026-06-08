## 1. 프로젝트 초기 설정

- [x] 1.1 Next.js 프로젝트 생성 (App Router, TypeScript)
- [ ] 1.2 Upstash Redis 계정 생성 및 인스턴스 설정  ← 사용자 직접 수행
- [x] 1.3 필요 패키지 설치 (`@upstash/redis`, `@upstash/ratelimit`)
- [x] 1.4 환경변수 설정 (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`)  ← .env.local.example 파일 생성됨

## 2. 익명 세션 (anonymous-session)

- [x] 2.1 sessionStorage 기반 UUID 생성 유틸리티 구현
- [x] 2.2 익명 닉네임 생성 로직 구현 (`익명` + 두 자리 난수)
- [x] 2.3 페이지 마운트 시 세션 초기화 훅(`useAnonymousSession`) 구현
- [x] 2.4 내 닉네임을 UI에 표시하는 컴포넌트 구현

## 3. 채팅방 관리 (chat-rooms)

- [x] 3.1 공개 채팅방 메인 페이지 (`/`) 라우트 구성
- [x] 3.2 비공개 방 생성 API (`POST /api/rooms`) 구현 — 초대코드, 유지시간, 메시지 TTL 설정
- [x] 3.3 초대코드로 방 조회 API (`GET /api/rooms/[code]`) 구현
- [x] 3.4 비공개 방 입장 페이지 (`/room/[code]`) 구현
- [x] 3.5 방 생성 모달 UI 구현 (유지시간 선택, 초대코드 복사)
- [x] 3.6 만료된 방 접근 시 오류 처리 UI 구현

## 4. 휘발성 메시지 (volatile-messaging)

- [x] 4.1 메시지 전송 API (`POST /api/messages`) 구현 — Redis 저장 (TTL) + 관리자 로그 동시 기록
- [x] 4.2 메시지 목록 조회 API (`GET /api/messages?roomId=`) 구현
- [x] 4.3 3초 폴링 훅(`usePolling`) 구현
- [x] 4.4 메시지 중복 제거 로직 구현 (클라이언트 ID 기반)
- [x] 4.5 메시지 입력창 컴포넌트 구현 (200자 제한, 글자수 표시)
- [x] 4.6 메시지 말풍선 컴포넌트 구현 (닉네임 + 내용)
- [x] 4.7 Upstash Realtime endpoint 및 provider 구성
- [x] 4.8 메시지 전송 시 방 채널에 `chat.message` 이벤트 emit
- [x] 4.9 3초 폴링 훅을 realtime message hook으로 교체
- [ ] 4.10 초기 snapshot + realtime 이벤트 + TTL 만료 제거 흐름 검증

## 5. 스프레드시트 위장 UI

- [x] 5.1 스프레드시트 배경 컴포넌트 구현 (행/열 번호, 셀 그리드)
- [x] 5.2 메시지 말풍선을 스프레드시트 위에 랜덤 위치로 렌더링
- [x] 5.3 상단 툴바를 엑셀 스타일로 구현 (위장용)
- [x] 5.4 하단 입력창 영역 레이아웃 구현 ("휘발성 메시지 · 저장되지 않음" 안내 포함)

## 6. 관리자 패널 (admin-logs)

- [x] 6.1 관리자 페이지 (`/admin`) 라우트 생성
- [x] 6.2 비밀번호 인증 API (`POST /api/admin/auth`) 구현 — Rate limiting 포함
- [x] 6.3 날짜별 로그 조회 API (`GET /api/admin/logs?date=`) 구현
- [x] 6.4 관리자 로그인 UI 구현 (비밀번호 입력)
- [x] 6.5 날짜 선택 및 JSON 다운로드 UI 구현

## 7. 배포

- [x] 7.1 Vercel 프로젝트 연동 및 환경변수 등록
- [x] 7.2 Vercel 배포 및 동작 확인 (공개방, 비공개방, 관리자 패널)
- [ ] 7.3 실제 브라우저에서 폴링, 메시지 소멸, 초대코드 흐름 통합 테스트  ← 사용자 직접 수행
