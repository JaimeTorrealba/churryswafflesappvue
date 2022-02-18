<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getProducts } from '@/utils/firebase'

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

// TODO: add form validation
// TODO: add create order firebase
// TODO: teste flow
// TODO: start login process

const titleStack = ref(['Admin', 'New order'])
// const products = ref([])
onMounted(async () => {
  // getProductsList()
})
const products = [{ id: 'HTZtgMai987xYgqJDjIK', data: { Price: 2500, Name: 'Jamón' } }, { id: 'Vj9AIkYF8tb2ufKk7dsr', data: { Price: 2500, Name: 'Frutilla Banana' } }, { id: 'oLxmYqf45uPm08wmPOr4', data: { Price: 2500, Name: 'Oreo glaseado' } }, { id: 'pSvZvbOOUheQoJ3nHJ0n', data: { Price: 2500, Name: 'Vegetariano' } }]

const getProductsList = async () => {
  products.value = await getProducts()
}

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
  products
})
const totalQuantity = computed(() => {
  const quantity = []
  form.products.map(elem => {
    if (!elem.data.Quantity) {
      return quantity.push(0)
    } else {
      return quantity.push(elem.data.Quantity)
    }
  })
  const tQuantity = quantity.reduce((value, element) => value + element) + form.extraQuantity
  return tQuantity
})

const totalPrice = computed(() => {
  const prices = []
  form.products.map(elem => {
    if (!elem.data.Quantity) {
      return prices.push(0)
    } else {
      return prices.push(elem.data.Quantity * elem.data.Price)
    }
  })
  const tPrice = prices.reduce((value, element) => value + element) + (form.extraPrice * form.extraQuantity)
  return tPrice
})

const submit = () => {
  form.totalQuantity = totalQuantity.value
  form.totalPrice = totalPrice.value
  console.log(form)
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
        v-for="product in form.products"
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
