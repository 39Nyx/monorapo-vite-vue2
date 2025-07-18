<script setup>
import { computed, ref } from 'vue'
import { sum } from 'shared-utils'
import { MyButton } from 'ui-components'

const count1 = ref(0)
const count2 = ref(0)

const result = computed(() => {
  return sum(count1.value, count2.value)
})
</script>

<template>
  <div>
    <div>
      <my-button @click="count1++">Increment count1 = {{ count1 }}</my-button>
    </div>
    <div>
      <my-button @click="count2++">Increment count2 = {{ count2 }}</my-button>
    </div>
    <div>
      结果: {{ result }}
    </div>
  </div>
</template>
