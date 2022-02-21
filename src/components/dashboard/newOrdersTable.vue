<script setup>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'

defineProps({
  checkable: Boolean
})

const store = useStore()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const lightBgStyle = computed(() => store.state.lightBgStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.orders)
//const items = [ { "id": "Hx1V5MxbrYVdyoyEQkxk", "data": { "isPaid": false, "products": [ { "data": { "Price": 2500, "Quantity": 1, "Name": "Oreo glaseado" }, "id": "oLxmYqf45uPm08wmPOr4" } ], "totalPrice": 2500, "note": "Pedido de prueba", "paymentType": { "id": 1, "label": "Efectivo" }, "client": "Jaime", "totalQuantity": 1, "extraPrice": 0, "date": "20 feb 2022, 21:23", "extraQuantity": 0 } } ]

const orderWrapper = reactive({
  items
})

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const itemsPaginated = computed(
  () => {
    if (orderWrapper.items.length > 0) {
      return orderWrapper.items.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
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

</script>

<template>
  <modal-box
    v-model="isModalActive"
    title="Sample modal"
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    large-title="Please confirm"
    button="danger"
    has-cancel
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
      :class="lightBgStyle"
    >
      {{ checkedRow.name }}
    </span>
  </div>
  <!-- {{orderWrapper.items}} -->
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
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
        <checkbox-cell
          v-if="checkable"
          @checked="checked($event, order)"
        />
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
              @click="isModalActive = true"
            />
            <jb-button
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
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
