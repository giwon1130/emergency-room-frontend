# emergency-room-frontend

사용자 위치 기반으로 주변 응급실 병상 현황을 지도와 리스트로 확인할 수 있는 프론트엔드 서비스입니다.

실제 백엔드 API와 연결해 현재 위치 기준 주변 병원을 조회하고, 지도와 리스트, 상세 패널이 함께 반응하는 MVP를 목표로 합니다.

## 핵심 기능
- 현재 위치 기반 응급실 조회
- 지도 / 리스트 동시 탐색
- 검색, 상태 필터, 정렬 기반 탐색
- 병원 상세 정보 확인
- 병상 상태 시각화
- 거리 기반 탐색과 병원 액션 버튼 제공

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
- `services/emergencyRoomApi.ts`: 요약/주변 병원/병원 상세 API 인터페이스
- `services/mockEmergencyRoomData.ts`: 백엔드 응답 형태를 따른 mock 데이터

## 현재 상태
- 병원 목록과 상태 요약을 분리된 응답 타입으로 관리
- 요약 카드에서 상태 미확인 병원 수와 최근 갱신 시각 표시
- 실제 백엔드 API 연동 구조 반영
- API 실패 시 mock 데이터로 fallback 가능하게 구성
- Leaflet 기반 지도 표시
- 현재 위치 기반 조회 및 반경 변경 UI 반영
- 리스트/지도 선택 상태와 상세 패널 연동
- 병원명, 주소, 지역 기준 검색 지원
- 상태 필터(`전체 / 가용 / 혼잡 / 미확인`) 지원
- 거리순/가용 병상 순/이름 순 정렬 지원
- 단건 detail API 연동으로 연락처, 최근 갱신, 좌표/연락처 보유 여부 표시
- 현재 위치 기준 거리 계산 및 리스트/상세 패널 노출
- `응급실 전화`, `외부 지도 열기` 액션 버튼 제공

## 다음 단계
- 병원 상세 패널에 추가 정보나 운영 배너 보강
- 검색/지역 조회 API를 직접 활용한 서버 사이드 탐색 확장
- 스크린샷 및 아키텍처 이미지 보강

## 환경 변수
- `VITE_API_BASE_URL`: 백엔드 API base URL
- 기본 예시: [`.env.example`](/Users/g/workspace/public/civic/emergency-room-frontend/.env.example)

## 로컬 실행
1. `npm install`
2. `cp .env.example .env`
3. `npm run dev`
4. 기본 백엔드 예시: `http://localhost:8082`

## Docker
```bash
docker build -t emergency-room-frontend .
docker run -p 4178:80 emergency-room-frontend
```

- 기본 정적 웹 포트: `http://localhost:4178`
- 프론트만 따로 띄우면 `VITE_API_BASE_URL`을 실제 API 주소로 맞춘 뒤 빌드해야 한다.
- 로컬 개발 기본 API 예시는 계속 `http://localhost:8082`다.
