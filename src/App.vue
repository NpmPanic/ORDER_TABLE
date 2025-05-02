<script setup>
import {
	Search,
	User,
	Switch,
	CopyDocument,
	Edit,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref, watch } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
import TextEditDialog from './components/TextEditDialog.vue'

const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
const isDrawer = ref(false)

// Переменные хранения состояния и значения для модалки добавления комментария
const isTextEditDialog = ref(false)
const TextEditDialogValue = ref('')

// Записываем значение input из TextEditDialog.vue в TextEditDialogValue
const handleTextUpdate = value => {
	TextEditDialogValue.value = value
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
		width: '150',
	},
	Джерело: {
		visible: true,
		prop: 'source',
		width: '120',
	},
	'Час створення': {
		visible: true,
		prop: 'created_at',
		width: '150',
	},
	'Дата доставки': {
		visible: false,
		prop: 'delivery_date',
		width: '150',
	},
	Статус: {
		visible: true,
		prop: 'status.order_status',
		width: '120',
	},
	Менеджер: {
		visible: true,
		prop: 'manager',
		width: '120',
	},
	Покупець: {
		visible: true,
		prop: 'customer.name',
		width: '150',
	},
	'Телефон покупця': {
		visible: true,
		prop: 'customer.phone',
		width: '170',
	},
	'E-mail покупця': {
		visible: false,
		prop: 'customer.email',
		width: '170',
	},
	'Служба доставки': {
		visible: true,
		prop: 'delivery.service',
		width: '170',
	},
	'Трекінг код': {
		visible: true,
		prop: 'delivery.ttn',
		width: '170',
	},
	'Статус доставки': {
		visible: false,
		prop: 'delivery.status',
		width: '170',
	},
	Товари: {
		visible: true,
		prop: 'products.name',
		width: '150',
	},
	Вартість: {
		visible: true,
		prop: 'products.price',
		width: '120',
	},
	Отримувач: {
		visible: false,
		prop: 'recipient.name',
		width: '150',
	},
	'Телефон отримувача': {
		visible: false,
		prop: 'recipient.phone',
		width: '190',
	},
	'Адреса відділення': {
		visible: true,
		prop: 'delivery.adress',
		width: '180',
	},
	Місто: {
		visible: true,
		prop: 'delivery.city',
		width: '100',
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
	<TextEditDialog
		v-model="isTextEditDialog"
		@update:textValue="handleTextUpdate"
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
						<div class="w-1/2">
							<el-descriptions
								direction="vertical"
								border
								style="margin: 10px"
								size="large"
								column="4"
							>
								<el-descriptions-item
									:rowspan="2"
									:width="200"
									label="ЗАМОВЛЕННЯ"
									align="center"
								>
									<el-image style="width: 150px" src="./order.png" />
								</el-descriptions-item>
								<el-descriptions-item label="№ замовлення">{{
									props.row.order_number
								}}</el-descriptions-item>
								<el-descriptions-item label="Джерело">
									<img class="w-10" :src="props.row.source" alt="" />
								</el-descriptions-item>
								<el-descriptions-item label="Час створення">{{
									props.row.created_at
								}}</el-descriptions-item>
								<el-descriptions-item label="Статус">
									<el-tag size="large" effect="plain">{{
										props.row.status.order_status
									}}</el-tag>
								</el-descriptions-item>
								<el-descriptions-item label="Менеджер">{{
									props.row.manager
								}}</el-descriptions-item>
								<el-descriptions-item label="Трекінг код">{{
									props.row.delivery.ttn
								}}</el-descriptions-item>
							</el-descriptions>
						</div>
						<div class="w-1/2">
							<el-descriptions
								direction="vertical"
								border
								style="margin: 10px"
								size="large"
							>
								<el-descriptions-item
									:rowspan="2"
									:width="200"
									label="ПОКУПЕЦЬ"
									align="center"
								>
									<el-image style="width: 150px" src="./customer.png" />
								</el-descriptions-item>
								<el-descriptions-item label="Ім'я покупця">{{
									props.row.customer.name
								}}</el-descriptions-item>
								<el-descriptions-item label="Телефон покупця">{{
									props.row.customer.phone
								}}</el-descriptions-item>
								<el-descriptions-item label="E-mail покупця">{{
									props.row.customer.email
								}}</el-descriptions-item>
								<el-descriptions-item label="Коментар менеджера">
									<div class="flex gap-2 max-w-35">
										<div>
											<p>{{ TextEditDialogValue }}</p>
										</div>
										<div class="cursor-pointer">
											<el-icon @click="isTextEditDialog = true" size="large"
												><Edit
											/></el-icon>
										</div>
									</div>
								</el-descriptions-item>
							</el-descriptions>
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
				:width="column.width"
				sortable
			>
				<!-- Кастомные шаблоны для определенных колонок -->
				<template #default="{ row }">
					<div
						class="flex items-center gap-2"
						v-if="column.prop === 'order_number'"
					>
						<span>{{ row.order_number }}</span>
						<div class="cursor-pointer">
							<el-icon @click="copyText(row.order_number)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>

					<div v-else-if="column.prop === 'source'">
						<img class="w-12" :src="row.source" alt="source" />
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
						<div class="cursor-pointer">
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
						<div class="cursor-pointer">
							<el-icon @click="copyText(row.delivery.ttn)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>
					<div
						class="flex items-center gap-2"
						v-else-if="column.prop === 'recipient.phone'"
					>
						<span>{{ row.recipient.phone }}</span>
						<div class="cursor-pointer">
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
