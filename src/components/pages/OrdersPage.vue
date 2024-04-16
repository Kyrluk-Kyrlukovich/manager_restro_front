<script setup lang="ts">
import dayjs from "dayjs";
import { ElMessage, TabsPaneContext } from "element-plus";
import { debounce, slice } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
	createOrder,
	getFormCreateOrder,
	getFormEditOrder,
	getOrderDishes,
	getOrders,
	updateOrder,
	updateStatus,
} from "@/api/ordersSetting";
import { appRoutes } from "@/navigation/routes";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";

const isInitLoading = ref(true);
const isLoading = ref(false);
const editId = ref();
const router = useRouter();
const route = useRoute();
const isEditDrawer = ref(false);
const isCreateDrawer = ref(false);
const isDialogDishes = ref(false);
const dishes = ref();

const formEditOrder = ref();
const formCreateOrder = ref();
const data = ref();
const width = ref(0);
const style = computed(() => "width: " + Number(width.value) + "px");
const aside = document.querySelector(".el-menu.el-menu--vertical");
width.value = window.innerWidth - aside?.clientWidth - 90;

function translateStatus(status) {
	switch (status) {
		case "accept":
			return "Принят";
		case "prepare":
			return "Готовится";
		case "ready":
			return "Готов к выдаче";
		case "passed":
			return "Выдан";
		default:
			return "Заказ завершен";
	}
}

function typeOfStatus(status) {
	switch (status) {
		case "accept":
			return "";
		case "prepare":
			return "warning";
		case "ready":
			return "danger";
		case "passed":
			return "success";
		default:
			return "info";
	}
}

function typeButtonOfStatus(status) {
	switch (status) {
		case "accept":
			return "";
		case "prepare":
			return "warning";
		case "ready":
			return "info";
		case "passed":
			return "success";
		default:
			return "info";
	}
}

