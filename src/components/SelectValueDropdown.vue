<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	initialArray: Array,
	initialValue: String,
	useTag: Boolean,
	getStatusColor: Function,
	statusColor: String,
})

const emit = defineEmits(['update:selectedValue'])

const selectedValue = ref(props.initialValue)

watch(selectedValue, newValue => {
	emit('update:selectedValue', newValue)
})

const handleCommand = command => {
	selectedValue.value = command
}
</script>

<template>
	<el-dropdown trigger="click" @command="handleCommand">
		<el-link v-if="!useTag" type="primary" :underline="false">
			<span>{{ selectedValue || 'Не задано' }}</span>
		</el-link>
		<el-tag
			v-else
			class="cursor-pointer"
			:type="props.statusColor"
			effect="dark"
		>
			{{ selectedValue || 'Не задано' }}
		</el-tag>

		<template #dropdown>
			<el-dropdown-menu class="dropdown-with-scroll">
				<el-dropdown-item
					v-for="item in props.initialArray"
					:key="item"
					:command="item"
				>
					<el-tag
						v-if="useTag"
						:type="getStatusColor(item)"
						effect="dark"
						style="width: 100%"
						class="font-semibold"
					>
						{{ item }}
					</el-tag>
					<span v-else>{{ item }}</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link:hover {
	color: orange;
}

/* Стили для выпадающего меню с прокруткой */
.dropdown-with-scroll {
	max-height: 300px;
	overflow-y: auto;
}

/* Ширина полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar {
	width: 6px;
}
/* Фон полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar-track {
	background: white;
}
/* Цвет полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar-thumb {
	background: #999999;
	border-radius: 3px;
}
/* Цвет полосы прокрутки :hover */
.dropdown-with-scroll::-webkit-scrollbar-thumb:hover {
	background: #8b8b8b;
}
</style>
