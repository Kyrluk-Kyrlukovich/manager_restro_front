<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, UploadProps } from "element-plus";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getFormUser, updateUser } from "@/api/userSetting";
import { usePageStore } from "@/pageStore";
import { getServerError } from "@/shared/getServerError";
import { setUrl } from "@/shared/getServerImage";
import type { formFieldT } from "@/types";
import { useUserStore } from "@/userStore";

const user = useUserStore();
const route = useRoute();
const editMode = ref(false);
const isLoading = ref(false);
const page = usePageStore();
const data = ref<formFieldT>();
page.setTitlePage("Настройки");

const imageUrl = ref(null);
const imageFile = ref(null);
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
	imageUrl.value = URL.createObjectURL(uploadFile.raw!);
	imageFile.value = uploadFile.raw;
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
	if (
		rawFile.type !== "image/jpeg" &&
		rawFile.type !== "image/png" &&
		rawFile.type !== "image/jpg"
	) {
		ElMessage.error("Avatar picture must be JPG format!");
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error("Avatar picture size can not exceed 2MB!");
		return false;
	}
	return true;
};

async function formUser() {
	isLoading.value = true;
	try {
		data.value = (await getFormUser(route.params?.id)).data.data;
		isLoading.value = false;
		editMode.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function handleUpdateUser() {
	isLoading.value = true;
	try {
		const dto: FormData = new FormData();
		data.value.form.forEach((field) => {
			if (field.code == "avatar") return;
			else dto.append(`${field.code}`, field.value);
		});
		await updateUser(dto, route.params.id);
		isLoading.value = false;
		editMode.value = false;
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

async function updateAvatar(file, id) {
	try {
		const dto: FormData = new FormData();
		dto.append("avatar", file);
		await updateUser(dto, id);
		formUser();
	} catch (e) {
		ElMessage.error(getServerError(e));
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
}

formUser();
</script>

<template>
	<div v-loading="isLoading">
		<el-skeleton animated :loading="isLoading">
			<div class="p-8 flex flex-column gap-4 items-center">
				<div class="flex flex-column gap-2 w-1/2">
					<el-form label-position="top">
						<el-form-item
							v-for="field in data.form"
							class="w-[100%]"
							:label="field.placeholder"
						>
							<el-tooltip
								v-if="field.type == 'image'"
								content="Заргузите аватарку"
								placement="top"
							>
								<el-upload
									v-model="field.value"
									:disabled="!field.canEdit"
									:show-file-list="false"
									:http-request="
										(image) => updateAvatar(image.file, route.params.id)
									"
									:on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload"
									class="flex justify-center w-full rounded-[50%]"
								>
									<img
										v-if="field.value"
										:src="setUrl(field.value)"
										class="avatar"
									/>
									<el-icon v-else>
										<Plus />
									</el-icon>
								</el-upload>
							</el-tooltip>
							<el-select
								v-else-if="field.type == 'select'"
								v-model="field.value"
								:disabled="editMode ? !field.canEdit : !editMode"
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
								:disabled="editMode ? !field.canEdit : !editMode"
								:placeholder="field.placeholder"
								size="large"
							/>
						</el-form-item>
						<el-form-item>
							<div class="flex flex-column w-full gap-2">
								<el-button
									v-if="!editMode && !!data.editMode"
									type="primary"
									size="large"
									class="w-full"
									@click="editMode = true"
								>
									Изменить
								</el-button>
								<el-button
									v-if="editMode"
									type="primary"
									size="large"
									class="w-full"
									@click="handleUpdateUser"
								>
									Сохранить
								</el-button>
								<el-button
									v-if="editMode"
									type="danger"
									size="large"
									class="w-full"
									@click="
										() => {
											formUser();
											editMode = false;
										}
									"
								>
									Отменить
								</el-button>
							</div>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</el-skeleton>
	</div>
</template>

<style scoped lang="scss">
.el-button + .el-button {
	margin: 0;
}

:deep(.el-upload--picture-card) {
	border-radius: 50% !important;
}

:deep(.el-upload) {
	border: 1px dashed var(--el-border-color);
	border-radius: 50% !important;
	cursor: pointer;
	position: relative;
	width: 150px;
	height: 150px;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

:deep(.el-upload:hover) {
	border-color: var(--el-color-primary);
}

:deep(.el-upload .el-icon) {
	font-size: 28px;
	color: #8c939d;
	width: 150px;
	height: 150px;
	text-align: center;
}
</style>