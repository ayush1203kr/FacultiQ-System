"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/profile";

export interface Profile {
  id: string;
  email: string;
  role: string;

  faculty?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    designation: string;
    qualification: string;
    experienceYears: number;
    bio: string;
    department: {
      id: string;
      name: string;
      code: string;
    };
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const res = await getProfile();
      setProfile(res.user);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    profile,
    loading,
    reload: load,
  };
}