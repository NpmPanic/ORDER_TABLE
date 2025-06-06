<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	initialPrice: Number,
})
const emit = defineEmits(['update:priceValue'])

const priceValue = ref(props.initialPrice)
const isOpen = ref(false)

watch(
	() => props.initialPrice,
	newVal => {
		priceValue.value = newVal
	}
)

const saveResult = () => {
	emit('update:priceValue', priceValue.value)
	isOpen.value = false
}

const cancelEdit = () => {
	priceValue.value = props.initialPrice
	isOpen.value = false
}
</script>

<template>
	<el-popover :visible="isOpen" placement="bottom" width="200px">
		<div class="flex justify-center">
			<el-input
				v-model="priceValue"
				placeholder="Введіть ціну"
				clearable
				:formatter="
					value => {
						const cleanValue = value.replace(/[^\d]/g, '')
						const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
						return cleanValue ? `₴ ${formatted}` : ''
					}
				"
				:parser="value => value.replace(/[^\d]/g, '')"
			/>
		</div>

		<div class="mt-4 flex justify-center">
			<el-button size="small" @click="cancelEdit">Скасувати</el-button>
			<el-button size="small" type="primary" @click="saveResult">
				Зберегти
			</el-button>
		</div>

		<template #reference>
			<el-link @click="isOpen = true" type="primary" :underline="false">
				<span>{{ priceValue || 0 }}</span>
			</el-link>
		</template>
	</el-popover>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link :hover {
	color: orange;
}
</style>
