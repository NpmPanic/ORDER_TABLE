<script setup>
import {
	Search,
	Edit,
	Delete,
	User,
	Plus,
	Switch,
} from '@element-plus/icons-vue'
import { TABLE_DATA } from './components/TableData'
import { computed, ref } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
// Переменные для хранения значения input и select
const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
// Переменная хранения состояния окна редактирования столбцов таблицы
const isDrawer = ref(false)
// Список вариантов фильтрации для select со значениями полей массива данных
const options = [
	{
		value: 'order_number',
		label: '№ замовлення',
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
	{
		value: 'manager',
		label: 'Менеджер',
	},
]
// Возвращаем значение из объекта по пути цыклом с проверкой промежуточных свойств на null или undefined
const getValueByPath = (obj, path) => {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
// Отображаем строку соответствующую поисковому запросу по выбраному значению select
const resultData = computed(() => {
	// Проверка выбран ли select, ато без нее не работает очистка поля
	if (!valueQuerySelect.value) return TABLE_DATA.value
	// Сама фильтрация по выбраной колонке из значения select и запросу в input
	return TABLE_DATA.value.filter(item => {
		const fieldValue = getValueByPath(item, valueQuerySelect.value)
		return String(fieldValue)
			.toLowerCase()
			.includes(inputQuerySearch.value.toLowerCase())
	})
})
// Состояние видимости столбцов по умолчанию
const columnVisibility = ref({
	'№ замовлення': true,
	Джерело: true,
	'Час створення': true,
	'Дата доставки': false,
	Статус: false,
	Менеджер: true,
	Покупець: true,
	'Телефон покупця': true,
	'E-mail покупця': false,
	'Служба доставки': true,
	'Трекінг код': true,
	'Статус доставки': false,
	Товари: true,
	Вартість: true,
	Отримувач: false,
	'Телефон отримувача': false,
	'Адреса відділення': true,
	Місто: true,
})
// Обработчик обновления видимости столбцов
const handleColumnUpdate = newVisibility => {
	columnVisibility.value = newVisibility
}
// Маппинг названий столбцов и их свойства
const columnMapping = {
	'№ замовлення': { prop: 'order_number', label: '№ замовлення', width: '150' },
	Джерело: { prop: 'source', label: 'Джерело', width: '120' },
	'Час створення': { prop: 'created_at', label: 'Час створення', width: '150' },
	'Дата доставки': {
		prop: 'delivery_date',
		label: 'Дата доставки',
		width: '150',
	},
	Статус: { prop: 'status.order_status', label: 'Статус', width: '120' },
	Менеджер: { prop: 'manager', label: 'Менеджер', width: '120' },
	Покупець: { prop: 'customer.name', label: 'Покупець', width: '150' },
	'Телефон покупця': {
		prop: 'customer.phone',
		label: 'Телефон покупця',
		width: '170',
	},
	'E-mail покупця': {
		prop: 'customer.email',
		label: 'E-mail покупця',
		width: '170',
	},
	'Служба доставки': {
		prop: 'delivery.service',
		label: 'Служба доставки',
		width: '170',
	},
	'Трекінг код': { prop: 'delivery.ttn', label: 'Трекінг код', width: '140' },
	'Статус доставки': {
		prop: 'delivery.status',
		label: 'Статус доставки',
		width: '170',
	},
	Товари: { prop: 'products.name', label: 'Товари', width: '150' },
	Вартість: { prop: 'products.price', label: 'Вартість', width: '120' },
	Отримувач: { prop: 'recipient.name', label: 'Отримувач', width: '150' },
	'Телефон отримувача': {
		prop: 'recipient.phone',
		label: 'Телефон отримувача',
		width: '190',
	},
	'Адреса відділення': {
		prop: 'delivery.adress',
		label: 'Адреса відділення',
		width: '190',
	},
	Місто: { prop: 'delivery.city', label: 'Місто', width: '120' },
}

// Вычисляемые столбцы для таблицы
const visibleColumns = computed(() => {
	return Object.entries(columnVisibility.value)
		.filter(([_, isVisible]) => isVisible)
		.map(([columnName]) => ({
			...columnMapping[columnName],
			key: columnMapping[columnName].prop, // Добавляем уникальный ключ
		}))
})
</script>
<template>
	<!-- Header таблицы -->
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
			<el-button @click="isDrawer = true" type="primary" plain
				>Редагувати таблицю</el-button
			>
		</div>
	</div>
	<!-- Drawer настройки таблицы -->
	<TableEditDrawer
		v-model="isDrawer"
		:tableData="columnVisibility"
		:columns="columnVisibility"
		@update:columns="handleColumnUpdate"
	/>
	<!-- Body таблицы -->
	<el-table
		:data="resultData"
		:default-sort="{ prop: 'created_at', order: 'descending' }"
		height="100%"
		style="width: 100%"
	>
		<!-- Колонка для стрелочки разворота -->
		<el-table-column type="expand">
			<template #default="props">
				<div class="p-4 bg-green-100">
					<p><strong>№ замовлення:</strong> {{ props.row.order_number }}</p>
					<p><strong>Джерело</strong> {{ props.row.source }}</p>
				</div>
			</template>
		</el-table-column>

		<!-- Динамические колонки -->
		<el-table-column
			v-for="column in visibleColumns"
			:key="column.key"
			:prop="column.prop"
			:label="column.label"
			:width="column.width"
			sortable
		>
			<template #default="{ row }">
				<!-- Колонка "source" -->
				<div v-if="column.prop === 'source'">
					<img class="w-12" :src="row.source" alt="source" />
				</div>

				<!-- Колонка "delivery" -->
				<div v-else-if="column.prop === 'delivery.service'">
					<img class="w-12 ml-5" :src="row.delivery.service" alt="source" />
				</div>

				<!-- Колонка "manager" -->
				<div
					v-else-if="column.prop === 'manager'"
					class="flex items-center gap-4"
				>
					<el-icon><User /></el-icon>
					<span>{{ row.manager }}</span>
				</div>
			</template>
		</el-table-column>

		<!-- Всегда видимая колонка действий -->
		<el-table-column label="Дії" width="150">
			<el-button type="default" :icon="Edit" circle />
			<el-button type="default" :icon="Delete" circle />
		</el-table-column>
	</el-table>
</template>
