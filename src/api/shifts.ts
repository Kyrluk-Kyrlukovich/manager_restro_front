import { apiInstance } from "@/axios";

export function getShifts() {
	return apiInstance.get("/get-shifts");
}

export function takeShift(id: number) {
	return apiInstance.get(`/take-shift/${id}`);
}

export function rejectShift(id: number) {
	return apiInstance.get(`/reject-shift/${id}`);
}

export function getFormCreateShift() {
	return apiInstance.get(`/get-form-create-shift`);
}

export function getFormEditShift(id: number) {
	return apiInstance.get(`/get-form-edit-shift/${id}`);
}

export function createShift(dto) {
	return apiInstance.post(`/create-shift`, dto);
}

export function deleteShift(id: string) {
	return apiInstance.get(`/delete-shift/${id}`);
}

export function updateShift(dto, id) {
	return apiInstance.put(`/update-shift/${id}`, dto);
}

export function startShift(id) {
	return apiInstance.get(`/start-shift/${id}`);
}
export function endShift(id) {
	return apiInstance.get(`/end-shift/${id}`);
}
