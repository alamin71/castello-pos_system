"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { useAuthStore } from "@/store/auth.store";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) return error.response?.data?.message ?? fallback;
    return fallback;
}

export function ChangeNameDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);
    const updateProfile = useUpdateProfile();

    const [name, setName] = useState(user?.name ?? "");
    const [error, setError] = useState("");

    function handleSave() {
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        updateProfile.mutate(
            { name: name.trim() },
            {
                onSuccess: (updated) => {
                    updateUser(updated);
                    onOpenChange(false);
                },
                onError: (err) => setError(getErrorMessage(err, "Could not update name. Please try again.")),
            }
        );
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (next) {
                    setName(user?.name ?? "");
                    setError("");
                }
                onOpenChange(next);
            }}
        >
            <DialogTitle className="sr-only">Change Name</DialogTitle>
            <DialogContent className="w-11/12 max-w-sm border border-white/10 bg-[#1c1c1c] p-6 text-white">
                <h2 className="text-lg font-bold text-white">Change Name</h2>

                <div className="mt-4 flex flex-col gap-2">
                    <Label className="text-white">Full Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        placeholder="Enter your name"
                        className="h-11"
                    />
                    {error && <p className="text-xs text-secondary">{error}</p>}
                </div>

                <Button
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="mt-4 h-11 w-full bg-secondary text-white hover:bg-secondary/90"
                >
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
