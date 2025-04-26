<script setup>
import { Setting, Lock, Unlock } from '@element-plus/icons-vue'
import { ref } from 'vue'
const dataColumn = ref([
	'№ замовлення',
	'Джерело',
	'Час створення',
	'Дата доставки',
	'Статус',
	'Менеджер',
	'Покупець',
	'Телефон покупця',
	'E-mail покупця',
	'Служба доставки',
	'Трекінг код',
	'Статус доставки',
	'Товари',
	'Вартість',
	'Отримувач',
	'Телефон отримувача',
	'Адреса відділення',
	'Місто',
])
// Объект для хранения состояния каждого переключателя
const switchStates = ref(
	dataColumn.value.reduce((acc, item) => {
		acc[item] = true // Изначально все включены
		return acc
	}, {})
)
// Props принимающий значение переменной isDrawer через v-model в TheHeader.vue
const prop = defineProps({
	modelValue: Boolean,
})
const value = ref(true)
// Emits отправляющий событие о закрытии модалки и изменении значения переменной состояния через :update в TheHeader.vue
const emit = defineEmits(['update:modelValue'])
</script>
<template>
	<el-drawer
		:model-value="prop.modelValue"
		@close="emit('update:modelValue', false)"
		:with-header="false"
	>
		<div class="flex flex-col h-full">
			<div class="flex-1 overflow-y-auto px-5">
				<div
					class="flex items-center gap-3 text-2xl mb-10 border-b border-gray-200"
				>
					<p class="pb-2">Налаштування</p>
					<el-icon><Setting /></el-icon>
				</div>

				<div
					v-for="item in dataColumn"
					:key="item"
					class="w-full flex items-center justify-between mb-6 border-b border-gray-200"
				>
					<div
						class="flex items-center gap-3"
						:class="{ 'text-gray-400': !switchStates[item] }"
					>
						<el-icon v-if="switchStates[item]"><Unlock /></el-icon>
						<el-icon v-else><Lock /></el-icon>
						<p>{{ item }}</p>
					</div>
					<el-switch v-model="switchStates[item]" />
				</div>
			</div>

			<div class="pt-5 bg-white z-10 border-t border-slate-200">
				<div class="flex justify-center gap-15">
					<el-button @click="emit('update:modelValue', false)" size="large"
						>Закрити</el-button
					>
					<el-button type="primary" size="large">Зберегти</el-button>
				</div>
			</div>
		</div>
	</el-drawer>
</template>
