import { apiInstance } from "@/axios";

export function getOrdersAndCosts() {
	return apiInstance.get("/get-orders-costs-data");
}
