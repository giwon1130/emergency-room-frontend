export type HospitalStatus = "GREEN" | "RED" | "UNKNOWN";

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export interface NearbyEmergencyHospital {
  hospitalId: string;
  name: string;
  address: string | null;
  region: string | null;
  availableBeds: number | null;
  emergencyStatus: HospitalStatus;
  lastUpdated: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface EmergencyStatusSummary {
  totalHospitals: number;
  greenCount: number;
  redCount: number;
  unknownCount: number;
  totalAvailableBeds: number;
  latestStatusUpdatedAt: string | null;
}
