<script setup>
import { ref, computed } from 'vue'
import { mdiTable } from '@mdi/js'
import store from '../store'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import ClientsTable from '@/components/dashboard/newOrdersTable.vue'

const titleStack = ref(['Admin', 'Dashboard'])
const products = computed(() => store.state.products)
if (products.value.length === 0) {
  if (process.env.NODE_ENV !== 'development') {
    store.dispatch('getAllProducts', 'products')
    store.dispatch('getAllOrders', 'orders')
  } else {
    store.dispatch('getAllOrdersDevelop', 'orders')
    store.dispatch('getAllProductsDevelop', 'products')
  }
}

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>New orders </hero-bar>
  <main-section>
    <card-component
      class="mb-6"
      title="Last orders"
      :icon="mdiTable"
      has-table
    >
      <clients-table />
    </card-component>
  </main-section>
</template>
