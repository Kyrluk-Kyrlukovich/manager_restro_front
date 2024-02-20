import "./assets/main.css";
import "element-plus/theme-chalk/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import axios from "axios";
import ElementPlus from "element-plus";
import ru from "element-plus/es/locale/lang/ru";
import { createPinia } from "pinia";
import { createApp } from "vue";
import VueAxios from "vue-axios";
import VueApexCharts from "vue3-apexcharts";

import { initInlineSvg } from "@/core/plugins/inline-svg";
import declarePusher from "@/pusher/pusher";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

declarePusher();

app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
	locale: ru,
});
app.use(VueAxios, axios);
app.use(VueApexCharts);

initInlineSvg(app);

app.mount("#app");
