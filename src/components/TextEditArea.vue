<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	initialText: String,
})
const emit = defineEmits(['update:modelValue', 'update:textValue'])
const textValue = ref(props.initialText || '')

watch(
	() => props.initialText,
	newVal => {
		textValue.value = newVal || ''
	}
)

const saveTextEditArea = () => {
	emit('update:textValue', textValue.value)
	emit('update:modelValue', false)
}

const cancelEdit = () => {
	emit('update:modelValue', false)
}
</script>

<template>
	<div v-show="props.modelValue" class="w-full">
		<el-input
			v-model="textValue"
			style="width: 100%"
			:rows="2"
			maxlength="40"
			show-word-limit
			type="textarea"
			placeholder="Введіть коментар"
		/>
		<div class="mt-2 flex gap-2">
			<el-button @click="saveTextEditArea" type="primary" size="small">
				Зберегти
			</el-button>
			<el-button @click="cancelEdit" size="small"> Скасувати </el-button>
		</div>
	</div>
</template>
