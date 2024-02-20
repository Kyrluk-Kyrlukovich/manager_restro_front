<script setup lang="ts">
import { MoreFilled, PictureFilled, Upload, WarningFilled } from "@element-plus/icons-vue";
import { ElMessage, UploadProps } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";

import {
	createDish,
	deleteDish,
	deleteImageDish,
	editDish,
	getDishes,
	setImageDish,
} from "@/api/menuSetting";
import { getFormCreateDishes, getFormEditDishes } from "@/api/menuSetting";
import { appRoutes } from "@/navigation/routes";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { formFieldT } from "@/types";

const page = usePageStore();
const data = ref();
const editDishId = ref();
const deleteDishId = ref();
const formEditDish = ref<formFieldT>();
const formCreateDish = ref<formFieldT>();

const router = useRouter();

const drawerFormEditDish = ref(false);
const drawerFormCreatetDish = ref(false);
const dialogVisible = ref(false);
const deleteDialog = ref(false);

const isInitLoading = ref(true);
const isLoading = ref(false);

async function handleClickTab(tab) {
	isLoading.value = true;
	try {
		data.value = (await getDishes({ tab: tab.props.name })).data.data;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleEditDish() {
	isLoading.value = true;
	try {
		const dto = {};
		formEditDish.value?.form?.forEach((field) => {
			if (field.type !== "upload") dto[field.code] = field.value;
		});
		await editDish(editDishId.value, dto);
		await handleGetDishes({ tab: data.value.tabs.active });
		isLoading.value = false;
		drawerFormEditDish.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleCreateDish() {
	isLoading.value = true;
	try {
		const dto = {};
		formCreateDish.value?.form?.forEach((field) => {
			if (field.type !== "upload") dto[field.code] = field.value;
		});
		await createDish(dto);
		await handleGetDishes({ tab: data.value.tabs.active });
		isLoading.value = false;
		drawerFormCreatetDish.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleDeleteDish() {
	isLoading.value = true;
	try {
		await deleteDish(deleteDishId.value);
		await handleGetDishes({ tab: data.value.tabs.active });
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFormEditDish(id) {
	isLoading.value = true;
	try {
		editDishId.value = id;
		formEditDish.value = (await getFormEditDishes(id)).data.data;
		isLoading.value = false;
		drawerFormEditDish.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFormCreateDish() {
	isLoading.value = true;
	try {
		formCreateDish.value = (await getFormCreateDishes()).data.data;
		isLoading.value = false;
		drawerFormCreatetDish.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetDishes(tab) {
	isInitLoading.value = true;
	try {
		data.value = (await getDishes(tab)).data.data;
		isInitLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleSetImageDish(file) {
	isLoading.value = true;
	try {
		const dto = new FormData();
		dto.append("image", file.file);
		await setImageDish(editDishId.value, dto);
		isLoading.value = false;
		ElMessage.success("Фото успешно добавлено");
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleDeleteImageDish(file) {
	isLoading.value = true;
	try {
		await deleteImageDish(file.id);
		isLoading.value = false;
		ElMessage.success("Фото успешно удалено");
		return true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
		return false;
	} finally {
		isLoading.value = false;
	}
}

handleGetDishes();
page.setTitlePage("Меню");
</script>

<template>
	<div v-loading="isInitLoading" class="mt-8">
		<el-skeleton animated :loading="isInitLoading">
			<el-tabs v-model="data.tabs.active" class="mt-6" @tab-click="handleClickTab">
				<el-tab-pane
					v-for="tab in data?.tabs?.items"
					:key="tab.id"
					:label="tab.name"
					:name="tab.id"
				>
					{{ tab.name }}
				</el-tab-pane>
			</el-tabs>
			<div class="p-4 w-full flex justify-end">
				<el-button type="primary" size="large" @click="handleGetFormCreateDish">
					Добавить товар
				</el-button>
			</div>
			<div class="flex flex-wrap gap-4 w-full justify-center">
				<el-skeleton animated :loading="isLoading">
					<el-card v-for="dish in data.dishes" :key="dish.id" class="w-[450px]">
						<div v-if="data.actions" class="flex w-full justify-end">
							<el-dropdown trigger="click">
								<div class="btn btn-light">
									<el-icon color="#808080">
										<MoreFilled />
									</el-icon>
								</div>
								<template #dropdown>
									<el-dropdown-item @click="handleGetFormEditDish(dish.id)">
										Редактировать
									</el-dropdown-item>
									<el-dropdown-item
										@click="
											() => {
												deleteDishId = dish.id;
												deleteDialog = true;
											}
										"
									>
										<div class="text-danger">Удалить</div>
									</el-dropdown-item>
								</template>
							</el-dropdown>
						</div>
						<el-carousel
							v-if="dish?.images.length"
							height="200px"
							class="w-full"
							:autoplay="false"
						>
							<el-carousel-item v-for="item in dish?.images" :key="item">
								<div class="flex justify-center items-center">
									<img
										class="rounded-[10px]"
										:src="setUrl(item?.photo)"
										height="200"
										width="200"
									/>
								</div>
							</el-carousel-item>
						</el-carousel>
						<div v-else class="flex justify-center items-center h-[200px]">
							<img
								src="../../assets/icons/blank_file.png"
								height="200px"
								width="150"
							/>
						</div>

						<div style="padding: 14px" class="flex flex-col gap-3">
							<div class="flex gap-3 items-center">
								<h3>{{ dish.name }}</h3>
								<el-tag>
									{{ dish.category }}
								</el-tag>
							</div>
							<div class="text-muted">
								{{
									dish.description.length > 150
										? dish.description.slice(0, 147) + "..."
										: dish.description
								}}
							</div>
							<div class="flex mt-auto justify-start">
								<el-tag type="success" size="large" class="mt-2">
									Цена: {{ dish.cost }}₽
								</el-tag>
							</div>
							<div class="flex w-full">
								<el-button
									class="w-full"
									type="primary"
									@click="router.push(appRoutes.DISH_PAGE.getPath(dish.id))"
								>
									Просмотр
								</el-button>
							</div>
						</div>
					</el-card>
				</el-skeleton>
			</div>
		</el-skeleton>

		<el-drawer v-model="drawerFormEditDish" title="Редактирование блюда">
			<template #default>
				<el-form label-position="top">
					<el-form-item
						v-for="(field, idx) in formEditDish?.form"
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
						<el-upload
							v-else-if="field.type == 'upload'"
							v-model:file-list="field.value"
							:http-request="handleSetImageDish"
							:on-remove="handleDeleteImageDish"
						>
							<el-button type="primary">Загрузить картинку</el-button>
						</el-upload>
						<el-input
							v-else
							v-model="field.value"
							maxlength="255"
							:show-word-limit="field.type == 'textarea' ? true : false"
							:autosize="{ minRows: 4, maxRows: 4 }"
							resize="none"
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
				<el-button class="self-end" type="primary" @click="handleEditDish">
					Сохранить
				</el-button>
				<el-button class="self-end" type="danger" @click="dialogVisible = true">
					Отмена
				</el-button>
			</template>
		</el-drawer>

		<el-drawer v-model="drawerFormCreatetDish" title="Создание блюда">
			<template #default>
				<el-form label-position="top">
					<el-form-item
						v-for="(field, idx) in formCreateDish?.form"
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
						<el-upload
							v-else-if="field.type == 'upload'"
							v-model:file-list="field.value"
							:http-request="handleSetImageDish"
							:on-remove="handleDeleteImageDish"
						>
							<el-button type="primary">Click to upload</el-button>
						</el-upload>
						<el-input
							v-else
							v-model="field.value"
							maxlength="255"
							:show-word-limit="field.type == 'textarea' ? true : false"
							:autosize="{ minRows: 4, maxRows: 4 }"
							resize="none"
							:type="field.type"
							clearable
							:disabled="!field.canEdit"
							:placeholder="field.placeholder"
							size="large"
						/>
					</el-form-item>
				</el-form>
				<div class="gap-1">
					<el-icon color="#901010">
						<WarningFilled />
					</el-icon>
					Фотогорафию можно будет загрузить после создания блюда
				</div>
			</template>
			<template #footer>
				<el-button class="self-end" type="primary" @click="handleCreateDish">
					Сохранить
				</el-button>
				<el-button class="self-end" type="danger" @click="dialogVisible = true">
					Отмена
				</el-button>
			</template>
		</el-drawer>

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
								drawerFormEditDish = false;
								drawerFormCreatetDish = false;
							}
						"
					>
						Уйти
					</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog v-model="deleteDialog" width="30%" title="Подтверждение">
			<span>Вы уверены что хотите удалить?</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="deleteDialog = false">Отмена</el-button>
					<el-button
						type="danger"
						@click="
							() => {
								handleDeleteDish();
								deleteDialog = false;
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
:deep(.el-upload-list__item) {
	width: 80% !important;
}

:deep(.el-card__body) {
	display: flex;
	flex-direction: column;
	height: 100% !important;
}
</style>