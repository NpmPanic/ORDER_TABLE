<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	initialText: String,
})
const emit = defineEmits(['update:textValue'])

const textValue = ref(props.initialText)
const isOpen = ref(false)

watch(
	() => props.initialText,
	newVal => {
		textValue.value = newVal
	}
)

const saveResult = () => {
	emit('update:textValue', textValue.value)
	isOpen.value = false
}

const cancelEdit = () => {
	textValue.value = props.initialText
	isOpen.value = false
}
</script>

<template>
	<el-popover :visible="isOpen" placement="bottom" width="200px">
		<div class="flex justify-center">
			<el-input v-model="textValue" placeholder="Заповніть данні" clearable />
		</div>

		<div class="mt-4 flex justify-center">
			<el-button size="small" @click="cancelEdit">Скасувати</el-button>
			<el-button size="small" type="primary" @click="saveResult">
				Зберегти
			</el-button>
		</div>

		<template #reference>
			<el-link @click="isOpen = true" type="primary" :underline="false">
				<span>{{ textValue || 'Не задано' }}</span>
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
