const BASE = "https://reqres.in/api/users";

export async function fetchUsers(page = 1, perPage = 6) {
  const res = await fetch(`${BASE}?page=${page}&per_page=${perPage}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
