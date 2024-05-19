<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue";

import { getOrdersAndCosts } from "@/api/apexcharts";
import { getServerError } from "@/shared/getServerError";

const isInitLoading = ref(false);
const dataOrdersAndCosts = ref([]);
const costs = computed(() => dataOrdersAndCosts.value?.costs ?? []);
const countOrders = computed(() => dataOrdersAndCosts.value?.countOrders ?? []);
const daysOfWeekIncome = computed(() => dataOrdersAndCosts.value?.daysOfWeekCost ?? []);
const daysOfWeekOrders = computed(() => dataOrdersAndCosts.value?.daysOfWeekCountOrders ?? []);
const periodOrders = ref(getPeriod(7, true));
const periodIncome = ref(getPeriod(7, true));

const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerLg = breakpoints.smallerOrEqual("lg");
const smallerMd = breakpoints.smallerOrEqual("md");
const smallerXs = breakpoints.smallerOrEqual("sm");
const seriesCountOrders = reactive([
	{
		name: "Количество заказов за день",
		data: countOrders,
	},
]);

const responsiveChartWidth = computed(() => {
	return !smallerLg.value
		? "1000px"
		: !smallerMd.value
		? "500px"
		: !smallerXs.value
		? "500px"
		: "300px";
});

const responsiveElGroup = computed(() =>
	!smallerLg.value ? "large" : !smallerMd.value ? "default" : "small",
);

function getShortsDaysOfWeek(arrayDaysOfWeeks) {
	return arrayDaysOfWeeks.value.map((day) => {
		switch (day) {
			case "Воскресенье":
				return "Вс";
			case "Понедельник":
				return "Пн";
			case "Вторник":
				return "Вт";
			case "Среда":
				return "Ср";
			case "Четверг":
				return "Чт";
			case "Пятница":
				return "Пт";
			case "Суббота":
				return "Сб";
			default:
				return "Ошибка";
		}
	});
}

const shortsDaysOfWeekIncome = computed(() =>
	dataOrdersAndCosts.value?.countOrdersDate
		? daysOfWeekIncome.value
		: getShortsDaysOfWeek(daysOfWeekIncome),
);
const shortsDaysOfWeekOrders = computed(() =>
	dataOrdersAndCosts.value?.countIncomeDate
		? daysOfWeekOrders.value
		: getShortsDaysOfWeek(daysOfWeekOrders),
);

const seriesCosts = reactive([
	{
		name: "Доход за день",
		data: costs,
	},
]);
let options = reactive({
	chart: {
		height: 400,
		width: "80%",
		type: "area",
		style: {
			backgroundColor: "#000",
		},
	},
	responsive: [
		{
			breakpoint: 1268,
			options: {
				xaxis: {
					categories: shortsDaysOfWeekIncome,
				},
			},
		},
		{
			breakpoint: 768,
			chart: {
				height: 150,
				width: "80%",
				type: "bar",
			},
			options: {
				xaxis: {
					categories: shortsDaysOfWeekIncome,
				},
			},
		},
	],
	plotOptions: {
		bar: {
			borderRadius: 10,
			dataLabels: {
				position: "top", // top, center, bottom
			},
		},
	},
	dataLabels: {
		enabled: false,
		formatter: function (val) {
			return val + "шт";
		},
		offsetY: -20,
		style: {
			fontSize: "10px",
			colors: ["#304758"],
		},
	},

	xaxis: {
		categories: daysOfWeekIncome,
		position: "top",
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		crosshairs: {
			fill: {
				type: "gradient",
				gradient: {
					colorFrom: "#D8E3F0",
					colorTo: "#BED1E6",
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5,
				},
			},
		},
		tooltip: {
			enabled: true,
		},
	},
	yaxis: {
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		labels: {
			show: true,
			formatter: function (val) {
				return val.toFixed(0) + "шт";
			},
		},
	},
	title: {
		text: "Количество заказов в день за последние 7 дней",
		floating: false,
		offsetY: 415,
		align: "center",
		style: {
			color: "#444",
		},
	},
});

