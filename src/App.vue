<script setup>
import {
	Search,
	User,
	Switch,
	CopyDocument,
	Edit,
	Delete,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref, watch } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
import TextEditArea from './components/TextEditArea.vue'

const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
const isDrawer = ref(false)

// Переменные хранения состояния и значения для модалки добавления комментария
const isTextEditArea = ref(false)
const TextEditAreaValue = ref('')

// Записываем значение input из TextEditArea.vue в TextEditAreaValue
const handleTextUpdate = value => {
	TextEditAreaValue.value = value
	isTextEditArea.value = false
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
const options = [
	{ value: 'order_number', label: '№ замовлення' },
	{ value: 'customer.name', label: 'Покупець' },
	{ value: 'customer.phone', label: 'Телефон покупця' },
	{ value: 'delivery.ttn', label: 'Трекінг код' },
	{ value: 'manager', label: 'Менеджер' },
]

// Функция для получения значения из объекта по пути
const getValueByPath = (obj, path) => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
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
		prop: 'order_number',
		sortable: true,
	},
	Джерело: {
		visible: true,
		prop: 'source',
		sortable: true,
	},
	'Час створення': {
		visible: false,
		prop: 'created_at',
		sortable: true,
	},
	'Дата доставки': {
		visible: false,
		prop: 'delivery_date',
		sortable: true,
	},
	Статус: {
		visible: true,
		prop: 'status.order_status',
		sortable: false,
	},
	Менеджер: {
		visible: false,
		prop: 'manager',
		sortable: true,
	},
	Покупець: {
		visible: true,
		prop: 'customer.name',
		sortable: true,
	},
	'Телефон покупця': {
		visible: true,
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
		prop: 'delivery.status',
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
					v-for="item in options"
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
			:default-sort="{ prop: 'created_at', order: 'descending' }"
			height="100%"
			style="width: 100%"
		>
			<!-- Колонка с раскрывающейся секцией -->
			<el-table-column type="expand">
				<template #default="props">
					<div class="w-full flex">
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
										<span>{{ props.row.order_number }}</span>
										<div class="cursor-pointer hover:text-blue-500 transition">
											<el-icon @click="copyText(props.row.order_number)"
												><CopyDocument
											/></el-icon>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Джерело">
									<img class="w-10" :src="props.row.source" alt="" />
								</el-descriptions-item>
								<el-descriptions-item label="Час створення">{{
									props.row.created_at
								}}</el-descriptions-item>
								<el-descriptions-item label="Менеджер">{{
									props.row.manager
								}}</el-descriptions-item>
								<el-descriptions-item label="Статус">
									<div v-if="props.row.status.order_status === 'Новий'">
										<el-button
											type="primary"
											size="small"
											style="width: 70px"
											>{{ props.row.status.order_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.status.order_status === 'Доставка'">
										<el-button
											type="warning"
											size="small"
											style="width: 70px"
											>{{ props.row.status.order_status }}</el-button
										>
									</div>
									<div v-else-if="props.row.status.order_status === 'Виконано'">
										<el-button
											type="success"
											size="small"
											style="width: 70px"
											>{{ props.row.status.order_status }}</el-button
										>
									</div>
									<div
										v-else-if="props.row.status.order_status === 'Скасовано'"
									>
										<el-button type="danger" size="small" style="width: 70px">{{
											props.row.status.order_status
										}}</el-button>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Статус оплати">
									<div v-if="props.row.status.pay_status === 'Оплачено'">
										<el-button
											type="success"
											size="small"
											style="width: 70px"
											>{{ props.row.status.pay_status }}</el-button
										>
									</div>
									<div
										v-else-if="props.row.status.pay_status === 'Не оплачено'"
									>
										<el-button type="danger" size="small" plain>{{
											props.row.status.pay_status
										}}</el-button>
									</div>
								</el-descriptions-item>
							</el-descriptions>
						</div>
						<div class="w-1/3">
							<el-descriptions
								direction="horisontal"
								border
								style="margin: 0px"
								size="large"
								column="1"
							>
								<el-descriptions-item label="Ім'я покупця">{{
									props.row.customer.name
								}}</el-descriptions-item>
								<el-descriptions-item label="Телефон покупця"
									><div class="flex items-center gap-2">
										<span>{{ props.row.customer.phone }}</span>
										<div class="cursor-pointer hover:text-blue-500 transition">
											<el-icon @click="copyText(props.row.customer.phone)"
												><CopyDocument
											/></el-icon>
										</div></div
								></el-descriptions-item>
								<el-descriptions-item label="E-mail покупця">{{
									props.row.customer.email
								}}</el-descriptions-item>
								<el-descriptions-item label="Коментар менеджера">
									<div class="flex items-center justify-between min-w-full">
										<TextEditArea
											v-model="isTextEditArea"
											:initial-text="TextEditAreaValue"
											@update:textValue="handleTextUpdate"
										/>

										<div v-if="!isTextEditArea" class="flex items-center gap-2">
											<p>{{ TextEditAreaValue || 'Коментар відсутній' }}</p>
											<div
												class="flex gap-2 cursor-pointer hover:text-blue-500"
											>
												<el-icon @click="isTextEditArea = true">
													<Edit />
												</el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Трекінг код"
									><div class="flex items-center gap-2">
										<span>{{ props.row.delivery.ttn }}</span>
										<div class="cursor-pointer hover:text-blue-500 transition">
											<el-icon @click="copyText(props.row.delivery.ttn)"
												><CopyDocument
											/></el-icon>
										</div></div
								></el-descriptions-item>
							</el-descriptions>
						</div>
					</div>

					<div class="w-full mt-15">
						<el-descriptions
							direction="vertical"
							border
							style="margin: 0px"
							size="large"
							column="7"
						>
							<el-descriptions-item :rowspan="2" :width="200" align="center">
								<template #label>
									<el-badge
										:value="props.row.products.count"
										:offset="[15, 10]"
										type="primary"
									>
										<h1 class="">Товари</h1>
									</el-badge>
								</template>
								<el-image style="width: 70px" :src="props.row.products.img" />
							</el-descriptions-item>
							<el-descriptions-item label="Артикуль" align="center">{{
								props.row.products.id
							}}</el-descriptions-item>
							<el-descriptions-item label="Назва товару" align="center">{{
								props.row.products.name
							}}</el-descriptions-item>
							<el-descriptions-item label="Кількість" align="center">
								{{ props.row.products.count }} <span>шт.</span>
							</el-descriptions-item>
							<el-descriptions-item label="Ціна товару" align="center"
								>{{ props.row.products.price }} <span>&#8372;</span>
							</el-descriptions-item>
							<el-descriptions-item label="Ціна продажу" align="center"
								>{{ props.row.products.price * props.row.products.count }}
								<span>&#8372;</span>
							</el-descriptions-item>

							<el-descriptions-item label="Дії" align="center">
								<div class="flex items-center gap-5 justify-center">
									<div class="cursor-pointer hover:text-blue-500 transition">
										<el-icon size="large"><Edit /></el-icon>
									</div>
									<div class="cursor-pointer hover:text-red-500 transition">
										<el-icon size="large"><Delete /></el-icon>
									</div>
								</div>
							</el-descriptions-item>
						</el-descriptions>
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
					<div
						class="flex items-center gap-2"
						v-if="column.prop === 'order_number'"
					>
						<span>{{ row.order_number }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition">
							<el-icon @click="copyText(row.order_number)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>

					<div v-else-if="column.prop === 'source'">
						<img class="w-12" :src="row.source" alt="source" />
					</div>
					<div v-else-if="column.prop === 'status.order_status'">
						<div v-if="row.status.order_status === 'Новий'">
							<el-button type="primary" size="small" style="width: 70px">{{
								row.status.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.status.order_status === 'Доставка'">
							<el-button type="warning" size="small" style="width: 70px">{{
								row.status.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.status.order_status === 'Виконано'">
							<el-button type="success" size="small" style="width: 70px">{{
								row.status.order_status
							}}</el-button>
						</div>
						<div v-else-if="row.status.order_status === 'Скасовано'">
							<el-button type="danger" size="small" style="width: 70px">{{
								row.status.order_status
							}}</el-button>
						</div>
					</div>
					<div
						v-else-if="column.prop === 'manager'"
						class="flex items-center gap-4"
					>
						<el-icon><User /></el-icon>
						<span>{{ row.manager }}</span>
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'customer.phone'"
					>
						<span>{{ row.customer.phone }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition">
							<el-icon @click="copyText(row.customer.phone)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>
					<div v-else-if="column.prop === 'delivery.service'">
						<img class="w-12 ml-5" :src="row.delivery.service" alt="source" />
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'delivery.ttn'"
					>
						<span>{{ row.delivery.ttn }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition">
							<el-icon @click="copyText(row.delivery.ttn)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>
					<div v-else-if="column.prop === 'products.price'">
						{{ row.products.price * row.products.count }} <span>&#8372;</span>
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'recipient.phone'"
					>
						<span>{{ row.recipient.phone }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition">
							<el-icon @click="copyText(row.recipient.phone)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
