<script setup>
import { ref, computed } from 'vue'
import { DocumentAdd, Delete, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
	modelValue: Boolean,
	product: Object,
	warehouseList: Array,
})
const emit = defineEmits(['update:modelValue', 'save'])
const input_reserves = ref([
	{
		place: '',
		number: '',
	},
])

// Добавляем объект для хранения ошибок валидации
const errorFields = ref([])

const addReserve = () => {
	input_reserves.value.push({ place: '', number: '' })
	// Добавляем поле для ошибки при создании нового резерва
	errorFields.value.push(false)
}

const deleteReserve = index => {
	if (input_reserves.value.length > 1) {
		input_reserves.value.splice(index, 1)
		// Удаляем соответствующее поле ошибки
		errorFields.value.splice(index, 1)
	}
}

// Обработчик изменения поля для сброса ошибки
const handleFieldChange = index => {
	errorFields.value[index] = false
}

const saveReserve = () => {
	let hasErrors = false

	// Проверяем каждое поле place
	input_reserves.value.forEach((reserve, index) => {
		if (!reserve.place) {
			errorFields.value[index] = true
			hasErrors = true
		} else {
			errorFields.value[index] = false
		}
	})

	if (hasErrors) {
		ElMessage.error('Заповніть місце резерву')
		return
	}

	emit('save', [...input_reserves.value])
	closeModal()
	input_reserves.value = [
		{
			place: '',
			number: '',
		},
	]
	// Сбрасываем ошибки
	errorFields.value = [false]
}

// Отмена изменений при закрытии
const closeModal = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<el-dialog
		v-model="props.modelValue"
		:show-close="false"
		width="35%"
		align-center
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4">
				<span class="text-xl text-gray-700 font-semibold">Додати резерв</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div
				v-for="(reserve, index) in input_reserves"
				:key="index"
				class="flex items-center gap-5 mt-10 mb-10 px-4"
			>
				<el-select
					v-model="reserve.place"
					@change="handleFieldChange(index)"
					clearable
					placeholder="Місце резерву"
					:class="{ 'error-field': errorFields[index] }"
				>
					<el-option
						v-for="item in props.warehouseList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
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
		</template>

		<template #footer>
			<div class="px-4">
				<el-button @click="closeModal">Скасувати</el-button>
				<el-button @click="saveReserve" type="primary"> Зберегти </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped>
.error-field :deep(.el-input__wrapper),
.error-field :deep(.el-select__wrapper) {
	box-shadow: 0 0 0 0.5px red inset !important;
}
</style>
