<script setup>
import { ref, reactive } from 'vue'
import { mdiBallot, mdiBallotOutline, mdiAccount, mdiMail } from '@mdi/js'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import TitleSubBar from '@/components/TitleSubBar.vue'

const titleStack = ref(['Admin', 'Forms'])

const selectOptions = [
  { id: 1, label: 'Business development' },
  { id: 2, label: 'Marketing' },
  { id: 3, label: 'Sales' }
]

const form = reactive({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  department: selectOptions[0],
  subject: '',
  question: ''
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
      title="Create new order"
    />
    <card-component
      title="Forms"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="Grouped with icons">
        <control
          v-model="form.name"
          :icon="mdiAccount"
        />
        <control
          v-model="form.email"
          type="email"
          :icon="mdiMail"
        />
      </field>

      <field
        label="With help line"
        help="Do not enter the leading zero"
      >
        <control
          v-model="form.phone"
          type="tel"
          placeholder="Your phone number"
        />
      </field>

      <field label="Dropdown">
        <control
          v-model="form.department"
          :options="selectOptions"
        />
      </field>

      <divider />

      <field
        label="Question"
        help="Your question. Max 255 characters"
      >
        <control
          type="textarea"
          placeholder="Explain how we can help you"
        />
      </field>

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
