<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getDish } from "@/api/DishSettings";
import {
	deleteDish,
	deleteImageDish,
	editDish,
	getFormEditDishes,
	setImageDish,
} from "@/api/menuSetting";
import { appRoutes } from "@/navigation/routes";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { formFieldT } from "@/types";

const route = useRoute();
const router = useRouter();
const dishId = ref(route.params.id);

const isInitLoading = ref(true);
const isLoading = ref(false);
const drawerFormEditDish = ref(false);
const dialogVisible = ref(false);

const data = ref();
const formEditDish = ref<formFieldT>();

const deleteDialog = ref(false);

async function handleDeleteDish(id) {
	isInitLoading.value = true;
	try {
		await deleteDish(id);
		isInitLoading.value = false;
		router.push(appRoutes.MENU_PAGE.getPath());
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleGetDish(id) {
	try {
		data.value = (await getDish(id)).data.data;
		isInitLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleGetFormEditDish(id) {
	isLoading.value = true;
	try {
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

async function handleSetImageDish(file) {
	isLoading.value = true;
	try {
		const dto = new FormData();
		dto.append("image", file.file);
		await setImageDish(dishId.value, dto);
		await getDish(dishId.value);
		isLoading.value = false;
		ElMessage.success("Фото успешно добавлено");
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
		await editDish(dishId.value, dto);
		await handleGetDish(dishId.value);
		isLoading.value = false;
		drawerFormEditDish.value = false;
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
		await getDish(dishId.value);
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

handleGetDish(dishId.value);
</script>

<template>
	<div class="flex flex-col gap-6 mt-5">
		<el-skeleton animated :loading="isInitLoading || isLoading">
			<el-carousel
				v-if="data.dish.images?.length"
				:autoplay="false"
				type="card"
				height="300px"
			>
				<el-carousel-item v-for="item in data.dish.images" :key="item">
					<div class="flex justify-center items-center">
						<img
							class="rounded-[10px]"
							:src="setUrl(item.url)"
							height="300"
							width="400"
						/>
					</div>
				</el-carousel-item>
			</el-carousel>
			<div v-else class="flex justify-center items-center h-[200px]">
				<img src="../../assets/icons/blank_file.png" height="200px" width="150" />
			</div>
			<div class="flex gap-2">
				<div>Описание:</div>
				<div>{{ data.dish.description }}</div>
			</div>
			<div class="flex gap-2">
				<div>Категория:</div>
				<el-tag>
					{{ data.dish.category }}
				</el-tag>
			</div>
			<div class="flex gap-2">
				<div>Цена:</div>
				<el-tag>
					{{ data.dish.cost }}
				</el-tag>
			</div>
			<div class="flex gap-2">
				<el-button class="w-[130px]" type="primary" @click="handleGetFormEditDish(dishId)">
					Редактировать
				</el-button>
				<el-button class="w-[130px]" type="danger" @click="handleDeleteDish(dishId)">
					Удалить
				</el-button>
			</div>
		</el-skeleton>

		<el-drawer v-model="drawerFormEditDish" title="Создание сотрдуника">
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
								handleDeleteDish(dishId);
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

</style>