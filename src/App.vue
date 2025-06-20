<script setup>
import {
	Search,
	User,
	Edit,
	Delete,
	ChatRound,
	Phone,
	DocumentAdd,
	DocumentCopy,
	Goods,
	Sell,
	Money,
	PriceTag,
	Box,
	ShoppingCart,
	CreditCard,
	Message,
	Service,
	View,
} from '@element-plus/icons-vue'
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
import AddReserveDialog from './components/AddReserveDialog.vue'
import AddOrderDialog from './components/AddOrderDialog.vue'
import DeliveryStatusDialog from './components/DeliveryStatusDialog.vue'

// Опции для выбора полей поиска
const multiple = { multiple: true, expandTrigger: 'click' }
const options = [
	{
		value: 'id',
		label: '№ замовлення',
	},
	{
		value: 'order.order_status',
		label: 'Статус',
		children: [
			{
				value: 'Новий',
				label: 'Новий',
			},
			{
				value: 'На збір',
				label: 'На збір',
			},
			{
				value: 'Недозвін - 1',
				label: 'Недозвін - 1',
			},
			{
				value: 'Недозвін - 2',
				label: 'Недозвін - 2',
			},
			{
				value: 'Незабрано',
				label: 'Незабрано',
			},
			{
				value: 'Виїхав банк',
				label: 'Виїхав банк',
			},
			{
				value: 'Відправлений',
				label: 'Відправлений',
			},
			{
				value: 'Підтверджений',
				label: 'Підтверджений',
			},
			{
				value: 'Оплачено',
				label: 'Оплачено',
			},
			{
				value: 'Кременчук видача',
				label: 'Кременчук видача',
			},
			{
				value: 'Київ на збір',
				label: 'Київ на збір',
			},
			{
				value: 'Київ видача',
				label: 'Київ видача',
			},
			{
				value: 'Харків на збір',
				label: 'Харків на збір',
			},
			{
				value: 'Харків видача',
				label: 'Харків видача',
			},
			{
				value: 'Чернівці на збір',
				label: 'Чернівці на збір',
			},
			{
				value: 'Чернівці видача',
				label: 'Чернівці видача',
			},
			{
				value: 'Львів Куліша на збір',
				label: 'Львів Куліша на збір',
			},
			{
				value: 'Львів Куліша видача',
				label: 'Львів Куліша видача',
			},
			{
				value: 'Львів Маф на збір',
				label: 'Львів Маф на збір',
			},
			{
				value: 'Львів Маф видача',
				label: 'Львів Маф видача',
			},
			{
				value: 'Львів Сільпо на збір',
				label: 'Львів Сільпо на збір',
			},
			{
				value: 'Львів Сільпо видача',
				label: 'Львів Сільпо видача',
			},
			{
				value: 'Піксель на збір',
				label: 'Піксель на збір',
			},
			{
				value: 'Піксель видача',
				label: 'Піксель видача',
			},
			{
				value: 'Ізюм ЖД на збір',
				label: 'Ізюм ЖД на збір',
			},
			{
				value: 'Ізюм ЖД видача',
				label: 'Ізюм ЖД видача',
			},
			{
				value: 'Канів на збір',
				label: 'Канів на збір',
			},
			{
				value: 'Канів видача',
				label: 'Канів видача',
			},
			{
				value: 'Чортків на збір',
				label: 'Чортків на збір',
			},
			{
				value: 'Чортків видача',
				label: 'Чортків видача',
			},
			{
				value: 'Південноукраїнськ на збір',
				label: 'Південноукраїнськ на збір',
			},
			{
				value: 'Південноукраїнськ видача',
				label: 'Південноукраїнськ видача',
			},
		],
	},

	{
		value: 'order.manager',
		label: 'Менеджер',
		children: [
			{
				value: 'Андрій',
				label: 'Андрій',
			},
			{
				value: 'Марина',
				label: 'Марина',
			},
			{
				value: 'Тетяна',
				label: 'Тетяна',
			},
			{
				value: 'Богдан',
				label: 'Богдан',
			},
			{
				value: 'Оксана',
				label: 'Оксана',
			},
		],
	},
	{
		value: 'customer.name',
		label: 'Покупець',
	},
	{
		value: 'customer.phone',
		label: 'Телефон покупця',
	},
	{
		value: 'delivery.ttn',
		label: 'Трекінг код',
	},
]

