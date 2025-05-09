<script setup>
import {
	Search,
	User,
	Switch,
	CopyDocument,
	Edit,
	Delete,
	ChatRound,
	Phone,
	CirclePlus,
	EditPen,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TABLE_DATA } from './components/TableData'
import { computed, ref } from 'vue'
import TableEditDrawer from './components/TableEditDrawer.vue'
import TextEditArea from './components/TextEditArea.vue'

const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
const isDrawer = ref(false)

// Переменные хранения состояния и значения для добавления комментариев
const isTextEditAreaManager = ref(false)
const isTextEditAreaCustomer = ref(false)

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
const options = [
	{ value: 'order.order_number', label: '№ замовлення' },
	{ value: 'customer.name', label: 'Покупець' },
	{ value: 'customer.phone', label: 'Телефон покупця' },
	{ value: 'delivery.ttn', label: 'Трекінг код' },
	{ value: 'order.manager', label: 'Менеджер' },
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
		prop: 'order.order_number',
		sortable: true,
	},
	Джерело: {
		visible: true,
		prop: 'order.source',
		sortable: true,
	},
	'Час створення': {
		visible: false,
		prop: 'order.created_at',
		sortable: true,
	},
	'Дата доставки': {
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
		visible: false,
		prop: 'order.manager',
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
										<div class="cursor-pointer hover:text-blue-500 transition">
											<el-icon @click="copyText(props.row.order.order_number)"
												><CopyDocument
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
								<el-descriptions-item label="Менеджер">{{
									props.row.order.manager
								}}</el-descriptions-item>
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

								<el-descriptions-item label="Коментар покупця">
									<div class="flex items-center justify-between min-w-full">
										<TextEditArea
											v-model="isTextEditAreaCustomer"
											:initial-text="props.row.customer.comment"
											@update:textValue="
												value => updateCustomerComment(props.row, value)
											"
										/>

										<div
											v-if="!isTextEditAreaCustomer"
											class="flex items-center gap-2"
										>
											<p>
												{{ props.row.customer.comment || 'Коментар відсутній' }}
											</p>
											<div
												class="flex gap-2 cursor-pointer hover:text-blue-500"
											>
												<el-icon @click="isTextEditAreaCustomer = true">
													<EditPen />
												</el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>

								<el-descriptions-item label="Коментар менеджера">
									<div class="flex items-center justify-between min-w-full">
										<TextEditArea
											v-model="isTextEditAreaManager"
											:initial-text="props.row.order.manager_comment || ''"
											@update:textValue="
												value => updateManagerComment(props.row, value)
											"
										/>

										<div
											v-if="!isTextEditAreaManager"
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
												<el-icon @click="isTextEditAreaManager = true">
													<EditPen />
												</el-icon>
											</div>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="Комунікації">
									<div class="flex items-center gap-4">
										<div>
											<el-button
												type="success"
												:icon="Phone"
												circle
											></el-button>
										</div>
										<div>
											<el-button
												type="primary"
												:icon="ChatRound"
												circle
											></el-button>
										</div>
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
								<el-descriptions-item label="Дата доставки">{{
									props.row.delivery.delivery_date
								}}</el-descriptions-item>
								<el-descriptions-item label="Отримувач">{{
									props.row.recipient.name
								}}</el-descriptions-item>
								<el-descriptions-item label="Телефон отримувача"
									><div class="flex items-center gap-2">
										<span>{{ props.row.recipient.phone }}</span>
										<div class="cursor-pointer hover:text-blue-500 transition">
											<el-icon @click="copyText(props.row.recipient.phone)"
												><CopyDocument
											/></el-icon>
										</div></div
								></el-descriptions-item>
								<el-descriptions-item label="Служба доставки"
									><img
										class="w-10"
										:src="props.row.delivery.service"
										alt="source"
								/></el-descriptions-item>
								<el-descriptions-item label="Адреса доставки"
									>{{ props.row.delivery.adress }},
									{{ props.row.delivery.city }}</el-descriptions-item
								>
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

					<!-- Товари -->
					<div class="w-full mt-10">
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
									<div class="cursor-pointer hover:text-green-500 transition">
										<el-tooltip content="Додати товар" placement="top">
											<el-icon size="large"><CirclePlus /></el-icon>
										</el-tooltip>
									</div>
									<div class="cursor-pointer hover:text-blue-500 transition">
										<el-tooltip content="Редагувати товар" placement="top">
											<el-icon size="large"><Edit /></el-icon>
										</el-tooltip>
									</div>
									<div class="cursor-pointer hover:text-red-500 transition">
										<el-tooltip content="Видалити товар" placement="top">
											<el-icon size="large"><Delete /></el-icon>
										</el-tooltip>
									</div>
								</div>
							</el-descriptions-item>
						</el-descriptions>
					</div>

					<!-- Оплаты -->
					<div class="w-full mt-10">
						<el-descriptions
							direction="vertical"
							border
							style="margin: 0px"
							size="large"
							column="7"
						>
							<el-descriptions-item
								:rowspan="2"
								:width="200"
								label="Оплати"
								align="center"
							>
								<div v-if="props.row.order.pay_status === 'Оплачено'">
									<el-button type="success" size="small" style="width: 70px">{{
										props.row.order.pay_status
									}}</el-button>
								</div>
								<div v-else-if="props.row.order.pay_status === 'Не оплачено'">
									<el-button type="danger" size="small" plain>{{
										props.row.order.pay_status
									}}</el-button>
								</div>
							</el-descriptions-item>
							<el-descriptions-item label="Дата та час" align="center"
								>-</el-descriptions-item
							>
							<el-descriptions-item label="Ти платежу" align="center"
								>-</el-descriptions-item
							>
							<el-descriptions-item label="Сума за товар" align="center">
								{{ props.row.products.price * props.row.products.count }}
								<span>&#8372;</span>
							</el-descriptions-item>
							<el-descriptions-item label="Вартість доставки" align="center">
								{{ props.row.delivery.delivery_price }}
								<span>&#8372;</span>
							</el-descriptions-item>
							<el-descriptions-item label="Загальна вартість" align="center">
								{{
									props.row.products.price * props.row.products.count +
									props.row.delivery.delivery_price
								}}
								<span>&#8372;</span>
							</el-descriptions-item>

							<el-descriptions-item label="Дії" align="center">
								<div class="flex items-center gap-5 justify-center">
									<div class="cursor-pointer hover:text-green-500 transition">
										<el-tooltip content="Додати оплату" placement="top">
											<el-icon size="large"><CirclePlus /></el-icon>
										</el-tooltip>
									</div>
									<div class="cursor-pointer hover:text-blue-500 transition">
										<el-tooltip content="Редагувати оплату" placement="top">
											<el-icon size="large"><Edit /></el-icon>
										</el-tooltip>
									</div>
									<div class="cursor-pointer hover:text-blue-500 transition">
										<el-tooltip content="Змінити статус" placement="top">
											<el-icon size="large"><Switch /></el-icon>
										</el-tooltip>
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
						v-if="column.prop === 'order.order_number'"
					>
						<span>{{ row.order.order_number }}</span>
						<div class="cursor-pointer hover:text-blue-500 transition">
							<el-icon @click="copyText(row.order.order_number)"
								><CopyDocument
							/></el-icon>
						</div>
					</div>

					<div v-else-if="column.prop === 'order.source'">
						<img class="w-12" :src="row.order.source" alt="source" />
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
						<span>{{ row.order.manager }}</span>
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
