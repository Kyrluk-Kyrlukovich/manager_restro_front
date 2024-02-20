import { apiInstance } from "@/axios";

export function getNotifications() {
	return apiInstance.get("/notifications");
}

export function readNotifications() {
	return apiInstance.get("/notifications/read");
}

export function deletNotifications() {
	return apiInstance.get("/notifications/delete");
}
