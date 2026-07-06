import { api } from "./api";

export async function getActivity(params?: any) {
  const res = await api.get("/activity-logs", {
    params,
  });

  return res.data;
}