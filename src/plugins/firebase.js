import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import store from '@/store'
import { useCart } from '@/use/cart'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig)

const dbService = firebase.database()
const authService = firebase.auth()
const storageService = firebase.storage()

const imagesRef = storageService.ref('images')

authService.languageCode = 'ru'

const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {},
  'expired-callback': () => {}
})

// Helper
// const toArray = snapshot => {
//   let arr = []
//   const data = snapshot.toJSON()

//   if (data) {
//     for (const [id, value] of Object.entries(data)) {
//       arr.push({ id, ...value })
//     }
//   }

//   return arr
// }

// Товары
const productsRef = dbService.ref('products')

productsRef.on('child_added', data => {
  store.commit('products/PRODUCT_ADD', { id: data.key, ...data.val() })
})

productsRef.on('child_changed', data => {
  store.commit('products/PRODUCT_UPDATE', { id: data.key, ...data.val() })
})

productsRef.on('child_removed', data =>
  store.commit('products/PRODUCT_REMOVE', data.key)
)

// Категории
const categoriesRef = dbService.ref('categories')

categoriesRef.on('child_added', data => {
  store.commit('categories/CATEGORY_ADD', { id: data.key, ...data.val() })
})

categoriesRef.on('child_changed', data => {
  store.commit('categories/CATEGORY_UPDATE', { id: data.key, ...data.val() })
})

categoriesRef.on('child_removed', data =>
  store.commit('categories/CATEGORY_REMOVE', data.key)
)

// Заказы
let ordersRef = dbService.ref('orders')

const attachOrders = (uid = null) => {
  ordersRef.on('child_added', data => {
    if (!uid || (uid && data.val().userID === uid)) {
      store.commit('orders/ORDER_ADD', { id: data.key, ...data.val() })
    }
  })

  ordersRef.on('child_changed', data => {
    store.commit('orders/ORDER_UPDATE', { id: data.key, ...data.val() })
  })

  ordersRef.on('child_removed', data =>
    store.commit('orders/ORDER_REMOVE', data.key)
  )
}

// Промокоды
const promocodesRef = dbService.ref('promocodes')

promocodesRef.on('child_added', data => {
  store.commit('promocodes/PROMOCODE_ADD', { id: data.key, ...data.val() })
})

promocodesRef.on('child_changed', data => {
  store.commit('promocodes/PROMOCODE_UPDATE', { id: data.key, ...data.val() })
})

promocodesRef.on('child_removed', data =>
  store.commit('promocodes/PROMOCODE_REMOVE', data.key)
)

// Корзина
let cartRef = null

const attachCart = uid => {
  cartRef = dbService.ref(`carts/${uid}`)

  cartRef.once('value').then(snapshot => {
    if (!snapshot.exists()) {
      useCart().transferCart()
    }
  })

  cartRef.on('child_added', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', data.val())
    } else {
      store.commit('cart/CART_SET_ITEM', { id: data.key, ...data.val() })
    }
  })

  cartRef.on('child_changed', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', data.val())
    } else {
      if (!data.val().amount) {
        data.ref.remove()
      } else {
        store.commit('cart/CART_SET_ITEM', { id: data.key, ...data.val() })
      }
    }
  })

  cartRef.on('child_removed', async data => {
    if (data.key === 'promocodes') {
      store.commit('cart/SET_PROMOCODES', [])
    } else {
      store.commit('cart/CART_REMOVE_ITEM', data.key)
    }
  })
}

const detachCart = () => {
  cartRef.off()
}

export {
  dbService,
  authService,
  storageService,
  appVerifier,
  productsRef,
  categoriesRef,
  ordersRef,
  imagesRef,
  promocodesRef,
  attachOrders,
  attachCart,
  detachCart,
  cartRef
}
