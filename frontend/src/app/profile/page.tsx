"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import ProfileCard from "@/components/profile/profile-card";

import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { profile, loading } = useProfile();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <ProfileCard profile={profile} />
        ) : (
          <p>No profile found.</p>
        )}

      </div>
    </DashboardLayout>
  );
}