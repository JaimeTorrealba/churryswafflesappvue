<script setup>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { paidOrder } from '@/utils/firebase.js'
import { mdiEye, mdiCheck } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'

// TODO: agregar edit option

defineProps({
  checkable: Boolean
})

const router = useRouter()

const store = useStore()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.orders)

const orderWrapper = reactive({
  items
})

const isModalSuccessActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const itemsPaginated = computed(
  () => {
    if (orderWrapper.items.length > 0) {
      const filterList = orderWrapper.items.filter((elem) => elem.data.isPaid === false)
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
const paidSelectedOrderFromTable = async (order, newData) => {
  await paidOrder(order, newData)
  store.dispatch('getAllOrders', 'orders')
  isModalSuccessActive.value = false
  alert('La orden se marco como pagada de manera correcta')
}
const selectItem = (order) => {
  selectedItem.data = order
}
const routeDetails = () => {
  router.push(`/orderDetail/${selectedItem.data.id}`)
}
const selectOptionsPaymentTypes = [
  { id: 1, label: 'Efectivo' },
  { id: 2, label: 'RedCompra' },
  { id: 3, label: 'Transferencia' }
]
const forForm = reactive({
  paymentType: selectOptionsPaymentTypes[0],
  tip: 0
})
</script>

<template>
  <modal-box
    v-model="isModalSuccessActive"
    large-title="Confirm order"
    button="success"
    has-cancel
    @effect="paidSelectedOrderFromTable(selectedItem.data, forForm)"
  >
    <p>Marcar como <b>entregado</b></p>
    <p>Esta accion enviará la orden al historial de ordenes (donde no se podran realizar modificaciones posteriores)</p>
    <field label="Payment Type">
      <control
        v-model="forForm.paymentType"
        :options="selectOptionsPaymentTypes"
      />
    </field>
    <field
      label="Tip"
      :help="`Total order: ${selectedItem?.data.data?.totalPrice} - 10% suggested ${selectedItem?.data.data?.totalPrice * 0.10}`"
    >
      <vue-number-input
        v-model="forForm.tip"
        :min="0"
        :step="100"
        controls
      />
    </field>
  </modal-box>
  <table>
    <thead>
      <tr>
        <th>Client</th>
        <th>Total Price</th>
        <th>N° Products</th>
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
              @click="selectItem(order); routeDetails()"
            />
            <jb-button
              color="success"
              :icon="mdiCheck"
              small
              @click="isModalSuccessActive = true; selectItem(order)"
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
