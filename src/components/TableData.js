import { ref } from 'vue'

export const TABLE_DATA = ref([
	{
		id: 1,
		order_number: '1001',
		customer: {
			id: '1',
			name: 'Петр Петров',
			phone: '+380671112233',
			email: 'petr@example.com',
		},
		recipient: {
			id: '2',
			name: 'Анна Петрова',
			phone: '+380671112234',
		},
		products: {
			id: 'p2',
			name: 'Ноутбук Lenovo IdeaPad 3',
			count: 1,
			price: 21000,
		},
		delivery: {
			service: 'Нова пошта',
			ttn: '20400098765432',
			adress: 'Отделение №5',
			city: 'г. Львов',
			status: 'В пути',
		},
		status: {
			order_status: 'Отправлен',
			contact_status: 'Не дозвонились',
		},
		created_at: '2025-04-16 09:15:00',
		delivery_date: '2025-04-18 15:00:00',
		source: 'Rozetka',
		manager: 'Мария',
	},
	{
		id: 2,
		order_number: '1002',
		customer: {
			id: '2',
			name: 'Олег Сидоров',
			phone: '+380501234567',
			email: 'oleg@example.com',
		},
		recipient: {
			id: '3',
			name: 'Дмитрий Сидоров',
			phone: '+380501234568',
		},
		products: {
			id: 'p3',
			name: 'Планшет Apple iPad 9',
			count: 2,
			price: 15000,
		},
		delivery: {
			service: 'Укрпошта',
			ttn: '10560012312312',
			adress: 'Отделение №7',
			city: 'г. Харьков',
			status: 'В обработке',
		},
		status: {
			order_status: 'Ожидает отправки',
			contact_status: 'Связались',
		},
		created_at: '2025-04-15 14:00:00',
		delivery_date: '2025-04-19 10:00:00',
		source: 'Facebook',
		manager: 'Ирина',
	},
	{
		id: 3,
		order_number: '1003',
		customer: {
			id: '3',
			name: 'Марина Коваль',
			phone: '+380991234567',
			email: 'marina@example.com',
		},
		recipient: {
			id: '4',
			name: 'Ирина Коваль',
			phone: '+380991234568',
		},
		products: {
			id: 'p4',
			name: 'Умные часы Xiaomi Mi Band 7',
			count: 3,
			price: 2200,
		},
		delivery: {
			service: 'Justin',
			ttn: '98765432101234',
			adress: 'Отделение №55',
			city: 'г. Одесса',
			status: 'Выдано',
		},
		status: {
			order_status: 'Доставлен',
			contact_status: 'Подтвержден',
		},
		created_at: '2025-04-14 12:45:00',
		delivery_date: '2025-04-16 11:00:00',
		source: 'Instagram',
		manager: 'Сергей',
	},
])
