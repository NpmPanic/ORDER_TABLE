<script setup>
import { ref } from 'vue'
const props = defineProps({
	modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'update:textValue'])
const textValue = ref('')

const saveTextEditDialog = () => {
	emit('update:textValue', textValue.value)
	emit('update:modelValue', false)
}
const closeTextEditDialog = () => {
	emit('update:modelValue', false)
}
</script>

<template>
	<el-dialog
		:model-value="props.modelValue"
		@close="closeTextEditDialog"
		title="Додати коментар"
		width="500"
		align-center
	>
		<div class="my-5">
			<el-input
				v-model="textValue"
				style="width: 100%"
				:rows="1"
				maxlength="50"
				show-word-limit
				type="textarea"
				placeholder="Введіть коментар"
			/>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeTextEditDialog">Закрити</el-button>
				<el-button type="primary" @click="saveTextEditDialog">
					Зберегти
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>
