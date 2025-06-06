import { ref } from 'vue'
export const PRODUCTS_DATA = ref([
	{
		id: '5432',
		count: 0,
		count_name: 'шт',
		name: 'Apple iPhone 15 Pro Titanium 128 Gb',
		second_name: 'Iphone 15 Pro Titanium 128 Gb Global',
		title:
			'6,1" Super Retina XDR (120 Гц), A17 Pro, 48 Мп (основна) + 12 Мп (ультраширока) + 12 Мп (теле), титановий корпус, USB-C, Face ID, iOS 17, 5G, без адаптера в комплекті',
		price: 41999,
		img: './products/p6.jpg',
		warehouse: [],
	},
	{
		id: '8796',
		count: 0,
		count_name: 'шт',
		name: 'Apple iPhone 16 Pro Titanium 256 Gb',
		second_name: 'Iphone 16 Pro Titanium 256 Gb Global',
		title:
			'6,3" ProMotion OLED (120 Гц), A18 Pro, 48 Мп (основна) + 48 Мп (ультраширока) + 12 Мп (телефото з 5x зумом), титановий корпус, USB-C 3.2, нові термічні кнопки, покращена система охолодження, Wi-Fi 7, 5G, iOS 18, можливість підтримки Apple Intelligence',
		price: 49999,
		img: './products/p7.jpg',
		warehouse: [],
	},
	{
		id: '2698',
		count: 0,
		count_name: 'шт',
		name: 'Samsung Galaxy S24 Ultra Titanium 256 Gb',
		second_name: 'Samsung Galaxy S24 Ultra Titanium 256 Gb Global',
		title:
			'6.8" Dynamic AMOLED 2X (120 Гц, QHD+), Snapdragon 8 Gen 3, 200 Мп (основна) + 50 Мп (теле 5x) + 12 Мп (ультраширока) + 10 Мп (теле 3x), S Pen, Titanium Frame, 5000 мАг, 45W зарядка, Android 14 (One UI 6.1), IP68',
		price: 37499,
		img: './products/p8.jpg',
		warehouse: [],
	},
	{
		id: '3564',
		count: 0,
		count_name: 'шт',
		name: 'Xiaomi 13 Ultra 512 Gb',
		second_name: 'Xiaomi 13 Ultra 512 Gb UA UCRF',
		title:
			'6.73" AMOLED 120 Гц LTPO, Snapdragon 8 Gen 2, 50 Мп (Sony IMX989) + 50 Мп (теле 5x) + 50 Мп (теле 3.2x) + 50 Мп (ультраширока), алюмінієво-шкіряний корпус, 5000 мАг, 90W зарядка, IP68, Android 13 (MIUI 14)',
		price: 30999,
		img: './products/p9.jpg',
		warehouse: [],
	},
	{
		id: '8712',
		count: 0,
		count_name: 'шт',
		name: 'Samsung Galaxy A16 SM-A165F',
		second_name: 'Samsung Galaxy A16 SM-A165F UA UCRF',
		title:
			'6.5" HD+ Super AMOLED (60 Гц), MediaTek Helio G99, 50 Мп (осн) + 5 Мп (ультрашир) + 2 Мп (макро), 5000 мАг, 15W зарядка, Android 14 (One UI Core), пластиковий корпус, 3.5 мм розєм',
		price: 6599,
		img: './products/p10.jpg',
		warehouse: [],
	},
	{
		id: '4365',
		count: 0,
		count_name: 'шт',
		name: 'Power Bank Baseus Bipow Digital Display 10000mAh',
		second_name: 'Power Bank Baseus Bipow Digital Display 10000mAh UA UCRF',
		title:
			'10000 мАг, 18W PD/QC швидка зарядка, цифровий дисплей, 2xUSB-A + 1xUSB-C, компактний корпус, захист від перегріву/КЗ',
		price: 679,
		img: './products/p11.jpg',
		warehouse: [],
	},
	{
		id: '9687',
		count: 0,
		count_name: 'шт',
		name: 'TWS Lenovo LivePods LP60 5.0 black',
		second_name: 'Lenovo LivePods LP60 5.0 black UA UCRF',
		title:
			'Bluetooth 5.3, 12 мм динаміки, до 4 год роботи (20 год із case), IPX4, сенсорне керування, мікрофон, Type-C',
		price: 890,
		img: './products/p12.jpg',
		warehouse: [],
	},
	{
		id: '2598',
		count: 0,
		count_name: 'шт',
		name: 'Bluetooth Stereo Panasonic RB-HF420BGE-K Black',
		second_name: 'Panasonic RB-HF420BGE-K Black UA UCRF',
		title:
			'Bluetooth 5.0, 40 мм динаміки, до 50 год роботи, FM-радіо, AUX, microSD, легкий складний дизайн, діапазон частот 20 Гц – 20 кГц',
		price: 1289,
		img: './products/p13.jpg',
		warehouse: [],
	},

	{
		id: '1256',
		count: 0,
		count_name: 'шт',
		name: 'Поклейка скла',
		second_name: 'Поклейка скла до 6 дюймів',
		title: '',
		price: 199,
		img: './products/p14.jpg',
		warehouse: [],
	},
	{
		id: '1298',
		count: 0,
		count_name: 'шт',
		name: 'Поклейка плівки',
		second_name: 'Поклейка плівки до 6 дюймів',
		title: '',
		price: 199,
		img: './products/p15.jpg',
		warehouse: [],
	},
	{
		id: '7500',
		count: 0,
		count_name: 'шт',
		name: 'Налаштування Стандарт',
		second_name: 'Програмне забезпечення "Стандарт"',
		title: 'Програмне забезпечення "Стандарт',
		price: 999,
		img: './products/p16.jpg',
		warehouse: [],
	},
	{
		id: '7550',
		count: 0,
		count_name: 'шт',
		name: 'Налаштування Преміум',
		second_name: 'Програмне забезпечення "Преміум"',
		title: 'Програмне забезпечення "Преміум"',
		price: 1999,
		img: './products/p16.jpg',
		warehouse: [],
	},
	{
		id: '7580',
		count: 0,
		count_name: 'шт',
		name: 'Налаштування Ультра',
		second_name: 'Програмне забезпечення "Ультра"',
		title: 'Програмне забезпечення "Ультра"',
		price: 2999,
		img: './products/p16.jpg',
		warehouse: [],
	},
	{
		id: '9000',
		count: 0,
		count_name: 'шт',
		name: 'Упаковка товару',
		second_name: 'Упаковка',
		title: '',
		price: 99,
		img: './products/p17.jpg',
		warehouse: [],
	},
])
