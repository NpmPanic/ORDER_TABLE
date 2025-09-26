<script setup>
import { Close, Rank } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
	modelValue: Boolean,
	columns: Object,
})

const emit = defineEmits(['update:modelValue', 'update:columns'])

const localColumnsList = ref([])
const fontSize = ref(10)
const isDragging = ref(false) // Добавляем состояние перетаскивания

// Инициализация при открытии
watch(
	() => props.modelValue,
	isOpen => {
		if (isOpen) {
			const columns = JSON.parse(JSON.stringify(props.columns))

			// Исключаем fontSize из списка колонок для перетаскивания
			localColumnsList.value = Object.entries(columns)
				.filter(([name]) => name !== 'fontSize')
				.map(([name, settings], index) => ({
					id: index,
					name,
					settings,
				}))

			// Устанавливаем текущий размер шрифта из отдельного свойства
			fontSize.value = columns.fontSize?.value || 10
		}
	},
	{ immediate: true }
)

// Сохраняем изменения
const saveSettings = () => {
	const newColumns = {}
	localColumnsList.value.forEach(item => {
		newColumns[item.name] = item.settings
	})

	// Добавляем настройку размера шрифта отдельно
	newColumns.fontSize = {
		value: fontSize.value,
		visible: true,
	}

	emit('update:columns', newColumns)
	emit('update:modelValue', false)
}
const closeDrawer = () => {
	emit('update:modelValue', false)
}
</script>

<template>
	<el-drawer
		:model-value="props.modelValue"
		@close="closeDrawer"
		:show-close="false"
	>
		<template #header>
			<div class="flex items-center justify-between w-full px-4 mb-10">
				<span class="text-xl text-gray-700 font-semibold uppercase"
					>Налаштування</span
				>
				<el-button @click="closeDrawer" link circle>
					<el-icon size="large">
						<Close class="text-gray-500 hover:text-blue-500" />
					</el-icon>
				</el-button>
			</div>
		</template>

		<template #default>
			<!-- Настройка размера шрифта -->
			<div class="px-4 mb-15">
				<div class="flex items-center justify-between mb-5">
					<span class="text-gray-700 font-medium">Розмір шрифту</span>
					<span class="text-blue-500 font-medium">{{ fontSize }}px</span>
				</div>
				<el-slider
					v-model="fontSize"
					:min="10"
					:max="16"
					:step="1"
					show-stops
					:marks="{
						10: '10',
						12: '12',
						14: '14',
						16: '16',
					}"
				/>
			</div>

			<!-- Настройки колонок -->
			<div class="mb-4">
				<draggable
					v-model="localColumnsList"
					item-key="id"
					handle=".drag-handle"
					ghost-class="ghost"
					:component-data="{
						tag: 'div',
						type: 'transition-group',
						name: !isDragging ? 'flip-list' : null,
					}"
					:animation="200"
					@start="isDragging = true"
					@end="isDragging = false"
				>
					<template #item="{ element }">
						<div
							class="w-full flex items-center justify-between mb-5 px-4 border-b border-gray-200"
						>
							<div
								class="flex items-center gap-4 pb-4"
								:class="{ 'text-gray-400': !element.settings.visible }"
							>
								<el-icon class="drag-handle"><Rank /></el-icon>
								<span>{{ element.name }}</span>
							</div>
							<div class="pb-2">
								<el-switch v-model="element.settings.visible" size="small" />
							</div>
						</div>
					</template>
				</draggable>
			</div>
		</template>

		<template #footer>
			<div class="flex justify-end gap-4 px-4 pt-[10px]">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="saveSettings" type="primary" size="large">
					Зберегти
				</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<style scoped>
.drag-handle {
	cursor: grabbing;
}

/* Анимация для перетаскивания */
.flip-list-move {
	transition: transform 0.3s ease;
}

.ghost {
	opacity: 0.5;
	background: white;
}

:deep(.el-slider__marks-text) {
	font-size: 12px;
}
</style>
