<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	initialCount: Number,
})
const emit = defineEmits(['update:countValue'])

const countValue = ref(props.initialCount)
const isOpen = ref(false)

watch(
	() => props.initialCount,
	newVal => {
		countValue.value = newVal
	}
)

const saveResult = () => {
	emit('update:countValue', countValue.value)
	isOpen.value = false
}

const cancelEdit = () => {
	countValue.value = props.initialCount
	isOpen.value = false
}
</script>

<template>
	<el-popover :visible="isOpen" placement="bottom" width="200px">
		<div class="flex justify-center">
			<el-input-number v-model="countValue" :min="1" :max="500" />
		</div>

		<div class="mt-4 flex justify-center">
			<el-button size="small" @click="cancelEdit">Скасувати</el-button>
			<el-button size="small" type="primary" @click="saveResult">
				Зберегти
			</el-button>
		</div>

		<template #reference>
			<el-link @click="isOpen = true" type="primary" :underline="false">
				<span>{{ countValue }}</span>
			</el-link>
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
