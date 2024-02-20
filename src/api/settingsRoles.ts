import { apiInstance } from "@/axios";

export function getRoles() {
	return apiInstance.get("/get-roles");
}
export function getRoots(id) {
	return apiInstance.get(`/get-roots/${id}`);
}

export function updateRoots(id, dto) {
	return apiInstance.put(`/update-roots/${id}`, dto);
}
export function getFormCreateRole() {
	return apiInstance.get(`/get-form-create-role`);
}
export function getFormEditRole(id) {
	return apiInstance.get(`/get-form-edit-role/${id}`);
}
export function createRole(dto) {
	return apiInstance.post(`/create-role`, dto);
}
export function updateRole(id, dto) {
	return apiInstance.put(`/update-role/${id}`, dto);
}
