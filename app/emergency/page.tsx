"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Pencil, Save, ShieldAlert, Plane, Phone } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { getEmergencyInfo, saveEmergencyInfo } from "../lib/emergencyInfo";
import type { EmergencyInfo } from "../lib/emergencyInfo";

const emptyInfo: EmergencyInfo = {
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

export default function EmergencyPage() {
  const [info, setInfo] = useState<EmergencyInfo>(emptyInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EmergencyInfo>(emptyInfo);

  useEffect(() => {
    setInfo(getEmergencyInfo());
  }, []);

  function startEdit() {
    setDraft(info);
    setIsEditing(true);
  }

  function handleSave() {
    setInfo(draft);
    saveEmergencyInfo(draft);
    setIsEditing(false);
  }

  function updateField(field: keyof EmergencyInfo, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  const hasAnyData = Object.values(info).some((v) => v.trim() !== "");

  return (
    <main className="mx-auto max-w-[430px] px-5 pb-[120px] pt-8">
      <div className="flex items-center justify-between">
        <Link
          href="/me"
          aria-label="返回"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.9} />
        </Link>
        <h1 className="font-serif text-[1.5rem] font-medium text-[#2B2A28]">緊急聯絡卡</h1>
        <button
          onClick={isEditing ? handleSave : startEdit}
          aria-label={isEditing ? "儲存" : "編輯"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F3EC] text-[#2B2A28]"
        >
          {isEditing ? (
            <Save className="h-4 w-4" strokeWidth={1.9} />
          ) : (
            <Pencil className="h-4 w-4" strokeWidth={1.9} />
          )}
        </button>
      </div>

      <p className="mt-2 text-[13px] text-[#9C9488]">
        所有資訊只存在這台裝置上，不會上傳到任何伺服器
      </p>

      {!isEditing && !hasAnyData && (
        <section className="mt-6 rounded-[28px] bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
          <p className="text-[15px] text-[#9C9488]">
            還沒有填寫任何資訊，點右上角鉛筆開始填寫
          </p>
        </section>
      )}

      {(isEditing || hasAnyData) && (
        <>
          {/* 護照資訊 */}
          <section className="mt-6 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
            <div className="mb-4 flex items-center gap-2">
              <Plane className="h-4 w-4 text-[#34495E]" strokeWidth={1.9} />
              <h2 className="text-[15px] font-semibold text-[#2B2A28]">護照資訊</h2>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Field label="姓名（護照上）" value={draft.passportName} onChange={(v) => updateField("passportName", v)} />
                <Field label="護照號碼" value={draft.passportNumber} onChange={(v) => updateField("passportNumber", v)} />
                <Field label="效期至" value={draft.passportExpiry} onChange={(v) => updateField("passportExpiry", v)} placeholder="例如 2030-05-20" />
              </div>
            ) : (
              <div className="space-y-2">
                <InfoRow label="姓名" value={info.passportName} />
                <InfoRow label="護照號碼" value={info.passportNumber} />
                <InfoRow label="效期至" value={info.passportExpiry} />
              </div>
            )}
          </section>

          {/* 緊急聯絡人 */}
          <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#E8927C]" strokeWidth={1.9} />
              <h2 className="text-[15px] font-semibold text-[#2B2A28]">緊急聯絡人</h2>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Field label="姓名" value={draft.emergencyContactName} onChange={(v) => updateField("emergencyContactName", v)} />
                <Field label="電話" value={draft.emergencyContactPhone} onChange={(v) => updateField("emergencyContactPhone", v)} placeholder="含國碼，例如 +886..." />
              </div>
            ) : (
              <div className="space-y-2">
                <InfoRow label="姓名" value={info.emergencyContactName} />
                <InfoRow label="電話" value={info.emergencyContactPhone} isPhone />
              </div>
            )}
          </section>

          {/* 保險資訊 */}
          <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#A9BFA0]" strokeWidth={1.9} />
              <h2 className="text-[15px] font-semibold text-[#2B2A28]">旅遊保險</h2>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <Field label="保險公司" value={draft.insuranceCompany} onChange={(v) => updateField("insuranceCompany", v)} />
                <Field label="保單號碼" value={draft.insurancePolicyNumber} onChange={(v) => updateField("insurancePolicyNumber", v)} />
                <Field label="24小時協助專線" value={draft.insurancePhone} onChange={(v) => updateField("insurancePhone", v)} placeholder="含國碼" />
              </div>
            ) : (
              <div className="space-y-2">
                <InfoRow label="保險公司" value={info.insuranceCompany} />
                <InfoRow label="保單號碼" value={info.insurancePolicyNumber} />
                <InfoRow label="協助專線" value={info.insurancePhone} isPhone />
              </div>
            )}
          </section>

          {/* 備註 */}
          <section className="mt-4 rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]">
            <h2 className="mb-3 text-[15px] font-semibold text-[#2B2A28]">其他備註</h2>
            {isEditing ? (
              <textarea
                value={draft.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
                placeholder="例如：過敏藥物、血型、慢性病用藥..."
                className="w-full resize-none rounded-[16px] border border-[#ECE6DA] p-3 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
              />
            ) : (
              <p className="text-[14px] text-[#2B2A28]">
                {info.notes || <span className="text-[#D8D2C2]">尚未填寫</span>}
              </p>
            )}
          </section>

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-[14px] bg-white py-3 text-[14px] font-medium text-[#9C9488] shadow-[0_20px_50px_-30px_rgba(43,42,40,0.35)]"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-[14px] bg-[#A9BFA0] py-3 text-[14px] font-medium text-white"
              >
                儲存
              </button>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[12px] text-[#9C9488]">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-[#ECE6DA] px-3 py-2 text-[14px] text-[#2B2A28] outline-none focus:border-[#A9BFA0]"
      />
    </div>
  );
}

function InfoRow({ label, value, isPhone }: { label: string; value: string; isPhone?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-[#ECE6DA] py-2 first:border-t-0 first:pt-0">
      <span className="text-[13px] text-[#9C9488]">{label}</span>
      {value ? (
        isPhone ? (
          <a href={`tel:${value}`} className="text-[14px] font-medium text-[#34495E] underline">
            {value}
          </a>
        ) : (
          <span className="text-[14px] font-medium text-[#2B2A28]">{value}</span>
        )
      ) : (
        <span className="text-[14px] text-[#D8D2C2]">尚未填寫</span>
      )}
    </div>
  );
}
