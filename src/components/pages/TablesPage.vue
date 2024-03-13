<script setup lang="ts">
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage, TabsPaneContext } from "element-plus";
import { ref } from "vue";

import {
	createTable,
	deleteTable,
	getFormTableCreate,
	getFormTableEdit,
	getTables,
	updateTable,
} from "@/api/tablesSetting";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { FieldT, formFieldT } from "@/types";
import { useUserStore } from "@/userStore";

const data = ref();
const isLoading = ref(true);
const isInitLoading = ref(true);
const page = usePageStore();
const user = useUserStore();
const formCreateTable = ref<formFieldT>();
const formEditTable = ref<formFieldT>();
const formDrawer = ref(false);
const editDrawer = ref(false);
const isFormLoading = ref(false);
const dialogVisible = ref(false);
const dialogDeleteVisible = ref(false);
const tableIdForDelete = ref();
const tableIdForUpdate = ref();

const handleClick = (tab: TabsPaneContext, event: Event) => {
	handeGetTables(tab.props?.name);
};

async function handleUpdateStatusTable(id, status) {
	try {
		await updateTable(id, { status: status });
		await handeGetTables(data.value.tabs.active);
		isLoading.value = false;
		ElMessage.success("Статус успешно изменен");
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleUpdateServedTable(idTable, idUser, status) {
	try {
		await updateTable(idTable, { served: idUser });
		await handeGetTables(status);
		isLoading.value = false;
		idUser
			? ElMessage.success("Вы успешно взяли стол")
			: ElMessage.success("Вы успешно отказались от стола");
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleUpdateTable(idTable) {
	try {
		const dto = {};
		formEditTable.value?.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		await updateTable(idTable, dto);
		await handeGetTables(data.value.tabs.active);
		isLoading.value = false;
		ElMessage.success("Вы успешно изменили стол");
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleCreateTable() {
	isLoading.value = true;
	try {
		const dto = {};
		formCreateTable.value?.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		await createTable(dto);
		await handeGetTables(data.value.tabs.active);
		formDrawer.value = false;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFormCreateTable() {
	isFormLoading.value = true;
	try {
		formCreateTable.value = (await getFormTableCreate()).data.data;
		formDrawer.value = true;
		isFormLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}

async function handleGetFormEditTable(id) {
	isFormLoading.value = true;
	try {
		formEditTable.value = (await getFormTableEdit(id)).data.data;
		editDrawer.value = true;
		isFormLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isFormLoading.value = false;
	} finally {
		isFormLoading.value = false;
	}
}

async function handleDeleteTable() {
	isLoading.value = true;
	try {
		await deleteTable(tableIdForDelete.value);
		await handeGetTables(data.value.tabs.active);
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handeGetTables(active) {
	isLoading.value = true;
	try {
		let response;
		if (active) {
			response = (await getTables(active)).data.data;
		} else {
			response = (await getTables(null)).data.data;
		}
		data.value = response;
		isLoading.value = false;
		isInitLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

handeGetTables("view");
page.setTitlePage("Столы");
</script>

<template>
	<div v-loading="isLoading">
		<el-skeleton animated :loading="isInitLoading">
			<el-tabs v-model="data.tabs.active" class="mt-6" @tab-click="handleClick">
				<el-tab-pane
					v-for="(value, key) in data?.tabs?.items"
					:label="value"
					:name="key"
				></el-tab-pane>
			</el-tabs>
		</el-skeleton>
		<el-skeleton animated :loading="isLoading || isInitLoading">
			<div class="flex justify-end mt-2">
				<el-button
					v-if="data.actions"
					class="self-end mb-3"
					type="primary"
					@click="handleGetFormCreateTable"
				>
					Создать стол
				</el-button>
			</div>
			<el-table v-loading="isLoading" :data="data.tables" height="450">
				<el-table-column prop="number" label="Номер стола" />
				<el-table-column prop="placements" label="Количество посадочных мест" />
				<el-table-column prop="status" align="center" label="Статус" min-width="140">
					<template #default="scoped">
						<el-tag
							class="w-[120px]"
							effect="light"
							:type="
								scoped.row.status == 'emty'
									? 'success'
									: scoped.row.status == 'reserved'
									? 'warning'
									: 'info'
							"
						>
							{{ scoped.row.status_name }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					v-if="data.actions"
					min-width="150"
					prop="actions"
					label="Действия"
				>
					<template #default="scoped">
						<el-dropdown type="primary" size="small" trigger="click">
							<el-button type="primary" size="small">Изменить статус</el-button>
							<template #dropdown>
								<el-dropdown-item
									v-for="(value, key) in scoped.row.actions"
									:key="key"
									@click="
										handleUpdateStatusTable(
											scoped.row.id,
											key,
											data.tabs.active,
										)
									"
								>
									<span>{{ value }}</span>
								</el-dropdown-item>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
				<el-table-column
					prop="served"
					min-width="200"
					align="center"
					label="Кто обслуживает"
				>
					<template #default="scope">
						<div v-if="scope.row?.served">
							<div
								v-if="user.getUserId != scope.row?.served.id"
								class="flex gap-2 justify-center items-center"
							>
								<el-avatar
									size="30"
									:src="
										scope.row?.served?.avatar
											? setUrl(scope.row?.served?.avatar)
											: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
									"
								/>
								<div>{{ scope.row.served?.name }}</div>
							</div>
							<el-button
								v-else
								size="small"
								class="w-[120px]"
								type="danger"
								@click="
									handleUpdateServedTable(scope.row.id, null, data.tabs.active)
								"
							>
								Отклонить
							</el-button>
						</div>
						<div v-else-if="data.actions">
							<el-button
								type="primary"
								class="w-[120px]"
								size="small"
								@click="
									handleUpdateServedTable(
										scope.row.id,
										user.getUserId,
										data.tabs.active,
									)
								"
							>
								Обслуживать
							</el-button>
						</div>
						<div v-else>
							<el-tag type="info">Никто не обслуживает этот стол</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column v-if="data.actions" align="center" min-width="75" fixed="right">
					<template #default="scoped">
						<el-dropdown trigger="click">
							<div class="btn btn-light">
								<el-icon color="#a9a9a9">
									<MoreFilled />
								</el-icon>
							</div>
							<template #dropdown>
								<el-dropdown-item
									@click="
										() => {
											handleGetFormEditTable(scoped.row.id);
											tableIdForUpdate = scoped.row.id;
										}
									"
								>
									<div>Редактировать</div>
								</el-dropdown-item>
								<el-dropdown-item
									@click="
										() => {
											dialogDeleteVisible = true;
											tableIdForDelete = scoped.row.id;
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

			<el-drawer v-model="formDrawer" title="Создание сотрдуника">
				<template #default>
					<el-form label-position="top">
						<el-form-item
							v-for="(field, idx) in formCreateTable?.form"
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
					<el-button class="self-end" type="primary" @click="handleCreateTable">
						Создать
					</el-button>
					<el-button class="self-end" type="danger" @click="dialogVisible = true">
						Отмена
					</el-button>
				</template>
			</el-drawer>
			<el-drawer v-model="editDrawer" title="Редактирование сотрдуника">
				<template #default>
					<el-form label-position="top">
						<el-form-item
							v-for="(field, idx) in formEditTable?.form"
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
					<el-button
						class="self-end"
						type="primary"
						@click="handleUpdateTable(tableIdForUpdate)"
					>
						Изменить
					</el-button>
					<el-button class="self-end" type="danger" @click="editDrawer = false">
						Отмена
					</el-button>
				</template>
			</el-drawer>
		</el-skeleton>
		<el-dialog v-model="dialogVisible" width="30%" title="Подтверждение">
			<span>Все данные будут потеряны. Вы уверены что хотите уйти?</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">Отмена</el-button>
					<el-button
						type="danger"
						@click="
							() => {
								dialogVisible = false;
								formDrawer = false;
							}
						"
					>
						Уйти
					</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="dialogDeleteVisible" width="30%" title="Подтверждение">
			<span>Вы уверены что хотите удалить стол</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogDeleteVisible = false">Отмена</el-button>
					<el-button
						type="danger"
						@click="
							() => {
								dialogDeleteVisible = false;
								handleDeleteTable();
							}
						"
					>
						Удалить
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">

</style>