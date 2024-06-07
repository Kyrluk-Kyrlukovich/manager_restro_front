import axios from "axios";

import { apiInstance } from "@/axios";
import type { dtoTypes } from "@/types";

export function login(dto: dtoTypes) {
	return axios
		.get("http://api.diplom-vasilev.ru/sanctum/csrf-cookie")
		.then((r) => apiInstance.post("/login", dto));
}

export function loginInfo() {
	return apiInstance.get("/login-info");
}

export function getlogout() {
	return apiInstance.get("/logout");
}
