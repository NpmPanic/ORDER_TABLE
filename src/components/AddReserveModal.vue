<script setup>
import { ref } from 'vue'
import { DocumentAdd, Delete } from '@element-plus/icons-vue'
const props = defineProps({
	modelValue: Boolean,
	order: Object,
})
const emit = defineEmits(['update:modelValue', 'save'])
const reserves = ref([
	{
		place: '',
		count: 0,
		number: '',
	},
])
const addReserve = () => {
	reserves.value.push({ place: '', count: 0, number: '' })
}
const deleteReserve = index => {
	if (reserves.value.length > 1) {
		reserves.value.splice(index, 1)
	}
}
// Опции для выпадающего списка служб доставки
const optionsWarehouseReserve = [
	{ value: 'Постачальник 1', label: 'Постачальник 1' },
	{ value: 'Постачальник 2', label: 'Постачальник 2' },
	{ value: 'Магазин 1', label: 'Магазин 1' },
	{ value: 'Магазин 2', label: 'Магазин 2' },
	{ value: 'Магазин 3', label: 'Магазин 3' },
	{ value: 'Магазин 4', label: 'Магазин 4' },
	{ value: 'Магазин 5', label: 'Магазин 5' },
]
// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<el-dialog
		v-model="props.modelValue"
		title="Додати резерв"
		width="40%"
		align-center
	>
		<div
			v-for="(reserve, index) in reserves"
			:key="index"
			class="flex items-center gap-5 mt-8 mb-8"
		>
			<el-select v-model="reserve.place" clearable placeholder="Місце резерву">
				<el-option
					v-for="item in optionsWarehouseReserve"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-select>
			<el-input-number
				v-model="reserve.count"
				:min="0"
				:max="100"
				style="width: 60%"
			/>
			<el-input
				v-model="reserve.number"
				placeholder="Номер резерву"
				clearable
			/>
			<div class="flex items-center gap-2">
				<el-button @click="addReserve" :icon="DocumentAdd" circle />
				<el-button @click="deleteReserve(index)" :icon="Delete" circle />
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDrawer">Скасувати</el-button>
				<el-button @click="closeDrawer" type="primary"> Зберегти </el-button>
			</div>
		</template>
	</el-dialog>
</template>
