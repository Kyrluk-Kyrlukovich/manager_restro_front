import axios from "axios";

import { apiInstance } from "@/axios";
import type { dtoTypes } from "@/types";

export function login(dto: dtoTypes) {
	return axios
		.get("http://94.26.225.206:81/sanctum/csrf-cookie")
		.then((r) => apiInstance.post("/login", dto));
}

export function loginInfo() {
	return apiInstance.get("/login-info");
}

export function getlogout() {
	return apiInstance.get("/logout");
}
