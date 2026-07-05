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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateLegacyData(parsed: any): EmergencyInfo {
  // 舊版把護照資料直接存在最外層，沒有 travelers 陣列
  const hasLegacyPassportFields =
    parsed.passportName || parsed.passportNumber || parsed.passportExpiry;
  const hasTravelers = Array.isArray(parsed.travelers) && parsed.travelers.length > 0;

  if (hasLegacyPassportFields && !hasTravelers) {
    const migratedTraveler: Traveler = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: "",
      passportName: parsed.passportName ?? "",
      passportNumber: parsed.passportNumber ?? "",
      passportExpiry: parsed.passportExpiry ?? "",
      birthday: "",
      bloodType: "",
      notes: "",
    };
    return {
      ...defaultInfo,
      ...parsed,
      travelers: [migratedTraveler],
    };
  }

  return {
    ...defaultInfo,
    ...parsed,
    travelers: hasTravelers ? parsed.travelers : [],
  };
}

export function getEmergencyInfo(): EmergencyInfo {
  if (typeof window === "undefined") return defaultInfo;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultInfo;
    const parsed = JSON.parse(raw);
    const migrated = migrateLegacyData(parsed);
    // 順便把轉換後的新格式存回去，之後就不用再轉換
    saveEmergencyInfo(migrated);
    return migrated;
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
