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
	<el-drawer :model-value="props.modelValue" @close="closeDrawer">
		<template #header>
			<span class="text-xl font-semibold px-4">Налаштування</span>
		</template>
		<template #default>
			<div
				v-for="(settings, columnName) in localColumns"
				:key="columnName"
				class="w-full flex items-center justify-between mb-5 mt-5 border-b border-gray-200"
			>
				<div
					class="flex items-center gap-4 px-4 pb-4"
					:class="{ 'text-gray-400': !settings.visible }"
				>
					<el-icon v-if="settings.visible"><Unlock /></el-icon>
					<el-icon v-else><Lock /></el-icon>
					<span>{{ columnName }}</span>
				</div>
				<div class="pb-2">
					<el-switch v-model="settings.visible" size="small" />
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="saveSettings" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-drawer>
</template>
