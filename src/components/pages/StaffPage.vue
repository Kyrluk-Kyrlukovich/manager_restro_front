<script setup lang="ts">
import { Plus, WarningFilled } from "@element-plus/icons-vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";

import { dismiss, getFormCreateUser, getStaff, rehire, signup } from "@/api/StaffPage";
import { appRoutes } from "@/navigation/routes";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { FieldT, formFieldT } from "@/types";

const router = useRouter();

const data = ref([]);
const formCreateUser = ref<FieldT[]>();
const page = usePageStore();
const isLoading = ref(true);
const drawer = ref(false);
const dialogVisible = ref(false);
const userIdForDismiss = ref(null);
const dialogDismissVisible = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerLg = breakpoints.smallerOrEqual("md");

function handleOpenDrawer() {
	handleGetFromCreateUser();
	drawer.value = true;
}

function cancel() {
	dialogVisible.value = true;
}

async function handleRehireUser(id) {
	try {
		await rehire(id);
		await handleGetStaff();
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}
async function handleDismissUser() {
	try {
		await dismiss(userIdForDismiss.value);
		await handleGetStaff();
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleSignupUser() {
	try {
		const dto = {};
		formCreateUser.value?.forEach((field) => {
			dto[field.code] = field.value;
		});
		await signup(dto);
		await handleGetStaff();
		drawer.value = false;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFromCreateUser() {
	try {
		const response = (await getFormCreateUser()).data.data;
		formCreateUser.value = response.form;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetStaff() {
	try {
		const response = (await getStaff()).data.data;
		data.value = response;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

handleGetStaff();
page.setTitlePage("Сотрудники");
</script>

<template>
	<el-skeleton animated :loading="isLoading">
		<div class="flex flex-col w-full gap-4">
			<el-button
				v-if="data.canCreateUser"
				class="self-end mt-3"
				type="primary"
				:size="smallerLg ? 'small' : 'default'"
				@click="handleOpenDrawer"
			>
				Создать сотрудника
			</el-button>
			<el-table
				:data="data.users"
				height="550"
				@row-click="(item) => router.push(appRoutes.SETTINGS_PAGE.getPath(item.id))"
			>
				<el-table-column prop="name" label="Имя" fixed min-width="250">
					<template #default="scope">
						<div class="flex gap-2 items-center">
							<el-avatar
								size="30"
								:src="
									scope.row?.avatar
										? setUrl(scope.row?.avatar)
										: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
								"
							/>
							<div>{{ scope.row.name }}</div>
							<el-tooltip
								v-if="scope.row.status == 'dismissed'"
								content="Сотрудник уволен, профиль является неактивным"
							>
								<el-icon color="#901010">
									<WarningFilled />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="email" label="Email" min-width="100" />
				<el-table-column prop="role_name" label="Должность" min-width="100" />
				<el-table-column
					v-if="data.canDismiss"
					fixed="right"
					prop="status"
					label="Действия"
					min-width="100"
				>
					<template #default="scope">
						<el-button
							v-if="scope.row.status == 'work'"
							type="danger"
							@click.stop="
								() => {
									userIdForDismiss = scope.row.id;
									dialogDismissVisible = true;
								}
							"
						>
							Уволить
						</el-button>
						<el-button v-else type="info" @click.stop="handleRehireUser(scope.row.id)">
							Ренайм
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-drawer v-model="drawer" title="Создание сотрдуника">
				<template #default>
					<el-form label-position="top">
						<el-form-item
							v-for="(field, idx) in formCreateUser"
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
					<el-button class="self-end" type="primary" @click="handleSignupUser">
						Создать
					</el-button>
					<el-button class="self-end" type="danger" @click="cancel">Отмена</el-button>
				</template>
			</el-drawer>
			<el-dialog v-model="dialogDismissVisible" width="30%" title="Подтверждение">
				<span>
					Вы уверены что хотите уволить сотрдуника? Он останется доступен для ренайма
				</span>
				<template #footer>
					<span class="dialog-footer">
						<el-button
							@click="
								() => {
									dialogDismissVisible = false;
									userIdForDismiss = null;
								}
							"
						>
							Отмена
						</el-button>
						<el-button
							type="danger"
							@click.stop="
								() => {
									dialogDismissVisible = false;
									handleDismissUser();
								}
							"
						>
							Уволить
						</el-button>
					</span>
				</template>
			</el-dialog>
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
									drawer = false;
								}
							"
						>
							Уйти
						</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</el-skeleton>
</template>

<style scoped lang="scss">

</style>