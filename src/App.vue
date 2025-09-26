<script setup>
import {
	Search,
	User,
	Edit,
	Delete,
	ChatRound,
	Phone,
	DocumentAdd,
	Goods,
	Sell,
	Money,
	PriceTag,
	Box,
	ShoppingCart,
	CreditCard,
	Message,
	Service,
	Menu,
	Document,
	Refresh,
	Location,
	Van,
	Check,
	Switch,
	LocationInformation,
	More,
	Select,
	Setting,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref, watch } from 'vue'
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
import SelectValueDropdown from './components/SelectValueDropdown.vue'
import CreateTtnDialog from './components/CreateTtnDialog.vue'

// Переменная хранения данных поискового запроса
const inputQuerySearch = ref('')
// Активная категория и текущие выбранные опции
const selectedCategory = ref('')
const selectedSubOptions = ref([])
// Категории и возможные значения
const subOptions = {
	source: ['Пошта', 'Менеджер'],
	status: [
		'Новий',
		'Підтверджений',
		'Виїхав банк',
		'Відправлений',
		'Канів видача',
		'Канів на збір',
		'Київ видача',
		'Київ на збір',
		'Кременчук видача',
		'Львів Куліша видача',
		'Львів Куліша на збір',
		'Львів Маф видача',
		'Львів Маф на збір',
		'Львів Сільпо видача',
		'Львів Сільпо на збір',
		'На збір',
		'Піксель видача',
		'Піксель на збір',
		'Південноукраїнськ видача',
		'Південноукраїнськ на збір',
		'Чернівці видача',
		'Чернівці на збір',
		'Чортків видача',
		'Чортків на збір',
		'Харків видача',
		'Харків на збір',
		'Ізюм ЖД видача',
		'Ізюм ЖД на збір',
		'Оплачено',
		'Недозвін - 1',
		'Недозвін - 2',
		'Незабрано',
	],
	manager: ['Андрій', 'Богдан', 'Марина', 'Оксана', 'Тетяна'],
	delivery_service: [
		'Нова пошта',
		'Самовивіз Ізюм ЖД',
		'Самовивіз Канів',
		'Самовивіз Київ',
		'Самовивіз Кременчук',
		'Самовивіз Львів Куліша',
		'Самовивіз Львів Маф',
		'Самовивіз Львів Сільпо',
		'Самовивіз Піксель',
		'Самовивіз Південноукраїнськ',
		'Самовивіз Харків',
		'Самовивіз Чернівці',
		'Самовивіз Чортків',
	],
	delivery_adress: [
		'Відділення №1',
		'Відділення №2',
		'Відділення №3',
		'Відділення №4',
		'Відділення №5',
	],
	delivery_status: [
		'У дорозі',
		'Доставлено',
		'Повернення',
		'Замовлення отримано',
		'Обробка замовлення',
		'Прибуло у відділення',
	],
	pay_status: ['Оплачено', 'Не оплачено'],
}
// Массив для хранения примененных тегов поиска
const appliedSearchTags = ref([])
// Отфильтрованные значения, применённые к таблице
const appliedFilters = ref({
	source: [],
	status: [],
	manager: [],
	delivery_service: [],
	delivery_status: [],
	pay_status: [],
})

// Редактируемые фильтры, до нажатия "Зберегти"
const editingFilters = ref({
	source: [],
	status: [],
	manager: [],
	delivery_service: [],
	delivery_status: [],
	pay_status: [],
})

const dropdownRef = ref(null)

// При открытии фильтров копируем applied -> editing
const openFilters = () => {
	editingFilters.value = JSON.parse(JSON.stringify(appliedFilters.value))
	if (selectedCategory.value) {
		selectedSubOptions.value = [
			...(editingFilters.value[selectedCategory.value] || []),
		]
	}
}

// При смене категории — загрузить её подопции
watch(selectedCategory, newCategory => {
	if (newCategory) {
		selectedSubOptions.value = [...(editingFilters.value[newCategory] || [])]
	}
})

