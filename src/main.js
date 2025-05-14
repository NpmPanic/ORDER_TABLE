import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import localeUa from 'element-plus/es/locale/lang/uk'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(ElementPlus, { locale: localeUa }).mount('#app')
