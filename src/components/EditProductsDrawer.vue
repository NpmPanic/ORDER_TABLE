<script setup>
import { PRODUCTS_DATA } from './ProductsData'
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	product: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}

const saveChanges = () => {
	emit('save', props.product.value)
	closeDrawer()
}
</script>
<template>
	<el-drawer :model-value="props.modelValue" @close="closeDrawer" size="30%">
		<template #header>
			<span class="text-2xl px-4">Редагування товару</span>
		</template>
		<template #default>
			<div class="px-4 mt-5">
				<div class="mb-5">
					<div class="mb-4">
						<span>Артикуль</span>
					</div>
					<el-input
						v-model="props.product.id"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Назва товару</span>
					</div>
					<el-input
						v-model="props.product.name"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Ціна товару</span>
					</div>
					<el-input
						v-model="props.product.price"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Номер резерву</span>
					</div>
					<el-input
						v-model="props.product.warehouse.number"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Склад резерву</span>
					</div>
					<el-input
						v-model="props.product.warehouse.place"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Кількість резерву</span>
					</div>
					<el-input
						v-model="props.product.warehouse.count"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="flex mb-5 gap-5">
					<div class="w-full">
						<div class="mb-4">
							<span>Кількість товару</span>
						</div>
						<el-input-number
							v-model="props.product.count"
							:min="1"
							:max="100"
							size="large"
							style="width: 100%"
						/>
					</div>
					<div class="w-full">
						<div class="mb-4">
							<span>Одиниці товару</span>
						</div>
						<el-input
							v-model="props.product.count_name"
							style="width: 100%"
							size="large"
							placeholder="Заповніть данні"
							clearable
						/>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="saveChanges" type="primary" size="large"
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
