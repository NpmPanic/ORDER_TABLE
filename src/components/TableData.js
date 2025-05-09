import { ref } from 'vue'

export const TABLE_DATA = ref([
	{
		id: 1,
		isActive: true,
		order: {
			order_number: '345286913',
			order_status: 'Новий',
			contact_status: 'Не вдалося зв’язатися',
			pay_status: 'Не оплачено',
			created_at: '2025-04-16 09:15:00',
			source: './prom.png',
			manager: 'Марія',
			manager_comment: '',
		},
		customer: {
			id: '1',
			name: 'Іван Іванович',
			phone: '+380671112233',
			email: 'ivan@example.com',
			comment: '',
		},
		recipient: {
			id: '2',
			name: 'Оксана Іванова',
			phone: '+380671112234',
		},
		products: {
			id: 'p2',
			name: 'Ноутбук Lenovo IdeaPad 3',
			count: 2,
			price: 21000,
			img: './orders/1.jpg',
		},
		delivery: {
			delivery_date: '2025-04-18 15:00:00',
			service: './delivery.png',
			ttn: '20400098765432',
			adress: 'Відділення №5',
			city: 'м. Львів',
			delivery_status: 'В дорозі',
			delivery_price: 80,
		},
	},
])
