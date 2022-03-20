<script setup>
import { ref, reactive, computed } from 'vue'
import { modifyOrder } from '@/utils/firebase'
import useVuelidate from '@vuelidate/core'
import { numeric, minValue, required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import { DateTime } from 'luxon'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'

import { mdiBallot, mdiBallotOutline } from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import Field from '@/components/Field.vue'
import ProductField from '@/components/ProductField.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import TitleSubBar from '@/components/TitleSubBar.vue'

// TODO: agregar modales de error y limpiar los campos

const titleStack = ref(['Admin', 'Modify Order'])

const store = useStore()

const router = useRouter()

const originalProducts = computed(() => store.state.products)

const userEmail = computed(() => store.state.userEmail)

const items = computed(() => store.state.orders)

const products = cloneDeep(originalProducts)

const productWrapper = reactive({
  products
})

const orderWrapper = reactive({
  items
})
const selectedOrder = computed(() => {
  if (orderWrapper.items.length > 0) {
    const orderFiltered = orderWrapper.items.filter((elem) => elem.id === router.currentRoute.value.params.id)
    return orderFiltered[0]
  }
  return false
})

// eslint-disable-next-line no-unused-vars
const updateProducts = computed(() => {
  return productWrapper.products.map((elem) => {
    selectedOrder.value.data.products.map((match) => {
      if (match.data.Name === elem.data.Name) {
        elem.data.Quantity = match.data.Quantity
      }
      return true
    })
    return true
  })
})

const form = reactive({
  totalPrice: selectedOrder.value.data.totalPrice,
  totalQuantity: selectedOrder.value.data.totalQuantity,
  extraPrice: selectedOrder.value.data.extraPrice,
  extraQuantity: selectedOrder.value.data.extraQuantity,
  client: selectedOrder.value.data.client,
  note: selectedOrder.value.data.note,
  date: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
  isPaid: false
})

const rules = {
  extraPrice: { numeric },
  totalQuantity: { minValue: minValue(1) },
  client: { required }
}
const v$ = useVuelidate(rules, form)
const totalQuantity = computed(() => {
  if (productWrapper.products.length > 0) {
    const quantity = []
    productWrapper.products.map(elem => {
      if (!elem.data?.Quantity) {
        return quantity.push(0)
      } else {
        return quantity.push(elem.data.Quantity)
      }
    })
    const tQuantity = quantity.reduce((value, element) => value + element) + form.extraQuantity
    return tQuantity
  }
  return false
})

const totalPrice = computed(() => {
  if (productWrapper.products.length > 0) {
    const prices = []
    productWrapper.products.map(elem => {
      if (!elem.data?.Quantity) {
        return prices.push(0)
      } else {
        return prices.push(elem.data.Quantity * elem.data.Price)
      }
    })
    const tPrice = prices.reduce((value, element) => value + element) + (form.extraPrice * form.extraQuantity)
    return tPrice
  }

  return false
})

const submit = async () => {
  const finalProducts = []
  form.totalQuantity = totalQuantity.value
  form.totalPrice = totalPrice.value
  productWrapper.products.map(elem => {
    if (elem.data.Quantity) {
      finalProducts.push(elem)
    }
    return true
  })
  form.products = finalProducts
  form.user = userEmail.value
  if (v$.value.$invalid !== true) {
    await modifyOrder(router.currentRoute.value.params.id, form)
    alert('orden modificada correctamente')
    store.dispatch('getAllOrders', 'orders')
    router.push('/dashboard')
  } else {
    alert('error campos obligatorios faltantes')
  }
}
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Modify Order</hero-bar>
  <span class="hidden">{{ updateProducts }}</span>

  <main-section>
    <title-sub-bar
      :icon="mdiBallotOutline"
      title="Modify"
    />
    <card-component
      title="* Required"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <product-field
        label="Product"
        extra-label="Price"
      >
        Quantity
      </product-field>
      <div
        v-for="product in productWrapper.products"
        :key="product.data.Name"
      >
        <ProductField
          :label="product.data.Name"
          :extra-label="`${product.data.Price}$` "
        >
          <vue-number-input
            v-model="product.data.Quantity"
            :min="0"
            inline
            controls
          />
        </ProductField>
      </div>
      <field
        label="*Client name"
        help="Client name"
      >
        <control
          v-model="form.client"
          type="text"
        />
      </field>
      <div
        v-for="error of v$.client.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>
      <field
        label="Extra... Price and Quantity"
        help="You could add the description in the note section"
      >
        <control
          v-model="form.extraPrice"
          type="text"
        />
        <vue-number-input
          v-model="form.extraQuantity"
          :min="0"
          controls
        />
      </field>
      <div
        v-for="error of v$.extraPrice.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>

      <divider />

      <field
        label="Note"
        help="(Optional). Max 255 characters"
      >
        <control
          v-model="form.note"
          type="textarea"
          placeholder="Something special to add"
        />
      </field>

      <divider />

      <product-field
        label="Total"
      >
        {{ totalPrice }}$
      </product-field>
      <product-field
        label="Total quantity"
      >
        {{ totalQuantity }}
      </product-field>
      <div
        v-for="error of v$.totalQuantity.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>
      <divider />
      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Submit"
        />
      </jb-buttons>
    </card-component>
  </main-section>
</template>
