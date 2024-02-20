import {apiInstance} from "@/axios";


export function getDishes(params) {
    return apiInstance.get('/dishes', {params:params});
}

export function getFormEditDishes(id) {
    return apiInstance.get(`/get-form-edit-dish/${id}`);
}

export function getFormCreateDishes() {
    return apiInstance.get(`/get-form-create-dish`);
}

export function editDish(id, dto) {
    return apiInstance.post(`/edit-dish/${id}`, dto);
}

export function deleteDish(id) {
    return apiInstance.delete(`/delete-dish/${id}`);
}

export function setImageDish(id, dto) {
    return apiInstance.post(`/set-image-dish/${id}`, dto)
}
export function deleteImageDish(id) {
    return apiInstance.delete(`/delete-image-dish/${id}`)
}

export function createDish(dto) {
    return apiInstance.post(`/dish-create`, dto)
}