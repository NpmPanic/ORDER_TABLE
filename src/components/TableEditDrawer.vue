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
const isDragging = ref(false) // Добавляем состояние перетаскивания

// Преобразуем объект columns в массив для draggable
watch(
	() => props.modelValue,
	isOpen => {
		if (isOpen) {
			const columns = JSON.parse(JSON.stringify(props.columns))
			localColumnsList.value = Object.entries(columns).map(
				([name, settings], index) => ({
					id: index,
					name,
					settings,
				})
			)
		}
	},
	{ immediate: true }
)

// Сохраняем изменения только при нажатии кнопки
const saveSettings = () => {
	const newColumns = {}
	localColumnsList.value.forEach(item => {
		newColumns[item.name] = item.settings
	})

	emit('update:columns', newColumns)
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
</style>
