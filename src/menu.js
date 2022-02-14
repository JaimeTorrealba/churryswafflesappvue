import {
  mdiDesktopMac,
  mdiSquareEditOutline,
  mdiArchivePlus
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
      to: '/newOrder',
      label: 'Add new order',
      icon: mdiSquareEditOutline
    },
    {
      to: '/products',
      label: 'Product Managment',
      icon: mdiArchivePlus
    }
  ]
]
