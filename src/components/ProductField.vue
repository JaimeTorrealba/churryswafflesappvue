<script setup>
import { computed, useSlots } from 'vue'

defineProps({
  label: {
    type: String,
    default: null
  },
  help: {
    type: String,
    default: null
  },
  extraLabel: {
    type: String,
    default: null
  }
})

const slots = useSlots()

const wrapperClass = computed(() => {
  const base = []
  const slotsLength = slots.default().length

  if (slotsLength > 1) {
    base.push('grid grid-cols-1 gap-3')
  }

  if (slotsLength === 2) {
    base.push('md:grid-cols-2')
  }

  return base
})
</script>

<template>
  <div class="mb-6 last:mb-0">
    <div
      :class="wrapperClass"
      class="flex justify-between items-center mb-2"
    >
      <label
        v-if="label"
        class="block font-bold mb-2 minWidthLabel"
      >{{ label }}
      </label>
      <p>{{ extraLabel }}</p>
      <slot />
    </div>
    <div
      v-if="help"
      class="text-xs text-gray-500 dark:text-gray-400 mt-1"
    >
      {{ help }}
    </div>
  </div>
</template>
<style>
.minWidthLabel{
  min-width: 140px;
}
</style>
