import firebase from './init'
import 'firebase/storage'

const storageService = firebase.storage()

const imagesRef = storageService.ref('images')

export { storageService, imagesRef }
