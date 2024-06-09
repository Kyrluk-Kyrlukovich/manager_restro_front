<script setup lang="ts">
import { MoreFilled, Setting } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { Action, ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";

import {
	createRole,
	deleteRole,
	getFormCreateRole,
	getFormEditRole,
	getRoles,
	updateRole,
} from "@/api/settingsRoles";
import { appRoutes } from "@/navigation/routes";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";

const isInitLoading = ref(true);
const isFormLoading = ref(true);
const formCreateRole = ref([]);
const formEditRole = ref([]);
const createDrawer = ref(false);
const editDrawer = ref(false);
const roleEditId = ref();
const roleDeleteId = ref();
const dialogVisible = ref(false);
const data = ref([]);
const router = useRouter();
const page = usePageStore();

async function handleGetRoles() {
	isInitLoading.value = false;
	try {
		data.value = (await getRoles()).data.data;
		isInitLoading.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}
async function handleGetFormCreateRole() {
	isFormLoading.value = false;
	try {
		formCreateRole.value = (await getFormCreateRole()).data.data;
		isFormLoading.value = true;
		createDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = true;
	} finally {
		isFormLoading.value = true;
	}
}

async function handleGetFormEditRole(id) {
	isFormLoading.value = false;
	try {
		formEditRole.value = (await getFormEditRole(id)).data.data;
		isFormLoading.value = true;
		editDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = true;
	} finally {
		isFormLoading.value = true;
	}
}

async function handleCreateRole() {
	isInitLoading.value = false;
	try {
		let dto = {};
		formCreateRole.value.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		let response = (await createRole(dto)).data.data;
		isInitLoading.value = true;
		ElMessage.success(response.message);
		router.push(appRoutes.ROLE_PAGE.getPath(response.rootId));
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

async function handleUpdateRole() {
	isInitLoading.value = false;
	try {
		let dto = {};
		formEditRole.value.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		let response = (await updateRole(roleEditId.value, dto)).data.data;
		isInitLoading.value = true;
		editDrawer.value = false;
		await handleGetRoles();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

async function handleDeleteRole(roleId) {
	isInitLoading.value = false;
	try {
		let response = (await deleteRole(roleId)).data.data;
		isInitLoading.value = true;
		await handleGetRoles();
		ElMessage.success(response.message);
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

handleGetRoles();
page.setTitlePage("Настройки ролей");
</script>

<template>
	<el-skeleton animated :loading="!isInitLoading">
		<div class="flex flex-col">
			<div class="py-2 mt-auto flex w-full justify-end">
				<el-button type="primary" @click="handleGetFormCreateRole">Создать смену</el-button>
			</div>
			<div class="w-[90%] mx-auto">
				<el-table :data="data.roles">
					<el-table-column prop="role" label="Название роли" />
					<el-table-column prop="action" label="Действия" align="right">
						<template #default="scope">
							<el-dropdown trigger="click">
								<div class="btn btn-light">
									<el-icon color="#a9a9a9">
										<MoreFilled />
									</el-icon>
								</div>
								<template #dropdown>
									<el-dropdown-item
										@click="
											router.push(appRoutes.ROLE_PAGE.getPath(scope.row.id))
										"
									>
										<div>Настроить права</div>
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												roleEditId = scope.row.id;
												handleGetFormEditRole(scope.row.id);
											}
										"
									>
										<div>Редактировать</div>
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												roleDeleteId = scope.row.id;
												dialogVisible = true;
											}
										"
									>
										<div class="text-danger">Удалить</div>
									</el-dropdown-item>
								</template>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" width="30%" title="Подтверждение">
			<span>Вы уверены что хотите удалить роль?</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">Отмена</el-button>
					<el-button
						type="danger"
						@click="
							() => {
								handleDeleteRole(roleDeleteId);
								dialogVisible = false;
							}
						"
					>
						Удалить
					</el-button>
				</span>
			</template>
		</el-dialog>
	</el-skeleton>
	<el-drawer v-model="createDrawer" title="Создание категории">
		<template #default>
			<el-form label-position="top">
				<el-form-item
					v-for="(field, idx) in formCreateRole?.form"
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
			<el-button class="self-end" type="primary" @click="handleCreateRole">Создать</el-button>
			<el-button class="self-end" type="danger" @click="createDrawer = false">
				Отмена
			</el-button>
		</template>
	</el-drawer>
	<el-drawer v-model="editDrawer" title="Редактирование категории">
		<template #default>
			<el-form label-position="top">
				<el-form-item
					v-for="(field, idx) in formEditRole?.form"
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
			<el-button class="self-end" type="primary" @click="handleUpdateRole">
				Сохранить
			</el-button>
			<el-button class="self-end" type="danger" @click="editDrawer = false">Отмена</el-button>
		</template>
	</el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-table__cell) {
	padding: 1rem 0;
}
</style>