"use client";

import { isAxiosError } from "axios";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRemoveProfilePhoto } from "@/hooks/mutations/useRemoveProfilePhoto";
import { useAuthStore } from "@/store/auth.store";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) return error.response?.data?.message ?? fallback;
    return fallback;
}

export function RemovePhotoDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const updateUser = useAuthStore((s) => s.updateUser);
    const removePhoto = useRemoveProfilePhoto();
    const [error, setError] = useState("");

    function handleRemove() {
        removePhoto.mutate(undefined, {
            onSuccess: (updated) => {
                updateUser(updated);
                onOpenChange(false);
            },
            onError: (err) => setError(getErrorMessage(err, "Could not remove photo. Please try again.")),
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTitle className="sr-only">Remove Profile Photo</DialogTitle>
            <DialogDescription className="sr-only">Confirm removing your profile photo</DialogDescription>
            <DialogContent className="w-11/12 max-w-sm border border-white/10 bg-[#1c1c1c] p-6 text-white">
                <h2 className="text-lg font-bold text-white">Remove Profile Photo</h2>
                <p className="mt-1 text-sm text-white/50">Are you sure you want to remove your profile photo?</p>
                {error && <p className="mt-2 text-xs text-secondary">{error}</p>}
                <div className="mt-4 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 flex-1 border-white/15 text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRemove}
                        disabled={removePhoto.isPending}
                        className="h-11 flex-1 bg-secondary text-white hover:bg-secondary/90"
                    >
                        {removePhoto.isPending ? "Removing..." : "Remove"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