let optionsOrders = reactive({
	chart: {
		height: 350,
		width: "80%",
		type: "area",
	},
	responsive: [
		{
			breakpoint: 1268,
			options: {
				xaxis: {
					categories: shortsDaysOfWeekOrders,
				},
			},
		},
	],
	plotOptions: {
		bar: {
			borderRadius: 10,
			dataLabels: {
				position: "top", // top, center, bottom
			},
		},
	},
	dataLabels: {
		enabled: false,
		formatter: function (val) {
			return val + "₽";
		},
		offsetY: -20,
		style: {
			fontSize: "12px",
			colors: ["#304758"],
		},
	},

	xaxis: {
		categories: daysOfWeekOrders,
		position: "top",
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		crosshairs: {
			fill: {
				type: "gradient",
				gradient: {
					colorFrom: "#D8E3F0",
					colorTo: "#BED1E6",
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5,
				},
			},
		},
		tooltip: {
			enabled: true,
		},
	},
	yaxis: {
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
		labels: {
			show: true,
			formatter: function (val) {
				return val.toFixed(2) + "₽";
			},
		},
	},
	title: {
		text: "Доход в день за последние 7 дней",
		floating: false,
		offsetY: 415,
		align: "center",
		style: {
			color: "#444",
			fontWeight: 900,
		},
	},
});

async function hadnleGetOrdersAndCosts(periodOrders, periodIncome) {
	isInitLoading.value = false;
	try {
		dataOrdersAndCosts.value = (
			await getOrdersAndCosts({ periodOrders: periodOrders, periodIncome: periodIncome })
		).data.data;
		isInitLoading.value = true;
	} catch (e) {
		// ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

function getPeriod(value, revert) {
	if (!revert) {
		switch (value) {
			case "Последнии 7 дней":
				return 7;
			case "За 30 дней":
				return 30;
			case "за 90 дней":
				return 90;
			default:
				return 7;
		}
	} else {
		switch (value) {
			case 7:
				return "Последнии 7 дней";
			case 30:
				return "За 30 дней";
			case 90:
				return "за 90 дней";
			default:
				return "Последнии 7 дней";
		}
	}
}

hadnleGetOrdersAndCosts(getPeriod(periodOrders.value), getPeriod(periodIncome.value));
</script>

<template>
	<el-skeleton animated :loading="!isInitLoading">
		<div class="flex justify-center">
			<div class="flex flex-col gap-4">
				<el-radio-group
					v-model="periodOrders"
					:size="responsiveElGroup"
					@change="
						(value) => {
							hadnleGetOrdersAndCosts(getPeriod(value), getPeriod(periodIncome));
						}
					"
				>
					<el-radio-button :label="getPeriod(7, true)" />
					<el-radio-button :label="getPeriod(30, true)" />
					<el-radio-button :label="getPeriod(90, true)" />
				</el-radio-group>
				<apexchart
					class="mx-auto"
					:width="responsiveChartWidth"
					:options="options"
					:series="seriesCountOrders"
				></apexchart>
				<el-radio-group
					v-model="periodIncome"
					:size="responsiveElGroup"
					@change="
						(value) => {
							hadnleGetOrdersAndCosts(getPeriod(periodOrders), getPeriod(value));
						}
					"
				>
					<el-radio-button :label="getPeriod(7, true)" />
					<el-radio-button :label="getPeriod(30, true)" />
					<el-radio-button :label="getPeriod(90, true)" />
				</el-radio-group>
				<apexchart
					class="mx-auto"
					:width="responsiveChartWidth"
					:options="optionsOrders"
					:series="seriesCosts"
				></apexchart>
			</div>
		</div>
	</el-skeleton>
</template>

<style scoped lang="scss">
.vue-apexcharts {
	border: 1px solid #dcdfe6;
	padding: 1rem;
	border-radius: 10px;
}
</style>