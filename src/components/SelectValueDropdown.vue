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

watch(selectedValue, newValue => {
	emit('update:selectedValue', newValue)
})
</script>

<template>
	<el-dropdown trigger="click">
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

		<template #dropdown>
			<el-select
				v-model="selectedValue"
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
	</el-dropdown>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link :hover {
	color: orange;
}
</style>
