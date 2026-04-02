import { useEffect, useState } from "react";
import { EmergencyHospitalList } from "../../components/emergency-room/EmergencyHospitalList";
import { EmergencyRoomSummaryCard } from "../../components/emergency-room/EmergencyRoomSummaryCard";
import { EmergencyRoomMapPanel } from "../../components/emergency-room/EmergencyRoomMapPanel";
import { fetchEmergencyRoomSummary, fetchNearbyEmergencyHospitals } from "../../services/emergencyRoomApi";
import type { EmergencyStatusSummary, NearbyEmergencyHospital } from "../../types/emergency-room";

const DEFAULT_LOCATION = {
  latitude: 37.5665,
  longitude: 126.978
};

const RADIUS_OPTIONS = [
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
  { label: "10km", value: 10000 },
  { label: "20km", value: 20000 }
] as const;

export function EmergencyRoomPage() {
  const [summary, setSummary] = useState<EmergencyStatusSummary | null>(null);
  const [hospitals, setHospitals] = useState<NearbyEmergencyHospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<NearbyEmergencyHospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5000);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState("서울 시청 기준");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "GREEN" | "RED" | "UNKNOWN">("ALL");
  const [sortOption, setSortOption] = useState<"distance" | "beds" | "name">("distance");

  const loadEmergencyData = async (nextLocation = currentLocation, nextRadius = radius) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [nextSummary, nextHospitals] = await Promise.all([
        fetchEmergencyRoomSummary(),
        fetchNearbyEmergencyHospitals({
          latitude: nextLocation.latitude,
          longitude: nextLocation.longitude,
          radius: nextRadius
        })
      ]);

      setSummary(nextSummary);
      setHospitals(nextHospitals);
      setSelectedHospital((currentSelectedHospital) =>
        nextHospitals.find((hospital) => hospital.hospitalId === currentSelectedHospital?.hospitalId)
          ?? nextHospitals[0]
          ?? null
      );
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "응급실 데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWithCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationLabel("브라우저 위치 미지원, 서울 시청 기준");
      void loadEmergencyData(DEFAULT_LOCATION, radius);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(nextLocation);
        setLocationLabel("내 현재 위치 기준");
        void loadEmergencyData(nextLocation, radius);
      },
      () => {
        setCurrentLocation(DEFAULT_LOCATION);
        setLocationLabel("위치 권한 거부, 서울 시청 기준");
        void loadEmergencyData(DEFAULT_LOCATION, radius);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000
      }
    );
  };

  useEffect(() => {
    refreshWithCurrentLocation();
  }, []);

  useEffect(() => {
    void loadEmergencyData(currentLocation, radius);
  }, [radius]);

  const filteredHospitals = hospitals
    .filter((hospital) => {
      const matchesKeyword =
        searchKeyword.trim().length === 0 ||
        hospital.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (hospital.address ?? "").toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (hospital.region ?? "").toLowerCase().includes(searchKeyword.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || hospital.emergencyStatus === statusFilter;
      return matchesKeyword && matchesStatus;
    })
    .sort((left, right) => {
      if (sortOption === "beds") {
        return (right.availableBeds ?? -1) - (left.availableBeds ?? -1);
      }

      if (sortOption === "name") {
        return left.name.localeCompare(right.name, "ko");
      }

      return 0;
    });

  const visibleSelectedHospital =
    filteredHospitals.find((hospital) => hospital.hospitalId === selectedHospital?.hospitalId) ?? filteredHospitals[0] ?? null;

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Emergency Room</p>
          <h1>주변 응급실 병상 현황</h1>
          <p className="page-copy">
            현재 위치 기준으로 주변 병원을 지도와 리스트에서 동시에 탐색할 수 있는 MVP 화면이다.
          </p>
        </div>
      </header>

      <section className="control-panel">
        <div>
          <span className="control-label">조회 기준</span>
          <strong>{locationLabel}</strong>
          <p className="control-copy">
            위도 {currentLocation.latitude.toFixed(4)} / 경도 {currentLocation.longitude.toFixed(4)}
          </p>
        </div>
        <div className="control-actions">
          <label className="search-control">
            <span className="control-label">검색</span>
            <input
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="병원명, 주소, 지역"
            />
          </label>
          <label className="radius-control">
            <span className="control-label">상태</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | "GREEN" | "RED" | "UNKNOWN")}>
              <option value="ALL">전체</option>
              <option value="GREEN">가용</option>
              <option value="RED">혼잡</option>
              <option value="UNKNOWN">미확인</option>
            </select>
          </label>
          <label className="radius-control">
            <span className="control-label">정렬</span>
            <select value={sortOption} onChange={(event) => setSortOption(event.target.value as "distance" | "beds" | "name")}>
              <option value="distance">기본</option>
              <option value="beds">가용 병상 순</option>
              <option value="name">이름 순</option>
            </select>
          </label>
          <label className="radius-control">
            <span className="control-label">반경</span>
            <select value={radius} onChange={(event) => setRadius(Number(event.target.value))}>
              {RADIUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="primary-button" onClick={refreshWithCurrentLocation}>
            현재 위치로 재조회
          </button>
        </div>
      </section>

      {errorMessage ? (
        <section className="notice-banner error">
          <strong>데이터 조회 실패</strong>
          <p>{errorMessage}</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="notice-banner">
          <strong>데이터 조회 중</strong>
          <p>응급실 병상 현황과 주변 병원 정보를 불러오는 중이다.</p>
        </section>
      ) : null}

      {summary ? <EmergencyRoomSummaryCard summary={summary} /> : null}

      <section className="result-meta">
        <div>
          <span className="control-label">검색 결과</span>
          <strong>{filteredHospitals.length}개 병원</strong>
          <p className="control-copy">현재 검색/필터 기준으로 표시되는 병원 수</p>
        </div>
      </section>

      <section className="emergency-layout">
        <EmergencyRoomMapPanel
          hospitals={filteredHospitals}
          center={currentLocation}
          selectedHospitalId={visibleSelectedHospital?.hospitalId ?? null}
          onSelectHospital={setSelectedHospital}
        />
        <div className="side-panel-stack">
          {visibleSelectedHospital ? (
            <section className="hospital-detail-panel">
              <div className="hospital-detail-header">
                <div>
                  <span className="control-label">선택한 병원</span>
                  <h2>{visibleSelectedHospital.name}</h2>
                </div>
                <span className={`status-badge ${visibleSelectedHospital.emergencyStatus.toLowerCase()}`}>
                  {visibleSelectedHospital.emergencyStatus}
                </span>
              </div>
              <div className="hospital-detail-grid">
                <div>
                  <span className="detail-label">주소</span>
                  <p>{visibleSelectedHospital.address ?? "주소 정보 없음"}</p>
                </div>
                <div>
                  <span className="detail-label">지역</span>
                  <p>{visibleSelectedHospital.region ?? "지역 정보 없음"}</p>
                </div>
                <div>
                  <span className="detail-label">가용 병상</span>
                  <p>{visibleSelectedHospital.availableBeds ?? "-"}</p>
                </div>
                <div>
                  <span className="detail-label">최근 갱신</span>
                  <p>{visibleSelectedHospital.lastUpdated ? new Date(visibleSelectedHospital.lastUpdated).toLocaleString("ko-KR") : "업데이트 정보 없음"}</p>
                </div>
                <div>
                  <span className="detail-label">좌표</span>
                  <p>
                    {visibleSelectedHospital.latitude ?? "-"}, {visibleSelectedHospital.longitude ?? "-"}
                  </p>
                </div>
              </div>
            </section>
          ) : null}
          <EmergencyHospitalList
            hospitals={filteredHospitals}
            selectedHospitalId={visibleSelectedHospital?.hospitalId ?? null}
            onSelectHospital={setSelectedHospital}
          />
        </div>
      </section>
    </main>
  );
}
