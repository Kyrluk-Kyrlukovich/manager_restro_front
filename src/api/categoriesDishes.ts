import { apiInstance } from "@/axios";

export function getCategoriesDishes() {
	return apiInstance.get("/categories-dishes");
}

export function getFormEditCategoryDishes(id) {
	return apiInstance.get(`/get-form-edit-category/${id}`);
}

export function getFormCreateCategoryDishes() {
	return apiInstance.get(`/get-form-create-category`);
}

export function editCategoryDishes(id, dto) {
	return apiInstance.post(`/edit-category-dishes/${id}`, dto);
}

export function createCategoryDishes(dto) {
	return apiInstance.post(`/create-category-dishes`, dto);
}

export function deleteCategoryDishes(id) {
	return apiInstance.delete(`/delete-category-dishes/${id}`);
}
