<script setup>
import {
	Document,
	Location,
	Van,
	Refresh,
	WarningFilled,
	CircleCheckFilled,
	Close,
	Check,
} from '@element-plus/icons-vue'

const props = defineProps({
	modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const steps = [
	{
		title: 'Замовлення отримано',
		description: 'Ми отримали ваше замовлення та почали обробку',
		timestamp: '2025-06-16 09:00',
		icon: Document,
		isCurrent: false,
		isDone: true,
	},
	{
		title: 'Обробка замовлення',
		description: 'Замовлення перевіряється та готується до відправки',
		timestamp: '2025-06-16 11:00',
		icon: Refresh,
		isCurrent: true,
		isDone: false,
	},
	{
		title: 'Передано курʼєру',
		description: 'Ваше замовлення передано службі доставки',
		timestamp: '2025-06-16 14:30',
		icon: Location,
		isCurrent: false,
		isDone: false,
	},
	{
		title: 'У дорозі',
		description: 'Замовлення в дорозі до вас',
		timestamp: '',
		icon: Van,
		isCurrent: false,
		isDone: false,
	},
	{
		title: 'Доставлено',
		description: 'Замовлення успішно доставлено',
		timestamp: '',
		icon: Check,
		isCurrent: false,
		isDone: false,
	},
]

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
			<div class="flex justify-between items-center w-full px-4 mb-10">
				<span class="text-xl font-semibold">Статус доставки</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="px-4 mb-10">
				<div
					v-for="(step, index) in steps"
					:key="index"
					class="flex items-start mb-8 relative"
				>
					<!-- Кастомная иконка вместо стандартного кружка -->
					<div
						class="flex items-center justify-center rounded-full w-8 h-8 flex-shrink-0"
						:class="{
							'bg-blue-500 text-white': step.isCurrent,
							'bg-green-500 text-white': step.isDone && !step.isCurrent,
							'bg-gray-300 text-gray-500': !step.isDone && !step.isCurrent,
						}"
					>
						<el-icon :size="20">
							<component
								:is="
									step.isCurrent
										? WarningFilled
										: step.isDone
										? CircleCheckFilled
										: step.icon
								"
							/>
						</el-icon>
					</div>

					<!-- Линия таймлайна -->
					<div
						class="w-[2px] bg-gray-300 mx-4"
						:style="{ height: index === steps.length - 1 ? '0' : '60px' }"
					></div>

					<!-- Текст -->
					<div class="flex-1">
						<div
							class="text-base"
							:class="{
								'text-blue-600 font-bold': step.isCurrent,
								'text-green-700 font-semibold': step.isDone && !step.isCurrent,
								'text-gray-700 font-medium': !step.isDone && !step.isCurrent,
							}"
						>
							{{ step.title }}
						</div>
						<div
							class="text-sm"
							:class="step.isCurrent ? 'text-blue-500' : 'text-gray-500'"
						>
							{{ step.description }}
						</div>
						<div v-if="step.timestamp" class="text-xs text-gray-400 mt-1">
							{{ step.timestamp }}
						</div>
						<div
							v-if="step.isCurrent"
							class="mt-2 inline-block rounded-full bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium"
						>
							Поточний статус
						</div>
					</div>
				</div>
			</div>
		</template>

		<template #footer>
			<el-button type="primary" @click="closeModal">Закрити</el-button>
		</template>
	</el-dialog>
</template>
