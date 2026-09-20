"use client";

import { useState } from "react";
import { ProfileAvatar } from "@/components/settings/ProfileAvatar";
import { ChangePhotoDialog } from "@/components/settings/ChangePhotoDialog";
import { RemovePhotoDialog } from "@/components/settings/RemovePhotoDialog";
import { useAuthStore } from "@/store/auth.store";

export function ProfilePhotoSection() {
    const user = useAuthStore((s) => s.user);
    const [changeOpen, setChangeOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);

    return (
        <div className="mb-6 max-w-2xl rounded-2xl bg-white/5 p-6">
            <div className="flex items-center gap-4">
                <ProfileAvatar image={user?.image} name={user?.name} size="lg" />
                <div>
                    <p className="text-lg font-semibold text-white">{user?.name}</p>
                    <p className="text-sm text-white/50">{user?.designation}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                        <button onClick={() => setChangeOpen(true)} className="font-medium text-white transition-colors hover:text-secondary">
                            Change Profile Photo
                        </button>
                        {user?.image && (
                            <button onClick={() => setRemoveOpen(true)} className="font-medium text-white transition-colors hover:text-secondary">
                                Remove Profile Photo
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ChangePhotoDialog open={changeOpen} onOpenChange={setChangeOpen} />
            <RemovePhotoDialog open={removeOpen} onOpenChange={setRemoveOpen} />
        </div>
    );
}
