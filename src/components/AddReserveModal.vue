<script setup>
import { ref } from 'vue'
import { DocumentAdd, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
	modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue', 'save'])
const input_reserves = ref([
	{
		place: '',
		count: 0,
		number: '',
	},
])
const addReserve = () => {
	input_reserves.value.push({ place: '', count: 0, number: '' })
}
const deleteReserve = index => {
	if (input_reserves.value.length > 1) {
		input_reserves.value.splice(index, 1)
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
const saveReserve = () => {
	let hasErrors = false

	input_reserves.value.forEach((reserve, index) => {
		if (!reserve.place || reserve.count <= 0 || !reserve.number) {
			hasErrors = true
		}
	})

	if (hasErrors) {
		ElMessage.error('Заповніть всі поля для кожного резерву')
		return
	}

	emit('save', [...input_reserves.value])
	closeDrawer()
	input_reserves.value = [
		{
			place: '',
			count: 0,
			number: '',
		},
	]
}

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
			v-for="(reserve, index) in input_reserves"
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
				<el-button
					@click="addReserve"
					:icon="DocumentAdd"
					type="success"
					circle
				/>
				<el-button
					@click="deleteReserve(index)"
					:icon="Delete"
					type="danger"
					circle
				/>
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDrawer">Скасувати</el-button>
				<el-button @click="saveReserve" type="primary"> Зберегти </el-button>
			</div>
		</template>
	</el-dialog>
</template>
