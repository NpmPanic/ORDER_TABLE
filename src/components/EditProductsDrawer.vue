<script setup>
import { reactive, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	product: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

// Локальная копия товара
const localProduct = reactive({
	id: '',
	count: 1,
	count_name: '',
	name: '',
	second_name: '',
	title: '',
	soft: '',
	nfc: '',
	wireless_charger: '',
	sd_card: '',
	screen_diagonal: '',
	display_type: '',
	refresh_rate: '',
	sim_type: '',
	sim_count: '',
	waterproof: '',
	cpu: '',
	battery_capacity: '',
	equipment: '',
	availability: '',
	price: 0,
	img: '',
	warehouse: {
		number: '',
		place: '',
		count: '',
	},
})

const availabilityValues = ref(['Так', 'Ні'])
const productAvailabilityValues = ref(['В  наявності', 'Закінчився'])

// Копирование значений из props при открытии в localProduct
watch(
	() => props.modelValue,
	val => {
		if (val && props.product) {
			Object.assign(localProduct, JSON.parse(JSON.stringify(props.product)))
		}
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
						<span>Наявність товару</span>
					</div>
					<el-select
						v-model="localProduct.availability"
						placeholder="Обрати"
						size="large"
					>
						<el-option
							v-for="item in productAvailabilityValues"
							:key="item"
							:label="item"
							:value="item"
						/>
					</el-select>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Операційна система</span>
					</div>
					<el-input
						v-model="localProduct.soft"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>NFC модуль</span>
					</div>
					<el-select
						v-model="localProduct.nfc"
						placeholder="Обрати"
						size="large"
					>
						<el-option
							v-for="item in availabilityValues"
							:key="item"
							:label="item"
							:value="item"
						/>
					</el-select>
				</div>

				<div class="mb-5">
					<div class="mb-4">
						<span>SD карта</span>
					</div>
					<el-select
						v-model="localProduct.sd_card"
						placeholder="Обрати"
						size="large"
					>
						<el-option
							v-for="item in availabilityValues"
							:key="item"
							:label="item"
							:value="item"
						/>
					</el-select>
				</div>

				<div class="mb-5">
					<div class="mb-4">
						<span>Бездротова зарядка</span>
					</div>
					<el-select
						v-model="localProduct.wireless_charger"
						placeholder="Обрати"
						size="large"
					>
						<el-option
							v-for="item in availabilityValues"
							:key="item"
							:label="item"
							:value="item"
						/>
					</el-select>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Тип SIM-карти</span>
					</div>
					<el-input
						v-model="localProduct.sim_type"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Кількість SIM-карт</span>
					</div>
					<el-input-number
						v-model="localProduct.sim_count"
						:min="1"
						:max="100"
						style="width: 100%"
					/>
				</div>
				<div class="mb-5">
					<div class="mb-4">
						<span>Комплектація</span>
					</div>
					<el-input
						v-model="localProduct.equipment"
						style="width: 100%"
						size="large"
						placeholder="Заповніть данні"
						clearable
					/>
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
