// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore/lite'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import store from '../store'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCoGbiWmOrGCXhI9VdHjX4Cn56XXd29fHQ',
  authDomain: 'churryswafflesapp.firebaseapp.com',
  projectId: 'churryswafflesapp',
  storageBucket: 'churryswafflesapp.appspot.com',
  messagingSenderId: '461397207207',
  appId: '1:461397207207:web:dd27cea8373c14eeec1382'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth()

// PRODUCTS

// Get product list
export async function getProducts () {
  const getProductsDB = collection(db, 'products')
  const productsSnapshot = await getDocs(getProductsDB)
  const productsListData = productsSnapshot.docs.map(doc => {
    const responseWithId = {
      id: doc.id,
      data: doc.data()
    }
    return responseWithId
  })
  console.log(productsListData)
  return productsListData
}

// Add new Product
export async function addNewProduct (newProduct) {
  await addDoc(collection(db, 'products'), { Name: newProduct.Name, Price: parseInt(newProduct.Price) })
}
// Delete Product
export async function deleteProduct (productId) {
  await deleteDoc(doc(db, 'products', productId))
}

// ORDERS

// Add new order
export async function addNewOrder (newOrder) {
  await addDoc(collection(db, 'orders'), newOrder)
}

// Get order list
export async function getUnpaidOrders () {
  const getOrdersDB = collection(db, 'orders')
  // const consult = query(getOrdersDB, where('isPaid', '==', false)) activar cuando sean muchas ordenes
  // const ordersSnapshot = await getDocs(consult, orderBy('date'))
  const ordersSnapshot = await getDocs(getOrdersDB, orderBy('date', 'desc')) // probar orden
  const ordersListData = ordersSnapshot.docs.map(doc => {
    const responseWithId = {
      id: doc.id,
      data: doc.data()
    }
    return responseWithId
  })
  console.log(ordersListData)
  return ordersListData
}
// delete order
export async function deleteOrder (orderId) {
  await deleteDoc(doc(db, 'orders', orderId))
}
// update order
export async function paidOrder (order, newData) {
  const orderRef = doc(db, 'orders', order.id)
  await updateDoc(orderRef, {
    isPaid: true,
    tip: newData.tip,
    paymentType: newData.paymentType
  })
}

// LOGIN

export async function login (email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      store.commit('user', {
        email: user.email
      })
    })
    .catch((error) => {
      console.error(error.code)
      console.error(error.message)
      return false
    })
}
export async function logOut () {
  store.commit('user', {
    email: null
  })
  await auth.signOut()
}

export async function islogin () {
  let isAuth = false
  await auth.onAuthStateChanged(user => {
    if (user) {
      isAuth = true
    } else {
      isAuth = false
    }
  })
  return isAuth
}
