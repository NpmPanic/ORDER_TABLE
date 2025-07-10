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

const isOpen = ref(false)
const selectedValue = ref(props.initialValue)
const mySelectRef = ref(null)

watch(selectedValue, newValue => {
	emit('update:selectedValue', newValue)
})

const openSelectOptions = () => {
	mySelectRef.value.toggleMenu()
	mySelectRef.value.focus()
}
</script>

<template>
	<el-popover
		placement="bottom-start"
		trigger="click"
		:transition="'el-zoom-in-center'"
		@show="openSelectOptions"
		popper-class="custom-select-popover"
	>
		<template #reference>
			<el-link
				v-if="!useTag"
				@click="isOpen = true"
				type="primary"
				:underline="false"
			>
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
		</template>
		<template #default>
			<el-select
				v-model="selectedValue"
				ref="mySelectRef"
				filterable
				clearable
				placeholder="Обрати"
				style="width: 200px"
			>
				<el-option
					v-for="item in props.initialArray"
					:key="item"
					:label="item"
					:value="item"
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
				</el-option>
			</el-select>
		</template>
	</el-popover>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link :hover {
	color: orange;
}
</style>

<style>
.custom-select-popover {
	padding: 0 !important;
	margin: 0 !important;
	border: none !important;
	box-shadow: none !important;
}

.custom-select-popover .el-popper__arrow {
	display: none !important;
}
</style>
