"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { ChangeNameDialog } from "@/components/settings/ChangeNameDialog";
import { useAuthStore } from "@/store/auth.store";

function InfoRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <div>
                <p className="text-xs text-white/40">{label}</p>
                <p className="text-sm text-white">{value || "—"}</p>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="flex size-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 hover:text-white"
                >
                    <Pencil className="size-4" />
                </button>
            )}
        </div>
    );
}

export function BasicInfoTab() {
    const user = useAuthStore((s) => s.user);
    const [changeNameOpen, setChangeNameOpen] = useState(false);

    return (
        <div className="flex max-w-2xl flex-col gap-3">
            <InfoRow label="Full Name" value={user?.name ?? ""} onEdit={() => setChangeNameOpen(true)} />
            <InfoRow label="User ID" value={user?.userId ?? ""} />
            <InfoRow label="Phone Number" value={user?.phone ?? ""} />
            <InfoRow label="Designation" value={user?.designation ?? ""} />
            <InfoRow label="Branch" value={user?.branch?.name ?? ""} />
            <InfoRow label="Role" value={user?.role?.name ?? ""} />

            <ChangeNameDialog open={changeNameOpen} onOpenChange={setChangeNameOpen} />
        </div>
    );
}
