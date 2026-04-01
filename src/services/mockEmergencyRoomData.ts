import type { EmergencyStatusSummary, NearbyEmergencyHospital } from "../types/emergency-room";

export const mockHospitals: NearbyEmergencyHospital[] = [
  {
    hospitalId: "A1100001",
    name: "샘플 응급의료센터",
    address: "서울특별시 중구 샘플로 1",
    region: "서울특별시 중구",
    availableBeds: 12,
    emergencyStatus: "GREEN",
    lastUpdated: "2026-04-01T08:15:00",
    latitude: 37.5665,
    longitude: 126.978
  },
  {
    hospitalId: "A1100002",
    name: "도심 응급진료센터",
    address: "서울특별시 종로구 예시로 24",
    region: "서울특별시 종로구",
    availableBeds: 3,
    emergencyStatus: "RED",
    lastUpdated: "2026-04-01T08:10:00",
    latitude: 37.5705,
    longitude: 126.982
  },
  {
    hospitalId: "A1100003",
    name: "북부 권역응급의료센터",
    address: "서울특별시 성북구 샘플로 88",
    region: "서울특별시 성북구",
    availableBeds: null,
    emergencyStatus: "UNKNOWN",
    lastUpdated: null,
    latitude: 37.5894,
    longitude: 127.0167
  }
];

export const mockSummary: EmergencyStatusSummary = {
  totalHospitals: 3,
  greenCount: 1,
  redCount: 1,
  unknownCount: 1,
  totalAvailableBeds: 15,
  latestStatusUpdatedAt: "2026-04-01T08:15:00"
};
