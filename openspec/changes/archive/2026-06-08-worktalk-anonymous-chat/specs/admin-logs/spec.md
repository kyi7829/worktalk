## ADDED Requirements

### Requirement: 관리자 비밀번호 인증
시스템은 관리자 페이지(`/admin`)를 비밀번호 인증을 통해서만 접근 가능하게 해야 한다(SHALL). 비밀번호는 Vercel 환경변수 `ADMIN_PASSWORD`로 관리되어야 한다(MUST).

#### Scenario: 올바른 비밀번호로 접근
- **WHEN** 관리자가 `/admin` 페이지에서 올바른 비밀번호를 입력한다
- **THEN** 관리자 대시보드가 표시된다

#### Scenario: 잘못된 비밀번호로 접근 거부
- **WHEN** 관리자가 잘못된 비밀번호를 입력한다
- **THEN** 접근이 거부되고 오류 메시지가 표시된다

#### Scenario: 브루트포스 방어
- **WHEN** 동일 IP에서 비밀번호 오류가 5회 연속 발생한다
- **THEN** 해당 IP의 요청이 1분간 차단된다

### Requirement: 채팅 로그 영구 저장
시스템은 메시지가 전송될 때 Redis에 휘발성으로 저장하는 것과 별도로 관리자 로그용 날짜별 Redis List에도 저장해야 한다(SHALL). 로그는 90일간 보관되어야 한다(MUST).

#### Scenario: 메시지 전송 시 로그 동시 저장
- **WHEN** 사용자가 채팅방에 메시지를 전송한다
- **THEN** 메시지 내용, 닉네임, 방 ID, 타임스탬프가 `log:{YYYY-MM-DD}` 키에 추가된다

#### Scenario: 로그 90일 보관
- **WHEN** 로그 데이터가 저장된 지 90일이 경과한다
- **THEN** 해당 날짜의 로그가 자동으로 삭제된다

### Requirement: 날짜별 로그 JSON 다운로드
시스템은 관리자가 날짜를 선택하여 해당 날짜의 채팅 로그를 JSON 파일로 다운로드할 수 있게 해야 한다(SHALL).

#### Scenario: 특정 날짜 로그 다운로드
- **WHEN** 관리자가 날짜를 선택하고 다운로드를 요청한다
- **THEN** 해당 날짜의 모든 채팅 로그가 담긴 JSON 파일이 다운로드된다

#### Scenario: 로그가 없는 날짜 선택
- **WHEN** 관리자가 채팅이 없었던 날짜를 선택한다
- **THEN** 빈 배열 `[]`이 담긴 JSON 파일이 다운로드되거나 "해당 날짜에 로그가 없습니다" 메시지가 표시된다

#### Scenario: JSON 파일 형식
- **WHEN** 로그 파일이 다운로드된다
- **THEN** 파일명은 `worktalk-log-{YYYY-MM-DD}.json`이며, 각 항목은 `{ timestamp, roomId, nickname, message }` 형식이다
