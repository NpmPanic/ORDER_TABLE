<script setup>
import { Search } from '@element-plus/icons-vue'
import { PRODUCTS_DATA } from './ProductsData'
import { ref, computed } from 'vue'

const searchInput = ref()
const productSelect = ref('Товари')
// Переменная хранения массива выбраных товаров
const selectedRows = ref([])
// Переменная доступа к таблице допродаж
const tableRef = ref()

const props = defineProps({
	modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'save'])

// Отображаем список товаров либо услуг
const tableData = computed(() => {
	const data = PRODUCTS_DATA.value[0]
	return productSelect.value === 'Товари' ? data.products : data.services
})

// Фильтрация данных по поисковому запросу
const filteredData = computed(() => {
	if (!searchInput.value) return tableData.value
	const searchTerm = searchInput.value.toLowerCase()
	return tableData.value.filter(
		item =>
			item.name.toLowerCase().includes(searchTerm) ||
			item.id.toLowerCase().includes(searchTerm)
	)
})

// Сбрасываем выделение и количество
const resetSelection = () => {
	// Очищаем выбраный товар
	tableRef.value?.clearSelection()
	// Очищаем массив выбранных товаров
	selectedRows.value = []
	// Обнуляем счетчик
	tableData.value.forEach(item => {
		item.count = 0
	})
}

// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}
const saveSelection = () => {
	// Фильтруем только товары с count > 0
	const selected = tableData.value.filter(item => item.count > 0)
	emit('save', selected) // Отправляем выбранные товары
	resetSelection()
	closeDrawer()
}
</script>
<template>
	<el-drawer :model-value="props.modelValue" @close="closeDrawer" size="35%">
		<template #header>
			<div class="flex px-4 justify-between gap-2">
				<div class="flex-grow">
					<el-input
						v-model="searchInput"
						size="large"
						placeholder="Назва або артикуль товару"
						:prefix-icon="Search"
						clearable
					/>
				</div>
				<div>
					<el-radio-group v-model="productSelect" size="large">
						<el-radio-button label="Товари" value="Товари" />
						<el-radio-button label="Послуги" value="Послуги" />
					</el-radio-group>
				</div>
			</div>
		</template>
		<template #default>
			<el-table
				:data="filteredData"
				style="width: 100%"
				@selection-change="selectedRows = $event"
				ref="tableRef"
			>
				<el-table-column type="selection" width="30px" />
				<el-table-column width="100px">
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
				<el-table-column property="name" width="250px">
					<template #default="{ row }">
						<div>
							<span>{{ row.name }}</span>
						</div>

						<span class="text-slate-400">{{ row.id }}</span></template
					>
				</el-table-column>

				<el-table-column property="price" width="100px">
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
							:disabled="!selectedRows.includes(row)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4">
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
	padding-bottom: 0 !important;
}
</style>
