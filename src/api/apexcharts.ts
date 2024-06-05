import { apiInstance } from "@/axios";

export function getOrdersAndCosts(periods) {
	return apiInstance.get("/get-orders-costs-data", { params: periods });
}
export function getDataDishes(period) {
	return apiInstance.get("/get-dishes-data", { params: { period: period } });
}
