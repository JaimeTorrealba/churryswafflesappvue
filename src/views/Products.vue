<script setup>
import { ref, reactive, computed } from 'vue'
import { addNewProduct, deleteProduct } from '@/utils/firebase'
import useVuelidate from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'
import { useStore } from 'vuex'

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

const titleStack = ref(['Admin', 'Products'])
const store = useStore()

const products = computed(() => store.state.products)

const submit = async () => {
  if (v$.value.$invalid !== true) {
    await addNewProduct(form)
    store.dispatch('getAllProducts', 'products') // Eliminar llamada en un futuro
    alert('Producto ingresado correctamente')
  } else {
    alert('Error')
  }
}
const deleteSelectedProduct = async (productID) => {
  await deleteProduct(productID)
  store.dispatch('getAllProducts', 'products') // Eliminar llamada en un futuro
}
const form = reactive({
  Name: null,
  Price: null
})
const rules = {
  Name: { required },
  Price: { required, numeric }
}
const v$ = useVuelidate(rules, form)
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <hero-bar>Products</hero-bar>

  <main-section>
    <title-sub-bar
      :icon="mdiBallotOutline"
      title="Products Managment"
    />
    <card-component
      title="Create new product form"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field
        label="New Product..."
        help="Product's Name"
      >
        <control
          v-model="form.Name"
          type="text"
        />
      </field>
      <div
        v-for="error of v$.Name.$silentErrors"
        :key="error.$uid"
        class="input-errors"
      >
        <div class="error-msg">
          {{ error.$message }}
        </div>
      </div>
      <field
        label="Price"
        help="Price"
      >
        <control
          v-model="form.Price"
          type="text"
        />
      </field>
      <div
        v-for="error of v$.Price.$silentErrors"
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
          label="Add new product"
        />
      </jb-buttons>
    </card-component>
    <divider />
    <card-component
      title="Delete products"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <div
        v-for="product in products"
        :key="product.data.Name"
      >
        <ProductField
          :label="product.data.Name"
          :extra-label="`${product.data.Price}$` "
        >
          <jb-button
            type="button"
            color="danger"
            label="Delete Product"
            @click="deleteSelectedProduct(product.id)"
          />
        </ProductField>
      </div>
    </card-component>
  </main-section>
</template>
