import { createRouter, createWebHistory } from "vue-router";

import { appRoutes } from "@/navigation/routes";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: (to) => {
				return appRoutes.DASHBOARD_PAGE.getPath();
			},
		},
		{
			path: appRoutes.HOME_PAGE.path,
			component: () => import("@/components/pages/HomePage.vue"),
			children: [
				{
					path: appRoutes.SETTINGS_PAGE.path,
					component: () => import("@/components/pages/UserSettingsPage.vue"),
				},
				{
					path: appRoutes.DASHBOARD_PAGE.path,
					component: () => import("@/components/pages/DashboardPage.vue"),
				},
				{
					path: appRoutes.STAFF_PAGE.path,
					component: () => import("@/components/pages/StaffPage.vue"),
				},
				{
					path: appRoutes.TABLES_PAGE.path,
					component: () => import("@/components/pages/TablesPage.vue"),
				},
				{
					path: appRoutes.MENU_PAGE.path,
					component: () => import("@/components/pages/MenuPage.vue"),
				},
				{
					path: appRoutes.DISH_PAGE.path,
					component: () => import("@/components/pages/DishPage.vue"),
				},
				{
					path: appRoutes.CATEGORIES_DISHES_PAGE.path,
					component: () => import("@/components/pages/CategoriesDishesPage.vue"),
				},
				{
					path: appRoutes.ORDERS_PAGE.path,
					component: () => import("@/components/pages/OrdersPage.vue"),
				},
				{
					path: appRoutes.SHIFT_PAGE.path,
					component: () => import("@/components/pages/ShiftsPage.vue"),
				},
				{
					path: appRoutes.SETTINGS_ROLES.path,
					component: () => import("@/components/pages/SettingsRoles.vue"),
				},
				{
					path: appRoutes.ROLE_PAGE.path,
					component: () => import("@/components/pages/RolePage.vue"),
				},
			],
		},
		{
			path: appRoutes.LOGIN_PAGE.path,
			component: () => import("@/components/pages/LoginPage.vue"),
		},
	],
});

export default router;
