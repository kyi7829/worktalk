## Why

회사에서 간단하게 익명으로 소통할 수 있는 채팅 도구가 없다. 기존 메신저는 기록이 남고 익명성이 없어 솔직한 소통이 어렵다. Vercel 무료 배포로 운영비 0원을 유지하면서, 메시지가 자동으로 사라지는 휘발성 익명 채팅 서비스를 제공한다.

## What Changes

- URL 접속만으로 즉시 익명 채팅 참여 가능 (회원가입 없음)
- 세션 기반 익명 닉네임 자동 부여 (예: 익명67)
- 메시지는 5~30초 후 자동 소멸 (휘발성)
- 메시지 수신은 3초 폴링 대신 Vercel 호환 realtime event stream 사용
- 공개 채팅방: 누구나 접속 가능
- 비공개 채팅방: 초대코드로 입장, 방 유지시간 설정 가능
- UI는 스프레드시트 위에 말풍선이 떠다니는 형태 (회사에서 일하는 척 가능)
- 관리자 패널: 비밀번호 인증 후 날짜별 채팅 로그 JSON 다운로드
- 관리자 비밀번호는 Vercel 환경변수로 관리 (재배포로 변경)

## Capabilities

### New Capabilities

- `anonymous-session`: 세션 기반 익명 닉네임 자동 부여 및 관리
- `chat-rooms`: 공개/비공개 채팅방 생성 및 입장 (초대코드 포함)
- `volatile-messaging`: 메시지 발송, realtime event stream 수신, TTL 기반 자동 소멸
- `admin-logs`: 관리자 인증 및 날짜별 채팅 로그 JSON 다운로드

### Modified Capabilities

## Impact

- 신규 프로젝트로 기존 코드 없음
- 의존성: Next.js (App Router), Upstash Redis, Vercel
- 배포: Vercel 무료 플랜
- 운영비: 소규모 트래픽 기준 실질적 $0
