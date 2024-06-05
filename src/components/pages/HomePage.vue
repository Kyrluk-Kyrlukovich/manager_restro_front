<script setup lang="ts">
import { ArrowDown, BellFilled, DArrowRight, InfoFilled, Setting } from "@element-plus/icons-vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { ElIcon, ElMessage, ElNotification } from "element-plus";
import { debounce } from "lodash";
import { computed, h, onMounted, ref, render, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { loginInfo } from "@/api/login";
import { getlogout } from "@/api/login";
import { deletNotifications, getNotifications, readNotifications } from "@/api/notifications";
import GetIcon from "@/components/pages/GetIcon.vue";
import { appRoutes } from "@/navigation/routes";
import { usePageStore } from "@/pageStore";
import declarePusher from "@/pusher/pusher";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { dtoLoginInfo } from "@/types";
import { useUserStore } from "@/userStore";

const isLoading = ref(true);
const isCollapse = ref<Boolean>(false);
const user = useUserStore();
const page = usePageStore();
const router = useRouter();
const instance = ref<dtoLoginInfo>();
const isNotificationLoading = ref(true);
const notification = declarePusher();
const notifications = ref<Array>([]);
const drawerNotification = ref(false);
const noReadNotificationCount = computed(() => notifications.value.filter((el) => !el.read).length);

const pageTitle = computed(() => page.title);
const asideSmallClass = computed(() => (isCollapse.value ? "asideSmall" : ""));
const dialogVisible = ref(false);

const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerLg = breakpoints.smallerOrEqual("md");
isCollapse.value = smallerLg;

async function fetch() {
	try {
		instance.value = (await loginInfo()).data.data;
		handleGetNotifications();
		user.setUser(instance.value?.user);

		notification
			.channel(`store-notification-${user.getUserId}`)
			.listen(".store-notification", (res) => {
				ElNotification({
					title: "Новое уведомление",
					dangerouslyUseHTMLString: true,
					message: res.notification,
					type: "info",
					position: "bottom-left",
					duration: 10000,
				});
				handleGetNotifications();
			});
		user.setNotification(notification);
		isLoading.value = false;
	} catch (e) {
		isLoading.value = false;
		router.push(appRoutes.LOGIN_PAGE.getPath());
	} finally {
		isLoading.value = false;
	}
}

async function logout() {
	try {
		await getlogout();
		isLoading.value = false;
		debounce(() => (isLoading.value = false), 100);
		router.push(appRoutes.LOGIN_PAGE.getPath());
		ElMessage.success("Действие выполнено успешно");
	} catch (e) {
		isLoading.value = false;
		ElMessage.error("Произошла непредвиденная ошибка");
	} finally {
		isLoading.value = false;
	}
}

async function handleGetNotifications() {
	try {
		notifications.value = (await getNotifications()).data.data;
	} catch (e) {
		ElMessage.error("Произошла непредвиденная ошибка");
	} finally {
		isNotificationLoading.value = false;
	}
}

async function handleReadNotifications() {
	try {
		await readNotifications();
	} catch (e) {
		ElMessage.error("Произошла непредвиденная ошибка");
	} finally {
		isNotificationLoading.value = false;
	}
}

async function handleDeleteNotifications() {
	try {
		await deletNotifications();
		handleGetNotifications();
	} catch (e) {
		ElMessage.error("Произошла непредвиденная ошибка");
	} finally {
		isNotificationLoading.value = false;
	}
}

fetch();
</script>

<template>
	<el-container v-loading="isLoading" class="layout-container h-full">
		<el-aside class="aside" :class="asideSmallClass">
			<el-scrollbar height="100%">
				<el-menu :collapse="isCollapse" class="h-full" router>
					<keep-alive>
						<el-menu-item
							@click="
								() => {
									isCollapse = !isCollapse;
								}
							"
						>
							<el-icon>
								<DArrowRight />
							</el-icon>
						</el-menu-item>
					</keep-alive>
					<el-menu-item
						v-for="tab in instance?.tabs"
						:key="tab.id"
						@click="router.push(tab.link)"
					>
						<get-icon :icon="tab.code"></get-icon>

						<template #title>
							<div class="w-full" :class="{ 'text-slate-50': isCollapse }">
								{{ tab.name }}
							</div>
						</template>
					</el-menu-item>
				</el-menu>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header>
				<div class="flex h-full items-center justify-end gap-4">
					<el-badge
						:value="noReadNotificationCount"
						class="notification cursor-pointer"
						@click="
							() => {
								drawerNotification = true;
								handleReadNotifications();
							}
						"
					>
						<el-icon :size="20" color="#949494">
							<BellFilled />
						</el-icon>
						<el-drawer v-model="drawerNotification" @close="handleGetNotifications">
							<template #title>
								<div class="flex gap-2">
									<el-icon :size="20" color="#949494">
										<BellFilled />
									</el-icon>
									<h2>Уведомления</h2>
								</div>
							</template>
							<div
								v-for="notify in notifications"
								:key="notify.id"
								class="rounded-[8px] p-4 mb-4 flex gap-2 border-[1px] border-[#ebeef5]"
							>
								<div>
									<el-icon size="20" :color="notify.read ? '#808080' : '#0d6efd'">
										<InfoFilled />
									</el-icon>
								</div>
								<div>
									<h2 :class="{ 'no-read': !notify.read }">Уведомление</h2>
									<div v-html="notify.message"></div>
								</div>
							</div>
							<template #footer>
								<el-button
									type="danger"
									@click="
										() => {
											handleDeleteNotifications();
										}
									"
								>
									Удалить все уведомления
								</el-button>
							</template>
						</el-drawer>
					</el-badge>
					<el-dropdown class="">
						<div class="flex items-center gap-2">
							<el-avatar
								:size="30"
								:src="
									user.user?.avatar
										? setUrl(user.user?.avatar)
										: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
								"
							/>
							<span>{{ instance?.user?.first_name }}</span>
							<span>{{ instance?.user?.last_name }}</span>
							<el-icon class="el-icon--right">
								<arrow-down />
							</el-icon>
						</div>
						<template #dropdown>
							<el-dropdown-item
								@click="
									() => {
										router.push(
											appRoutes.SETTINGS_PAGE.getPath(user.getUserId),
										);
									}
								"
							>
								Настройки
							</el-dropdown-item>
							<el-dropdown-item @click="dialogVisible = true">
								<div class="text-danger">Выйти</div>
							</el-dropdown-item>
						</template>
					</el-dropdown>
				</div>
			</el-header>
			<el-main>
				<el-skeleton animated :loading="isLoading">
					<el-page-header title="Назад" @back="router.back()">
						<template #content>
							<span class="text-[0.9rem] font-medium mr-3">{{ pageTitle }}</span>
						</template>
					</el-page-header>
					<RouterView></RouterView>
					<el-dialog v-model="dialogVisible" width="30%" title="Подтверждение">
						<span>Вы уверены что хотите выйти?</span>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogVisible = false">Отмена</el-button>
								<el-button
									type="danger"
									@click="
										() => {
											logout();
											dialogVisible = false;
										}
									"
								>
									Выйти
								</el-button>
							</span>
						</template>
					</el-dialog>
				</el-skeleton>
			</el-main>
		</el-container>
	</el-container>
</template>

<style scoped lang="scss">
:deep(.el-scrollbar__view) {
	height: 100%;
}

:deep(.el-badge) {
	display: flex;
}

:deep(.el-dropdown-menu__item) {
	width: 150px !important;
}

.no-read {
	color: #0d6efd;
}

.aside {
	max-width: 300px;
	transition: all 0.4s linear;
}

.asideSmall {
	max-width: 64px;
}
</style>