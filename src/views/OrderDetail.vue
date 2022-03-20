<script setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { mdiTable, mdiPrinter, mdiFileDocumentEdit, mdiArrowLeftCircle } from '@mdi/js'
import { deleteOrder } from '@/utils/firebase.js'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'

const titleStack = ref(['Admin', 'Detail'])

const store = useStore()

const router = useRouter()

const items = computed(() => store.state.orders)

const orderWrapper = reactive({
  items
})
const selectedOrder = computed(
  () => {
    if (orderWrapper.items.length > 0) {
      const orderFiltered = orderWrapper.items.filter((elem) => elem.id === router.currentRoute.value.params.id)
      return orderFiltered[0]
    }
    return false
  }
)

const deleteOrderFromTable = async (order) => {
  await deleteOrder(order)
  store.dispatch('getAllOrders', 'orders')
}
const printPage = () => {
  window.print()
}
const goBack = () => {
  router.go(-1)
}
const routeDetails = (orderId) => {
  router.push(`/modifyOrder/${orderId}`)
}
</script>

<template>
  <title-bar
    :title-stack="titleStack"
    class="print:hidden"
  />
  <hero-bar>Order Detail </hero-bar>
  <main-section>
    <card-component
      class="mb-6"
      title="Order Selected"
      :icon="mdiTable"
      has-table
    >
      <div
        class="flex  m-8 print:hidden"
        :class="selectedOrder.data?.isPaid ? 'justify-center' : 'justify-between' "
      >
        <jb-button
          label="Print"
          :icon="mdiPrinter "
          @click="printPage()"
        />
        <jb-button
          v-if="!selectedOrder.data?.isPaid"
          label="Modify"
          color="info"
          :icon="mdiFileDocumentEdit "
          @click="routeDetails(selectedOrder.id)"
        />
        <jb-button
          v-if="!selectedOrder.data?.isPaid"
          label="Delete"
          color="danger"
          :icon="mdiPrinter "
          @click="deleteOrderFromTable(selectedOrder.id)"
        />
      </div>
      <ul class="mx-8">
        <li class="mb-2">
          <b> Client's Name: </b> {{ selectedOrder?.data?.client }}
        </li>
        <li class="mb-2">
          <b> Date: </b> {{ selectedOrder?.data?.date }}
        </li>
        <li class="mb-2">
          <b> Total Price: </b> {{ selectedOrder?.data?.totalPrice }}
        </li>
        <li class="mb-2">
          <b> Total Items: </b> {{ selectedOrder?.data?.totalQuantity }}
        </li>
        <li class="mb-2">
          <b> Notes: </b> {{ selectedOrder?.data?.note || 'No notes' }}
        </li>
        <li
          v-if="selectedOrder?.data?.extraQuantity"
          class="mb-2"
        >
          This order has extra products, <b> total: </b>  {{ selectedOrder?.data?.extraQuantity }}
          for a <b> total price </b>  of {{ selectedOrder?.data?.extraPrice }}
        </li>
      </ul>
      <divider />
      <h3 class="text-center font-bold">
        Products:
      </h3>
      <divider />
      <ul
        v-for="product in selectedOrder?.data?.products"
        :key="product.Name"
        class="mx-8"
      >
        <li class="mb-2">
          <b> Nombre: </b> {{ product.data?.Name }}
        </li>
        <li class="mb-2">
          <b> Precio: </b> {{ product.data?.Price }}
        </li>
        <li class="mb-2">
          <b> Quantity: </b> {{ product.data?.Quantity }}
        </li>
        <divider />
      </ul>
    </card-component>
    <div class="flex justify-center m-8 print:hidden">
      <jb-button
        label="Go back"
        :icon="mdiArrowLeftCircle "
        @click="goBack()"
      />
    </div>
  </main-section>
</template>
