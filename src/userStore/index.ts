import { defineStore } from "pinia";

import type { dtoLoginInfo } from "@/types";

export const useUserStore = defineStore("user", {
	state: () =>
		({
			user: null,
			notification: null,
		} as dtoLoginInfo),
	getters: {
		getUserId: (state) => state.user?.id || null,
		getUserEmail: (state) => state.user?.email || null,
		getUserFirstName: (state) => state.user?.first_name || null,
		getUserLastName: (state) => state.user?.last_name || null,
		getUserPatronymic: (state) => state.user?.patronymic || null,
		getUserSalary: (state) => state.user?.salary || null,
	},
	actions: {
		setUser(payload) {
			this.user = payload;
		},
		setNotification(payload) {
			this.notification = payload;
		},
	},
});
