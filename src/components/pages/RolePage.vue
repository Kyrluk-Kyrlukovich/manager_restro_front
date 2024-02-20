<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { getRoots, updateRoots } from "@/api/settingsRoles";
import { getServerError } from "@/shared/getServerError";

import truncateString from "../../shared/truncateString";

const isInitLoading = ref(true);
const isUpdateLoading = ref(false);
const data = ref([]);
const route = useRoute();

function getRootName(code) {
	switch (code) {
		case "canEditUsers":
			return "Редактировать других пользователей";
		case "canEditDismissUser":
			return "Увольнение пользователей";
		case "canEditTables":
			return "Редактирование столов";
		case "canEditDish":
			return "Редактирование блюд";
		case "canEditOrders":
			return "Редактирование заказа";
		case "canStatusOrders":
			return "Редактирование статуса заказа";
		case "canResponsibleOrders":
			return "Редактирование ответственного за заказ";
		case "canChefOrders":
			return "Редактирование ответственного за приготовление заказа";
		case "canTableOrders":
			return "Редактирование стола привязанного к заказу";
		case "canNotesOrders":
			return "Редактирование примечания к заказу";
		case "canCreateShift":
			return "Создание смены";
		case "canWatchChartsCountOrders":
			return "Просмотр графика «Общее количество заказов за определенное время»";
		case "canWatchChartsIncome":
			return "Просмотр графика «Дохода за определенное время»";
		case "canWatchChartsUserOrders":
			return "Просмотр графика «Количество заказов, которое выполнил этот пользователь за определенное время»";
		case "canWatchChartsUserHours":
			return "Просмотр графика «Количество отработанных часов за определенное время»";
		case "canBeResponsibleOrder":
			return "Возможность стать ответственным за заказ";
		case "canBeChefOrder":
			return "Возможность стать ответственным за приготовление заказа";
		case "canWatchSettingsRolesTab":
			return "Просмотр настроек ролей";
		default:
			return "Значение не определено";
	}
}
async function handleGetRoles(id) {
	isInitLoading.value = false;
	try {
		data.value = (await getRoots(id)).data.data;
		data.value.roots = Object.fromEntries(
			Object.entries(data.value.roots).map(([key, value]) => {
				return [key, Boolean(value)];
			}),
		);

		isInitLoading.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

async function handleUpdateRoots(dto) {
	isUpdateLoading.value = true;
	try {
		ElMessage.success((await updateRoots(data.value.rootId, dto)).data.data);
		isUpdateLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isUpdateLoading.value = false;
	} finally {
		isUpdateLoading.value = false;
	}
}

watchEffect(() => {
	console.log(data.value.roots);
});

handleGetRoles(route.params.id);
</script>

<template>
	<el-skeleton animated :loading="!isInitLoading">
		<div v-loading="isUpdateLoading" class="flex flex-col gap-8 w-[80%]">
			<div
				v-for="(value, key) in data.roots"
				class="flex gap-2 justify-between items-center border-b-[1px] border-dashed border-slate-400 py-3"
			>
				<div class="font-medium">
					<el-tooltip :content="getRootName(key)">
						{{ truncateString(getRootName(key), 50) }}
					</el-tooltip>
				</div>
				<div>
					<el-switch
						v-model="data.roots[key]"
						size="large"
						active-text="Включено"
						inactive-text="Выключено"
						@change="handleUpdateRoots(data.roots)"
					/>
				</div>
			</div>
		</div>
	</el-skeleton>
</template>

<style scoped lang="scss">

</style>