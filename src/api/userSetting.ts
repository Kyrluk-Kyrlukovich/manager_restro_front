import {apiInstance} from "@/axios";

export function updateUser(dto, id) {
    return apiInstance.post(`/update-user/${id}`, dto)
}

export function getFormUser(id) {
    return apiInstance.get(`/get-form-users/${id}`)
}

