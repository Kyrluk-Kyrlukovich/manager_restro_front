<script setup lang="ts">
import { MoreFilled } from "@element-plus/icons-vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core/index";
import dayjs from "dayjs";
import { Action, ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useRoute } from "vue-router";

import {
	createShift,
	deleteShift,
	endShift,
	getFormCreateShift,
	getFormEditShift,
	getShifts,
	rejectShift,
	startShift,
	takeShift,
	updateShift,
} from "@/api/shifts";
import { appRoutes } from "@/navigation/routes";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";

const route = useRoute();

const data = ref({});
const isInitLoading = ref(true);
const formCreateShift = ref([]);
const formEditShift = ref([]);
const isOpendialog = ref(false);
const usersForDialod = ref([]);
const isFormLoading = ref(true);
const createDrawer = ref(false);
const editId = ref();
const editDrawer = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerLg = breakpoints.smallerOrEqual("md");
async function handleGetShifts() {
	isInitLoading.value = true;
	try {
		data.value = (await getShifts()).data;
		isInitLoading.value = false;
		setTimeout(() => {
			const blockToScroll: HTMLElement | null = document.getElementById(route.hash.slice(1));
			if (blockToScroll) {
				blockToScroll.scrollIntoView({ block: "center", behavior: "smooth" });
			}
		}, 500);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleTakeShift(id: number) {
	try {
		let response = (await takeShift(id)).data.data;
		await handleGetShifts();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleRejectShift(id: number) {
	try {
		let response = (await rejectShift(id)).data.data;
		await handleGetShifts();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleGetFormCreateShift() {
	try {
		formCreateShift.value = (await getFormCreateShift()).data.data;
		isFormLoading.value = false;
		createDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}

async function handleGetFormEditShift(id) {
	try {
		formEditShift.value = (await getFormEditShift(id)).data.data;
		isFormLoading.value = false;
		editDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}
async function handleCreateShift() {
	try {
		let dto = {};
		formCreateShift.value.form?.forEach((field) => {
			if (field.type === "datetime") {
				dto[field.code] = dayjs(field.value).format("YYYY-MM-DD HH:mm:ss");
			} else {
				dto[field.code] = field.value;
			}
		});
		await createShift(dto);
		await handleGetShifts();
		createDrawer.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}

async function handleDeleteShift(id: number) {
	try {
		let response = (await deleteShift(id)).data.data;
		await handleGetShifts();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleUpdateShift(id: number) {
	try {
		let dto = {};
		formEditShift.value.form?.forEach((field) => {
			if (field.type === "datetime") {
				dto[field.code] = dayjs(field.value).format("YYYY-MM-DD HH:mm:ss");
			} else {
				dto[field.code] = field.value;
			}
		});
		await updateShift(dto, id);
		await handleGetShifts();
		editDrawer.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}

async function handleStartShift(id) {
	try {
		let response = (await startShift(id)).data.data;
		await handleGetShifts();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleEndShift(id) {
	try {
		let response = (await endShift(id)).data.data;
		await handleGetShifts();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

handleGetShifts();
</script>

<template>
	<div class="flex flex-col h-full">
		<el-skeleton :loading="isInitLoading" animated>
			<div v-if="data.canCreateShift" class="py-2 mt-3 mb-2 flex w-full justify-end">
				<el-button
					type="primary"
					:size="smallerLg ? 'small' : 'default'"
					@click="handleGetFormCreateShift"
				>
					Создать смену
				</el-button>
			</div>
			<el-table v-loading="isInitLoading" :data="data.shifts" height="450">
				<el-table-column prop="id" label="Номер смены" />
				<el-table-column prop="name" label="Название смены" />
				<el-table-column prop="date_start" label="Начало смены">
					<template #default="scope">
						{{ dayjs(scope.row.date_start).format("HH:mm DD.MM.YYYY") }}
					</template>
				</el-table-column>
				<el-table-column prop="date_end" label="Конец смены">
					<template #default="scope">
						{{ dayjs(scope.row.date_end).format("HH:mm DD.MM.YYYY") }}
					</template>
				</el-table-column>
				<el-table-column prop="hours" label="Часов за смену" />
				<el-table-column prop="count_staff" label="Необходимое количество персонала" />
				<el-table-column
					prop="users"
					min-width="200"
					align="center"
					label="Участники этой смены"
				>
					<template #default="scope">
						<div
							v-if="scope.row?.users.length == 0"
							:id="scope.row.id"
							class="break-words"
						>
							В этой смене пока нет участников
						</div>
						<div
							v-else-if="scope.row?.users.length > 0 && scope.row?.users.length > 3"
							class="flex justify-center"
						>
							<router-link
								v-for="user in scope.row.users.slice(0, 2)"
								:to="appRoutes.SETTINGS_PAGE.getPath(user.id)"
							>
								<el-avatar
									:key="user.id"
									size="30"
									:src="
										user?.avatar
											? setUrl(user?.avatar)
											: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
									"
								/>
							</router-link>
							<el-avatar
								class="more"
								@click="
									() => {
										usersForDialod = scope.row.users;
										isOpendialog = true;
									}
								"
							>
								<template #default>
									<div class="bg-gray-900">+7</div>
								</template>
							</el-avatar>
						</div>
						<div v-else class="flex justify-center">
							<router-link
								v-for="user in scope.row.users"
								:to="appRoutes.SETTINGS_PAGE.getPath(user.id)"
							>
								<el-avatar
									:key="user.id"
									size="30"
									:src="
										user?.avatar
											? setUrl(user?.avatar)
											: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
									"
								/>
							</router-link>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="shift"
					:fixed="!data.canEditShift ? 'right' : false"
					width="180"
					label="Действия"
				>
					<template #default="scope">
						<el-button
							v-if="scope.row.shift.active"
							type="info"
							size="small"
							plain
							disabled
							class="w-full"
						>
							Эта смена уже началась
						</el-button>
						<el-button
							v-else-if="!scope.row.shift.freely"
							type="info"
							size="small"
							plain
							disabled
							class="w-full"
						>
							Эта смена уже заполнена
						</el-button>
						<el-button
							v-else-if="!scope.row.shift.include"
							type="primary"
							size="small"
							class="w-full"
							@click="handleTakeShift(scope.row.id)"
						>
							Взять смену
						</el-button>

						<el-button
							v-else
							type="danger"
							class="w-full"
							size="small"
							@click="() => {
							ElMessageBox.alert('Вы уверены что хотите отказаться от смены?', 'Подтверждение', {
								confirmButtonText: 'OK',
								callback: (action: Action) => {
								  handleRejectShift(scope.row.id);
								},
							  })
						}"
						>
							Отказаться от смены
						</el-button>
					</template>
				</el-table-column>
				<el-table-column v-if="data.canEditShift" fixed="right" prop="actions">
					<template #default="scope">
						<el-dropdown trigger="click">
							<div class="btn btn-light">
								<el-icon color="#a9a9a9">
									<MoreFilled />
								</el-icon>
							</div>
							<template #dropdown>
								<el-dropdown-item
									v-if="!scope.row.active"
									@click="handleStartShift(scope.row.id)"
								>
									<div class="text-success">Начать</div>
								</el-dropdown-item>
								<el-dropdown-item v-else @click="handleEndShift(scope.row.id)">
									<div>Закончить</div>
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											handleGetFormEditShift(scope.row.id);
											editId = scope.row.id;
										}
									"
								>
									<div>Редактировать</div>
								</el-dropdown-item>
								<el-dropdown-item
									@click="() => {
									ElMessageBox.alert('Вы уверены что хотите удалить смену?', 'Подтверждение', {
										confirmButtonText: 'OK',
										callback: (action: Action) => {
										  handleDeleteShift(scope.row.id);
										},
									  })
								}"
								>
									<div class="text-danger">Удалить</div>
								</el-dropdown-item>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column width="120" prop="active" label="Статус смены">
					<template #default="scope">
						<el-tag v-if="scope.row.active" type="success" effect="plain">
							Активна
						</el-tag>
						<el-tag v-else type="danger" effect="plain">Неактивна</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog v-model="isOpendialog" align-center width="40%">
				<template #title>
					<h2>Участники</h2>
				</template>
				<div class="pb-2 flex flex-col gap-2">
					<div
						v-for="user in usersForDialod"
						class="user flex p-3 gap-2 items-center border-b-[2px] border-dashed border-b-slate-300"
					>
						<el-avatar
							:key="user.id"
							size="30"
							class="dialog-avatar"
							:src="
								user?.avatar
									? setUrl(user?.avatar)
									: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
							"
						/>
						<div>
							<div>{{ user.first_name }} {{ user.last_name }}</div>
							<div class="text-[12px] text-slate-400">
								{{ user.roles == 2 ? "Официант" : "Повар" }}
							</div>
						</div>
					</div>
				</div>
			</el-dialog>
			<el-drawer v-model="createDrawer" title="Создание категории">
				<template #default>
					<el-form label-position="top">
						<el-form-item
							v-for="(field, idx) in formCreateShift?.form"
							:key="idx"
							class="w-[100%]"
							:label="field.placeholder"
						>
							<el-select
								v-if="field.type == 'select'"
								v-model="field.value"
								:disabled="!field.canEdit"
								size="large"
								class="w-full"
							>
								<el-option
									v-for="item in field.possibleValues"
									:key="item.id"
									:label="item.value"
									:value="item.id"
									:placeholder="field.placeholder"
								/>
							</el-select>
							<el-date-picker
								v-else-if="field.type == 'datetime'"
								v-model="field.value"
								:placeholder="field.placeholder"
								type="datetime"
								size="large"
								class="w-full"
								clearable
								teleported
							/>
							<el-input
								v-else
								v-model="field.value"
								:type="field.type"
								clearable
								:disabled="!field.canEdit"
								:placeholder="field.placeholder"
								size="large"
							/>
						</el-form-item>
					</el-form>
				</template>
				<template #footer>
					<el-button class="self-end" type="primary" @click="handleCreateShift">
						Создать
					</el-button>
					<el-button class="self-end" type="danger" @click="createDrawer = false">
						Отмена
					</el-button>
				</template>
			</el-drawer>
			<el-drawer v-model="editDrawer" title="Создание категории">
				<template #default>
					<el-form label-position="top">
						<el-form-item
							v-for="(field, idx) in formEditShift?.form"
							:key="idx"
							class="w-[100%]"
							:label="field.placeholder"
						>
							<el-select
								v-if="field.type == 'select'"
								v-model="field.value"
								:disabled="!field.canEdit"
								size="large"
								class="w-full"
							>
								<el-option
									v-for="item in field.possibleValues"
									:key="item.id"
									:label="item.value"
									:value="item.id"
									:placeholder="field.placeholder"
								/>
							</el-select>
							<el-date-picker
								v-else-if="field.type == 'datetime'"
								v-model="field.value"
								:placeholder="field.placeholder"
								type="datetime"
								size="large"
								class="w-full"
								clearable
								teleported
							/>
							<el-input
								v-else
								v-model="field.value"
								:type="field.type"
								clearable
								:disabled="!field.canEdit"
								:placeholder="field.placeholder"
								size="large"
							/>
						</el-form-item>
					</el-form>
				</template>
				<template #footer>
					<el-button class="self-end" type="primary" @click="handleUpdateShift(editId)">
						Сохранить
					</el-button>
					<el-button class="self-end" type="danger" @click="editDrawer = false">
						Отмена
					</el-button>
				</template>
			</el-drawer>
		</el-skeleton>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-avatar) {
	margin-left: -20px;
}

:deep(.el-avatar.dialog-avatar) {
	margin-left: 0px;
}

:deep(.el-avatar.more) {
	background-color: rgb(17, 24, 39);
}
:deep(.el-dialog__body) {
	padding-top: 1rem;
}

:deep(.el-table *) {
	word-break: break-word;
}
:deep(.el-input.el-date-editor--datetime) {
	width: 100%;
}

.user:last-child {
	border: none;
}
</style>