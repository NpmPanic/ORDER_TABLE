<script setup>
import { Close } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'

const props = defineProps({
	modelValue: Boolean,
	statusCRM: Object,
})
const emit = defineEmits(['update:modelValue'])

const settingsTypeRadio = ref('Головне')

const mainSettings = reactive({
	// Способы доставки
	deliveryMethods: {
		selected: ['Value selected and disabled', ''],
		defaultValue: null,
	},
	// Форма оплаты за доставку
	paymentForm: {
		selected: [''],
		defaultValue: null,
	},
	// Платник доставки
	deliveryPayer: {
		selected: [''],
		defaultValue: null,
	},
	// Количество мест по умолчанию
	defaultPlaces: '',
	// Наложенный платеж
	cashOnDelivery: {
		selected: [''],
		defaultValue: null,
	},
	// Платник за обратную доставку
	returnDeliveryPayer: {
		selected: [''],
		defaultValue: null,
	},
	// Отправка на юридическое лицо
	legalEntityShipping: {
		selected: ['Ні'],
	},
	// Описание отправления
	shipmentDescription: 'Назва товару',
	// Дополнительная информация отправления
	additionalInfo: 'Назва товару',
	// Сокращенная дополнительная информация
	shortAdditionalInfo: 'Так',
	// Дата отправки
	shipmentDate: 'Поточна дата',
	// Расходы за доставку
	deliveryCosts: 'Заповнювати',
	// Вес по умолчанию
	defaultWeight: 1,
	// Перевод в оплаченное после получения заказа
	autoMarkAsPaid: 1,
})

const statusNovaPoshta = ref([
	'Відправник самостійно створив цю накладну, але ще не надав до відправки',
	'ТТН видалено',
	'Номер не знайдено',
	'Відправлення у місті відправника',
	'Відправлення у місті відправника (доставка в межах міста)',
	'Відправлення прямує до міста одержувача',
	'Відправлення у місті одержувача',
	'Прибув на відділення',
	'Завантажено в Поштомат',
	'Відправлення отримано',
	'Відправлення отримано. Грошовий переказ видано одержувачу',
	'Нова Пошта комплектує ваше відправлення',
	'На шляху до одержувача',
	'Відмова від отримання (відправником створено замовлення на повернення)',
	'Відмова одержувача (отримувач відмовився від відправлення)',
	'Змінено адресу',
	'Припинено зберігання',
	'Одержано і створено ЄН зворотньої доставки',
	'Невдала спроба доставки',
	'Дата доставки перенесена одержувачем',
])
const innerSenderDrawer = ref(false)

const saveModal = () => {
	emit('update:modelValue', false)
}

