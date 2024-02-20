import {apiInstance} from "@/axios";

export function getOrders(tab?: string) {
    return apiInstance.get('/get-orders', {params: {tab:tab}});
}

export function updateStatus(id: string | number, status?: string) {
    return apiInstance.get(`/update-status-orders/${id}`, {params: {status:status}});
}

export function getFormEditOrder(id: string | number) {
    return apiInstance.get(`/get-form-edit-order/${id}`);
}

export function getFormCreateOrder() {
    return apiInstance.get(`/get-form-create-order`);
}

export function createOrder(dto) {
    return apiInstance.post(`/create-order`, dto);
}

export function updateOrder(id: string | number, dto) {
    return apiInstance.put(`/update-order/${id}`, dto);
}

export function getOrderDishes(id: string | number) {
    return apiInstance.get(`/get-order-dishes/${id}`);
}