// При смене подопций — сразу обновлять временное хранилище
watch(selectedSubOptions, newOptions => {
	if (selectedCategory.value) {
		editingFilters.value[selectedCategory.value] = [...newOptions]
	}
})

// Сохранить применённые фильтры
const applyFilters = () => {
	appliedFilters.value = JSON.parse(JSON.stringify(editingFilters.value))
	// Обновляем теги поиска
	appliedSearchTags.value = []
	for (const category in appliedFilters.value) {
		if (appliedFilters.value[category].length > 0) {
			appliedFilters.value[category].forEach(value => {
				appliedSearchTags.value.push({
					category,
					value,
				})
			})
		}
	}
	dropdownRef.value?.handleClose?.()
}
// Функция для удаления тега
const handleClose = tag => {
	// Удаляем тег из массива
	const index = appliedSearchTags.value.findIndex(t => t.value === tag.value)
	if (index !== -1) {
		appliedSearchTags.value.splice(index, 1)
	}

	// Обновляем appliedFilters
	appliedFilters.value[tag.category] = appliedFilters.value[
		tag.category
	].filter(v => v !== tag.value)
}
// Функция сброса всех фильтров
const resetFilters = () => {
	appliedFilters.value = {
		source: [],
		status: [],
		manager: [],
		delivery_service: [],
		delivery_status: [],
		pay_status: [],
	}

	editingFilters.value = {
		source: [],
		status: [],
		manager: [],
		delivery_service: [],
		delivery_status: [],
		pay_status: [],
	}

	appliedSearchTags.value = []

	selectedSubOptions.value = []

	dropdownRef.value?.handleClose?.()
}

// Подсчет количества категорий  для фильтра
const filterCount = computed(() => {
	return Object.values(appliedFilters.value).reduce(
		(acc, arr) => acc + arr.length,
		0
	)
})

const isSaveDisabled = computed(() => {
	return !Object.values(editingFilters.value).some(arr => arr.length > 0)
})

// Фильтрация данных таблицы на основе appliedFilters
const resultData = computed(() => {
	const search = inputQuerySearch.value?.trim() || ''
	const filters = appliedFilters.value

	// Фильтрация по поисковому запросу
	const searchFiltered = TABLE_DATA.value.filter(item => {
		if (!search) return true

		const searchLower = search.toLowerCase()
		const customerName = item.customer?.name?.toLowerCase() || ''
		const customerPhone = item.customer?.phone?.toLowerCase() || ''
		const recipientName = item.recipient?.name?.toLowerCase() || ''
		const recipientPhone = item.recipient?.phone?.toLowerCase() || ''
		const orderId = String(item.id)
		const ttn = item.delivery?.ttn?.toLowerCase() || ''

		return (
			orderId.includes(search) ||
			customerName.includes(searchLower) ||
			customerPhone.includes(searchLower) ||
			recipientName.includes(searchLower) ||
			recipientPhone.includes(searchLower) ||
			ttn.includes(searchLower)
		)
	})

	// Фильтрация по примененным фильтрам
	return searchFiltered.filter(item => {
		// Проверяем каждый тип фильтра
		const sourceMatch =
			filters.source.length === 0 ||
			(item.order.source === 'Mail' && filters.source.includes('Пошта')) ||
			(item.order.source === 'Manager' && filters.source.includes('Менеджер'))

		const statusMatch =
			filters.status.length === 0 ||
			filters.status.includes(item.order.order_status)

		const managerMatch =
			filters.manager.length === 0 ||
			filters.manager.includes(item.order.manager)

		const deliveryServiceMatch =
			filters.delivery_service.length === 0 ||
			filters.delivery_service.includes(item.delivery.service)

		const deliveryStatusMatch =
			filters.delivery_status.length === 0 ||
			filters.delivery_status.includes(item.delivery.delivery_status)

		const payStatusMatch =
			filters.pay_status.length === 0 ||
			filters.pay_status.includes(item.order.pay_status)

		return (
			sourceMatch &&
			statusMatch &&
			managerMatch &&
			deliveryServiceMatch &&
			deliveryStatusMatch &&
			payStatusMatch
		)
	})
})

