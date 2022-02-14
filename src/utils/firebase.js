// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite'

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
  return productsListData
}

// Add new Product
export async function addNewProduct (newOrder) {
  await addDoc(collection(db, 'products'), { Name: newOrder.Name, Price: parseInt(newOrder.Price) })
}
// Delete Product
export async function deleteProduct (productId) {
  await deleteDoc(doc(db, 'products', productId))
}