// Переменная хранения данных поискового запроса
const inputQuerySearch = ref('')
// Переменная хранения данных категории поиска
const categoryQuerySearch = ref([])

const isTableEditDrawer = ref(false)
const isProductsAddDrawer = ref(false)
const isEditProductsDrawer = ref(false)
const isAddReserve = ref(false)
const isAdditionalProducts = ref(true)
const isDeliveryStatusDialog = ref(false)
const isAddOrder = ref(false)
// Переменная хранения текущего заказа
const currentOrder = ref({})
// Переменная хранения выбраного для редактирования товара
const currentEditProduct = ref({})
// Переменная хранения цены упаковки
const packagePrice = ref(10)

const handleSaveOrder = newOrder => {
	// Создаем полный объект заказа с ID
	const completeOrder = {
		...newOrder,
	}

	// Добавляем заказ в массив
	TABLE_DATA.value.push(completeOrder)

	ElMessage({
		type: 'success',
		message: 'Замовлення успішно додано',
	})
}

// Функция подсчета общей цены за товары в текущем заказе
const getTotalProductsPrice = order => {
	const mainProductsSum = order.products.reduce(
		(sum, p) => sum + p.price * p.count,
		0
	)
	const additionalProductsSum = order.additional_products?.reduce(
		(sum, p) => sum + p.price * p.count,
		0
	)
	return +mainProductsSum.toFixed(2) + +additionalProductsSum.toFixed(2)
}

// Функция подсчета цены наложеного платежа к текущему заказу
const getDeliveryPrice = order => {
	const mainDeliverySum = getTotalProductsPrice(order) * 0.02 + 20
	return +mainDeliverySum.toFixed(2)
}

// Функция подсчета сумарной суммы к текущему заказу
const getTotalPrice = order => {
	const mainTotalSum =
		getTotalProductsPrice(order) + getDeliveryPrice(order) + packagePrice.value
	return +mainTotalSum.toFixed(2)
}

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
	return TABLE_DATA.value
})

