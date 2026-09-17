"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/settings/ProfileAvatar";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { useAuthStore } from "@/store/auth.store";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) return error.response?.data?.message ?? fallback;
    return fallback;
}

export function ChangePhotoDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const updateProfile = useUpdateProfile();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState("");

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setError("");
    }

    function handleSave() {
        if (!file) {
            setError("Please choose a photo first");
            return;
        }
        updateProfile.mutate(
            { image: file },
            {
                onSuccess: (updated) => {
                    updateUser(updated);
                    setFile(null);
                    setPreview(null);
                    onOpenChange(false);
                },
                onError: (err) => setError(getErrorMessage(err, "Could not update photo. Please try again.")),
            }
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    setFile(null);
                    setPreview(null);
                    setError("");
                }
                onOpenChange(next);
            }}
        >
            <DialogTitle className="sr-only">Change Profile Photo</DialogTitle>
            <DialogContent className="w-11/12 max-w-sm border border-white/10 bg-[#1c1c1c] p-6 text-white">
                <h2 className="text-lg font-bold text-white">Change Profile Photo</h2>

                <div className="mt-4 flex flex-col items-center gap-4">
                    <ProfileAvatar image={preview ?? user?.image} name={user?.name} size="lg" />
                    <label className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border border-white/15 text-sm font-medium text-white hover:border-white/30">
                        Choose File
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                {error && <p className="mt-2 text-xs text-secondary">{error}</p>}

                <Button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="mt-4 h-11 w-full bg-secondary text-white hover:bg-secondary/90"
                >
                    {updateProfile.isPending ? "Saving..." : "Save Photo"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
