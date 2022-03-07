<script setup>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { paidOrder } from '@/utils/firebase.js'
import { mdiEye, mdiPrinter } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Divider from '@/components/Divider.vue'

// TODO: agregar print option

defineProps({
  checkable: Boolean
})

const store = useStore()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.orders)

const orderWrapper = reactive({
  items
})

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const itemsPaginated = computed(
  () => {
    if (orderWrapper.items.length > 0) {
      const filterList = orderWrapper.items.filter((elem) => elem.data.isPaid === true)
      return filterList.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
    }
    return false
  }
)

const numPages = computed(() => {
  if (orderWrapper.items.length > 0) {
    return Math.ceil(orderWrapper.items.length / perPage.value)
  }
  return false
})

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const selectedItem = reactive({
  data: ''
})
const paidSelectedOrderFromTable = async (order) => {
  await paidOrder(order)
  store.dispatch('getAllOrders', 'orders')
  isModalDangerActive.value = false
  alert('La orden se marco como pagada de manera correcta')
}
const selectItem = (order) => {
  selectedItem.data = order
}
const printPage = () => {
  window.print()
}
</script>

<template>
  <modal-box
    v-model="isModalActive"
    title="Order Options"
  >
    <div class="flex justify-between">
      <jb-button
        label="Print"
        :icon="mdiPrinter"
        @click="printPage()"
      />
    </div>
    <divider />
    <ul>
      <li>Client Name: <b>{{ selectedItem.data?.data?.client }} </b></li>
      <li>Date: <b>{{ selectedItem.data?.data?.date }} </b></li>
      <li>Total Price: <b>{{ selectedItem.data?.data?.totalPrice }}</b></li>
      <li>Total Items: <b>{{ selectedItem.data?.data?.totalQuantity }}</b></li>
      <li>Notes: {{ selectedItem.data?.data?.note || 'No notes' }}</li>
      <li v-if="selectedItem.data?.data?.extraQuantity">
        This order has extra products, total: <b>{{ selectedItem.data?.data?.extraQuantity }}</b>
        and a total of <b>{{ selectedItem.data?.data?.extraPrice }}</b>
      </li>
    </ul>
    <h3><b>Products:</b></h3>
    <ul
      v-for="product in selectedItem.data?.data?.products"
      :key="product.Name"
    >
      <li>Nombre: <b>{{ product.data?.Name }}</b></li>
      <li>Precio: <b>{{ product.data?.Price }}</b></li>
      <li>Quantity: <b>{{ product.data?.Quantity }}</b></li>
    </ul>
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    large-title="Confirm order"
    button="success"
    has-cancel
    @effect="paidSelectedOrderFromTable(selectedItem.data)"
  >
    <p>Marcar como <b>entregado</b></p>
    <p>Esta accion enviará la orden al historial de ordenes (donde no se podran realizar modificaciones posteriores</p>
  </modal-box>
  <table>
    <thead>
      <tr>
        <th>Client</th>
        <th>Price</th>
        <th>N° Products</th>
        <th>Payment type</th>
        <th>Created</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(order, index) in itemsPaginated"
        :key="order.id"
        :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
      >
        <td data-label="Client">
          {{ order.data.client }}
        </td>
        <td data-label="Total price">
          {{ order.data.totalPrice }}
        </td>
        <td
          data-label="Total quantity"
        >
          {{ order.data.totalQuantity }}
        </td>
        <td data-label="Total price">
          {{ order.data.paymentType.label }}
        </td>
        <td data-label="Created">
          <small
            class="text-gray-500 dark:text-gray-400"
            :title="order.created"
          >{{ order.data.date }}</small>
        </td>
        <td class="actions-cell">
          <jb-buttons
            type="justify-start lg:justify-end"
            no-wrap
          >
            <jb-button
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true; selectItem(order)"
            />
            <jb-button
              :icon="mdiPrinter "
              small
              @click="notYet()"
            />
          </jb-buttons>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :outline="darkMode"
          small
          @click="currentPage = page"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </level>
  </div>
</template>
