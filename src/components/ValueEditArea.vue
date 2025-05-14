<script setup>
import { ref, watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
	initialText: String,
})

const emit = defineEmits(['update:textValue'])

const textValue = ref(props.initialText || '')
const isOpen = ref(false)

watch(
	() => props.initialText,
	newVal => {
		textValue.value = newVal || ''
	}
)

const saveTextEditArea = () => {
	emit('update:textValue', textValue.value)
	isOpen.value = false // Закрываем после сохранения
}

const cancelEdit = () => {
	textValue.value = props.initialText || ''
	isOpen.value = false
}
</script>

<template>
	<div>
		<!-- Показываем текст и кнопку редактирования, если isOpen = false -->
		<template v-if="!isOpen">
			<div class="flex items-center gap-2">
				<span>{{ textValue || 'Не задано' }}</span>

				<el-icon
					@click="isOpen = true"
					class="cursor-pointer hover:text-blue-500"
				>
					<Edit />
				</el-icon>
			</div>
		</template>

		<!-- Показываем инпут, если isOpen = true -->
		<div v-else>
			<el-input
				v-model="textValue"
				placeholder="Введіть значення"
				size="small"
			/>
			<div class="mt-2 flex gap-2">
				<el-button @click="saveTextEditArea" type="primary" size="small">
					Зберегти
				</el-button>
				<el-button @click="cancelEdit" size="small"> Скасувати </el-button>
			</div>
		</div>
	</div>
</template>
