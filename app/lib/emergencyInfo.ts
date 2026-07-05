export interface EmergencyInfo {
  passportName: string;
  passportNumber: string;
  passportExpiry: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceCompany: string;
  insurancePolicyNumber: string;
  insurancePhone: string;
  notes: string;
}

const STORAGE_KEY = "travelDiaryEmergencyInfo";

const defaultInfo: EmergencyInfo = {
  passportName: "",
  passportNumber: "",
  passportExpiry: "",
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
    return raw ? { ...defaultInfo, ...JSON.parse(raw) } : defaultInfo;
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
