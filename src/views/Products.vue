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
      <jb-buttons>
        <jb-button
          type="submit"
          color="info"
          label="Add new product"
        />
      </jb-buttons>
    </card-component>
  </main-section>
</template>
