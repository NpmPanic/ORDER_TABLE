<script setup>
import {
	Search,
	User,
	Switch,
	Edit,
	Delete,
	ChatRound,
	Phone,
	CirclePlus,
	EditPen,
	DocumentAdd,
	DocumentCopy,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
import CommentEditArea from './components/CommentEditArea.vue'
import ValueEditArea from './components/ValueEditArea.vue'

const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
const isDrawer = ref(false)

// Переменные хранения состояния для добавления комментариев
const isCommentEditManager = ref(false)
const isCommentEditCustomer = ref(false)

// Записываем значение input комментария менеджера из TextEditArea.vue в TABLE_DATA
const updateManagerComment = (row, newComment) => {
	row.order.manager_comment = newComment // Обновляем комментарий в TABLE_DATA
}

// Записываем значение input комментария покупателя из TextEditArea.vue в TABLE_DATA
const updateCustomerComment = (row, newComment) => {
	row.customer.comment = newComment // Обновляем комментарий в TABLE_DATA
}

// Функция копирования текста по клику
const copyText = async text => {
	try {
		await navigator.clipboard.writeText(text)
		ElMessage({
			message: 'Скопійовано до буферу обміну',
			type: 'success',
			plain: true,
		})
	} catch (err) {
		ElMessage({
			message: 'Помилка копіювання',
			type: 'error',
			plain: true,
		})
		console.error('Clipboard error:', err)
	}
}

// Опции для выпадающего списка полей поиска
const optionsSearch = [
	{ value: 'order.order_number', label: '№ замовлення' },
	{ value: 'customer.name', label: 'Покупець' },
	{ value: 'customer.phone', label: 'Телефон покупця' },
	{ value: 'delivery.ttn', label: 'Трекінг код' },
	{ value: 'order.manager', label: 'Менеджер' },
]

// Опции для выпадающего списка служб доставки
const optionsOrderManager = [
	{ value: 'Андрій', label: 'Андрій' },
	{ value: 'Марина', label: 'Марина' },
	{ value: 'Тетяна', label: 'Тетяна' },
	{ value: 'Богдан', label: 'Богдан' },
	{ value: 'Оксана', label: 'Оксана' },
]

// Опции для выпадающего списка служб доставки
const optionsDeliveryService = [
	{ value: 'Нова пошта', label: 'Нова пошта' },
	{ value: 'Самовивіз Київ', label: 'Самовивіз Київ' },
	{ value: 'Самовивіз Львів', label: 'Самовивіз Львів' },
	{ value: 'Самовивіз Ізюм', label: 'Самовивіз Ізюм' },
	{ value: 'Самовивіз Харків', label: 'Самовивіз Харків' },
]

// Опции для выпадающего списка служб доставки
const optionsDeliveryAdress = [
	{ value: 'Відділення №1', label: 'Відділення №1' },
	{ value: 'Відділення №2', label: 'Відділення №2' },
	{ value: 'Відділення №3', label: 'Відділення №3' },
	{ value: 'Відділення №4', label: 'Відділення №4' },
]

// Функция для получения значения из объекта по пути
const getValueByPath = (obj, path) => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Функция генерации номера ТТН
const generatedNumber = ref(null)

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
		sortable: true,
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
		visible: true,
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
		visible: false,
		prop: 'customer.name',
		sortable: true,
	},
	'Телефон покупця': {
		visible: false,
		prop: 'customer.phone',
		sortable: true,
	},
	'E-mail покупця': {
		visible: false,
		prop: 'customer.email',
		sortable: true,
	},
	'Служба доставки': {
		visible: true,
		prop: 'delivery.service',
		sortable: true,
	},
	'Трекінг код': {
		visible: true,
		prop: 'delivery.ttn',
		sortable: false,
	},
	'Статус доставки': {
		visible: false,
		prop: 'delivery.delivery_status',
		sortable: false,
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
		sortable: true,
	},
	'Телефон отримувача': {
		visible: false,
		prop: 'recipient.phone',
		sortable: true,
	},
	Відділення: {
		visible: true,
		prop: 'delivery.adress',
		sortable: true,
	},
	Місто: {
		visible: true,
		prop: 'delivery.city',
		sortable: true,
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
			<el-button @click="isDrawer = true" type="primary" plain>
				Редагувати таблицю
			</el-button>
		</div>
	</div>

	<TableEditDrawer
		v-model="isDrawer"
		:columns="tableColumns"
		@update:columns="handleColumnUpdate"
	/>

	<!-- Основная таблица с данными -->
	<div class="pb-5">
		<el-table
			:data="resultData"
			row-key="id"
			:default-sort="{ prop: 'order.created_at', order: 'descending' }"
			height="100%"
			style="width: 100%"
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
								size="large"
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
								size="large"
								column="1"
							>
								<el-descriptions-item label="Телефон покупця">
									<div class="flex items-center gap-2">
										<ValueEditArea
											:initialText="props.row.customer.phone"
											@update:textValue="
												newValue => (props.row.customer.phone = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="E-mail покупця">
									<div class="flex items-center gap-2">
										<ValueEditArea
											:initialText="props.row.customer.email"
											@update:textValue="
												newValue => (props.row.customer.email = newValue)
											"
										/>
									</div>
								</el-descriptions-item>

								<el-descriptions-item label="Коментар покупця">
									<div class="flex items-center justify-between w-full">
										<CommentEditArea
											v-model="isCommentEditCustomer"
											:initial-text="props.row.customer.comment"
											@update:textValue="
												value => updateCustomerComment(props.row, value)
											"
										/>

										<div
											v-if="!isCommentEditCustomer"
											class="flex items-center gap-2"
										>
											<p>
												{{ props.row.customer.comment || 'Коментар відсутній' }}
											</p>
											<div
												class="flex gap-2 cursor-pointer hover:text-blue-500"
											>
												<el-icon @click="isCommentEditCustomer = true">
													<EditPen />
												</el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>

								<el-descriptions-item label="Коментар менеджера">
									<div class="flex items-center justify-between min-w-full">
										<CommentEditArea
											v-model="isCommentEditManager"
											:initial-text="props.row.order.manager_comment || ''"
											@update:textValue="
												value => updateManagerComment(props.row, value)
											"
										/>

										<div
											v-if="!isCommentEditManager"
											class="flex items-center gap-2"
										>
											<p>
												{{
													props.row.order.manager_comment ||
													'Коментар відсутній'
												}}
											</p>
											<div
												class="flex gap-2 cursor-pointer hover:text-blue-500"
											>
												<el-icon @click="isCommentEditManager = true">
													<EditPen />
												</el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Комунікації">
									<div class="flex items-center gap-2">
										<el-button type="success" :icon="Phone" circle />
										<el-button type="primary" :icon="ChatRound" circle />
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
								size="large"
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
										<ValueEditArea
											:initialText="props.row.recipient.name"
											@update:textValue="
												newValue => (props.row.recipient.name = newValue)
											"
										/>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Телефон отримувача">
									<div class="flex items-center gap-2">
										<ValueEditArea
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
										<span class="min-w-40">{{
											props.row.delivery.ttn || 'Не задано'
										}}</span>
										<div class="flex items-center gap-3 pt-2">
											<div
												@click="generateNumber(props.row)"
												class="cursor-pointer hover:text-green-500 transition"
											>
												<el-icon size="large"><DocumentAdd /></el-icon>
											</div>
											<div
												@click="props.row.delivery.ttn = null"
												class="cursor-pointer hover:text-red-500 transition"
											>
												<el-icon size="large"><Delete /></el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>
					</div>

					<!-- Товари -->
					<div class="w-full mt-5">
						<div class=""></div>
						<el-table :data="props.row.products" style="width: 100%" border>
							<el-table-column
								label="Зображення"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<el-image
										style="width: 60px"
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
								prop="name"
								label="Назва товару"
								header-align="center"
								align="center"
							/>
							<el-table-column
								prop="count"
								label="Кількість"
								header-align="center"
								align="center"
							>
							</el-table-column>
							<el-table-column
								label="Ціна товару"
								header-align="center"
								align="center"
							>
								<template #default="{ row }">
									<span>{{ row.price }} &#8372;</span>
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
								prop="count"
								label="Резерв"
								header-align="center"
								align="center"
							>
							</el-table-column>
							<el-table-column label="Дії" header-align="center" align="center">
								<div class="flex items-center justify-center gap-4">
									<div class="cursor-pointer hover:text-blue-500 transition">
										<el-icon size="large"><Edit /></el-icon>
									</div>
									<div class="cursor-pointer hover:text-red-500 transition">
										<el-icon size="large"><Delete /></el-icon>
									</div>
								</div>
							</el-table-column>
						</el-table>
					</div>

					<!-- Допродажи -->
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
