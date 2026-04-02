import type {
  ApiResponse,
  EmergencyHospitalDetail,
  EmergencyStatusSummary,
  NearbyEmergencyHospital
} from "../types/emergency-room";
import { mockHospitals, mockSummary } from "./mockEmergencyRoomData";

export interface NearbyHospitalParams {
  latitude: number;
  longitude: number;
  radius: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8082";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  if (payload.status !== "SUCCESS" || payload.data == null) {
    throw new Error(payload.message || "응답 데이터가 없습니다.");
  }

  return payload.data;
}

export async function fetchEmergencyRoomSummary(): Promise<EmergencyStatusSummary> {
  try {
    return await request<EmergencyStatusSummary>("/api/v1/emergency/status/summary");
  } catch (error) {
    console.warn("summary API fallback to mock", error);
    return mockSummary;
  }
}

export async function fetchNearbyEmergencyHospitals(
  params: NearbyHospitalParams
): Promise<NearbyEmergencyHospital[]> {
  const searchParams = new URLSearchParams({
    latitude: String(params.latitude),
    longitude: String(params.longitude),
    radius: String(params.radius)
  });

  try {
    return await request<NearbyEmergencyHospital[]>(
      `/api/v1/emergency/hospitals/nearby?${searchParams.toString()}`
    );
  } catch (error) {
    console.warn("nearby hospitals API fallback to mock", error);
    return mockHospitals;
  }
}

export async function fetchEmergencyHospitalDetail(
  hospitalId: string
): Promise<EmergencyHospitalDetail> {
  return request<EmergencyHospitalDetail>(`/api/v1/emergency/hospitals/${hospitalId}`);
}
