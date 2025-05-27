<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	initialComment: [String, Number],
})
const emit = defineEmits(['update:commentValue'])

const commentValue = ref(props.initialComment)
const isOpen = ref(false)

watch(
	() => props.initialComment,
	newVal => {
		commentValue.value = newVal
	}
)

const saveResult = () => {
	emit('update:commentValue', commentValue.value)
	isOpen.value = false
}

const cancelEdit = () => {
	commentValue.value = props.initialComment
	isOpen.value = false
}
</script>

<template>
	<el-popover :visible="isOpen" placement="bottom" width="250px">
		<div class="flex justify-center">
			<el-input
				v-model="commentValue"
				:autosize="{ minRows: 2, maxRows: 4 }"
				maxlength="30"
				show-word-limit
				type="textarea"
				placeholder="Введіть коментар"
			/>
		</div>

		<div class="mt-4 flex justify-center gap-2">
			<el-button size="small" @click="cancelEdit">Скасувати</el-button>
			<el-button size="small" type="primary" @click="saveResult">
				Зберегти
			</el-button>
		</div>

		<template #reference>
			<el-link @click="isOpen = true" type="primary" :underline="false">
				<span>{{ commentValue || 'Не задано' }}</span>
			</el-link>
		</template>
	</el-popover>
</template>

<style scoped>
.el-link {
	font-size: 12px;
}
.el-link :hover {
	color: orange;
}
</style>
