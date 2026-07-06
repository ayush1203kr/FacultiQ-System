import { api } from "./api";

export async function getDepartments(params?: any) {
  const res = await api.get("/departments", {
    params,
  });

  return res.data;
}

export async function createDepartment(data: any) {
  const res = await api.post("/departments", data);
  return res.data;
}

export async function updateDepartment(
  id: string,
  data: any
) {
  const res = await api.patch(
    `/departments/${id}`,
    data
  );

  return res.data;
}

export async function deleteDepartment(
  id: string
) {
  const res = await api.delete(
    `/departments/${id}`
  );

  return res.data;
}