async function handleGetOrders(tab: TabsPaneContext) {
	try {
		data.value = (await getOrders(tab?.props?.name)).data.data;
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

async function handleGetFormEditOrder(id: string | number) {
	isLoading.value = true;
	try {
		formEditOrder.value = (await getFormEditOrder(id)).data.data;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetFormCreateOrder() {
	isLoading.value = true;
	try {
		formCreateOrder.value = (await getFormCreateOrder()).data.data;
		isLoading.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleUpdateOrder(id: string | number) {
	isLoading.value = true;
	try {
		const dto = {};
		formEditOrder.value?.form?.forEach((field) => {
			if (field.code == "dishes") {
				dto[field.code] = [];
				field.value.forEach((el) => {
					dto[field.code].push({ dish_id: el.dish.value, count: el.count.value });
				});
			} else {
				dto[field.code] = field.value;
			}
		});
		console.log(route.fullPath);
		await updateOrder(id, dto);
		await handleGetOrders();
		isEditDrawer.value = true;
		console.log(id, dto);
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleCreateOrder() {
	try {
		const dto = {};
		formCreateOrder.value?.form?.forEach((field) => {
			if (field.code == "dishes") {
				dto[field.code] = [];
				field.value.forEach((el) => {
					dto[field.code].push({ dish_id: el.dish.value, count: el.count.value });
				});
			} else {
				dto[field.code] = field.value;
			}
		});
		await createOrder(dto);
		await handleGetOrders();
		isCreateDrawer.value = false;
		ElMessage.success("Заказ успешно создан");
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleUpdateStatus(id: string | number, status: string) {
	isLoading.value = true;
	try {
		await updateStatus(id, status);
		await handleGetOrders(data.value.tabs.active);
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleGetOrderDishes(id: string | number) {
	isLoading.value = true;
	try {
		dishes.value = (await getOrderDishes(id)).data.data;
		isLoading.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

handleGetOrders();

const debounceResize = debounce((target) => {
	let aside = document.querySelector(".el-menu.el-menu--vertical");
	let table = document.querySelector(".el-descriptions__body");
	width.value = target.innerWidth - aside?.clientWidth - 90;
}, 500);

window.addEventListener("resize", function (event) {
	debounceResize(event.target);
});
</script>

<template>
	<div>
		<el-skeleton animated :loading="isInitLoading">
			<div class="mt-6 flex flex-col flex-wrap justify-center gap-2">
				<div class="w-full">
					<el-skeleton animated :loading="isInitLoading">
						<el-tabs
							v-model="data.tabs.active"
							class="mt-6"
							@tab-click="handleGetOrders"
						>
							<el-tab-pane
								v-for="(value, key) in data?.tabs?.items"
								:label="value"
								:name="key"
							></el-tab-pane>
						</el-tabs>
					</el-skeleton>
				</div>
				<div class="self-end">
					<el-button
						type="primary"
						@click="
							() => {
								handleGetFormCreateOrder();
								isCreateDrawer = true;
							}
						"
					>
						Создать заказ
					</el-button>
				</div>
				<el-skeleton animated :loading="isInitLoading">
					<el-card v-for="order in data.orders" :id="order.id" :key="order.id">
						<div class="w-full flex flex-col gap-1">
							<h2>Заказ №{{ order.id }}</h2>
							<el-scrollbar>
								<div class="flex overflow-auto" :style="style">
									<el-descriptions
										class="description-block"
										direction="vertical"
										:column="6"
										border
									>
										<el-descriptions-item label="Статус">
											<el-tag
												class="border-amber-700"
												effect="plain"
												:type="typeOfStatus(order.status)"
											>
												{{ translateStatus(order.status) }}
											</el-tag>
										</el-descriptions-item>
										<el-descriptions-item label="Ответственный за заказ">
											<div class="text-[14px]">
												<RouterLink
													:to="
														appRoutes.SETTINGS_PAGE.getPath(
															order.responsible?.id,
														)
													"
												>
													<el-tooltip content="Перейти к пользователю">
														<div class="flex items-center gap-2">
															<el-avatar
																:size="30"
																:src="
																	order.responsible?.avatar
																		? setUrl(
																				order.responsible
																					.avatar,
																		  )
																		: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
																"
															/>
															<div class="text-[14px]">
																{{ order.responsible.name }}
															</div>
														</div>
													</el-tooltip>
												</RouterLink>
											</div>
										</el-descriptions-item>
										<el-descriptions-item
											label="Ответственный за приготовление"
										>
											<div class="text-[14px]">
												<RouterLink
													:to="
														appRoutes.SETTINGS_PAGE.getPath(
															order.chef?.id,
														)
													"
												>
													<el-tooltip content="Перейти к пользователю">
														<div class="flex items-center gap-2">
															<el-avatar
																:size="30"
																:src="
																	order.chef?.avatar
																		? setUrl(order.chef.avatar)
																		: 'http://localhost:5173/src/assets/icons/avatar_blank.png'
																"
															/>
															<div class="text-[14px]">
																{{ order.chef.name }}
															</div>
														</div>
													</el-tooltip>
												</RouterLink>
											</div>
										</el-descriptions-item>
										<el-descriptions-item label="Примечание к заказу">
											<span>{{ order.notes }}</span>
										</el-descriptions-item>
										<el-descriptions-item label="Дата создания">
											<span>
												{{
													dayjs(order.created).format("HH:mm DD.MM.YYYY")
												}}
											</span>
										</el-descriptions-item>
										<el-descriptions-item label="Стол">
											<el-tag type="info">№{{ order.table }}</el-tag>
										</el-descriptions-item>
									</el-descriptions>
								</div>
							</el-scrollbar>
							<div class="py-2 w-fit btns">
								<el-button
									type="info"
									@click="
										() => {
											handleGetOrderDishes(order.id);
											isDialogDishes = true;
										}
									"
								>
									Позиции заказа
								</el-button>
								<el-button
									type="primary"
									@click="
										() => {
											handleGetFormEditOrder(order.id);
											editId = order.id;
											isEditDrawer = true;
										}
									"
								>
									Редактировать
								</el-button>
								<el-button
									v-if="order.canChangeStatus"
									:text="order.changeStatus === 'finish' ? true : false"
									:disabled="order.changeStatus === 'finish' ? true : false"
									:color="order.changeStatus === 'ready' ? '#008080' : ''"
									:type="typeOfStatus(order.changeStatus)"
									@click="handleUpdateStatus(order.id, order.changeStatus)"
								>
									{{ translateStatus(order.changeStatus) }}
								</el-button>
							</div>
						</div>
					</el-card>
				</el-skeleton>

				<el-dialog v-model="isDialogDishes" :title="`Позиции заказа`">
					<el-table
						:data="dishes"
						@row-click="(item) => router.push(appRoutes.DISH_PAGE.getPath(item.id))"
					>
						<el-table-column prop="name" label="Название" />
						<el-table-column prop="count" label="Количество" />
						<el-table-column prop="cost" label="Цена, шт" />
					</el-table>
				</el-dialog>
				<el-drawer v-model="isEditDrawer" size="55%">
					<template #default>
						<el-form label-position="top">
							<el-form-item
								v-for="(field, idx) in formEditOrder?.form"
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
								<div v-else-if="field.type == 'form'" class="w-full">
									<div
										v-for="(dish, idx) in field.value"
										:key="idx"
										class="grid grid-cols-[3fr_1fr_1fr] mb-4 w-full gap-4 items-center"
									>
										<el-select
											v-if="dish.dish.type == 'select'"
											v-model="dish.dish.value"
											:disabled="!field.canEdit"
											size="large"
											class=""
										>
											<el-option
												v-for="item in dish.dish.possibleValues"
												:key="item.id"
												:label="item.value"
												:value="item.id"
												:placeholder="field.placeholder"
											/>
										</el-select>
										<el-input-number
											v-model="dish.count.value"
											size="default"
										/>
										<div class="flex-grow">
											Сумма:
											{{
												dish.dish.possibleValues.find((el) => {
													if (el.id == dish.dish.value) {
														return true;
													}
												})?.cost
													? dish.dish.possibleValues.find((el) => {
															if (el.id == dish.dish.value) {
																return true;
															}
													  })?.cost * dish.count.value
													: 0
											}}
										</div>
									</div>
									<div>
										<el-button
											type="primary"
											class="mt-3"
											@click="
												() => {
													field.value.push({
														dish: {
															id: null,
															code: 'id',
															type: 'select',
															value: null,
															possibleValues:
																field.value[0].dish.possibleValues,
														},
														sum: {
															id: null,
															code: 'sum',
															type: 'number',
															value: 0,
														},
														count: {
															id: null,
															code: 'count',
															type: 'number',
															value: 0,
														},
													});
												}
											"
										>
											Добавить позицию
										</el-button>
									</div>
								</div>
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
						<el-button
							class="self-end"
							type="primary"
							@click="handleUpdateOrder(editId)"
						>
							Сохранить
						</el-button>
						<el-button class="self-end" type="danger" @click="isEditDrawer = false">
							Отмена
						</el-button>
					</template>
				</el-drawer>
				<el-drawer v-model="isCreateDrawer" size="55%">
					<template #default>
						<el-form label-position="top">
							<el-form-item
								v-for="(field, idx) in formCreateOrder?.form"
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
								<div v-else-if="field.type == 'form'" class="w-full">
									<div
										v-for="(dish, idx) in field.value"
										:key="idx"
										class="grid grid-cols-[3fr_1fr_1fr] mb-4 w-full gap-4 items-center"
									>
										<el-select
											v-if="dish.dish.type == 'select'"
											v-model="dish.dish.value"
											:disabled="!field.canEdit"
											size="large"
											class=""
										>
											<el-option
												v-for="item in dish.dish.possibleValues"
												:key="item.id"
												:label="item.value"
												:value="item.id"
												:placeholder="field.placeholder"
											/>
										</el-select>
										<el-input-number
											v-model="dish.count.value"
											size="default"
										/>

										<div class="flex-grow">
											Сумма:
											{{
												dish.dish.possibleValues.find((el) => {
													if (el.id == dish.dish.value) {
														return true;
													}
												})?.cost
													? dish.dish.possibleValues.find((el) => {
															if (el.id == dish.dish.value) {
																return true;
															}
													  })?.cost * dish.count.value
													: 0
											}}
										</div>
									</div>
									<div>
										<el-button
											type="primary"
											class="mt-3"
											@click="
												() => {
													field.value.push({
														dish: {
															id: null,
															code: 'id',
															type: 'select',
															value: null,
															possibleValues:
																field.value[0].dish.possibleValues,
														},
														sum: {
															id: null,
															code: 'sum',
															type: 'number',
															value: 0,
														},
														count: {
															id: null,
															code: 'count',
															type: 'number',
															value: 0,
														},
													});
												}
											"
										>
											Добавить позицию
										</el-button>
									</div>
								</div>
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
						<el-button class="self-end" type="primary" @click="handleCreateOrder()">
							Создать
						</el-button>
						<el-button class="self-end" type="danger" @click="isCreateDrawer = false">
							Отмена
						</el-button>
					</template>
				</el-drawer>
			</div>
		</el-skeleton>
	</div>
</template>

<style scoped lang="scss">
//.description-block {
//	@media (max-width: 1120px) {
//		max-width: 500px;
//	}
//}

:deep(.el-descriptions__body) {
	overflow: auto;
}

@media (max-width: 640px) {
	.btns {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
		.el-button {
			width: 100%;
			margin: 0;
		}
	}
}
</style>