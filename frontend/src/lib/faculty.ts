import { api } from "./api";

export async function getFaculty(params?: any) {
  const res = await api.get("/faculty", {
    params,
  });

  return res.data;
}

export async function createFaculty(data: any) {
  try {
    const res = await api.post("/faculty", data);
    return res.data;
  } catch (err: any) {
    console.log(err.response?.data);
    throw err;
  }
}

export async function updateFaculty(
  id: string,
  data: any
) {
  const res = await api.patch(
    `/faculty/${id}`,
    data
  );

  return res.data;
}

export async function deleteFaculty(id: string) {
  const res = await api.delete(
    `/faculty/${id}`
  );

  return res.data;
}

export async function getFacultyById(
  id: string
) {
  const res = await api.get(
    `/faculty/${id}`
  );

  return res.data;
}