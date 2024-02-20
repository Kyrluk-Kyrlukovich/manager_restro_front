<template>
	<div class="login-page">
		<div class="login-page__block">
			<h2 class="text-muted">Вход в систему</h2>
			<div class="login-page__form">
				<el-input
v-model="email"
clearable placeholder="email"
size="large" />
				<el-input
					v-model="password"
					type="password"
					clearable
					placeholder="password"
					size="large"
				/>
				<el-button
type="primary"
size="large" class="w-full"
@click="sign">
					Войти
				</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { login } from "@/api/login";
import { appRoutes } from "@/navigation/routes";

const email = ref("");
const password = ref("");
const isLoading = ref(true);
const router = useRouter();

async function sign() {
	try {
		const dto = {
			email: email.value,
			password: password.value,
		};

		const token = (await login(dto)).data.data.token;
		localStorage.setItem("token", token);
		router.push(appRoutes.DASHBOARD_PAGE.getPath());
		isLoading.value = false;
	} catch (e) {
		isLoading.value = false;
		ElMessage.error(e?.response?.data?.error?.message || "Произошла непредвиденная ошибка");
	} finally {
		isLoading.value = false;
	}
}
</script>

<style scoped lang="scss">
.login-page {
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;

	&__block {
		width: 25%;
		height: 50%;
		background-color: rgba(233, 233, 233, 0.57);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
	}

	&__form {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		gap: 0.75rem;
	}
}
</style>