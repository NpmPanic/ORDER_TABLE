<script setup>
import {
	PriceTag,
	ShoppingCart,
	Money,
	CreditCard,
	Close,
	Box,
	Sell,
	DocumentAdd,
	Delete,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import AddProductDrawer from './AddProductDrawer.vue'
import AddReserveModal from './AddReserveModal.vue'
import EditTextPopover from './EditTextPopover.vue'
import EditCountPopover from './EditCountPopover.vue'

const props = defineProps({
	modelValue: Boolean,
	managersList: Array,
	deliveryService: Array,
	deliveryAdress: Array,
	warehouseList: Array,
})
const emit = defineEmits(['update:modelValue'])

const isAddProduct = ref(false)
const isAddReserve = ref(false)
const addProducts = ref([])
const currentEditProduct = ref([])

const newOrder = ref([
	{
		id: '',
		order: {
			order_status: 'Новий',
			contact_status: '',
			pay_status: 'Не оплачено',
			created_at: '',
			source: 'Manager',
			manager: '',
			manager_comment: '',
		},
		customer: {
			name: '',
			phone: '',
			email: '',
			comment: '',
		},
		recipient: {
			name: '',
			phone: '',
		},
		products: [],

		additional_products: [],

		delivery: {
			delivery_date: '',
			service: '',
			ttn: '',
			adress: '',
			city: '',
			delivery_status: '',
			delivery_price: '',
		},
	},
])

const takeCurrentEditProduct = product => {
	currentEditProduct.value = product
	isAddReserve.value = true
}

const handleProductSave = products => {
	products.forEach(newProduct => {
		// Ищем товар с таким же id в currentOrder
		const existingProductIndex = addProducts.value.findIndex(
			p => p.id === newProduct.id
		)

		if (existingProductIndex !== -1) {
			// Если товар уже есть - обновляем количество
			addProducts.value[existingProductIndex].count += newProduct.count
		} else {
			// Если товара нет - добавляем новый
			addProducts.value.push({ ...newProduct })
		}
	})
}

// Обработчик добавления резерва к выбраному товару
const handleSaveReserves = reserves => {
	const validReserves = reserves.filter(
		reserve => reserve.place && reserve.count > 0
	)

	if (validReserves.length > 0) {
		currentEditProduct.value.warehouse.push(...validReserves)
	}

	isAddReserve.value = false
}

// Вычисления максимального количества резерва для прямого редактирования
const getMaxReserveCount = (product, currentReserveIndex) => {
	if (!product.warehouse) return product.count

	const totalOtherReserves = product.warehouse.reduce((total, item, index) => {
		return index === currentReserveIndex ? total : total + item.count
	}, 0)

	const remaining = product.count - totalOtherReserves
	return remaining > 0 ? remaining : 0
}

// Удаления резерва из текущего товара
const deleteReserve = (warehouseArray, index) => {
	ElMessageBox.confirm('Ця дія незворотня. Продовжити?', 'Увага!', {
		confirmButtonText: 'Так',
		cancelButtonText: 'Ні',
		type: 'error',
		icon: Delete,
	})
		.then(() => {
			warehouseArray.splice(index, 1)

			ElMessage({
				type: 'success',
				message: 'Видалення завершено',
			})
		})
		.catch(() => {
			ElMessage({
				type: 'error',
				message: 'Видалення скасовано',
			})
		})
}

// Удадение товара из списка
const removeProduct = product => {
	ElMessageBox.confirm('Ця дія незворотня. Продовжити?', 'Увага!', {
		confirmButtonText: 'Так',
		cancelButtonText: 'Ні',
		type: 'error',
		icon: Delete,
	})
		.then(() => {
			const index = addProducts.value.findIndex(p => p.id === product.id)
			if (index !== -1) {
				addProducts.value.splice(index, 1)
				ElMessage({
					type: 'success',
					message: 'Видалення завершено',
				})
			}
		})
		.catch(() => {
			ElMessage({
				type: 'error',
				message: 'Видалення скасовано',
			})
		})
}

// Генерация номера заказа
function generateOrderNumber() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const firstChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

	let result = ''

	// Первый символ - только буква
	result += firstChars.charAt(Math.floor(Math.random() * firstChars.length))

	// Остальные 11 символов - буквы или цифры
	for (let i = 0; i < 11; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}

	return result
}
// Генерация даты создания заказа
function getTodayDate() {
	const today = new Date()
	const day = String(today.getDate()).padStart(2, '0')
	const month = String(today.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
	const year = today.getFullYear()

	return `${day}/${month}/${year}`
}

// Функция для сброса формы (опционально)
const resetForm = () => {
	newOrder.value = [
		{
			id: '',
			order: {
				order_status: 'Новий',
				contact_status: '',
				pay_status: 'Не оплачено',
				created_at: '',
				source: 'Manager',
				manager: '',
				manager_comment: '',
			},
			customer: {
				name: '',
				phone: '',
				email: '',
				comment: '',
			},
			recipient: {
				name: '',
				phone: '',
			},
			products: [],
			additional_products: [],
			delivery: {
				delivery_date: '',
				service: '',
				ttn: '',
				adress: '',
				city: '',
				delivery_status: '',
				delivery_price: '',
			},
		},
	]
	addProducts.value = []
}

const saveModal = () => {
	// Проверка заполнения обязательных полей
	const requiredFields = [
		newOrder.value[0].order.manager,
		newOrder.value[0].customer.name,
		newOrder.value[0].customer.phone,
		newOrder.value[0].recipient.name,
		newOrder.value[0].recipient.phone,
		newOrder.value[0].delivery.service,
		newOrder.value[0].delivery.city,
		newOrder.value[0].delivery.adress,
		addProducts.value.length > 0,
	]

	if (requiredFields.some(field => !field)) {
		ElMessage({
			type: 'error',
			message:
				"Заповніть всі обов'язкові поля: менеджер, дані покупця, отримувача, доставки та товару",
		})
		return
	}

	// Генерация данных заказа
	newOrder.value[0].id = generateOrderNumber()
	newOrder.value[0].order.created_at = getTodayDate()
	newOrder.value[0].products = [...addProducts.value]

	// Сохранение и закрытие
	emit('update:modelValue', false)
	emit('save-order', newOrder.value[0])
	resetForm()
}

const closeModal = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<AddProductDrawer v-model="isAddProduct" @save="handleProductSave" />
	<AddReserveModal
		v-model="isAddReserve"
		:product="currentEditProduct"
		:countProduct="currentEditProduct.count"
		:warehouseList="props.warehouseList"
		@save="handleSaveReserves"
	/>

	<el-dialog
		:model-value="props.modelValue"
		@close="closeModal"
		:show-close="false"
		fullscreen
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4 mb-10">
				<span class="text-xl font-semibold">Додати замовлення</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="flex gap-4 px-4 mb-10">
				<!-- Блок 1: Основна інформація -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Основна інформація</p>

					<el-select
						v-model="newOrder[0].order.manager"
						placeholder="Обрати менеджера"
						clearable
						class="pb-4"
					>
						<el-option
							v-for="manager in props.managersList"
							:key="manager.value"
							:label="manager.label"
							:value="manager.value"
						/>
					</el-select>

					<el-input
						v-model="newOrder[0].order.manager_comment"
						type="textarea"
						maxlength="30"
						show-word-limit
						placeholder="Коментар менеджера"
						rows="4"
					/>
				</div>

				<!-- Блок 2: Інформація про покупця -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Інформація про покупця</p>

					<el-input
						v-model="newOrder[0].customer.name"
						placeholder="Ім'я покупця"
						clearable
						class="pb-4"
					/>
					<el-input
						v-model="newOrder[0].customer.phone"
						placeholder="Телефон покупця"
						clearable
						class="pb-4"
					/>
					<el-input
						v-model="newOrder[0].customer.email"
						placeholder="E-mail покупця"
						clearable
						class="pb-4"
					/>
				</div>

				<!-- Блок 3: Інформація про доставку -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Інформація про отримувача</p>
					<el-input
						v-model="newOrder[0].recipient.name"
						placeholder="Ім'я отримувача"
						clearable
						class="pb-4"
					/>
					<el-input
						v-model="newOrder[0].recipient.phone"
						placeholder="Телефон отримувача"
						clearable
						class="pb-4"
					/>
					<el-select
						v-model="newOrder[0].delivery.service"
						placeholder="Служба доставки"
						clearable
						class="pb-4"
					>
						<el-option
							v-for="manager in props.deliveryService"
							:key="manager.value"
							:label="manager.label"
							:value="manager.value"
						/>
					</el-select>
					<el-input
						v-model="newOrder[0].delivery.city"
						placeholder="Місто доставки"
						clearable
						class="pb-4"
					/>
					<el-select
						v-model="newOrder[0].delivery.adress"
						placeholder="Адреса доставки"
						clearable
						class="pb-4"
					>
						<el-option
							v-for="manager in props.deliveryAdress"
							:key="manager.value"
							:label="manager.label"
							:value="manager.value"
						/>
					</el-select>
				</div>
			</div>

			<!-- Блок 4: Товари  -->
			<div class="px-4">
				<div class="flex items-center justify-between my-5">
					<div class="flex items-center gap-2">
						<el-icon><Sell /></el-icon>
						<span class="font-medium">Додати товари</span>
					</div>
					<div class="flex items-center gap-4">
						<span class="text-sm"> {{ addProducts.length }} позиції </span>

						<el-button type="primary" size="small" @click="isAddProduct = true">
							Додати
						</el-button>
					</div>
				</div>

				<el-table :data="addProducts" style="width: 100%" border size="small">
					<el-table-column
						label="Зображення"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<el-image
								style="width: 50px"
								:src="row.img"
								:zoom-rate="1.2"
								:max-scale="7"
								:min-scale="0.2"
								:preview-src-list="[row.img]"
								show-progress
								fit="cover"
								preview-teleported="true"
							/>
						</template>
					</el-table-column>
					<el-table-column
						prop="id"
						label="Артикуль"
						header-align="center"
						align="center"
					/>
					<el-table-column
						label="Назва товару"
						header-align="center"
						align="center"
						width="250px"
					>
						<template #default="{ row }">
							<div>
								<span>{{ row.name }}</span>
							</div>
							<div>
								<span class="text-gray-400 font-mono">{{
									row.second_name
								}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="Кількість"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div class="flex gap-1 items-center justify-center">
								<span>{{ row.count }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="Ціна товару"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ row.price }}</span>
						</template>
					</el-table-column>

					<el-table-column
						label="Ціна продажу"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ row.price * row.count }}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Місце резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div v-for="(reserve, i) in row.warehouse" :key="i">
									<EditTextPopover
										:initialText="reserve.place"
										@update:textValue="newValue => (reserve.place = newValue)"
									/>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Кількість резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div v-for="(reserve, i) in row.warehouse" :key="i">
									<EditCountPopover
										:initialCount="reserve.count"
										:maxCount="getMaxReserveCount(row, i)"
										@update:countValue="newValue => (reserve.count = newValue)"
									/>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Номер резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div
									class="flex items-center justify-center gap-4"
									v-for="(reserve, i) in row.warehouse"
									:key="i"
								>
									<EditTextPopover
										:initialText="reserve.number"
										@update:textValue="newValue => (reserve.number = newValue)"
									/>
									<div
										class="mt-1 cursor-pointer hover:text-red-500 transition"
									>
										<el-tooltip content="Видалити резерв" placement="top">
											<el-icon @click="deleteReserve(row.warehouse, i)"
												><Delete
											/></el-icon>
										</el-tooltip>
									</div>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>

					<el-table-column label="Дії" header-align="center" align="center">
						<template #default="{ row }">
							<div class="flex items-center justify-center gap-4">
								<div
									class="text-sm cursor-pointer hover:text-green-500 transition"
								>
									<el-tooltip content="Додати резерв" placement="top">
										<el-icon @click="takeCurrentEditProduct(row)"
											><DocumentAdd
										/></el-icon>
									</el-tooltip>
								</div>

								<div
									class="text-sm cursor-pointer hover:text-red-500 transition"
								>
									<el-tooltip content="Видалити товар" placement="top">
										<el-icon @click="removeProduct(row)"><Delete /></el-icon>
									</el-tooltip>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end fixed bottom-0 left-0 right-4 bg-white z-50">
				<div class="flex gap-4 p-4">
					<el-button @click="closeModal" size="large">Закрити</el-button>
					<el-button @click="saveModal" type="primary" size="large"
						>Зберегти</el-button
					>
				</div>
			</div>
		</template>
	</el-dialog>
</template>
