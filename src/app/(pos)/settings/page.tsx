"use client";

import { useEffect } from "react";
import { TopBar } from "@/components/pos/TopBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfilePhotoSection } from "@/components/settings/ProfilePhotoSection";
import { BasicInfoTab } from "@/components/settings/BasicInfoTab";
import { ChangePasswordTab } from "@/components/settings/ChangePasswordTab";
import { useMyProfile } from "@/hooks/queries/useMyProfile";
import { useAuthStore } from "@/store/auth.store";

export default function SettingsPage() {
    const updateUser = useAuthStore((s) => s.updateUser);
    const { data: profile } = useMyProfile();

    useEffect(() => {
        if (profile) updateUser(profile);
    }, [profile, updateUser]);

    return (
        <div>
            <TopBar />
            <div className="px-8 pb-10">
                <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>

                <ProfilePhotoSection />

                <Tabs defaultValue="basic" className="max-w-2xl">
                    <TabsList variant="line" className="mb-4 border-b border-white/10">
                        <TabsTrigger value="basic">Basic Information</TabsTrigger>
                        <TabsTrigger value="password">Change Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic">
                        <BasicInfoTab />
                    </TabsContent>
                    <TabsContent value="password">
                        <ChangePasswordTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
