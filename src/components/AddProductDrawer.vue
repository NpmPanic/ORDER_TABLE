<script setup>
import { Search } from '@element-plus/icons-vue'
import { PRODUCTS_DATA } from './ProductsData'
import { ref } from 'vue'

const num = ref(0)
const searchInput = ref()
const productSelect = ref('Товари')

const props = defineProps({
	modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])

// Отмена изменений при закрытии
const closeDrawer = () => {
	emit('update:modelValue', false)
}
</script>
<template>
	<el-drawer :model-value="props.modelValue" @close="closeDrawer" size="35%">
		<template #header>
			<div class="flex px-4 justify-between gap-2">
				<div class="flex-grow">
					<el-input
						v-model="searchInput"
						size="large"
						placeholder="Назва або артикуль товару"
						:prefix-icon="Search"
						clearable
					/>
				</div>
				<div>
					<el-radio-group v-model="productSelect" size="large">
						<el-radio-button label="Товари" value="Товари" />
						<el-radio-button label="Послуги" value="Послуги" />
					</el-radio-group>
				</div>
			</div>
		</template>
		<template #default>
			<el-table :data="PRODUCTS_DATA" style="width: 100%">
				<el-table-column type="selection" width="30px" />
				<el-table-column width="100px">
					<template #default="scope">
						<el-image
							style="width: 60px"
							:src="scope.row.img"
							:zoom-rate="1.2"
							:max-scale="7"
							:min-scale="0.2"
							:preview-src-list="[scope.row.img]"
							show-progress
							fit="cover"
							preview-teleported="true"
						/>
					</template>
				</el-table-column>
				<el-table-column property="name" width="250px">
					<template #default="scope">
						<div>
							<span>{{ scope.row.name }}</span>
						</div>

						<span class="text-slate-400">{{ scope.row.id }}</span></template
					>
				</el-table-column>

				<el-table-column property="price" width="100px">
					<template #default="scope">
						<span>{{ scope.row.price }}</span>

						<span> &#8372;</span></template
					>
				</el-table-column>
				<el-table-column>
					<el-input-number v-model="num" :min="0" :max="100" size="small" />
				</el-table-column>
			</el-table>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4">
				<el-button @click="closeDrawer" size="large">Закрити</el-button>
				<el-button @click="closeDrawer" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-drawer>
</template>

<style scoped>
:global(.el-drawer__header) {
	margin-bottom: 0 !important;
	padding-bottom: 0 !important;
}
</style>
