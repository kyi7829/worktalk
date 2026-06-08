## Context

신규 프로젝트. 기존 코드 없음. 운영비 0원 + Vercel 무료 배포가 최우선 제약 조건이며, 모든 기술 결정은 이 제약을 기준으로 내린다.

## Goals / Non-Goals

**Goals:**
- Vercel 무료 플랜으로 배포 및 운영
- 실질적 운영비 $0 유지 (소규모 트래픽 기준)
- 메시지 휘발성 보장 (TTL 기반 자동 삭제)
- 공개/비공개 채팅방 지원
- 관리자 로그 다운로드 기능

**Non-Goals:**
- 실시간 1:1 DM
- 이미지/파일 첨부
- 사용자 인증/회원가입
- 대규모 동시접속 최적화

## Decisions

### 결정 1: Serverless API (Next.js API Routes)

**선택**: Next.js App Router의 Route Handlers (`/app/api/`)를 백엔드로 사용  
**이유**: 별도 서버 없이 Vercel 무료 플랜에서 동작. Express 등 별도 서버를 띄우면 운영비 발생.  
**대안**: Express + Railway → 월 $5 이상 발생, 탈락.

### 결정 2: Realtime stream vs 3초 폴링

**선택**: Upstash Realtime 기반 event stream  
**이유**: Vercel Functions는 WebSocket server 역할을 지원하지 않는다. Vercel 배포를 유지하면서 3초 폴링의 지연과 요청량을 줄이기 위해 서버리스 호환 realtime stream을 사용한다.  
**대안**: 별도 WebSocket 서버(Railway/Fly.io/Render) → Vercel 단일 배포 구조가 깨지고 운영 비용/운영 대상이 증가해 보류.

### 결정 3: Upstash Redis (휘발성 메시지 + 관리자 로그)

**선택**: Upstash Redis 단일 스토어로 두 가지 목적에 활용  
**이유**: TTL 네이티브 지원으로 휘발성 메시지 구현이 자연스러움. 무료 플랜(10,000 req/day). 로그도 날짜별 Redis List로 저장해 스토어를 통일.  
**대안**: Neon PostgreSQL → TTL 미지원, 별도 만료 처리 필요, 복잡도 증가.  

Redis 키 구조:
```
msg:{roomId}:{msgId}     TTL 5~30초    # 휘발성 메시지
room:{roomId}            TTL 설정값    # 방 메타데이터
log:{YYYY-MM-DD}         TTL 90일      # 관리자 로그 (List)
```

### 결정 4: 세션 기반 익명성

**선택**: 브라우저 `sessionStorage`에 UUID + 닉네임 저장  
**이유**: 서버에 사용자 상태를 저장하지 않아 간단함. 탭을 닫으면 세션 소멸, 재접속 시 새 익명 닉네임 부여.  
**닉네임 형식**: `익명` + 두 자리 난수 (익명03 ~ 익명99)

### 결정 5: 관리자 비밀번호 → Vercel 환경변수

**선택**: `ADMIN_PASSWORD` 환경변수로 관리  
**이유**: 코드 변경 없이 Vercel 대시보드에서 수정 후 재배포로 변경 가능. 별도 관리자 계정 DB 불필요.

## Risks / Trade-offs

**[Realtime 연결 비용]** 동시접속자가 많으면 realtime 연결/이벤트 비용이 증가  
→ Mitigation: 기존 3초 폴링보다 메시지가 없을 때 반복 API 호출이 줄어든다. 초기 snapshot은 1회만 호출하고 이후 이벤트 기반으로 갱신한다.

**[Vercel WebSocket 제한]** Vercel Functions에서 자체 WebSocket server를 운영할 수 없음  
→ Mitigation: WebSocket 구현을 직접 호스팅하지 않고 Upstash Realtime/SSE 호환 경로를 사용한다.

**[관리자 보안]** 단일 비밀번호 방식은 탈취 시 모든 로그 노출  
→ Mitigation: 토이 프로젝트 수준에서 허용. Rate limiting으로 브루트포스 방어.

**[메시지 순서/중복]** 초기 snapshot과 realtime 이벤트가 겹쳐 중복 수신 가능성  
→ Mitigation: 메시지 ID로 클라이언트 측 중복 제거.

## Migration Plan

1. Upstash Redis 계정 생성 및 인스턴스 생성
2. Vercel 프로젝트 생성, 환경변수 설정 (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`)
3. Next.js 프로젝트 초기화 및 개발
4. Vercel에 배포 (자동 CI/CD)

롤백: 이전 Vercel 배포 버전으로 즉시 되돌리기 가능.
