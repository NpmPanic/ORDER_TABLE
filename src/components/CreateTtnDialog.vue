<script setup>
import { Close } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	selectedOrder: Object,
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<el-dialog
		v-model="props.modelValue"
		@close="closeModal"
		:show-close="false"
		align-center
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4 mb-10">
				<span class="text-xl text-gray-700 font-semibold uppercase"
					>Створення ТТН для замовлення № {{ props.selectedOrder.id }}</span
				>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="flex gap-5 px-4 mb-10">
				<div class="w-1/2">
					<div class="mb-4">
						<p class="font-semibold mb-4">Отримувач</p>

						<el-input
							v-model="props.selectedOrder.customer.name"
							placeholder="Отримувач"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Спосіб доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_method"
							placeholder="Спосіб доставки"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Місто доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.city"
							placeholder="Місто доставки"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Відправник</p>

						<el-input
							v-model="props.selectedOrder.sender.name"
							placeholder="Відправник"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Оплата доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_payer"
							placeholder="Оплата доставки"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Форма оплати</p>

						<el-select
							v-model="props.selectedOrder.order.pay_method"
							placeholder="Форма оплати"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
				</div>

				<div class="w-1/2">
					<div class="mb-4">
						<p class="font-semibold mb-4">Телефон отримувача</p>

						<el-input
							v-model="props.selectedOrder.customer.phone"
							placeholder="Телефон отримувача"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Склад доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_warehouse"
							placeholder="Склад доставки"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Відділення доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.adress"
							placeholder="Відділення доставки"
							clearable
							size="large"
						>
							<el-option
								v-for="manager in props.new_orderManagerList"
								:key="manager"
								:label="manager"
								:value="manager"
							/>
						</el-select>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Опис відправлення</p>

						<el-input
							v-model="props.selectedOrder.delivery.item_description"
							placeholder="Опис відправлення"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Оціночна вартість</p>

						<el-input
							v-model="props.selectedOrder.delivery.assessed_value"
							placeholder="Оціночна вартість"
							clearable
							size="large"
							:min="0"
							:max="999999"
							:formatter="
								value => {
									const cleanValue = value.replace(/[^\d]/g, '')
									const formatted = cleanValue.replace(
										/\B(?=(\d{3})+(?!\d))/g,
										','
									)
									return cleanValue ? `₴ ${formatted}` : ''
								}
							"
							:parser="value => value.replace(/[^\d]/g, '')"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Коментар менеджера</p>

						<el-input
							v-model="props.selectedOrder.order.manager_comment"
							maxlength="30"
							size="large"
							clearable
							show-word-limit
							placeholder="Коментар менеджера"
							rows="2"
						/>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="px-4">
				<el-button @click="closeModal" size="large">Скасувати</el-button>
				<el-button type="primary" @click="closeModal" size="large">
					Зберегти
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>
