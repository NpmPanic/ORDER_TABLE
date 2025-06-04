<script setup>
import {
	Search,
	User,
	Switch,
	Edit,
	Delete,
	ChatRound,
	Phone,
	DocumentAdd,
	DocumentCopy,
	Goods,
	Sell,
} from '@element-plus/icons-vue'
import { useTransition } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
import EditCountPopover from './components/EditCountPopover.vue'
import EditTextPopover from './components/EditTextPopover.vue'
import EditCommentPopover from './components/EditCommentPopover.vue'
import EditPricePopover from './components/EditPricePopover.vue'
import EditProductsDrawer from './components/EditProductsDrawer.vue'
import AddProductDrawer from './components/AddProductDrawer.vue'
import AddReserveModal from './components/AddReserveModal.vue'

const source = ref(0)
const animated = useTransition(source, { duration: 1500 })

const handleExpand = (row, expandedRows) => {
	if (expandedRows.includes(row)) {
		source.value = 0 // сбрасываем, если нужно
		source.value = 20000 // старт анимации
	}
}
// Переменная глобального поиска таблицы
const inputQuerySearch = ref('')
// Переменная глобальной категории поиска таблицы
const valueQuerySelect = ref('')

const isTableEditDrawer = ref(false)
const isProductsAddDrawer = ref(false)
const isEditProductsDrawer = ref(false)
const isAddReserve = ref(false)
const isAdditionalProducts = ref(false)
// Переменная хранения текущего заказа
const currentOrder = ref({})
// Переменная хранения выбраного для редактирования товара
const currentEditProduct = ref({})

// Функция передачи текущего заказа в переменную currentOrder для добавления доп товаров
const addAdditionalProductsToOrder = order => {
	currentOrder.value = order
	isProductsAddDrawer.value = true
}

// Функция передачи текущего заказа в переменную currentOrder для добавления резерва
const addReserveToOrder = product => {
	currentEditProduct.value = product
	isAddReserve.value = true
}

// Обработчик добавления резерва к выбраному товару
const handleSaveReserves = reserves => {
	const validReserves = reserves.filter(
		reserve => reserve.place && reserve.count > 0 && reserve.number
	)

	if (validReserves.length > 0) {
		currentEditProduct.value.warehouse.push(...validReserves)
	}

	isAddReserve.value = false
}

// Функция копирования текста по клику
const copyText = async text => {
	try {
		await navigator.clipboard.writeText(text)
		ElMessage({
			message: 'Скопійовано до буферу обміну',
			type: 'success',
		})
	} catch (err) {
		ElMessage({
			message: 'Помилка копіювання',
			type: 'error',
		})
		console.error('Clipboard error:', err)
	}
}

// Опции для выбора полей поиска
const optionsSearch = [
	{ value: 'order.order_number', label: '№ замовлення' },
	{ value: 'customer.name', label: 'Покупець' },
	{ value: 'customer.phone', label: 'Телефон покупця' },
	{ value: 'delivery.ttn', label: 'Трекінг код' },
	{ value: 'order.manager', label: 'Менеджер' },
]

// Опции для выбора служб доставки
const optionsOrderManager = [
	{ value: 'Андрій', label: 'Андрій' },
	{ value: 'Марина', label: 'Марина' },
	{ value: 'Тетяна', label: 'Тетяна' },
	{ value: 'Богдан', label: 'Богдан' },
	{ value: 'Оксана', label: 'Оксана' },
]

// Опции для выбора служб доставки
const optionsDeliveryService = [
	{ value: 'Нова пошта', label: 'Нова пошта' },
	{ value: 'Самовивіз Київ', label: 'Самовивіз Київ' },
	{ value: 'Самовивіз Львів', label: 'Самовивіз Львів' },
	{ value: 'Самовивіз Ізюм', label: 'Самовивіз Ізюм' },
	{ value: 'Самовивіз Харків', label: 'Самовивіз Харків' },
]

