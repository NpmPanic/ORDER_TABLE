import { ref } from 'vue'

export const TABLE_DATA = ref([
	{
		id: 345286913,
		order: {
			order_status: 'Новий',
			contact_status: 'Не вдалося зв’язатися',
			pay_status: 'Не оплачено',
			created_at: '01/06/2025',
			source: 'Mail',
			manager: '',
			manager_comment: '',
		},
		customer: {
			name: 'Іван Іванович',
			phone: '+380671112233',
			email: 'ivan@example.com',
			comment: '',
		},
		recipient: {
			name: 'Оксана Іванова',
			phone: '+380671112234',
		},
		products: [
			{
				id: '7622',
				name: 'Ноутбук Lenovo IdeaPad 3',
				second_name: 'Lenovo IdeaPad 3 12/512 Windows 11',
				title:
					'15.6" FHD (1920×1080), AMD Ryzen 5 5500U (6 ядер, 2.1–4.0 ГГц), 8 ГБ DDR4, SSD 256 ГБ, графіка AMD Radeon, без ОС, сірий корпус',
				count: 1,
				count_name: 'шт',
				price: 20999,
				img: './orders/1.jpg',
				warehouse: [],
			},
			{
				id: '9485',
				name: 'Смартфон Samsung Galaxy S22',
				second_name: 'Samsung Galaxy S22 8/256 UA UCRF',
				title:
					'6.1" Dynamic AMOLED 2X (120 Гц), Snapdragon 8 Gen 1 / Exynos 2200, 8 ГБ ОЗУ, 128/256 ГБ, камера 50 Мп + 10 Мп + 12 Мп, акумулятор 3700 мАг, IP68, Android 12 (One UI 4.1)',
				count: 1,
				count_name: 'шт',
				price: 11999,
				img: './orders/2.jpg',
				warehouse: [],
			},
		],

		additional_products: [],

		delivery: {
			delivery_date: '',
			service: '',
			ttn: '',
			adress: '',
			city: '',
			delivery_status: 'Доставлено',
			status_history: [
				{
					status: 'Замовлення отримано',
					date: '01/06/2025',
					time: '10:15',
					comment: 'Замовлення отримано від клієнта',
				},
				{
					status: 'Обробка замовлення',
					date: '01/06/2025',
					time: '11:30',
					comment: 'Замовлення передано на комплектацію',
				},
				{
					status: 'У дорозі',
					date: '02/06/2025',
					time: '08:30',
					comment: 'Замовлення прямує до відділення',
				},
				{
					status: 'Прибуло у відділення',
					date: '04/06/2025',
					time: '11:40',
					comment: 'Замовлення прибуло на відділення',
				},
				{
					status: 'Доставлено',
					date: '04/06/2025',
					time: '16:40',
					comment: 'Клієнт отримав замовлення',
				},
			],
			delivery_price: '',
		},
	},
	{
		id: 345286218,
		order: {
			order_status: 'Новий',
			contact_status: 'Не вдалося зв’язатися',
			pay_status: 'Не оплачено',
			created_at: '04/06/2025',
			source: 'Mail',
			manager: '',
			manager_comment: '',
		},
		customer: {
			name: 'Петро Петрович',
			phone: '+380671113322',
			email: 'petro@example.com',
			comment: '',
		},
		recipient: {
			name: 'Марина Петрівна',
			phone: '+380671114456',
		},
		products: [
			{
				id: '1354',
				name: 'Iphone 15 Pro',
				second_name: 'Iphone 15 Pro Titanium Global',
				title:
					'6,1" Super Retina XDR (120 Гц), A17 Pro, 48 Мп (основна) + 12 Мп (ультраширока) + 12 Мп (теле), титановий корпус, USB-C, Face ID, iOS 17, 5G, без адаптера в комплекті',
				count: 2,
				count_name: 'шт',
				price: 39999,
				img: './orders/3.jpg',
				warehouse: [],
			},

			{
				id: '1689',
				name: 'Samsung S24 Ultra',
				second_name: 'Samsung Galaxy S24 Ultra 12/512 UA UCRF',
				title:
					'6.8" Dynamic AMOLED 2X (120 Гц, QHD+), Snapdragon 8 Gen 3, 200 Мп (основна) + 50 Мп (теле 5x) + 12 Мп (ультраширока) + 10 Мп (теле 3x), S Pen, Titanium Frame, 5000 мАг, 45W зарядка, Android 14 (One UI 6.1), IP68',
				count: 1,
				count_name: 'шт',
				price: 37999,
				img: './orders/4.jpg',
				warehouse: [],
			},
		],

		additional_products: [],

		delivery: {
			delivery_date: '',
			service: '',
			ttn: '',
			adress: '',
			city: '',
			delivery_status: 'Замовлення отримано',
			status_history: [
				{
					status: 'Замовлення отримано',
					date: '04/06/2025',
					time: '12:15',
					comment: 'Замовлення отримано від клієнта',
				},
			],
			delivery_price: '',
		},
	},
])
