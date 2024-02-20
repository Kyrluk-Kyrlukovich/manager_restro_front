import { apiInstance } from "@/axios";

export function getStaff() {
	return apiInstance.get("/get-users");
}

export function getFormCreateUser() {
	return apiInstance.get("/get-form-create-user");
}

export function signup(dto) {
	return apiInstance.post("/signup", dto);
}

export function dismiss(id) {
	return apiInstance.get(`/dismiss/${id}`);
}

export function rehire(id) {
	return apiInstance.get(`/rehire/${id}`);
}
