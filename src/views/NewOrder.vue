<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getProducts, addNeworder } from '@/utils/firebase'
import useVuelidate from '@vuelidate/core'
import { numeric, minValue } from '@vuelidate/validators'

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

// TODO: add create order firebase
// TODO: teste flow
// TODO: start login process
const titleStack = ref(['Admin', 'New order'])
const products = ref([])

onMounted(async () => {
  console.log('before')
  getProductsList()
  console.log('after')
})
console.log('dsds', products.value)
const getProductsList = async () => {
  console.log('before list')
  products.value = await getProducts()
  console.log('after list')
}
const productWrapper = reactive({
  products
})
const selectOptionsPaymentTypes = [
  { id: 1, label: 'Efectivo' },
  { id: 2, label: 'RedCompra' },
  { id: 3, label: 'Transferencia' }
]

const form = reactive({
  paymentType: selectOptionsPaymentTypes[0],
  totalPrice: 0,
  totalQuantity: 0,
  extraPrice: 0,
  extraQuantity: 0,
  note: '',
  date: new Date(),
  isPaid: false
})

const rules = {
  extraPrice: { numeric },
  totalQuantity: { minValue: minValue(1) }
}
const v$ = useVuelidate(rules, form)
const totalQuantity = computed(() => {
  if (productWrapper.products.length > 1) {
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
  if (productWrapper.products.length > 1) {
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
  if (v$.value.$invalid !== true) {
    await addNeworder(form)
  } else {
    alert('error')
  }
}
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>New order</hero-bar>

  <main-section>
    <title-sub-bar
      :icon="mdiBallotOutline"
      title="Create"
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
            center
            inline
            :inputtable="false"
            controls
          />
        </ProductField>
      </div>
      <field
        label="Extra..."
        help="Price and quantity"
      >
        <control
          v-model="form.extraPrice"
          type="text"
        />
        <vue-number-input
          v-model="form.extraQuantity"
          :min="0"
          center
          :inputtable="false"
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
      <field label="Payment Type">
        <control
          v-model="form.paymentType"
          :options="selectOptionsPaymentTypes"
        />
      </field>

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
