<script setup>
import { ref } from 'vue'
import TheDrawer from './TheDrawer.vue'
import { Search, Edit, Plus, Switch } from '@element-plus/icons-vue'
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
defineProps({
	inputQuery: String,
	valueQuery: String,
})
const emit = defineEmits(['update:inputQuery', 'update:valueQuery'])
// Перекидываем новые значения через Emit в родителя
const onInputChange = val => emit('update:inputQuery', val)
const onSelectChange = val => emit('update:valueQuery', val)
</script>
<template>
	<div class="flex items-center justify-between m-5">
		<div class="flex gap-5">
			<el-input
				:model-value="inputQuery"
				@update:model-value="onInputChange"
				style="width: 240px"
				placeholder="Пошук"
				:prefix-icon="Search"
				clearable
			/>
			<el-select
				:model-value="valueQuery"
				@update:model-value="onSelectChange"
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
	<TheDrawer v-model="isDrawer" />
</template>
