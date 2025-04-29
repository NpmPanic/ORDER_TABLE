<script setup>
import { Setting, Lock, Unlock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

// Props принимающий значение переменной isDrawer через v-model в TheHeader.vue
const prop = defineProps({
	modelValue: Boolean,
	tableData: Array,
	columns: Object,
})
const switchStates = ref({ ...prop.columns }) // Инициализируем текущими значениями
// Инициализация состояний переключателей
watch(
	() => prop.columns,
	newColumns => {
		switchStates.value = { ...newColumns }
	},
	{ immediate: true }
)
// Emits отправляющий событие о закрытии модалки и изменении значения переменной состояния через :update в TheHeader.vue
const emit = defineEmits(['update:modelValue', 'update:columns'])

// Функция для сохранения настроек
const saveSettings = () => {
	emit('update:columns', switchStates.value)
	emit('update:modelValue', false)
}
</script>
<template>
	<el-drawer
		:model-value="prop.modelValue"
		@close="emit('update:modelValue', false)"
		:with-header="false"
	>
		<div class="flex flex-col h-full">
			<div class="flex-1 overflow-y-auto px-8">
				<div
					class="flex items-center gap-3 text-2xl mb-10 border-b border-gray-200"
				>
					<p class="pb-2">Налаштування</p>
					<el-icon><Setting /></el-icon>
				</div>

				<div
					v-for="(isVisible, columnName) in switchStates"
					:key="columnName"
					class="w-full flex items-center justify-between mb-6 border-b border-gray-200"
				>
					<div
						class="flex items-center gap-3"
						:class="{ 'text-gray-400': !isVisible }"
					>
						<el-icon v-if="isVisible"><Unlock /></el-icon>
						<el-icon v-else><Lock /></el-icon>
						<p>{{ columnName }}</p>
					</div>
					<el-switch v-model="switchStates[columnName]" />
				</div>
			</div>

			<div class="pt-5 bg-white z-10 border-t border-slate-200">
				<div class="flex justify-center gap-15">
					<el-button @click="emit('update:modelValue', false)" size="large"
						>Закрити</el-button
					>
					<el-button @click="saveSettings" type="primary" size="large"
						>Зберегти</el-button
					>
				</div>
			</div>
		</div>
	</el-drawer>
</template>
