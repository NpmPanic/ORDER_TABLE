<script setup>
import { Search, Close } from '@element-plus/icons-vue'
import { PRODUCTS_DATA } from './ProductsData'
import { ref, watch } from 'vue'

const searchInput = ref()
// Переменная хранения массива выбраных товаров
const selectedRows = ref([])
// Переменная доступа к таблице допродаж
const tableRef = ref()

const props = defineProps({
	modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'save'])

// Фильтрация данных по поисковому запросу
const filteredData = ref([...PRODUCTS_DATA.value])

watch(searchInput, val => {
	if (!val) {
		filteredData.value = [...PRODUCTS_DATA.value]
	} else {
		const searchTerm = val.toLowerCase()
		filteredData.value = PRODUCTS_DATA.value.filter(
			item =>
				item.name.toLowerCase().includes(searchTerm) ||
				item.id.toLowerCase().includes(searchTerm)
		)
	}
})

// Сбрасываем выделение и количество
const resetSelection = () => {
	// Очищаем выбраный товар
	tableRef.value?.clearSelection()
	// Очищаем массив выбранных товаров
	selectedRows.value = []
	// Обнуляем счетчик количества
	PRODUCTS_DATA.value.forEach(item => {
		item.count = 0
	})
}

// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}
const saveSelection = () => {
	// Фильтруем только товары с count > 0
	const selected = PRODUCTS_DATA.value.filter(item => item.count > 0)
	emit('save', selected)
	resetSelection()
	closeDrawer()
}
</script>
<template>
	<el-drawer
		:model-value="props.modelValue"
		@close="closeDrawer"
		:show-close="false"
		size="35%"
	>
		<template #header>
			<div class="flex items-center justify-between w-full gap-4 px-4 pb-5">
				<div class="flex-grow">
					<el-input
						v-model="searchInput"
						size="large"
						placeholder="Назва або артикуль товару"
						:prefix-icon="Search"
						clearable
					/>
				</div>
				<el-button @click="closeDrawer" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<el-table
				:data="filteredData"
				:row-key="row => row.id"
				style="width: 100%"
				@selection-change="selectedRows = $event"
				ref="tableRef"
			>
				<el-table-column type="selection" />
				<el-table-column>
					<template #default="{ row }">
						<el-image
							style="width: 70px"
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
				<el-table-column property="name">
					<template #default="{ row }">
						<div>
							<span>{{ row.name }}</span>
						</div>

						<span class="text-slate-400">{{ row.id }}</span></template
					>
				</el-table-column>

				<el-table-column property="price" align="center">
					<template #default="{ row }">
						<span>{{ row.price }}</span>

						<span> &#8372;</span></template
					>
				</el-table-column>
				<el-table-column>
					<template #default="{ row }">
						<el-input-number
							v-model="row.count"
							:min="0"
							:max="100"
							size="small"
							style="width: 100%"
							:disabled="!selectedRows.includes(row)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4 px-4 pt-[10px]">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="saveSelection" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-drawer>
</template>

<style scoped>
:global(.el-drawer__header) {
	margin-bottom: 0 !important;
}
</style>
