import {apiInstance} from "@/axios";

export function getTables(tab) {
    return apiInstance.get(`/tables`, {params: {tab:tab}});
}

export function updateTable(id, dto) {
    return apiInstance.post(`/tables/${id}/update`, dto)
}

export function createTable(dto) {
    return apiInstance.post('/create-table', dto)
}

export function getFormTableCreate() {
    return apiInstance.get('/get-form-create-table');
}

export function getFormTableEdit(id) {
    return apiInstance.get(`/get-form-edit-table/${id}`);
}

export function deleteTable(id) {
    return apiInstance.delete(`/delete-table/${id}`);
}