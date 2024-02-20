export const appRoutes = {
	LOGIN_PAGE: {
		path: "/sign-in",
		name: "login-page",
		getPath: () => "/sign-in",
	},
	HOME_PAGE: {
		path: "/main",
		name: "main-page",
		getPath: () => "/main",
	},
	DASHBOARD_PAGE: {
		path: "/main/dashboard",
		name: "dashboard-page",
		getPath: () => "/main/dashboard",
	},
	SETTINGS_PAGE: {
		path: "/user/:id/settings",
		name: "user-settings",
		getPath: (userId) => `/user/${userId}/settings`,
	},
	STAFF_PAGE: {
		path: "/staff",
		name: "staff-settings",
		getPath: () => `/staff`,
	},
	TABLES_PAGE: {
		path: "/tables",
		name: "tables-settings",
		getPath: () => `/tables`,
	},
	MENU_PAGE: {
		path: "/menu",
		name: "menu-settings",
		getPath: () => `/menu`,
	},
	DISH_PAGE: {
		path: "/dish/:id",
		name: "dish-settings",
		getPath: (id) => `/dish/${id}`,
	},
	CATEGORIES_DISHES_PAGE: {
		path: "/categories-dishes",
		name: "categories-dishes",
		getPath: () => `/categories-dishes`,
	},
	ORDERS_PAGE: {
		path: "/orders",
		name: "orders-settings",
		getPath: () => `/orders`,
	},
	SHIFT_PAGE: {
		path: "/shifts",
		name: "shifts",
		getPath: () => `/orders`,
	},
	SETTINGS_ROLES: {
		path: "/settings-roles",
		name: "settings-roles",
		getPath: () => `/settings-roles`,
	},
	ROLE_PAGE: {
		path: "/role/:id",
		name: "role-page",
		getPath: (id) => `/role/${id}`,
	},
};
