// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

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

export const db = getFirestore(app)

// Get product list
export async function getProducts (db) {
  const getProducts = collection(db, 'products')
  const productsSnapshot = await getDocs(getProducts)
  const productsList = productsSnapshot.docs.map(doc => doc.data())
  return productsList
}
