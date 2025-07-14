<script setup>
import { computed } from 'vue'
import {
	Document,
	Refresh,
	Van,
	Location,
	Check,
	Switch,
	Close,
} from '@element-plus/icons-vue'

const props = defineProps({
	modelValue: Boolean,
	statusHistory: Array,
	currentStatus: String,
})

const emit = defineEmits(['update:modelValue'])

const getStatusIcon = status => {
	const icons = {
		'Замовлення отримано': Document,
		'Обробка замовлення': Refresh,
		'У дорозі': Van,
		'Прибуло у відділення': Location,
		Доставлено: Check,
		Повернення: Switch,
	}
	return icons[status] || Document
}

// Порядок статусов доставки
const statusOrder = [
	'Замовлення отримано',
	'Обробка замовлення',
	'У дорозі',
	'Прибуло у відділення',
	'Доставлено',
	'Повернення',
]

// Генерируем steps на основе всех возможных статусов
const steps = computed(() => {
	const currentIndex = props.currentStatus
		? statusOrder.indexOf(props.currentStatus)
		: -1

	return statusOrder.map((status, index) => {
		// Находим соответствующий статус в истории
		const historyItem = props.statusHistory?.find(
			item => item.status === status
		)

		return {
			title: status,
			description: historyItem?.comment || '',
			timestamp: historyItem ? `${historyItem.date} ${historyItem.time}` : '',
			icon: getStatusIcon(status),
			isCurrent: status === props.currentStatus,
			isDone: currentIndex >= 0 && index < currentIndex,
			isFuture: currentIndex >= 0 ? index > currentIndex : true,
		}
	})
})

const closeModal = () => {
	emit('update:modelValue', false)
}
</script>

<template>
	<el-dialog
		v-model="props.modelValue"
		:show-close="false"
		@close="closeModal"
		width="500px"
		center
		class="rounded-xl"
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4 mb-5">
				<span class="text-xl font-semibold">Статус доставки</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="px-4 max-h-[500px] overflow-y-auto">
				<div
					v-for="(step, index) in steps"
					:key="index"
					class="flex items-start mb-8 relative"
				>
					<!-- Кастомная иконка вместо стандартного кружка -->
					<div
						class="flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0 my-auto"
						:class="{
							'bg-blue-500 text-white': step.isCurrent,
							'bg-green-500 text-white': step.isDone,
							'bg-gray-300 text-gray-500': step.isFuture,
						}"
					>
						<el-icon :size="20">
							<component :is="step.icon" />
						</el-icon>
					</div>

					<!-- Линия таймлайна -->
					<div
						class="w-[2px] bg-gray-300 mx-4"
						:style="{ height: index === steps.length - 1 ? '0' : '70px' }"
					></div>

					<!-- Текст -->
					<div class="flex-1">
						<div
							class="text-base"
							:class="{
								'text-blue-600 font-bold': step.isCurrent,
								'text-green-700 font-semibold': step.isDone,
								'text-gray-400 font-medium': step.isFuture,
							}"
						>
							{{ step.title }}
						</div>
						<div
							class="text-sm"
							:class="{
								'text-blue-500': step.isCurrent,
								'text-gray-500': step.isDone,
								'text-gray-400': step.isFuture,
							}"
						>
							{{ step.description || 'Очікуємо інформацію' }}
						</div>
						<div v-if="step.timestamp" class="text-xs text-gray-400 mt-1">
							{{ step.timestamp }}
						</div>
						<div
							v-if="step.isCurrent"
							class="mt-2 inline-block rounded-full bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium"
						>
							Поточний
						</div>
					</div>
				</div>
			</div>
		</template>

		<template #footer>
			<el-button type="default" @click="closeModal" size="large"
				>Закрити</el-button
			>
		</template>
	</el-dialog>
</template>