// Вычисляемое свойство для количества отфильтрованных заказов
const filteredOrdersCount = computed(() => {
	return resultData.value.length
})

// Вычисляемое свойство для общей стоимости отфильтрованных заказов
const filteredOrdersTotalPrice = computed(() => {
	return resultData.value.reduce((total, order) => {
		return total + getTotalPrice(order)
	}, 0)
})

// Подсветка строк таблицы согласно статусу заказа
const tableRowClassName = ({ row }) => {
	const statusColor = getStatusColor(row.order.order_status)

	switch (statusColor) {
		case 'primary':
			return 'primary-row'
		case 'success':
			return 'success-row'
		case 'warning':
			return 'warning-row'
		case 'danger':
			return 'danger-row'
		default:
			return ''
	}
}

// Обработчик проверки просмотрен ли заказ
const handleExpandChange = (row, expandedRows) => {
	if (expandedRows.includes(row)) {
		row.isViewed = true
	}
}

// Вспомогательная функция для получения иконки по статусу
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

// Функция для генерации steps на основе текущего статуса доставки
const getDeliverySteps = deliveryStatus => {
	// Порядок статусов доставки (важен для определения что было до и после)
	const statusOrder = [
		'Замовлення отримано',
		'Обробка замовлення',
		'У дорозі',
		'Прибуло у відділення',
		'Доставлено',
		'Повернення',
	]

	// Находим индекс текущего статуса в порядке следования
	const currentIndex = statusOrder.indexOf(deliveryStatus)

	// Генерируем steps
	return statusOrder.map((status, index) => ({
		title: status,
		icon: getStatusIcon(status),
		isCurrent: index === currentIndex,
		isDone: currentIndex >= 0 && index < currentIndex,
	}))
}

const isTableEditDrawer = ref(false)
const isProductsAddDrawer = ref(false)
const isEditProductsDrawer = ref(false)
const isAddReserve = ref(false)
const isAdditionalProducts = ref(true)
const isDeliveryStatusDialog = ref(false)
const isAddOrder = ref(false)
const isCreateTtnNumber = ref(false)

const statusGroups = {
	new: {
		color: 'primary',
		items: ['Новий', 'Підтверджений'],
	},
	processing: {
		color: 'warning',
		items: [
			'Виїхав банк',
			'Відправлений',
			'Канів видача',
			'Канів на збір',
			'Київ видача',
			'Київ на збір',
			'Кременчук видача',
			'Львів Куліша видача',
			'Львів Куліша на збір',
			'Львів Маф видача',
			'Львів Маф на збір',
			'Львів Сільпо видача',
			'Львів Сільпо на збір',
			'На збір',
			'Піксель видача',
			'Піксель на збір',
			'Південноукраїнськ видача',
			'Південноукраїнськ на збір',
			'Чернівці видача',
			'Чернівці на збір',
			'Чортків видача',
			'Чортків на збір',
			'Харків видача',
			'Харків на збір',
			'Ізюм ЖД видача',
			'Ізюм ЖД на збір',
		],
	},
	completed: {
		color: 'success',
		items: ['Оплачено'],
	},
	problem: {
		color: 'danger',
		items: ['Недозвін - 1', 'Недозвін - 2', 'Незабрано', 'Не оплачено'],
	},
}

// Функция для определения цвета по статусу
const getStatusColor = status => {
	for (const group in statusGroups) {
		if (statusGroups[group].items.includes(status)) {
			return statusGroups[group].color
		}
	}
	return 'info' // цвет по умолчанию
}

// Переменная хранения текущего заказа
const currentOrder = ref({})
// Переменная хранения выбраного для редактирования товара
const currentEditProduct = ref({})
// Переменная хранения цены упаковки
const packagePrice = ref(10)

// Обработчик текущего статуса доставки
const showDeliveryStatus = order => {
	currentOrder.value = order
	isDeliveryStatusDialog.value = true
}

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
		reserve => reserve.place && reserve.place.trim() !== ''
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
	'Статус замовлення': {
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
		visible: false,
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
		width: 250,
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
	fontSize: {
		value: 10,
		visible: true,
	},
})