// Опции для выбора служб доставки
const optionsDeliveryAdress = [
	{ value: 'Відділення №1', label: 'Відділення №1' },
	{ value: 'Відділення №2', label: 'Відділення №2' },
	{ value: 'Відділення №3', label: 'Відділення №3' },
	{ value: 'Відділення №4', label: 'Відділення №4' },
]

// Опции для выбора склада резерва
const optionsWarehouseReserve = [
	{ value: 'Постачальник 1', label: 'Постачальник 1' },
	{ value: 'Постачальник 2', label: 'Постачальник 2' },
	{ value: 'Магазин 1', label: 'Магазин 1' },
	{ value: 'Магазин 2', label: 'Магазин 2' },
	{ value: 'Магазин 3', label: 'Магазин 3' },
	{ value: 'Магазин 4', label: 'Магазин 4' },
	{ value: 'Магазин 5', label: 'Магазин 5' },
]

// Функция для получения значения из объекта по пути
const getValueByPath = (obj, path) => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Функция генерации номера ТТН

function generateNumber(row) {
	const prefix = '204'
	let remainingDigits = ''

	for (let i = 0; i < 11; i++) {
		remainingDigits += Math.floor(Math.random() * 10)
	}

	const newNumber = prefix + remainingDigits
	row.delivery.ttn = newNumber
}

// Фильтрация данных таблицы по поисковому запросу
const resultData = computed(() => {
	if (!valueQuerySelect.value) return TABLE_DATA.value
	return TABLE_DATA.value.filter(item => {
		const fieldValue = getValueByPath(item, valueQuerySelect.value)
		return String(fieldValue)
			.toLowerCase()
			.includes(inputQuerySearch.value.toLowerCase())
	})
})

// Объект с настройками колонок таблицы
const tableColumns = ref({
	'№ замовлення': {
		visible: true,
		prop: 'order.order_number',
		sortable: false,
	},
	Джерело: {
		visible: false,
		prop: 'order.source',
		sortable: true,
	},
	'Час створення': {
		visible: true,
		prop: 'order.created_at',
		sortable: true,
	},
	'Дата відправки': {
		visible: false,
		prop: 'delivery.delivery_date',
		sortable: true,
	},
	Статус: {
		visible: true,
		prop: 'order.order_status',
		sortable: false,
	},
	Менеджер: {
		visible: true,
		prop: 'order.manager',
		sortable: true,
	},
	Покупець: {
		visible: true,
		prop: 'customer.name',
		sortable: false,
	},
	'Телефон покупця': {
		visible: true,
		prop: 'customer.phone',
		sortable: false,
	},
	'E-mail покупця': {
		visible: false,
		prop: 'customer.email',
		sortable: false,
	},
	'Служба доставки': {
		visible: true,
		prop: 'delivery.service',
		sortable: false,
	},
	'Трекінг код': {
		visible: true,
		prop: 'delivery.ttn',
		sortable: false,
	},
	'Статус доставки': {
		visible: false,
		prop: 'delivery.delivery_status',
		sortable: true,
	},
	Товари: {
		visible: true,
		prop: 'products.name',
		sortable: false,
	},
	Вартість: {
		visible: true,
		prop: 'products.price',
		sortable: true,
	},
	Отримувач: {
		visible: false,
		prop: 'recipient.name',
		sortable: false,
	},
	'Телефон отримувача': {
		visible: false,
		prop: 'recipient.phone',
		sortable: false,
	},
	Відділення: {
		visible: true,
		prop: 'delivery.adress',
		sortable: false,
	},
	Місто: {
		visible: true,
		prop: 'delivery.city',
		sortable: false,
	},
})

// Вычисляемое свойство для получения только видимых колонок таблицы
// Возвращает массив объектов с настройками видимых колонок
const visibleColumns = computed(() => {
	return Object.entries(tableColumns.value)
		.filter(([_, settings]) => settings.visible)
		.map(([label, settings]) => ({
			label,
			prop: settings.prop,
			width: settings.width,
			key: settings.prop,
			sortable: settings.sortable,
		}))
})

