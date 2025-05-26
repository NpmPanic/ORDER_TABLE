import { ref } from 'vue'

export const TABLE_DATA = ref([
	{
		id: 1,
		order: {
			order_number: '345286913',
			order_status: 'Доставка',
			contact_status: 'Не вдалося зв’язатися',
			pay_status: 'Не оплачено',
			created_at: '16-04-2025',
			source: './prom.png',
			manager: '',
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
		products: [
			{
				id: 'p2',
				name: 'Ноутбук Lenovo IdeaPad 3',
				second_name: 'Lenovo IdeaPad 3 12/512 Windows 11',
				count: 1,
				count_name: 'шт',
				price: 20999,
				img: './orders/1.jpg',
				warehouse: [
					{
						place: '',
						count: 0,
						number: 0,
					},
				],
			},
			{
				id: 'p3',
				name: 'Смартфон Samsung Galaxy S22',
				second_name: 'Samsung Galaxy S22 8/256 UA UCRF',
				count: 1,
				count_name: 'шт',
				price: 11999,
				img: './orders/2.jpg',
				warehouse: [
					{
						place: '',
						count: 0,
						number: 0,
					},
				],
			},
		],

		delivery: {
			delivery_date: '',
			service: 'Нова пошта',
			ttn: '',
			adress: 'Відділення №2',
			city: 'м. Львів',
			delivery_status: '',
			delivery_price: 80,
		},
	},
	{
		id: 2,
		order: {
			order_number: '345286218',
			order_status: 'Новий',
			contact_status: 'Не вдалося зв’язатися',
			pay_status: 'Не оплачено',
			created_at: '18-04-2025',
			source: './prom.png',
			manager: '',
			manager_comment: '',
		},
		customer: {
			id: '2',
			name: 'Петро Петрович',
			phone: '+380671113322',
			email: 'petro@example.com',
			comment: '',
		},
		recipient: {
			id: '2',
			name: 'Марина Петрівна',
			phone: '+380671114456',
		},
		products: [
			{
				id: 'p4',
				name: 'Iphone 15 Pro',
				second_name: 'Iphone 15 Pro Titanium Global',
				count: 2,
				count_name: 'шт',
				price: 39999,
				img: './orders/3.jpg',
				warehouse: [
					{
						place: '',
						count: 0,
						number: 0,
					},
				],
			},
			{
				id: 'p5',
				name: 'Samsung S24 Ultra',
				second_name: 'Samsung Galaxy S24 Ultra 12/512 UA UCRF',
				count: 1,
				count_name: 'шт',
				price: 37999,
				img: './orders/4.jpg',
				warehouse: [
					{
						place: '',
						count: 0,
						number: 0,
					},
				],
			},
		],

		delivery: {
			delivery_date: '',
			service: 'Нова пошта',
			ttn: '',
			adress: 'Відділення №3',
			city: 'м. Київ',
			delivery_status: '',
			delivery_price: 80,
		},
	},
])