const closeModal = () => {
	emit('update:modelValue', false)
}
const closeDrawer = () => {
	innerSenderDrawer.value = false
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
			<div class="flex justify-between items-center w-full px-4 mb-10">
				<span class="text-xl text-gray-700 font-semibold uppercase"
					>Налаштування доставки</span
				>
				<el-button @click="closeModal" link circle>
					<el-icon size="large"
						><Close class="text-gray-500 hover:text-blue-500"
					/></el-icon>
				</el-button>
			</div>
		</template>

		<template #default>
			<div class="flex items-center justify-between px-4 mb-8">
				<el-radio-group v-model="settingsTypeRadio" size="large">
					<el-radio-button label="Головне" value="Головне" />
					<el-radio-button label="Статуси" value="Статуси" />
				</el-radio-group>
				<el-button @click="innerSenderDrawer = true" type="primary" size="large"
					>Додати відправника</el-button
				>
				<el-drawer
					v-model="innerSenderDrawer"
					@close="closeDrawer"
					:show-close="false"
				>
					<template #header>
						<div class="flex justify-between items-center w-full px-4 mb-10">
							<span class="text-xl text-gray-700 font-semibold uppercase"
								>Новий відправник</span
							>
							<el-button @click="closeDrawer" link circle>
								<el-icon size="large"
									><Close class="text-gray-500 hover:text-blue-500"
								/></el-icon>
							</el-button>
						</div>
					</template>
					<template #default>
						<div class="flex gap-5 px-4">
							<div class="w-1/2">
								<div class="mb-8">
									<p class="font-semibold mb-4">Контрагент</p>
									<el-select v-model="value" placeholder="Обрати" size="large">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Відправник</p>
									<el-select v-model="value" placeholder="Обрати" size="large">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Телефон</p>
									<el-input
										v-model="input"
										placeholder="Заповніть данні"
										size="large"
									/>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Відділення</p>
									<el-select v-model="value" placeholder="Обрати" size="large">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Будинок</p>
									<el-input
										v-model="input"
										placeholder="Заповніть данні"
										size="large"
									/>
								</div>
							</div>
							<div class="w-1/2">
								<div class="mb-8">
									<p class="font-semibold mb-4">API ключ</p>
									<el-input
										v-model="input"
										placeholder="Заповніть данні"
										size="large"
									/>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Контактна особа</p>
									<el-select v-model="value" placeholder="Обрати" size="large">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Місто</p>
									<el-select v-model="value" placeholder="Обрати" size="large">
										<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Вулиця</p>
									<el-input
										v-model="input"
										placeholder="Заповніть данні"
										size="large"
									/>
								</div>
								<div class="mb-8">
									<p class="font-semibold mb-4">Квартира</p>
									<el-input
										v-model="input"
										placeholder="Заповніть данні"
										size="large"
									/>
								</div>
							</div>
						</div>
					</template>
					<template #footer>
						<div class="flex justify-end gap-4 px-4 pt-[10px]">
							<el-button @click="closeDrawer" size="large">Закрити</el-button>
							<el-button @click="closeDrawer" type="primary" size="large">
								Зберегти
							</el-button>
						</div>
					</template>
				</el-drawer>
			</div>
			<div class="px-4 mb-8">
				<hr class="text-gray-200" />
			</div>
			<div>
				<div v-if="settingsTypeRadio == 'Головне'" class="px-4">
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Способи доставки</p>
							<el-checkbox-group
								v-model="mainSettings.deliveryMethods.selected"
							>
								<el-checkbox
									label="Відділення - Відділення"
									value="Відділення - Відділення"
								/>
								<el-checkbox
									label="Відділення - Адреса"
									value="Відділення - Адреса"
								/>
								<el-checkbox
									label="Адреса - Відділення"
									value="Адреса - Відділення"
								/>
								<el-checkbox label="Адреса - Адреса" value="Адреса - Адреса" />
							</el-checkbox-group>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">Значення за замовчуванням</p>
							<el-select
								v-model="mainSettings.deliveryMethods.defaultValue"
								placeholder="Обрати"
								style="width: 240px"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Форма оплати за доставку</p>
							<el-checkbox-group v-model="mainSettings.paymentForm.selected">
								<el-checkbox label="Готівка" value="Готівка" />
								<el-checkbox label="Безготівка" value="Безготівка" />
							</el-checkbox-group>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">Значення за замовчуванням</p>
							<el-select
								v-model="mainSettings.paymentForm.defaultValue"
								placeholder="Обрати"
								style="width: 240px"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Платник доставки</p>
							<el-checkbox-group v-model="mainSettings.deliveryPayer.selected">
								<el-checkbox label="Відправник" value="Відправник" />
								<el-checkbox label="Отримувач" value="Отримувач" />
								<el-checkbox label="Третя особа" value="Третя особа" />
							</el-checkbox-group>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">Значення за замовчуванням</p>
							<el-select
								v-model="mainSettings.deliveryPayer.defaultValue"
								placeholder="Обрати"
								style="width: 240px"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Кількість місць за замовчуванням</p>
							<el-radio-group v-model="mainSettings.defaultPlaces">
								<el-radio value="Кількість товарних позицій"
									>Кількість товарних позицій</el-radio
								>
								<el-radio value="Одне">Одне</el-radio>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Післяплата</p>
							<el-checkbox-group v-model="mainSettings.cashOnDelivery.selected">
								<el-checkbox
									label="Зворотна доставка - грошовий переказ"
									value="Зворотна доставка - грошовий переказ"
								/>
								<el-checkbox label="Контроль оплати" value="Контроль оплати" />
							</el-checkbox-group>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">Значення за замовчуванням</p>
							<el-select
								v-model="mainSettings.cashOnDelivery.defaultValue"
								placeholder="Обрати"
								style="width: 240px"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Платник за зворотну доставку</p>
							<el-checkbox-group
								v-model="mainSettings.returnDeliveryPayer.selected"
							>
								<el-checkbox label="Відправник" value="Відправник" />
								<el-checkbox label="Отримувач" value="Отримувач" />
							</el-checkbox-group>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">Значення за замовчуванням</p>
							<el-select
								v-model="mainSettings.returnDeliveryPayer.defaultValue"
								placeholder="Обрати"
								style="width: 240px"
							>
								<el-option
									v-for="item in options"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Відправка на юридичну особу</p>
							<el-checkbox-group
								v-model="mainSettings.legalEntityShipping.selected"
							>
								<el-checkbox
									label="Можливість відправки"
									value="Можливість відправки"
								/>
							</el-checkbox-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Опис відправлення</p>
							<el-radio-group v-model="mainSettings.shipmentDescription">
								<el-radio value="Назва товару">Назва товару</el-radio>
								<el-radio value="Код товару">Код товару</el-radio>
								<el-radio value="Назва в документах"
									>Назва в документах</el-radio
								>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">
								Додаткова інформація відправлення
							</p>
							<el-radio-group v-model="mainSettings.additionalInfo">
								<el-radio value="Назва товару">Назва товару</el-radio>
								<el-radio value="Код товару">Код товару</el-radio>
								<el-radio value="Назва в документах"
									>Назва в документах</el-radio
								>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Скорочена додаткова інформація</p>
							<el-radio-group v-model="mainSettings.shortAdditionalInfo">
								<el-radio value="Так">Так</el-radio>
								<el-radio value="Ні">Ні</el-radio>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Дата відправки</p>
							<el-radio-group v-model="mainSettings.shipmentDate">
								<el-radio value="Поточна дата">Поточна дата</el-radio>
								<el-radio value="Дата формування ТТН"
									>Дата формування ТТН</el-radio
								>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Витрати за доставку</p>
							<el-radio-group v-model="mainSettings.deliveryCosts">
								<el-radio value="Заповнювати">Заповнювати</el-radio>
								<el-radio value="Не заповнювати">Не заповнювати</el-radio>
							</el-radio-group>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">Вага за замовчуванням, кг</p>
							<el-input-number
								v-model="mainSettings.defaultWeight"
								:min="1"
								:max="100"
								controls-position="right"
							/>
						</div>
					</div>
					<div class="mb-8">
						<hr class="text-gray-200" />
					</div>
					<div class="mb-8">
						<div class="mb-4">
							<p class="font-semibold mb-4">
								Переведення в сплачене після отримання замовлення
							</p>
							<el-radio-group v-model="mainSettings.autoMarkAsPaid">
								<el-radio value="Так">Так</el-radio>
								<el-radio value="Ні">Ні</el-radio>
							</el-radio-group>
						</div>
					</div>
				</div>
				<div v-else class="px-4">
					<div class="space-y-8">
						<div
							v-for="(status, index) in statusNovaPoshta"
							:key="status"
							class="grid grid-cols-2 items-start mb-8"
						>
							<p class="font-semibold">
								{{ status }}
							</p>
							<el-select v-model="value" placeholder="Обрати" class="w-full">
								<el-option
									v-for="item in props.statusCRM.status"
									:key="item"
									:label="item"
									:value="item"
								/>
							</el-select>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #footer>
			<div class="flex justify-end gap-4 px-4">
				<el-button @click="closeModal" size="large">Закрити</el-button>
				<el-button @click="saveModal" type="primary" size="large"
					>Зберегти</el-button
				>
			</div>
		</template>
	</el-dialog>
</template>

<style scoped></style>