// Обработчик обновления видимости колонок таблицы
const handleColumnUpdate = newColumns => {
	Object.keys(tableColumns.value).forEach(key => {
		tableColumns.value[key].visible = newColumns[key].visible
	})
}

// Обработчик сохранения выбранных товаров c проверкой уже добавленных
const handleSaveAdditionalProducts = products => {
	products.forEach(newProduct => {
		// Ищем товар с таким же id в currentOrder
		const existingProductIndex =
			currentOrder.value.additional_products.findIndex(
				p => p.id === newProduct.id
			)

		if (existingProductIndex !== -1) {
			// Если товар уже есть - обновляем количество
			currentOrder.value.additional_products[existingProductIndex].count +=
				newProduct.count
		} else {
			// Если товара нет - добавляем новый
			currentOrder.value.additional_products.push({ ...newProduct })
		}
	})
}

// Удаления заказа
const removeOrderConfirm = (order, productIndex) => {
	ElMessageBox.confirm('Ця дія незворотня. Продовжити?', 'Увага!', {
		confirmButtonText: 'Так',
		cancelButtonText: 'Ні',
		type: 'error',
		icon: Delete,
	})
		.then(() => {
			order.products.splice(productIndex, 1)

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
// Удаления дозаказа
const removeAdditionalConfirm = (order, productIndex) => {
	ElMessageBox.confirm('Ця дія незворотня. Продовжити?', 'Увага!', {
		confirmButtonText: 'Так',
		cancelButtonText: 'Ні',
		type: 'error',
		icon: Delete,
	})
		.then(() => {
			order.additional_products.splice(productIndex, 1)

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
// Функция получения редактируемого товара
const takeCurrentEditProduct = product => {
	currentEditProduct.value = product
	isEditProductsDrawer.value = true
}
// Функция сохранения изменений редактируемого товара
const handleEditProductSave = updatedProduct => {
	// Обновляем currentEditProduct
	Object.assign(currentEditProduct.value, updatedProduct)
}
</script>

<template>
	<div class="flex items-center justify-between m-5">
		<div class="flex gap-5">
			<el-input
				v-model="inputQuerySearch"
				style="width: 240px"
				placeholder="Пошук"
				:prefix-icon="Search"
				clearable
			/>
			<el-select
				v-model="valueQuerySelect"
				style="width: 240px"
				placeholder="Вибрати"
				:suffix-icon="Switch"
				clearable
			>
				<el-option
					v-for="item in optionsSearch"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
		</div>
		<div>
			<el-button type="success" plain>Додати замовлення</el-button>
			<el-button @click="isTableEditDrawer = true" type="primary" plain>
				Редагувати таблицю
			</el-button>
		</div>
	</div>

	<TableEditDrawer
		v-model="isTableEditDrawer"
		:columns="tableColumns"
		@update:columns="handleColumnUpdate"
	/>
	<AddProductDrawer
		v-model="isProductsAddDrawer"
		@save="handleSaveAdditionalProducts"
	/>
	<EditProductsDrawer
		v-model="isEditProductsDrawer"
		:product="currentEditProduct"
		:warehouseList="optionsWarehouseReserve"
		@save="handleEditProductSave"
	/>
	<AddReserveModal
		v-model="isAddReserve"
		:product="currentEditProduct"
		:countProduct="currentEditProduct.count"
		:warehouseList="optionsWarehouseReserve"
		@save="handleSaveReserves"
	/>

	<!-- Основная таблица с данными -->
	<div class="pb-5">
		<el-table
			:data="resultData"
			row-key="id"
			:default-sort="{ prop: 'order.created_at', order: 'descending' }"
			height="100%"
			style="width: 100%"
			@expand-change="handleExpand"
		>
			<!-- Колонка с раскрывающейся секцией -->
			<el-table-column type="expand">
				<template #default="props">
					<div class="w-full flex gap-2">
						<!-- Замовлення -->

						<div class="w-1/3">
							<el-descriptions
								direction="horisontal"
								border
								style="margin: 0px"
								size="small"
								column="1"
							>
								<el-descriptions-item label="№ замовлення">
									<div class="flex items-center gap-2">
										<span>{{ props.row.order.order_number }}</span>
										<div
											class="cursor-pointer hover:text-blue-500 transition pt-1"
										>
											<el-icon @click="copyText(props.row.order.order_number)"
												><DocumentCopy
											/></el-icon>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Джерело">
									<img
										class="w-10"
										:src="props.row.order.source"
										alt="source"
									/>
								</el-descriptions-item>
								<el-descriptions-item label="Час створення">{{
									props.row.order.created_at
								}}</el-descriptions-item>
								<el-descriptions-item label="Менеджер">
									<el-select
										v-model="props.row.order.manager"
										clearable
										placeholder="Обрати"
										style="width: 220px"
										size="small"
									>
										<el-option
											v-for="item in optionsOrderManager"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-descriptions-item>
								<el-descriptions-item label="Статус">
									<div v-if="props.row.order.order_status === 'Новий'">
										<el-button
											type="primary"
											size="small"
											style="width: 70px"
											>{{ props.row.order.order_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.order.order_status === 'Доставка'">
										<el-button
											type="warning"
											size="small"
											style="width: 70px"
											>{{ props.row.order.order_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.order.order_status === 'Виконано'">
										<el-button
											type="success"
											size="small"
											style="width: 70px"
											>{{ props.row.order.order_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.order.order_status === 'Скасовано'">
										<el-button type="danger" size="small" style="width: 70px">{{
											props.row.order.order_status
										}}</el-button>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Статус оплати">
									<div v-if="props.row.order.pay_status === 'Оплачено'">
										<el-button
											type="success"
											size="small"
											style="width: 70px"
											>{{ props.row.order.pay_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.order.pay_status === 'Не оплачено'">
										<el-button type="danger" size="small" plain>{{
											props.row.order.pay_status
										}}</el-button>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>

						<!-- Покупець -->
						<div class="w-1/3">
							<el-descriptions
								direction="horisontal"
								border
								style="margin: 0px"
								size="small"
								column="1"
							>
								<el-descriptions-item label="Покупець">
									<div class="flex items-center gap-2">
										<EditTextPopover
											:initialText="props.row.customer.name"
											@update:textValue="
												newValue => (props.row.customer.name = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Телефон покупця">
									<div class="flex items-center gap-2">
										<EditTextPopover
											:initialText="props.row.customer.phone"
											@update:textValue="
												newValue => (props.row.customer.phone = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="E-mail покупця">
									<div class="flex items-center gap-2">
										<EditTextPopover
											:initialText="props.row.customer.email"
											@update:textValue="
												newValue => (props.row.customer.email = newValue)
											"
										/>
									</div>
								</el-descriptions-item>

								<el-descriptions-item label="Коментар покупця">
									<EditCommentPopover
										:initialText="props.row.customer.comment"
										@update:textValue="
											newValue => (props.row.customer.comment = newValue)
										"
									/>
								</el-descriptions-item>

								<el-descriptions-item label="Коментар менеджера">
									<EditCommentPopover
										:initialText="props.row.order.manager_comment"
										@update:textValue="
											newValue => (props.row.order.manager_comment = newValue)
										"
									/>
								</el-descriptions-item>
								<el-descriptions-item label="Комунікації">
									<div class="flex items-center gap-2">
										<el-button
											type="success"
											:icon="Phone"
											circle
											size="small"
										/>
										<el-button
											type="primary"
											:icon="ChatRound"
											circle
											size="small"
										/>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>

						<!-- Отримувач -->
						<div class="w-1/3">
							<el-descriptions
								direction="horisontal"
								border
								style="margin: 0px"
								size="small"
								column="1"
							>
								<el-descriptions-item label="Дата відправки">
									<el-date-picker
										v-model="props.row.delivery.delivery_date"
										type="date"
										placeholder="Обрати"
										format="DD/MM/YYYY"
										value-format="DD/MM/YYYY"
										style="width: 220px"
										size="small"
									/>
								</el-descriptions-item>
								<el-descriptions-item label="Отримувач">
									<div class="flex items-center gap-2">
										<EditTextPopover
											:initialText="props.row.recipient.name"
											@update:textValue="
												newValue => (props.row.recipient.name = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Телефон отримувача">
									<div class="flex items-center gap-2">
										<EditTextPopover
											:initialText="props.row.recipient.phone"
											@update:textValue="
												newValue => (props.row.recipient.phone = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Служба доставки">
									<el-select
										v-model="props.row.delivery.service"
										clearable
										placeholder="Обрати"
										style="width: 220px"
										size="small"
									>
										<el-option
											v-for="item in optionsDeliveryService"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-descriptions-item>
								<el-descriptions-item label="Адреса доставки">
									<el-select
										v-model="props.row.delivery.adress"
										clearable
										placeholder="Обрати"
										style="width: 220px"
										size="small"
									>
										<el-option
											v-for="item in optionsDeliveryAdress"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-descriptions-item>
								<el-descriptions-item label="Трекінг код">
									<div class="flex items-center gap-4">
										<span class="min-w-40">{{ props.row.delivery.ttn }}</span>
										<div class="flex items-center gap-3 pt-2">
											<div
												@click="generateNumber(props.row)"
												class="text-sm cursor-pointer hover:text-green-500 transition"
											>
												<el-icon><DocumentAdd /></el-icon>
											</div>
											<div
												@click="props.row.delivery.ttn = null"
												class="text-sm cursor-pointer hover:text-red-500 transition"
											>
												<el-icon><Delete /></el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>
					</div>

					<!--Товары-->

					<div>
						<div class="flex items-center justify-between m-5">
							<div class="flex items-center gap-2">
								<el-icon><Goods /></el-icon>
								<span class="font-medium">Товари замовлення</span>
							</div>
							<div class="flex items-center gap-4">
								<span class="text-sm"> Додаткові товари </span>

								<el-switch v-model="isAdditionalProducts" size="small" />
							</div>
						</div>
						<el-table
							:data="props.row.products"
							style="width: 100%"
							border
							size="small"
						>
							<el-table-column
								label="Зображення"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<el-popover
										:width="300"
										placement="right"
										popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
									>
										<template #reference>
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
										<template #default>
											<div
												style="display: flex; gap: 16px; flex-direction: column"
											>
												<el-avatar
													shape="square"
													:size="75"
													:src="row.img"
													style="margin-bottom: 8px"
												/>
												<div>
													<p style="margin: 0; font-weight: 500">
														{{ row.name }}
													</p>
													<p
														style="
															margin: 0;
															font-size: 14px;
															color: var(--el-color-info);
														"
													>
														{{ row.second_name }}
													</p>
												</div>

												<p style="margin: 0">
													{{ row.title }}
												</p>
											</div>
										</template>
									</el-popover>
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
										<EditCountPopover
											:initialCount="row.count"
											@update:countValue="newValue => (row.count = newValue)"
										/>
										<span>{{ row.count_name }}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								label="Ціна товару"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<EditPricePopover
										:initialPrice="row.price"
										@update:priceValue="newValue => (row.price = newValue)"
									/>
								</template>
							</el-table-column>

							<el-table-column
								label="Ціна продажу"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<span>{{ row.price * row.count }} &#8372;</span>
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
												@update:textValue="
													newValue => (reserve.place = newValue)
												"
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
												@update:countValue="
													newValue => (reserve.count = newValue)
												"
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
										<div v-for="(reserve, i) in row.warehouse" :key="i">
											<EditTextPopover
												:initialText="reserve.number"
												@update:textValue="
													newValue => (reserve.number = newValue)
												"
											/>
										</div>
									</div>
									<span v-else class="text-gray-400">Не задано</span>
								</template>
							</el-table-column>
							<el-table-column label="Дії" header-align="center" align="center">
								<template #default="{ row }">
									<div class="flex items-center justify-center gap-4">
										<div
											class="text-sm cursor-pointer hover:text-blue-500 transition"
										>
											<el-tooltip content="Додати резерв" placement="top">
												<el-icon @click="addReserveToOrder(row)"
													><DocumentAdd
												/></el-icon>
											</el-tooltip>
										</div>
										<div
											class="text-sm cursor-pointer hover:text-blue-500 transition"
										>
											<el-tooltip content="Редагувати товар" placement="top">
												<el-icon @click="takeCurrentEditProduct(row)"
													><Edit
												/></el-icon>
											</el-tooltip>
										</div>
										<div
											class="text-sm cursor-pointer hover:text-red-500 transition"
										>
											<el-tooltip content="Видалити товар" placement="top">
												<el-icon @click="removeOrderConfirm(props.row, $index)"
													><Delete
												/></el-icon>
											</el-tooltip>
										</div>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>

					<!--Допродажи-->

					<div v-if="isAdditionalProducts">
						<div class="flex items-center justify-between m-5">
							<div class="flex items-center gap-2">
								<el-icon><Sell /></el-icon>
								<span class="font-medium">Додаткові товари</span>
							</div>
							<div class="flex items-center gap-4">
								<span class="text-sm">
									{{ props.row.additional_products.length }} позиції
								</span>

								<el-button
									type="primary"
									size="small"
									@click="addAdditionalProductsToOrder(props.row)"
								>
									Додати
								</el-button>
							</div>
						</div>

						<el-table
							:data="props.row.additional_products"
							style="width: 100%"
							border
							size="small"
						>
							<el-table-column
								label="Зображення"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<el-popover
										:width="300"
										placement="right"
										popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
									>
										<template #reference>
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
										<template #default>
											<div
												style="display: flex; gap: 16px; flex-direction: column"
											>
												<el-avatar
													shape="square"
													:size="75"
													:src="row.img"
													style="margin-bottom: 8px"
												/>
												<div>
													<p style="margin: 0; font-weight: 500">
														{{ row.name }}
													</p>
													<p
														style="
															margin: 0;
															font-size: 14px;
															color: var(--el-color-info);
														"
													>
														{{ row.second_name }}
													</p>
												</div>

												<p style="margin: 0">
													{{ row.title }}
												</p>
											</div>
										</template>
									</el-popover>
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
										<EditCountPopover
											:initialCount="row.count"
											@update:countValue="newValue => (row.count = newValue)"
										/>
										<span>{{ row.count_name }}</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column
								label="Ціна товару"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<EditPricePopover
										:initialPrice="row.price"
										@update:priceValue="newValue => (row.price = newValue)"
									/>
								</template>
							</el-table-column>

							<el-table-column
								label="Ціна продажу"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<span>{{ row.price * row.count }} &#8372;</span>
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
												@update:textValue="
													newValue => (reserve.place = newValue)
												"
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
												@update:countValue="
													newValue => (reserve.count = newValue)
												"
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
										<div v-for="(reserve, i) in row.warehouse" :key="i">
											<EditTextPopover
												:initialText="reserve.number"
												@update:textValue="
													newValue => (reserve.number = newValue)
												"
											/>
										</div>
									</div>
									<span v-else class="text-gray-400">Не задано</span>
								</template>
							</el-table-column>
							<el-table-column label="Дії" header-align="center" align="center">
								<template #default="{ row }">
									<div class="flex items-center justify-center gap-4">
										<div
											class="text-sm cursor-pointer hover:text-blue-500 transition"
										>
											<el-tooltip content="Додати резерв" placement="top">
												<el-icon @click="addReserveToOrder(row)"
													><DocumentAdd
												/></el-icon>
											</el-tooltip>
										</div>
										<div
											class="text-sm cursor-pointer hover:text-blue-500 transition"
										>
											<el-tooltip content="Редагувати товар" placement="top">
												<el-icon @click="takeCurrentEditProduct(row)"
													><Edit
												/></el-icon>
											</el-tooltip>
										</div>
										<div
											class="text-sm cursor-pointer hover:text-red-500 transition"
										>
											<el-tooltip content="Видалити товар" placement="top">
												<el-icon
													@click="removeAdditionalConfirm(props.row, $index)"
													><Delete
												/></el-icon>
											</el-tooltip>
										</div>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>

					<!--Оплата-->
				</template>
			</el-table-column>

			<!-- Динамически генерируемые колонки таблицы -->
			<el-table-column
				v-for="column in visibleColumns"
				:key="column.key"
				:prop="column.prop"
				:label="column.label"
				:sortable="column.sortable === true"
			>
				<!-- Кастомные шаблоны для определенных колонок -->
				<template #default="{ row }">
					<div
						class="flex items-center gap-2"
						v-if="column.prop === 'order.order_number'"
					>
						<span>{{ row.order.order_number }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition pt-1">
							<el-icon @click="copyText(row.order.order_number)"
								><DocumentCopy
							/></el-icon>
						</div>
					</div>

					<div v-else-if="column.prop === 'order.source'">
						<img class="w-12" :src="row.order.source" alt="source" />
					</div>

					<div v-else-if="column.prop === 'delivery.delivery_date'">
						{{ row.delivery.delivery_date || 'Не задано' }}
					</div>

					<div v-else-if="column.prop === 'order.order_status'">
						<div v-if="row.order.order_status === 'Новий'">
							<el-button type="primary" size="small" style="width: 70px">{{
								row.order.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.order.order_status === 'Доставка'">
							<el-button type="warning" size="small" style="width: 70px">{{
								row.order.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.order.order_status === 'Виконано'">
							<el-button type="success" size="small" style="width: 70px">{{
								row.order.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.order.order_status === 'Скасовано'">
							<el-button type="danger" size="small" style="width: 70px">{{
								row.order.order_status
							}}</el-button>
						</div>
					</div>
					<div
						v-else-if="column.prop === 'order.manager'"
						class="flex items-center gap-4"
					>
						<el-icon><User /></el-icon>
						<span>{{ row.order.manager || 'Не задано' }}</span>
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'customer.phone'"
					>
						<span>{{ row.customer.phone }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition pt-1">
							<el-icon @click="copyText(row.customer.phone)"
								><DocumentCopy
							/></el-icon>
						</div>
					</div>
					<div v-else-if="column.prop === 'delivery.service'">
						{{ row.delivery.service || 'Не задано' }}
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'delivery.ttn'"
					>
						<span>{{ row.delivery.ttn || 'Не задано' }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition pt-1">
							<el-icon @click="copyText(row.delivery.ttn)"
								><DocumentCopy
							/></el-icon>
						</div>
					</div>
					<div v-else-if="column.prop === 'products.name'">
						<div v-for="product in row.products" :key="product.id">
							{{ product.name }} ({{ product.count }} шт.)
						</div>
					</div>
					<div v-else-if="column.prop === 'products.price'">
						{{
							row.products.reduce(
								(sum, product) => sum + product.price * product.count,
								0
							)
						}}
						<span>&#8372;</span>
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'recipient.phone'"
					>
						<span>{{ row.recipient.phone }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition pt-1">
							<el-icon @click="copyText(row.recipient.phone)"
								><DocumentCopy
							/></el-icon>
						</div>
					</div>
					<div v-else-if="column.prop === 'delivery.adress'">
						{{ row.delivery.adress || 'Не задано' }}
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link :hover {
	color: orange;
}
</style>
