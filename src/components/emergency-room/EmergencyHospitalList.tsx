import type { NearbyEmergencyHospital } from "../../types/emergency-room";

interface ListedEmergencyHospital extends NearbyEmergencyHospital {
  distanceInMeters?: number | null;
}

interface Props {
  hospitals: ListedEmergencyHospital[];
  selectedHospitalId: string | null;
  onSelectHospital: (hospital: NearbyEmergencyHospital) => void;
}

function formatDistance(distanceInMeters?: number | null): string {
  if (distanceInMeters == null) {
    return "거리 정보 없음";
  }

  if (distanceInMeters < 1000) {
    return `${distanceInMeters}m`;
  }

  return `${(distanceInMeters / 1000).toFixed(1)}km`;
}

export function EmergencyHospitalList({ hospitals, selectedHospitalId, onSelectHospital }: Props) {
  return (
    <section className="hospital-list-panel">
      <h2>주변 병원 목록</h2>
      {hospitals.length === 0 ? (
        <p className="empty-state">주변 반경 내 병원 정보가 없다.</p>
      ) : null}
      <div className="hospital-list">
        {hospitals.map((hospital) => (
          <article
            key={hospital.hospitalId}
            className={`hospital-card ${selectedHospitalId === hospital.hospitalId ? "selected" : ""}`}
            onClick={() => onSelectHospital(hospital)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onSelectHospital(hospital);
              }
            }}
          >
            <div className="hospital-card-header">
              <strong>{hospital.name}</strong>
              <span className={`status-badge ${hospital.emergencyStatus.toLowerCase()}`}>
                {hospital.emergencyStatus}
              </span>
            </div>
            <p>{hospital.address ?? "주소 정보 없음"}</p>
            <div className="hospital-card-footer">
              <span>가용 병상 {hospital.availableBeds ?? "-"}</span>
              <span>{formatDistance(hospital.distanceInMeters)}</span>
            </div>
            <div className="hospital-card-footer compact">
              <span>{hospital.region ?? hospital.hospitalId}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
