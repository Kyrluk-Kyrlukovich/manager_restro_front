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
const daysOfWeek = computed(() => dataOrdersAndCosts.value?.daysOfWeek ?? []);
const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerLg = breakpoints.smallerOrEqual("lg");
const seriesCountOrders = reactive([
	{
		name: "Количество заказов за день",
		data: countOrders,
	},
]);

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

const shortsDaysOfWeek = computed(() => getShortsDaysOfWeek(daysOfWeek));

const seriesCosts = reactive([
	{
		name: "Доход за день",
		data: costs,
	},
]);
let options = reactive({
	chart: {
		height: 350,
		width: "80%",
		type: "bar",
	},
	responsive: [
		{
			breakpoint: 1268,
			options: {
				xaxis: {
					categories: shortsDaysOfWeek,
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
		enabled: true,
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
		categories: daysOfWeek,
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
				return val + "шт";
			},
		},
	},
	title: {
		text: "Количество заказов в день за последние 7 дней",
		floating: true,
		offsetY: 390,
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
		type: "bar",
	},
	responsive: [
		{
			breakpoint: 1268,
			options: {
				xaxis: {
					categories: shortsDaysOfWeek,
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
		enabled: true,
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
		categories: daysOfWeek,
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
				return val + "₽";
			},
		},
	},
	title: {
		text: "Доход в день за последние 7 дней",
		floating: false,
		offsetY: 390,
		align: "center",
		style: {
			color: "#444",
		},
	},
});

async function hadnleGetOrdersAndCosts() {
	isInitLoading.value = false;
	try {
		dataOrdersAndCosts.value = (await getOrdersAndCosts()).data.data;
		isInitLoading.value = true;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isInitLoading.value = true;
	} finally {
		isInitLoading.value = true;
	}
}

hadnleGetOrdersAndCosts();
</script>

<template>
	<el-skeleton animated :loading="!isInitLoading">
		<div class="flex flex-col w-full">
			<apexchart
				class="mx-auto"
				:width="!smallerLg ? '700px' : '500px'"
				:options="options"
				:series="seriesCountOrders"
			></apexchart>
			<apexchart
				class="mx-auto"
				:width="!smallerLg ? '700px' : '500px'"
				:options="optionsOrders"
				:series="seriesCosts"
			></apexchart>
		</div>
	</el-skeleton>
</template>

<style scoped lang="scss">

</style>