// Вычисляемое свойство для получения размера шрифта
const tableFontSize = computed(() => {
	return tableColumns.value.fontSize?.value || 10
})

// Вычисляемое свойство для получения только видимых колонок таблицы
// Возвращает массив объектов с настройками видимых колонок
const visibleColumns = computed(() => {
	return Object.entries(tableColumns.value)
		.filter(([key, settings]) => settings.visible && key !== 'fontSize') // Исключаем fontSize
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
	tableColumns.value = newColumns
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
	console.log(currentEditProduct.value)
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

// Фрматировка даты создания заказа для отображения в две строки
const formatDateTime = datetime => {
	const [date, time] = datetime.split(' ')
	return `${date}<br/>${time}`
}

// Функция для получения текущей даты и времени
function getTodayDateTime() {
	const today = new Date()

	const day = String(today.getDate()).padStart(2, '0')
	const month = String(today.getMonth() + 1).padStart(2, '0')
	const year = today.getFullYear()

	const hours = String(today.getHours()).padStart(2, '0')
	const minutes = String(today.getMinutes()).padStart(2, '0')

	return `${day}.${month}.${year} ${hours}:${minutes}`
}

// Функция для обновления статуса заказа с добавлением даты изменения
const updateOrderStatus = (order, newStatus) => {
	order.order.order_status = newStatus
	order.order.status_changed_at = getTodayDateTime()
}

// Функция открытия окна создания номера ТТН
const CreateTtnNumber = order => {
	currentOrder.value = order
	isCreateTtnNumber.value = true
}
</script>

<template>
	<!-- Header -->
	<div class="mx-4 my-4">
		<div class="flex">
			<div class="flex items-center gap-4 w-[70%]">
				<el-input
					v-model="inputQuerySearch"
					style="width: 40%"
					placeholder="Пошук"
					:prefix-icon="Search"
					clearable
				/>
				<div class="flex items-center">
					<el-dropdown
						placement="bottom-start"
						trigger="click"
						ref="dropdownRef"
						@visible-change="val => val && openFilters()"
					>
						<el-badge :value="filterCount" :hidden="filterCount === 0">
							<el-button :icon="Menu" type="primary" />
						</el-badge>

						<template #dropdown>
							<div class="w-[600px] py-5">
								<div class="flex h-[400px] px-10">
									<!-- Левая панель 40% -->
									<div
										class="w-[40%] flex flex-col space-y-2 border-r border-slate-200"
									>
										<!-- Категория с подсписком: Джерело -->
										<el-radio label="source" v-model="selectedCategory">
											Джерело
										</el-radio>

										<!-- Категория с подсписком: Статус -->
										<el-radio label="status" v-model="selectedCategory">
											Статус
										</el-radio>

										<!-- Категория с подсписком: Менеджер -->
										<el-radio label="manager" v-model="selectedCategory">
											Менеджер
										</el-radio>

										<!-- Категория с подсписком: Служба доставки -->
										<el-radio
											label="delivery_service"
											v-model="selectedCategory"
										>
											Служба доставки
										</el-radio>

										<!-- Категория с подсписком: Статус доставки -->
										<el-radio
											label="delivery_status"
											v-model="selectedCategory"
										>
											Статус доставки
										</el-radio>

										<!-- Категория с подсписком: Статус оплаты -->
										<el-radio label="pay_status" v-model="selectedCategory">
											Статус оплати
										</el-radio>
									</div>

									<!-- Правая панель 60% -->
									<div
										class="w-[60%] px-10 overflow-y-auto dropdown-with-scroll"
									>
										<!-- Отображение дочернего списка -->
										<template v-if="subOptions[selectedCategory]">
											<el-checkbox-group
												v-model="selectedSubOptions"
												class="flex flex-col space-y-2"
											>
												<el-checkbox
													v-for="item in subOptions[selectedCategory]"
													:key="item"
													:label="item"
												>
													{{ item }}
												</el-checkbox>
											</el-checkbox-group>
										</template>
									</div>
								</div>

								<div class="flex justify-center w-[40%] mt-5">
									<el-button @click="resetFilters" type="default" size="small"
										>Очистити</el-button
									>
									<el-button
										@click="applyFilters"
										:disabled="isSaveDisabled"
										type="primary"
										size="small"
										>Прийняти</el-button
									>
								</div>
							</div>
						</template>
					</el-dropdown>
				</div>
				<div class="flex items-center gap-5 ml-10">
					<el-check-tag checked type="primary"
						>Замовлень: {{ filteredOrdersCount }}</el-check-tag
					>
					<el-check-tag checked type="success"
						>Вартість:
						{{ formatNumber(filteredOrdersTotalPrice) }}</el-check-tag
					>
				</div>
			</div>

			<div class="flex justify-end gap-2 w-[30%]">
				<el-button @click="isAddOrder = true" type="success"
					>Додати замовлення</el-button
				>
				<el-button @click="isTableEditDrawer = true" type="primary">
					Редагувати таблицю
				</el-button>
			</div>
		</div>
		<div class="flex flex-wrap items-center gap-4 mt-4">
			<el-tag
				v-for="tag in appliedSearchTags"
				:key="tag.value"
				type="info"
				effect="plain"
				closable
				size="large"
				:disable-transitions="false"
				@close="handleClose(tag)"
			>
				{{ tag.value }}
			</el-tag>
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
		:warehouseList="optionsWarehouseReserve"
		@save="handleSaveReserves"
	/>
	<AddOrderDialog
		v-model="isAddOrder"
		:new_orderManagerList="subOptions.manager"
		:new_orderDeliveryService="subOptions.delivery_service"
		:new_orderDeliveryAdress="subOptions.delivery_adress"
		:new_orderWarehouseList="optionsWarehouseReserve"
		:new_orderFormatNumber="formatNumber"
		@save-order="handleSaveOrder"
	/>

	<DeliveryStatusDialog
		v-model="isDeliveryStatusDialog"
		:statusHistory="currentOrder.delivery?.status_history || []"
		:currentStatus="currentOrder.delivery?.delivery_status || ''"
	/>
	<CreateTtnDialog v-model="isCreateTtnNumber" :selectedOrder="currentOrder" />

	<!-- Основная таблица с данными -->
	<div class="mx-4 mb-5">
		<el-table
			:data="resultData"
			:style="`font-size: ${tableFontSize}px;`"
			row-key="id"
			:default-sort="{ prop: 'order.created_at', order: 'descending' }"
			height="100%"
			style="width: 100%"
			:row-class-name="tableRowClassName"
			@expand-change="handleExpandChange"
			size="small"
		>
			<!-- Колонка с раскрывающейся секцией -->
			<el-table-column type="expand">
				<template #default="props">
					<div
						class="w-full flex gap-15"
						:style="`font-size: ${tableFontSize}px;`"
					>
						<!-- Замовлення -->

						<div class="w-[28%] shadow-sm px-4 pb-2">
							<div
								class="flex items-center w-1/2 gap-2 text-sm font-semibold text-gray-700 mb-5"
							>
								<el-icon><Sell /></el-icon>
								<h3>Замовлення</h3>
							</div>

							<div class="space-y-3 text-xs">
								<div class="flex items-center">
									<div class="w-1/2">
										<span>№ замовлення</span>
									</div>
									<div class="w-1/2">
										<span>{{ props.row.id }}</span>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Джерело</span>
									</div>
									<div class="w-1/2">
										<span v-if="props.row.order.source === 'Mail'">Пошта</span>
										<span v-else-if="props.row.order.source === 'Manager'"
											>Менеджер</span
										>
										<span v-else>Не задано</span>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Час створення</span>
									</div>
									<div class="w-1/2">
										<span>{{ props.row.order.created_at }}</span>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Менеджер</span>
									</div>
									<div class="w-1/2">
										<SelectValueDropdown
											:initialArray="subOptions.manager"
											:initialValue="props.row.order.manager"
											@update:selectedValue="
												newValue => (props.row.order.manager = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Статус</span>
									</div>
									<div class="w-1/2">
										<el-tag
											:type="getStatusColor(props.row.order.order_status)"
											effect="dark"
										>
											{{ props.row.order.order_status }}
										</el-tag>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Статус оплати</span>
									</div>
									<div class="w-1/2">
										<SelectValueDropdown
											:initialArray="subOptions.pay_status"
											:initialValue="props.row.order.pay_status"
											:useTag="true"
											:statusColor="getStatusColor(props.row.order.pay_status)"
											:getStatusColor="getStatusColor"
											@update:selectedValue="
												newValue => (props.row.order.pay_status = newValue)
											"
										/>
									</div>
								</div>
							</div>
						</div>

						<!-- Покупець -->

						<div class="w-[28%] shadow-sm px-4 pb-2">
							<div
								class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-5"
							>
								<el-icon><User /></el-icon>
								<h3>Покупець</h3>
							</div>

							<div class="space-y-3 text-xs">
								<div class="flex items-center">
									<div class="w-1/2">
										<span>Покупець</span>
									</div>
									<div class="w-1/2">
										<EditTextPopover
											:initialText="props.row.customer.name"
											@update:textValue="
												newValue => (props.row.customer.name = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Телефон покупця</span>
									</div>
									<div class="w-1/2">
										<EditTextPopover
											:initialText="props.row.customer.phone"
											@update:textValue="
												newValue => (props.row.customer.phone = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>E-mail покупця</span>
									</div>
									<div class="w-1/2">
										<EditTextPopover
											:initialText="props.row.customer.email"
											@update:textValue="
												newValue => (props.row.customer.email = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Коментар покупця</span>
									</div>
									<div class="w-1/2">
										<EditCommentPopover
											:initialText="props.row.customer.comment"
											@update:textValue="
												newValue => (props.row.customer.comment = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Коментар менеджера</span>
									</div>
									<div class="w-1/2">
										<EditCommentPopover
											:initialComment="props.row.order.manager_comment"
											@update:textValue="
												newValue => (props.row.order.manager_comment = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Комунікації</span>
									</div>
									<div class="w-1/2">
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
									</div>
								</div>
							</div>
						</div>

						<!-- Отримувач -->

						<div class="w-[28%] shadow-sm px-4 pb-2">
							<div
								class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-5"
							>
								<el-icon><User /></el-icon>
								<h3>Отримувач</h3>
							</div>

							<div class="space-y-3 text-xs">
								<div class="flex items-center">
									<div class="w-1/2">
										<span>Отримувач</span>
									</div>
									<div class="w-1/2">
										<EditTextPopover
											:initialText="props.row.recipient.name"
											@update:textValue="
												newValue => (props.row.recipient.name = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Телефон отримувача</span>
									</div>
									<div class="w-1/2">
										<EditTextPopover
											:initialText="props.row.recipient.phone"
											@update:textValue="
												newValue => (props.row.recipient.phone = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Дата відправки</span>
									</div>
									<div class="w-1/2">
										<el-date-picker
											v-model="props.row.delivery.delivery_date"
											type="date"
											placeholder="Обрати"
											format="DD/MM/YYYY"
											value-format="DD/MM/YYYY"
											style="width: 140px"
											size="small"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Служба доставки</span>
									</div>
									<div class="w-1/2">
										<SelectValueDropdown
											:initialArray="subOptions.delivery_service"
											:initialValue="props.row.delivery.service"
											@update:selectedValue="
												newValue => (props.row.delivery.service = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Адреса доставки</span>
									</div>
									<div class="w-1/2">
										<SelectValueDropdown
											:initialArray="subOptions.delivery_adress"
											:initialValue="props.row.delivery.adress"
											@update:selectedValue="
												newValue => (props.row.delivery.adress = newValue)
											"
										/>
									</div>
								</div>

								<div class="flex items-center">
									<div class="w-1/2">
										<span>Трекінг код</span>
									</div>
									<div class="w-1/2">
										<div class="flex items-center gap-2">
											<span v-if="props.row.delivery.ttn">{{
												props.row.delivery.ttn
											}}</span>
											<div class="flex items-center">
												<div @click="CreateTtnNumber(props.row)">
													<el-link type="success" :underline="false"
														>Створити</el-link
													>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Статус доставки -->
						<div class="w-[16%] shadow-sm px-4 pb-2">
							<div class="flex items-center gap-10 mb-5">
								<div
									class="flex items-center gap-2 text-sm font-semibold text-gray-700"
								>
									<el-icon><LocationInformation /></el-icon>
									<h3>Статус доставки</h3>
								</div>
								<div
									class="cursor-pointer hover:text-blue-500 transition"
									@click="showDeliveryStatus(props.row)"
								>
									<el-tooltip
										effect="dark"
										content="Додаткова інформація"
										placement="top"
									>
										<el-icon><More /></el-icon>
									</el-tooltip>
								</div>
							</div>
							<div class="pl-1 text-xs">
								<el-timeline>
									<el-timeline-item
										v-for="(step, index) in getDeliverySteps(
											props.row.delivery.delivery_status
										)"
										:key="index"
										:icon="step.icon"
										:type="
											step.isCurrent
												? 'primary'
												: step.isDone
												? 'success'
												: 'info'
										"
										size="large"
									>
										<div
											class="ml-3 pt-1"
											:class="{
												'text-blue-500': step.isCurrent,
												'font-bold': step.isCurrent,
												'font-semibold': !step.isCurrent,
												'text-green-600': step.isDone,
											}"
										>
											{{ step.title }}
										</div>
									</el-timeline-item>
								</el-timeline>
							</div>
						</div>
					</div>

					<!--Товары-->
					<div class="flex w-full justify-between gap-2">
						<div class="w-4/5">
							<div>
								<div class="flex items-center justify-between m-2">
									<div class="flex items-center gap-2">
										<el-icon><Goods /></el-icon>
										<span class="font-medium text-sm">Товари замовлення</span>
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
										width="400px"
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
								<div class="flex items-center justify-between m-2">
									<div class="flex items-center gap-2">
										<el-icon><Sell /></el-icon>
										<span class="font-medium text-sm">Додаткові товари</span>
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
										width="400px"
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
						<div
							class="flex-1 px-5 mt-10 bg-white shadow-sm"
							:class="{
								'self-end pb-5': props.row.additional_products.length > 1,
							}"
						>
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

							<hr class="my-5 border-gray-300" />

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

			<!-- Колонка отображения статуса просмотра -->
			<el-table-column width="20" header-align="center" align="center">
				<template #header> </template>
				<template #default="{ row }">
					<div class="flex justify-center text-green-500">
						<el-icon v-if="row.isViewed === true"><Select /></el-icon>
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
				:width="column.width"
				header-align="center"
				align="center"
			>
				<!-- Кастомные шаблоны для определенных колонок -->
				<template #default="{ row }">
					<div
						class="flex items-center justify-center gap-2"
						v-if="column.prop === 'isViewed'"
					>
						<el-icon v-if="row.isViewed === true"><View /></el-icon>
						<el-icon v-else><Hide /></el-icon>
					</div>
					<div
						@click="copyText(row.id)"
						class="flex items-center justify-center cursor-pointer"
						v-if="column.prop === 'id'"
					>
						<span>{{ row.id }}</span>
					</div>

					<div
						v-else-if="column.prop === 'order.source'"
						class="cursor-pointer"
					>
						<el-tooltip trigger="click" effect="light" placement="bottom">
							<template #default>
								<div v-if="row.order.source === 'Mail'">
									<div class="flex items-center justify-center gap-2">
										<el-icon><Message /></el-icon>
										<span>Пошта</span>
									</div>
								</div>
								<div v-else-if="row.order.source === 'Manager'">
									<div class="flex items-center justify-center gap-2">
										<el-icon><Service /></el-icon>
										<span>Менеджер</span>
									</div>
								</div>
							</template>
							<template #content>
								<div class="flex items-center gap-2">
									<span class="text-sm">utm:</span>
									<el-link type="primary" :underline="false">
										<span>{{ row.order.source_utm }}</span>
									</el-link>
								</div>
							</template>
						</el-tooltip>
					</div>

					<div v-else-if="column.prop === 'order.created_at'">
						<div v-html="formatDateTime(row.order.created_at)"></div>
					</div>

					<div v-else-if="column.prop === 'delivery.delivery_date'">
						{{ row.delivery.delivery_date || 'Не задано' }}
					</div>

					<div
						v-else-if="column.prop === 'order.order_status'"
						class="flex flex-col items-center"
					>
						<SelectValueDropdown
							:initialArray="subOptions.status"
							:initialValue="row.order.order_status"
							:useTag="true"
							:getStatusColor="getStatusColor"
							:statusColor="getStatusColor(row.order.order_status)"
							@update:selectedValue="
								newValue => updateOrderStatus(row, newValue)
							"
						/>
						<span
							v-if="row.order.status_changed_at"
							class="text-xs text-gray-500 mt-1"
						>
							{{ row.order.status_changed_at }}
						</span>
					</div>
					<div
						v-else-if="column.prop === 'order.manager'"
						class="flex items-center justify-center gap-4"
					>
						<el-icon><User /></el-icon>
						<span>{{ row.order.manager || 'Не задано' }}</span>
					</div>
					<div
						@click="copyText(row.customer.phone)"
						class="flex items-center justify-center cursor-pointer"
						v-else-if="column.prop === 'customer.phone'"
					>
						<span>{{ row.customer.phone }}</span>
					</div>
					<div v-else-if="column.prop === 'delivery.service'">
						{{ row.delivery.service || 'Не задано' }}
					</div>
					<div
						@click="copyText(row.delivery.ttn)"
						class="flex items-center cursor-pointer"
						v-else-if="column.prop === 'delivery.ttn'"
					>
						<span>{{ row.delivery.ttn || 'Не задано' }}</span>
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
						@click="copyText(row.recipient.phone)"
						class="flex items-center cursor-pointer"
						v-else-if="column.prop === 'recipient.phone'"
					>
						<span>{{ row.recipient.phone }}</span>
					</div>
					<div v-else-if="column.prop === 'delivery.adress'">
						{{ row.delivery.adress || 'Не задано' }}
					</div>
					<div v-else-if="column.prop === 'delivery.city'">
						{{ row.delivery.city || 'Не задано' }}
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
/* Стили изменения шрифта */
:deep(.el-table__expanded-cell) {
	font-size: v-bind('tableFontSize + "px"') !important;
}

:deep(.el-table__expanded-cell *) {
	font-size: inherit !important;
}

/* Стили линков */
.package-price-link :deep(.el-link) {
	font-size: 18px;
}

/* Размер кружков таймлайна */
:deep(.el-timeline-item__node) {
	width: 20px !important;
	height: 20px !important;
	left: -5px !important;
}

/* Размер иконок внутри кружков */
:deep(.el-timeline-item__icon) {
	font-size: 12px !important;
}

/* Отступы между элементами */
:deep(.el-timeline-item) {
	padding-bottom: 1px !important;
}

/* Ширина полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar {
	width: 6px;
}
/* Фон полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar-track {
	background: white;
}
/* Цвет полосы прокрутки */
.dropdown-with-scroll::-webkit-scrollbar-thumb {
	background: #999999;
	border-radius: 3px;
}
/* Цвет полосы прокрутки :hover */
.dropdown-with-scroll::-webkit-scrollbar-thumb:hover {
	background: #666666;
}
:deep(.el-table .primary-row) {
	--el-table-tr-bg-color: var(--el-color-primary-light-8) !important;
}
:deep(.el-table .success-row) {
	--el-table-tr-bg-color: var(--el-color-success-light-8) !important;
}
:deep(.el-table .warning-row) {
	--el-table-tr-bg-color: var(--el-color-warning-light-8) !important;
}
:deep(.el-table .danger-row) {
	--el-table-tr-bg-color: var(--el-color-danger-light-8) !important;
}
</style>
