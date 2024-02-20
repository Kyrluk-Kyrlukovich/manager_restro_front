<script lang="ts">
import {
	Dish,
	Files,
	Guide,
	House,
	List,
	Memo,
	Menu,
	Notebook,
	ScaleToOriginal,
	Setting,
	Shop,
	User,
	UserFilled,
} from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { h, ref } from "vue";

export default {
	props: {
		icon: String,
	},
	setup(props) {
		function defineIcons(name) {
			switch (name) {
				case "main":
					return h(House);
				case "staff":
					return h(User);
				case "tables":
					return h(ScaleToOriginal);
				case "menu":
					return h(Notebook);
				case "categories-dishes":
					return h(Dish);
				case "orders":
					return h(Memo);
				case "shifts":
					return h(Files);
				case "settings-roles":
					return h(Setting);
			}
		}
		// return the render function
		return () => h(ElIcon, defineIcons(props.icon));
	},
};
</script>

<style scoped lang="scss">

</style>