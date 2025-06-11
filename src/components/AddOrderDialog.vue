<script setup>
import { ref } from 'vue'
import { TABLE_DATA } from './TableData'
import AddProductDrawer from './AddProductDrawer.vue'
import {
	PriceTag,
	ShoppingCart,
	Money,
	CreditCard,
	Close,
	Box,
	Sell,
} from '@element-plus/icons-vue'

const props = defineProps({
	modelValue: Boolean,
	managersList: Array,
})
const emit = defineEmits(['update:modelValue'])

const isAddProduct = ref(false)

const currentProducts = ref([])

const handleProductSave = products => {
	products.forEach(newProduct => {
		// Ищем товар с таким же id в currentOrder
		const existingProductIndex = currentProducts.value.findIndex(
			p => p.id === newProduct.id
		)

		if (existingProductIndex !== -1) {
			// Если товар уже есть - обновляем количество
			currentProducts.value[existingProductIndex].count += newProduct.count
		} else {
			// Если товара нет - добавляем новый
			currentProducts.value.push({ ...newProduct })
		}
	})
}

const saveModal = () => {
	emit('update:modelValue', false)
}

const closeModal = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<AddProductDrawer v-model="isAddProduct" @save="handleProductSave" />

	<el-dialog
		:model-value="props.modelValue"
		@close="closeModal"
		:show-close="false"
		fullscreen
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4 mb-10">
				<span class="text-xl font-semibold">Додати замовлення</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="flex gap-4 px-4 mb-10">
				<!-- Блок 1: Основна інформація -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Основна інформація</p>

					<el-select
						v-model="selectedManager"
						placeholder="Обрати менеджера"
						clearable
						class="pb-4"
					>
						<el-option
							v-for="manager in props.managersList"
							:key="manager.value"
							:label="manager.label"
							:value="manager.value"
						/>
					</el-select>

					<el-input
						v-model="managerComment"
						type="textarea"
						placeholder="Коментар менеджера"
						rows="4"
						class="pb-4"
					/>
				</div>

				<!-- Блок 2: Інформація про покупця -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Інформація про покупця</p>

					<el-input
						v-model="buyerName"
						placeholder="Ім'я покупця"
						clearable
						class="pb-4"
					/>
					<el-input
						v-model="buyerName"
						placeholder="Телефон покупця"
						clearable
						class="pb-4"
					/>
				</div>

				<!-- Блок 3: Інформація про вартість -->
				<div class="w-1/3">
					<p class="font-semibold pb-4">Інформація про вартість</p>
					<div class="bg-white shadow-md">
						<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
							<el-icon><PriceTag /></el-icon>
							Підсумкова вартість
						</h2>

						<div class="space-y-3">
							<div class="flex justify-between items-center text-gray-700">
								<div class="flex items-center gap-2">
									<el-icon><ShoppingCart /></el-icon>
									<span>Вартість товарів</span>
								</div>
								<span>1500 грн</span>
							</div>

							<div class="flex justify-between items-center text-gray-700">
								<div class="flex items-center gap-2">
									<el-icon><Money /></el-icon>
									<span>Накладений платіж (2% + 20 грн)</span>
								</div>
								<span>50 грн</span>
							</div>

							<div class="flex justify-between items-center text-gray-700">
								<div class="flex items-center gap-2">
									<el-icon><Box /></el-icon>
									<span>Вартість упакування</span>
								</div>
								<span>30 грн</span>
							</div>
						</div>

						<hr class="my-4 border-gray-300" />

						<div
							class="flex justify-between items-center text-lg font-bold text-blue-600"
						>
							<div class="flex items-center gap-2">
								<el-icon><CreditCard /></el-icon>
								<span>Загальна вартість</span>
							</div>
							<span>1580 грн</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Блок 4: Товари  -->
			<div class="px-4">
				<div class="flex items-center justify-between my-5">
					<div class="flex items-center gap-2">
						<el-icon><Sell /></el-icon>
						<span class="font-medium">Додати товари</span>
					</div>
					<div class="flex items-center gap-4">
						<span class="text-sm"> {{}} позиції </span>

						<el-button type="primary" size="small" @click="isAddProduct = true">
							Додати
						</el-button>
					</div>
				</div>

				<el-table
					:data="currentProducts"
					style="width: 100%"
					border
					size="small"
				>
					<el-table-column
						label="Зображення"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<el-image
								style="width: 50px"
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
					<el-table-column
						prop="id"
						label="Артикуль"
						header-align="center"
						align="center"
					/>
					<el-table-column
						label="Назва товару"
						header-align="center"
						align="center"
						width="250px"
					>
						<template #default="{ row }">
							<div>
								<span>{{ row.name }}</span>
							</div>
							<div>
								<span class="text-gray-400 font-mono">{{
									row.second_name
								}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="Кількість"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div class="flex gap-1 items-center justify-center">
								<span>{{ row.count }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="Ціна товару"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ row.price }}</span>
						</template>
					</el-table-column>

					<el-table-column
						label="Ціна продажу"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ row.price * row.count }}</span>
						</template>
					</el-table-column>

					<el-table-column label="Дії" header-align="center" align="center">
						<template #default="{ row }"> </template>
					</el-table-column>
				</el-table>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end fixed bottom-0 left-0 right-4 bg-white z-50">
				<div class="flex gap-4 p-4">
					<el-button @click="closeModal" size="large">Закрити</el-button>
					<el-button @click="saveModal" type="primary" size="large"
						>Зберегти</el-button
					>
				</div>
			</div>
		</template>
	</el-dialog>
</template>
