<script setup lang="ts">
import { MoreFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";

import {
	createCategoryDishes,
	deleteCategoryDishes,
	editCategoryDishes,
	getCategoriesDishes,
	getFormCreateCategoryDishes,
	getFormEditCategoryDishes,
} from "@/api/categoriesDishes";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";

const isInitLoading = ref(true);
const isLoading = ref(false);
const formDrawer = ref(false);
const createDrawer = ref(false);
const dialogVisible = ref(false);

const data = ref();
const page = usePageStore();
const formEditCategoryDish = ref();
const formCreateCategoryDish = ref();
const editId = ref();
const deleteId = ref();

async function handleGetCategoriesDishes() {
	try {
		data.value = (await getCategoriesDishes()).data.data;
		isInitLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = false;
	} finally {
		isInitLoading.value = false;
	}
}

async function handleGetFormEditCategoryDishes(id) {
	isLoading.value = true;
	try {
		formEditCategoryDish.value = (await getFormEditCategoryDishes(id)).data.data;
		editId.value = id;
		isLoading.value = false;
		formDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFormCreateCategoryDishes() {
	isLoading.value = true;
	try {
		formCreateCategoryDish.value = (await getFormCreateCategoryDishes()).data.data;
		isLoading.value = false;
		createDrawer.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function hadnleEditCategoryDishes() {
	isLoading.value = true;
	try {
		const dto = {};
		formEditCategoryDish.value.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		await editCategoryDishes(editId.value, dto);
		await handleGetCategoriesDishes();
		isLoading.value = false;
		formDrawer.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function hadnleCreateCategoryDishes() {
	isLoading.value = true;
	try {
		const dto = {};
		formCreateCategoryDish.value.form?.forEach((field) => {
			dto[field.code] = field.value;
		});
		await createCategoryDishes(dto);
		await handleGetCategoriesDishes();
		isLoading.value = false;
		createDrawer.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleDeleteCategoryDishes() {
	isLoading.value = true;
	try {
		await deleteCategoryDishes(deleteId.value);
		await handleGetCategoriesDishes();
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

handleGetCategoriesDishes();
page.setTitlePage("Категории блюд");
</script>

<template>
	<div>
		<el-skeleton animated :loading="isInitLoading">
			<div class="py-4 flex justify-end">
				<el-button
					v-if="data.actions"
					type="primary"
					@click="handleGetFormCreateCategoryDishes"
				>
					Создать категорию
				</el-button>
			</div>
			<el-table :data="data.categories" height="550">
				<el-table-column prop="name" label="Название"></el-table-column>
				<el-table-column
					prop="count_dishes"
					label="Количество блюд в этой категории"
				></el-table-column>
				<el-table-column v-if="data.actions" align="center" prop="actions" label="Действия">
					<template #default="scoped">
						<el-dropdown type="primary" size="small" trigger="click">
							<div class="btn btn-light">
								<el-icon color="#808080">
									<MoreFilled />
								</el-icon>
							</div>
							<template #dropdown>
								<el-dropdown-item
									@click="handleGetFormEditCategoryDishes(scoped.row.id)"
								>
									<span>Редактировать</span>
								</el-dropdown-item>
								<el-dropdown-item>
									<span
										class="text-danger"
										@click="
											() => {
												deleteId = scoped.row.id;
												dialogVisible = true;
											}
										"
									>
										Удалить
									</span>
								</el-dropdown-item>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
		</el-skeleton>
		<el-drawer v-model="formDrawer" title="Создание сотрдуника">
			<template #default>
				<el-form label-position="top">
					<el-form-item
						v-for="(field, idx) in formEditCategoryDish?.form"
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
				<el-button class="self-end" type="primary" @click="hadnleEditCategoryDishes">
					Сохранить
				</el-button>
				<el-button class="self-end" type="danger" @click="formDrawer = false">
					Отмена
				</el-button>
			</template>
		</el-drawer>

		<el-drawer v-model="createDrawer" title="Создание категории">
			<template #default>
				<el-form label-position="top">
					<el-form-item
						v-for="(field, idx) in formCreateCategoryDish?.form"
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
				<el-button class="self-end" type="primary" @click="hadnleCreateCategoryDishes">
					Создать
				</el-button>
				<el-button class="self-end" type="danger" @click="createDrawer = false">
					Отмена
				</el-button>
			</template>
		</el-drawer>

		<el-dialog v-model="dialogVisible" width="30%" title="Подтверждение">
			<span>Вы уверены что хотите удалить?</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">Отмена</el-button>
					<el-button
						type="danger"
						@click="
							() => {
								dialogVisible = false;
								handleDeleteCategoryDishes();
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