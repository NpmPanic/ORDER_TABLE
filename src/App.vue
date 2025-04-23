<script setup>
import TheHeader from './components/TheHeader.vue'
import TheTable from './components/TheTable.vue'
// Локальные данные для таблицы из переменной TABLE_DATA
import { TABLE_DATA } from './components/TableData'
import { computed, ref } from 'vue'
// Переменные для хранения значения input и select
const inputQuerySearch = ref('')
const valueQuerySelect = ref('')
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
</script>
<template>
	<TheHeader
		v-model:inputQuery="inputQuerySearch"
		v-model:valueQuery="valueQuerySelect"
	/>
	<TheTable :table_data="resultData" />
</template>
