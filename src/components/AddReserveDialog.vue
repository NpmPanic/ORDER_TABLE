<script setup>
import { ref, computed } from 'vue'
import { DocumentAdd, Delete, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
	modelValue: Boolean,
	countProduct: Number,
	product: Object,
	warehouseList: Array,
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

// Вычисляем текущее количество зарезервированного товара
const currentReservedCount = computed(() => {
	if (!props.product || !props.product.warehouse) return 0
	return props.product.warehouse.reduce((total, item) => total + item.count, 0)
})

// Функция вычисления максимально допустимого кол резерва согласно сумме товара в заказе
function getMaxCountForReserve(index) {
	const totalReserved = input_reserves.value.reduce((sum, reserve, i) => {
		return sum + (i === index ? 0 : Number(reserve.count))
	}, 0)

	const remaining =
		props.countProduct - currentReservedCount.value - totalReserved
	return remaining > 0 ? remaining : 0
}

const saveReserve = () => {
	let hasErrors = false

	input_reserves.value.forEach(reserve => {
		if (!reserve.place || reserve.count <= 0) {
			hasErrors = true
		}
	})

	if (hasErrors) {
		ElMessage.error('Заповніть місце та кількість резерву')
		return
	}

	emit('save', [...input_reserves.value])
	closeModal()
	input_reserves.value = [
		{
			place: '',
			count: 0,
			number: '',
		},
	]
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
				<span class="text-xl font-semibold">Додати резерв</span>
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
					clearable
					placeholder="Місце резерву"
				>
					<el-option
						v-for="item in props.warehouseList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
				<el-input-number
					v-model="reserve.count"
					:min="0"
					:max="getMaxCountForReserve(index)"
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
		</template>

		<template #footer>
			<div class="px-4">
				<el-button @click="closeModal">Скасувати</el-button>
				<el-button @click="saveReserve" type="primary"> Зберегти </el-button>
			</div>
		</template>
	</el-dialog>
</template>
