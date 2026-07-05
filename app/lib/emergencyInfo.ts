export interface Traveler {
  id: string;
  name: string;
  passportName: string;
  passportNumber: string;
  passportExpiry: string;
  birthday: string;
  bloodType: string;
  notes: string;
}

export interface EmergencyInfo {
  travelers: Traveler[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insurancePhone: string;
  notes: string;
}

const STORAGE_KEY = "travelDiaryEmergencyInfo";

function emptyTraveler(): Traveler {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: "",
    passportName: "",
    passportNumber: "",
    passportExpiry: "",
    birthday: "",
    bloodType: "",
    notes: "",
  };
}

const defaultInfo: EmergencyInfo = {
  travelers: [],
  emergencyContactName: "",
  emergencyContactPhone: "",
  insuranceCompany: "",
  insurancePolicyNumber: "",
  insurancePhone: "",
  notes: "",
};

export function getEmergencyInfo(): EmergencyInfo {
  if (typeof window === "undefined") return defaultInfo;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultInfo;
    const parsed = JSON.parse(raw);
    return { ...defaultInfo, ...parsed, travelers: parsed.travelers ?? [] };
  } catch {
    return defaultInfo;
  }
}

export function saveEmergencyInfo(info: EmergencyInfo) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    alert("儲存失敗，請再試一次");
  }
}

export { emptyTraveler };
