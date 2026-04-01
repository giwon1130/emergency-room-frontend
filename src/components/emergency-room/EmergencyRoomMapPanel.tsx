import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { NearbyEmergencyHospital, HospitalStatus } from "../../types/emergency-room";

interface Props {
  hospitals: NearbyEmergencyHospital[];
  center: {
    latitude: number;
    longitude: number;
  };
  selectedHospitalId: string | null;
  onSelectHospital: (hospital: NearbyEmergencyHospital) => void;
}

const DEFAULT_CENTER: [number, number] = [37.5665, 126.978];

function getStatusColor(status: HospitalStatus) {
  switch (status) {
    case "GREEN":
      return "#16a34a";
    case "RED":
      return "#dc2626";
    case "UNKNOWN":
    default:
      return "#64748b";
  }
}

function MapViewportUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export function EmergencyRoomMapPanel({
  hospitals,
  center: currentCenter,
  selectedHospitalId,
  onSelectHospital
}: Props) {
  const hospitalsWithCoordinates = hospitals.filter(
    (hospital): hospital is NearbyEmergencyHospital & { latitude: number; longitude: number } =>
      hospital.latitude != null && hospital.longitude != null
  );

  const center =
    currentCenter.latitude != null && currentCenter.longitude != null
      ? [currentCenter.latitude, currentCenter.longitude] as [number, number]
      : hospitalsWithCoordinates.length > 0
        ? [hospitalsWithCoordinates[0].latitude, hospitalsWithCoordinates[0].longitude] as [number, number]
        : DEFAULT_CENTER;

  return (
    <section className="map-panel">
      <div className="leaflet-map-shell">
        <MapContainer center={center} zoom={12} scrollWheelZoom className="leaflet-map">
          <MapViewportUpdater center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hospitalsWithCoordinates.map((hospital) => (
            <CircleMarker
              key={hospital.hospitalId}
              center={[hospital.latitude, hospital.longitude]}
              eventHandlers={{
                click: () => onSelectHospital(hospital)
              }}
              pathOptions={{
                color: getStatusColor(hospital.emergencyStatus),
                fillColor: getStatusColor(hospital.emergencyStatus),
                fillOpacity: selectedHospitalId === hospital.hospitalId ? 1 : 0.9,
                weight: selectedHospitalId === hospital.hospitalId ? 4 : 2
              }}
              radius={selectedHospitalId === hospital.hospitalId ? 14 : 10}
            >
              <Popup>
                <strong>{hospital.name}</strong>
                <div>{hospital.address ?? "주소 정보 없음"}</div>
                <div>가용 병상: {hospital.availableBeds ?? "-"}</div>
                <div>상태: {hospital.emergencyStatus}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="map-marker-list">
        {hospitals.map((hospital) => (
          <div
            key={hospital.hospitalId}
            className={`map-marker-item ${selectedHospitalId === hospital.hospitalId ? "selected" : ""}`}
            onClick={() => onSelectHospital(hospital)}
          >
            <span className={`status-dot ${hospital.emergencyStatus.toLowerCase()}`} />
            <div>
              <strong>{hospital.name}</strong>
              <p>
                {hospital.latitude ?? "-"}, {hospital.longitude ?? "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
