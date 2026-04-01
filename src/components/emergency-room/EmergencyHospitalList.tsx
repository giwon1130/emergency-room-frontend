import type { NearbyEmergencyHospital } from "../../types/emergency-room";

interface Props {
  hospitals: NearbyEmergencyHospital[];
  selectedHospitalId: string | null;
  onSelectHospital: (hospital: NearbyEmergencyHospital) => void;
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
              <span>{hospital.region ?? hospital.hospitalId}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