// Объект с настройками колонок таблицы
const tableColumns = ref({
	'№ замовлення': {
		visible: true,
		prop: 'id',
		sortable: false,
	},
	Джерело: {
		visible: true,
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

// Фрматировка в денежный формат с округлением
function formatNumber(value) {
	const rounded = Math.round(value)
	return new Intl.NumberFormat('uk-UA').format(rounded)
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
			<div class="flex gap-5">
				<el-dropdown placement="bottom-start" trigger="click">
					<el-button type="primary">Фільтри</el-button>
					<template #dropdown>
						<div>
							<el-cascader-panel
								v-model="categoryQuerySearch"
								style="width: fit-content"
								:options="options"
								:props="multiple"
							/>
						</div>
					</template>
				</el-dropdown>
				<div v-for="item in categoryQuerySearch" :key="item.index">
					<el-tag type="primary" size="large">{{ item }}</el-tag>
				</div>
			</div>
		</div>
		<div>
			<el-button @click="isAddOrder = true" type="success" plain
				>Додати замовлення</el-button
			>
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
		@save="handleEditProductSave"
	/>
	<AddReserveDialog
		v-model="isAddReserve"
		:product="currentEditProduct"
		:countProduct="currentEditProduct.count"
		:warehouseList="optionsWarehouseReserve"
		@save="handleSaveReserves"
	/>
	<AddOrderDialog
		v-model="isAddOrder"
		:new_orderManagerList="optionsOrderManager"
		:new_orderDeliveryService="optionsDeliveryService"
		:new_orderDeliveryAdress="optionsDeliveryAdress"
		:new_orderWarehouseList="optionsWarehouseReserve"
		:new_orderFormatNumber="formatNumber"
		@save-order="handleSaveOrder"
	/>
	<DeliveryStatusDialog v-model="isDeliveryStatusDialog" />

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
					<div class="w-full flex gap-2 px-4">
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
										<span>{{ props.row.id }}</span>
										<div
											class="cursor-pointer hover:text-blue-500 transition pt-1"
										>
											<el-icon @click="copyText(props.row.id)"
												><DocumentCopy
											/></el-icon>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Джерело">
									<div v-if="props.row.order.source === 'Prom'">
										<div class="flex items-center gap-2">
											<el-icon><Message /></el-icon>
											<span>Пошта</span>
										</div>
									</div>
									<div v-else-if="props.row.order.source === 'Manager'">
										<div class="flex items-center gap-2">
											<el-icon><Service /></el-icon>
											<span>Менеджер</span>
										</div>
									</div>
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
										:initialComment="props.row.order.manager_comment"
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
									<div class="flex items-center gap-2">
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
										<div
											class="text-sm cursor-pointer hover:text-blue-500 transition"
										>
											<el-tooltip
												class="box-item"
												effect="dark"
												content="Переглянути статус доставки"
												placement="top"
											>
												<el-icon @click="isDeliveryStatusDialog = true"
													><View
												/></el-icon>
											</el-tooltip>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Трекінг код">
									<div class="flex items-center gap-4">
										<span class="min-w-40">{{ props.row.delivery.ttn }}</span>
										<div class="flex items-center gap-3 pt-2">
											<div
												@click="generateNumber(props.row)"
												class="text-sm cursor-pointer hover:text-green-500 transition"
											>
												<el-tooltip
													class="box-item"
													effect="dark"
													content="Створити номер"
													placement="top"
												>
													<el-icon><DocumentAdd /></el-icon>
												</el-tooltip>
											</div>
											<div
												@click="props.row.delivery.ttn = null"
												class="text-sm cursor-pointer hover:text-red-500 transition"
											>
												<el-tooltip
													class="box-item"
													effect="dark"
													content="Видалити номер"
													placement="top"
												>
													<el-icon><Delete /></el-icon>
												</el-tooltip>
											</div>
										</div>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>
					</div>

					<!--Товары-->
					<div class="flex w-full justify-between gap-2 px-4">
						<div class="w-4/5">
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
												<EditCountPopover
													:initialCount="row.count"
													@update:countValue="
														newValue => (row.count = newValue)
													"
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
											<div class="flex items-center justify-center gap-1">
												<EditPricePopover
													:initialPrice="row.price"
													@update:priceValue="
														newValue => (row.price = newValue)
													"
												/>
												<span> грн</span>
											</div>
										</template>
									</el-table-column>

									<el-table-column
										label="Ціна продажу"
										header-align="center"
										align="center"
									>
										<template #default="{ row }">
											<span>{{ formatNumber(row.price * row.count) }} грн</span>
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
														:maxCount="getMaxReserveCount(row, i)"
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
												<div
													class="flex items-center justify-center gap-4"
													v-for="(reserve, i) in row.warehouse"
													:key="i"
												>
													<EditTextPopover
														:initialText="reserve.number"
														@update:textValue="
															newValue => (reserve.number = newValue)
														"
													/>
													<div
														class="mt-1 cursor-pointer hover:text-red-500 transition"
													>
														<el-tooltip
															content="Видалити резерв"
															placement="top"
														>
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

									<el-table-column
										label="Дії"
										header-align="center"
										align="center"
									>
										<template #default="{ row }">
											<div class="flex items-center justify-center gap-4">
												<div
													class="text-sm cursor-pointer hover:text-green-500 transition"
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
													<el-tooltip
														content="Редагувати товар"
														placement="top"
													>
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
															@click="removeOrderConfirm(props.row, $index)"
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
												<EditCountPopover
													:initialCount="row.count"
													@update:countValue="
														newValue => (row.count = newValue)
													"
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
											<div class="flex items-center justify-center gap-1">
												<EditPricePopover
													:initialPrice="row.price"
													@update:priceValue="
														newValue => (row.price = newValue)
													"
												/>
												<span> грн</span>
											</div>
										</template>
									</el-table-column>

									<el-table-column
										label="Ціна продажу"
										header-align="center"
										align="center"
									>
										<template #default="{ row }">
											<span>{{ formatNumber(row.price * row.count) }} грн</span>
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
														:maxCount="getMaxReserveCount(row, i)"
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
												<div
													class="flex items-center justify-center gap-4"
													v-for="(reserve, i) in row.warehouse"
													:key="i"
												>
													<EditTextPopover
														:initialText="reserve.number"
														@update:textValue="
															newValue => (reserve.number = newValue)
														"
													/>
													<div
														class="mt-1 cursor-pointer hover:text-red-500 transition"
													>
														<el-tooltip
															content="Видалити резерв"
															placement="top"
														>
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
									<el-table-column
										label="Дії"
										header-align="center"
										align="center"
									>
										<template #default="{ row }">
											<div class="flex items-center justify-center gap-4">
												<div
													class="text-sm cursor-pointer hover:text-green-500 transition"
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
													<el-tooltip
														content="Редагувати товар"
														placement="top"
													>
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
															@click="
																removeAdditionalConfirm(props.row, $index)
															"
															><Delete
														/></el-icon>
													</el-tooltip>
												</div>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>

						<!--Оплата-->
						<div class="flex-1 mt-15 bg-white shadow-sm">
							<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
								<el-icon><PriceTag /></el-icon>
								Підсумкова вартість
							</h2>

							<div class="space-y-3">
								<div class="flex justify-between items-center text-gray-700">
									<div class="flex items-center gap-2">
										<el-icon><ShoppingCart /></el-icon>
										<span>Вартість товарів</span>
									</div>
									<span class="text-lg"
										>{{
											formatNumber(getTotalProductsPrice(props.row))
										}}
										грн</span
									>
								</div>

								<div class="flex justify-between items-center text-gray-700">
									<div class="flex items-center gap-2">
										<el-icon><Money /></el-icon>
										<span>Накладений платіж (2% + 20 грн)</span>
									</div>
									<span class="text-lg"
										>{{ formatNumber(getDeliveryPrice(props.row)) }} грн</span
									>
								</div>

								<div class="flex justify-between items-center text-gray-700">
									<div class="flex items-center gap-2">
										<el-icon><Box /></el-icon>
										<span>Вартість упакування</span>
									</div>
									<div class="flex items-center gap-1 package-price-link">
										<EditPricePopover
											:initialPrice="packagePrice"
											@update:priceValue="newValue => (packagePrice = newValue)"
										/>
										<span class="text-lg"> грн</span>
									</div>
								</div>
							</div>

							<hr class="my-4 border-gray-300" />

							<div
								class="flex justify-between items-center text-xl font-bold text-blue-600"
							>
								<div class="flex items-center gap-2">
									<el-icon><CreditCard /></el-icon>
									<span>Загальна вартість</span>
								</div>
								<span>{{ formatNumber(getTotalPrice(props.row)) }} грн</span>
							</div>
						</div>
					</div>
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
					<div class="flex items-center gap-2" v-if="column.prop === 'id'">
						<span>{{ row.id }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition pt-1">
							<el-icon @click="copyText(row.id)"><DocumentCopy /></el-icon>
						</div>
					</div>

					<div v-else-if="column.prop === 'order.source'">
						<div v-if="row.order.source === 'Prom'">
							<div class="flex items-center gap-2">
								<el-icon><Message /></el-icon>
								<span>Пошта</span>
							</div>
						</div>
						<div v-else-if="row.order.source === 'Manager'">
							<div class="flex items-center gap-2">
								<el-icon><Service /></el-icon>
								<span>Менеджер</span>
							</div>
						</div>
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
						{{ formatNumber(getTotalPrice(row)) }}
						<span> грн</span>
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
.el-link :hover {
	color: orange;
}
.package-price-link :deep(.el-link) {
	font-size: 18px;
}
</style>
