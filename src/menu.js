import {
  mdiDesktopMac,
  mdiSquareEditOutline
  // mdiTable,
} from '@mdi/js'

export default [
  'General',
  [
    {
      to: '/dashboard',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    }
  ],
  [
    // {
    //   to: '/tables',
    //   label: 'Tables',
    //   icon: mdiTable,
    //   updateMark: true
    // },
    {
      to: '/forms',
      label: 'Add new order',
      icon: mdiSquareEditOutline
    }
  ]
]
