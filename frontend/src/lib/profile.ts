import { api } from "./api";

export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function updateProfile(data: any) {
  const res = await api.patch("/profile", data);
  return res.data;
}