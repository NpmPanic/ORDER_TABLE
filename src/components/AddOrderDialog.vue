<script setup>
import { ref } from 'vue'
import { TABLE_DATA } from '../components/TableData'
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
})
const emit = defineEmits(['update:modelValue'])

const saveModal = () => {
	emit('update:modelValue', false)
}

const closeModal = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<el-dialog
		:model-value="props.modelValue"
		@close="closeModal"
		:show-close="false"
		fullscreen
	>
		<template #header>
			<div class="flex justify-between items-center w-full px-4">
				<span class="text-xl font-semibold">Додати замовлення</span>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="flex gap-4">
				<!-- Блок 1: Основна інформація -->
				<div class="w-1/3 p-4">
					<p class="font-semibold pb-4">Основна інформація</p>

					<div class="pb-4">
						<el-select
							v-model="selectedManager"
							placeholder="Обрати менеджера"
							clearable
						>
							<el-option
								v-for="manager in managers"
								:key="manager.value"
								:label="manager.label"
								:value="manager.value"
							/>
						</el-select>
					</div>

					<div class="pb-4">
						<el-input
							v-model="managerComment"
							type="textarea"
							placeholder="Коментар менеджера"
							rows="4"
						/>
					</div>
				</div>

				<!-- Блок 2: Інформація про покупця -->
				<div class="w-1/3 p-4">
					<p class="font-semibold pb-4">Інформація про покупця</p>

					<el-input v-model="buyerName" placeholder="Ім'я покупця" />
				</div>

				<!-- Блок 3: Інформація про вартість -->
				<div class="w-1/3 p-4">
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
			<div class="my-10 px-4">
				<div class="flex items-center justify-between my-5">
					<div class="flex items-center gap-2">
						<el-icon><Sell /></el-icon>
						<span class="font-medium">Додати товари</span>
					</div>
					<div class="flex items-center gap-4">
						<span class="text-sm"> {{}} позиції </span>

						<el-button
							type="primary"
							size="small"
							@click="addAdditionalProductsToOrder(props.row)"
						>
							Додати
						</el-button>
					</div>
				</div>

				<el-table :data="TABLE_DATA" style="width: 100%" border size="small">
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
								<EditCountPopover
									:initialCount="row.count"
									@update:countValue="newValue => (row.count = newValue)"
								/>
								<span>{{ row.count_name }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						label="Ціна товару"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<EditPricePopover
								:initialPrice="row.price"
								@update:priceValue="newValue => (row.price = newValue)"
							/>
						</template>
					</el-table-column>

					<el-table-column
						label="Ціна продажу"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<span>{{ formatNumber(row.price * row.count) }} &#8372;</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Місце резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div v-for="(reserve, i) in row.warehouse" :key="i">
									<EditTextPopover
										:initialText="reserve.place"
										@update:textValue="newValue => (reserve.place = newValue)"
									/>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Кількість резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div v-for="(reserve, i) in row.warehouse" :key="i">
									<EditCountPopover
										:initialCount="reserve.count"
										:maxCount="getMaxReserveCount(row, i)"
										@update:countValue="newValue => (reserve.count = newValue)"
									/>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Номер резерву"
						header-align="center"
						align="center"
					>
						<template #default="{ row }">
							<div v-if="row.warehouse && row.warehouse.length > 0">
								<div
									class="flex items-center justify-center gap-4"
									v-for="(reserve, i) in row.warehouse"
									:key="i"
								>
									<EditTextPopover
										:initialText="reserve.number"
										@update:textValue="newValue => (reserve.number = newValue)"
									/>
									<div
										class="mt-1 cursor-pointer hover:text-red-500 transition"
									>
										<el-tooltip content="Видалити резерв" placement="top">
											<el-icon @click="deleteReserve(row.warehouse, i)"
												><Delete
											/></el-icon>
										</el-tooltip>
									</div>
								</div>
							</div>
							<span v-else class="text-gray-400">Не задано</span>
						</template>
					</el-table-column>
					<el-table-column label="Дії" header-align="center" align="center">
						<template #default="{ row }">
							<div class="flex items-center justify-center gap-4">
								<div
									class="text-sm cursor-pointer hover:text-green-500 transition"
								>
									<el-tooltip content="Додати резерв" placement="top">
										<el-icon @click="addReserveToOrder(row)"
											><DocumentAdd
										/></el-icon>
									</el-tooltip>
								</div>
								<div
									class="text-sm cursor-pointer hover:text-blue-500 transition"
								>
									<el-tooltip content="Редагувати товар" placement="top">
										<el-icon @click="takeCurrentEditProduct(row)"
											><Edit
										/></el-icon>
									</el-tooltip>
								</div>
								<div
									class="text-sm cursor-pointer hover:text-red-500 transition"
								>
									<el-tooltip content="Видалити товар" placement="top">
										<el-icon @click="removeAdditionalConfirm(props.row, $index)"
											><Delete
										/></el-icon>
									</el-tooltip>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4 fixed bottom-5 left-0 right-5">
				<el-button @click="closeModal" size="large">Закрити</el-button>
				<el-button @click="saveModal" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>
