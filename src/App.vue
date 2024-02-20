<script setup lang="ts">
import { RouterView } from "vue-router";

import { useUserStore } from "@/userStore";

const user = useUserStore();
console.log(user.user);
</script>


<template>
	<RouterView />
</template>