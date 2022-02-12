<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getProducts, db } from '@/utils/firebase'

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

const titleStack = ref(['Admin', 'New order'])
// const products = ref([])
// onMounted(async () => {
//   products.value = await getProducts(db)
// })

const products = [{ Price: 2500, Name: 'Jamón' }, { Price: 2500, Name: 'Tocino' }, { Price: 2500, Name: 'Frutilla banana' }, { Name: 'Oreo glaseado', Price: 2500 }]

const selectOptions = [
  { id: 1, label: 'Efectivo' },
  { id: 2, label: 'RedCompra' },
  { id: 3, label: 'Transferencia' }
]

const form = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  department: selectOptions[0],
  subject: '',
  question: '',
  total: 0,
  totalQuantity: 0
})

const submit = () => {
  //
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
        v-for="product in products"
        :key="product.Name"
      >
        <ProductField
          :label="product.Name"
          :extra-label="`${product.Price}$` "
        >
          <vue-number-input
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
        help="Name and Price"
      >
        <control
          type="text"
        />
        <vue-number-input
          :min="0"
          center
          :inputtable="false"
          controls
        />
      </field>
      <field label="Payment Type">
        <control
          v-model="form.department"
          :options="selectOptions"
        />
      </field>

      <divider />

      <field
        label="Note"
        help="(Optional). Max 255 characters"
      >
        <control
          type="textarea"
          placeholder="Something special to add"
        />
      </field>

      <divider />

      <product-field
        label="Total"
      >
        {{ form.total }}$
      </product-field>
      <product-field
        label="Total quantity"
      >
        {{ form.totalQuantity }}
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
