<script setup>
import { reactive, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
	modelValue: Boolean,
	product: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

// Локальная копия товара
const localProduct = reactive({
	id: '',
	name: '',
	price: '',
	count: 1,
	count_name: '',
	warehouse: {
		number: '',
		place: '',
		count: '',
	},
})

// Копирование значений из props при открытии в localProduct
watch(
	() => props.modelValue,
	val => {
		if (val && props.product) {
			Object.assign(localProduct, JSON.parse(JSON.stringify(props.product)))
		}
		console.dir(localProduct)
	}
)

const closeDrawer = () => {
	emit('update:modelValue', false)
}

const saveChanges = () => {
	emit('save', JSON.parse(JSON.stringify(localProduct)))
	closeDrawer()
}
</script>
<template>
	<el-drawer
		:model-value="props.modelValue"
		@close="closeDrawer"
		:show-close="false"
		size="30%"
	>
		<template #header>
			<div class="flex items-center justify-between w-full px-4 pb-5">
				<span class="text-xl font-semibold">Редагування товару</span>
				<el-button @click="closeDrawer" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>
		<template #default>
			<div class="px-4 mt-5">
				<div class="flex items-center mb-10 gap-2">
					<img class="w-50" :src="localProduct.img" alt="img" />
					<p class="leading-loose">{{ localProduct.title }}</p>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Артикуль</span>
					</div>
					<el-input
						v-model="localProduct.id"
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
						v-model="localProduct.name"
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
						v-model="localProduct.price"
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
							v-model="localProduct.count"
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
							v-model="localProduct.count_name"
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
			<div class="flex justify-end gap-4 px-4 pt-[10px]">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="saveChanges" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-drawer>
</template>

<style scoped></style>
