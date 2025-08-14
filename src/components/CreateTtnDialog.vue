<script setup>
import { Close } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	selectedOrder: Object,
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
	emit('update:modelValue', false)
}

// Инициализация с проверкой на существование products
const orderProducts = ref(
	props.selectedOrder?.products?.map(product => product.name) || []
)

// Watcher с проверкой
watch(
	() => props.selectedOrder,
	newOrder => {
		orderProducts.value = newOrder?.products?.map(product => product.name) || []
	},
	{ immediate: true, deep: true }
)
</script>
<template>
	<el-dialog
		v-model="props.modelValue"
		@close="closeModal"
		:show-close="false"
		align-center
		width="80%"
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
			<div class="flex gap-5 px-4">
				<div class="w-1/2">
					<div class="mb-4">
						<p class="font-semibold mb-4">Отримувач</p>

						<el-input
							v-model="props.selectedOrder.recipient.name"
							placeholder="Заповніть данні"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Спосіб доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_method"
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Оплата доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_payer"
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
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
							v-model="props.selectedOrder.recipient.phone"
							placeholder="Заповніть данні"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Склад доставки</p>

						<el-select
							v-model="props.selectedOrder.delivery.delivery_warehouse"
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
							clearable
							size="large"
						/>
					</div>
					<div class="mb-4">
						<p class="font-semibold mb-4">Оціночна вартість</p>

						<el-input
							v-model="props.selectedOrder.delivery.assessed_value"
							placeholder="Заповніть данні"
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
							placeholder="Заповніть данні"
							maxlength="30"
							size="large"
							clearable
							show-word-limit
							rows="2"
						/>
					</div>
				</div>
			</div>
			<div class="flex gap-5 px-4 mb-10">
				<div class="w-[40%]">
					<p class="font-semibold mb-4">Товар</p>

					<el-input-tag
						v-model="orderProducts"
						size="large"
						tag-type="primary"
						disabled
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Кількість</p>

					<el-input-number
						v-model="props.selectedOrder.products[0].count"
						size="large"
						:min="1"
						:max="10"
						disabled
						style="width: 100%"
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Ширина</p>

					<el-input
						v-model="props.selectedOrder.delivery.width"
						placeholder="Заповніть данні"
						clearable
						size="large"
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Довжина</p>

					<el-input
						v-model="props.selectedOrder.delivery.length"
						placeholder="Заповніть данні"
						clearable
						size="large"
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Висота</p>

					<el-input
						v-model="props.selectedOrder.delivery.height"
						placeholder="Заповніть данні"
						clearable
						size="large"
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Вага, кг</p>

					<el-input
						v-model="props.selectedOrder.delivery.weight"
						placeholder="Заповніть данні"
						clearable
						size="large"
					/>
				</div>
				<div class="w-[10%]">
					<p class="font-semibold mb-4">Об`ємна вага, кг</p>

					<el-input
						v-model="props.selectedOrder.delivery.weight"
						placeholder="Заповніть данні"
						clearable
						size="large"
					/>
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
