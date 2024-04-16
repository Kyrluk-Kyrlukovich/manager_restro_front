import { apiInstance } from "@/axios";

export function getOrdersAndCosts(periods) {
	return apiInstance.get("/get-orders-costs-data", { params: periods });
}
