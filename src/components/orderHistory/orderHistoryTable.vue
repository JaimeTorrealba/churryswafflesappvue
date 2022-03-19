<script setup>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { mdiEye } from '@mdi/js'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'

// TODO: agregar print option

defineProps({
  checkable: Boolean
})

const store = useStore()

const router = useRouter()

const lightBorderStyle = computed(() => store.state.lightBorderStyle)

const tableTrStyle = computed(() => store.state.tableTrStyle)

const tableTrOddStyle = computed(() => store.state.tableTrOddStyle)

const darkMode = computed(() => store.state.darkMode)

const items = computed(() => store.state.orders)

const orderWrapper = reactive({
  items
})

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
const selectItem = (order) => {
  selectedItem.data = order
}
const routeDetails = () => {
  router.push(`/orderDetail/${selectedItem.data.id}`)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Client</th>
        <th>Total Price</th>
        <th>Tip</th>
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
        <td data-label="Total price">
          {{ order.data.tip || 0 }}
        </td>
        <td
          data-label="Total quantity"
        >
          {{ order.data.totalQuantity }}
        </td>
        <td data-label="Payment type">
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
              @click="selectItem(order); routeDetails()"
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
