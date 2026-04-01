# emergency-room-frontend

사용자 위치 기반으로 주변 응급실 병상 현황을 지도와 리스트로 확인할 수 있는 프론트엔드 서비스입니다.

실제 백엔드 API와 연결해 현재 위치 기준 주변 병원을 조회하고, 지도와 리스트, 상세 패널이 함께 반응하는 MVP를 목표로 합니다.

## 핵심 기능
- 현재 위치 기반 응급실 조회
- 지도 / 리스트 동시 탐색
- 병원 상세 정보 확인
- 병상 상태 시각화

## 기술 스택
- React
- TypeScript
- Vite
- React Router
- Leaflet / React Leaflet

## 현재 구조
- `pages/home`: 서비스 소개 화면
- `pages/emergency-room`: 지도/리스트 메인 화면
- `components/emergency-room`: 카드, 상세 패널 등 도메인 UI
- `services/emergencyRoomApi.ts`: 백엔드 연동 전 단계의 API 인터페이스
- `services/mockEmergencyRoomData.ts`: 백엔드 응답 형태를 따른 mock 데이터

## 현재 상태
- 병원 목록과 상태 요약을 분리된 응답 타입으로 관리
- 요약 카드에서 상태 미확인 병원 수와 최근 갱신 시각 표시
- 실제 백엔드 API 연동 구조 반영
- API 실패 시 mock 데이터로 fallback 가능하게 구성
- Leaflet 기반 지도 표시
- 현재 위치 기반 조회 및 반경 변경 UI 반영
- 리스트/지도 선택 상태와 상세 패널 연동

## 다음 단계
- 필터와 정렬 UI 추가
- 병원 상세 단건 API 연동

## 환경 변수
- `VITE_API_BASE_URL`: 백엔드 API base URL
- 기본 예시: [`.env.example`](/Users/g/workspace/github-public/emergency-room-frontend/.env.example)
