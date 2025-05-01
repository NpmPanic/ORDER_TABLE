<script setup>
import { Setting, Lock, Unlock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	columns: Object,
})

const emit = defineEmits(['update:modelValue', 'update:columns'])

const localColumns = ref({})

// Делаем локальную копию данных из props.columns в локальную реактивную переменную localColumns при открытии Drawer
watch(
	() => props.modelValue,
	isOpen => {
		if (isOpen) {
			localColumns.value = JSON.parse(JSON.stringify(props.columns))
		}
	},
	{ immediate: true }
)

// Сохраняем изменения только при нажатии кнопки
const saveSettings = () => {
	emit('update:columns', localColumns.value)
	emit('update:modelValue', false)
}

// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}
</script>

<template>
	<el-drawer
		:model-value="props.modelValue"
		@close="closeDrawer"
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
					v-for="(settings, columnName) in localColumns"
					:key="columnName"
					class="w-full flex items-center justify-between mb-6 border-b border-gray-200"
				>
					<div
						class="flex items-center gap-3"
						:class="{ 'text-gray-400': !settings.visible }"
					>
						<el-icon v-if="settings.visible"><Unlock /></el-icon>
						<el-icon v-else><Lock /></el-icon>
						<p>{{ columnName }}</p>
					</div>
					<el-switch v-model="settings.visible" />
				</div>
			</div>

			<div class="pt-5 bg-white z-10 border-t border-slate-200">
				<div class="flex justify-center gap-15">
					<el-button @click="closeDrawer" size="large">Закрити</el-button>
					<el-button @click="saveSettings" type="primary" size="large">
						Зберегти
					</el-button>
				</div>
			</div>
		</div>
	</el-drawer>
</template>
