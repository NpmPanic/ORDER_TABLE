<script setup>
import { defineProps } from 'vue'
// Иконки для компонентов element plus
import { Delete, Edit, UserFilled } from '@element-plus/icons-vue'
// Пропс для проброса данных таблицы из родителя
defineProps({
	table_data: Array,
})
</script>
<template>
	<el-table
		:data="table_data"
		:default-sort="{ prop: 'created_at', order: 'descending' }"
		height="100%"
		style="width: 100%"
	>
		<!-- Колонка для стрелочки разворота -->
		<el-table-column type="expand">
			<template #default="props">
				<div class="p-4 bg-green-100">
					<p><strong>№ замовлення:</strong> {{ props.row.order_number }}</p>
					<p><strong>Джерело</strong> {{ props.row.source }}</p>
				</div>
			</template>
		</el-table-column>

		<!-- Обычные колонки -->
		<el-table-column
			prop="order_number"
			label="№ замовлення"
			width="150"
			sortable
		/>
		<el-table-column prop="source" label="Джерело" width="120" sortable />
		<el-table-column
			prop="created_at"
			label="Час створення"
			width="170"
			sortable
		/>
		<el-table-column
			prop="delivery_date"
			label="Дата доставки"
			width="170"
			sortable
		/>
		<el-table-column
			prop="status.order_status"
			label="Статус"
			width="150"
			sortable
		/>
		<el-table-column prop="manager" label="Менеджер" width="150" sortable
			><template #default="{ row }">
				<div class="flex items-center gap-4">
					<el-avatar :size="20" :icon="UserFilled" />
					<span>{{ row.manager }}</span>
				</div>
			</template></el-table-column
		>
		<el-table-column
			prop="customer.name"
			label="Покупець"
			width="150"
			sortable
		/>
		<el-table-column
			prop="customer.phone"
			label="Телефон покупця"
			width="170"
			sortable
		/>
		<el-table-column
			prop="customer.email"
			label="E-mail покупця"
			width="170"
			sortable
		/>
		<el-table-column
			prop="delivery.service"
			label="Служба доставки"
			width="170"
			sortable
		/>
		<el-table-column
			prop="delivery.ttn"
			label="Трекінг код"
			width="150"
			sortable
		/>
		<el-table-column
			prop="delivery.status"
			label="Статус доставки"
			width="170"
			sortable
		/>
		<el-table-column prop="products.name" label="Товари" width="170" sortable />
		<el-table-column
			prop="products.price"
			label="Вартість"
			width="150"
			sortable
		/>
		<el-table-column
			prop="recipient.name"
			label="Отримувач"
			width="150"
			sortable
		/>
		<el-table-column
			prop="recipient.phone"
			label="Телефон отримувача"
			width="190"
			sortable
		/>
		<el-table-column
			prop="delivery.adress"
			label="Адреса відділення"
			width="190"
			sortable
		/>
		<el-table-column prop="delivery.city" label="Місто" width="150" sortable />
		<el-table-column label="Дії" width="150">
			<el-button type="default" :icon="Edit" circle />
			<el-button type="default" :icon="Delete" circle />
		</el-table-column>
	</el-table>
</template>
