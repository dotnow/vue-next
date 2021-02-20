import firebase from '../init'
import 'firebase/database'

const dbService = firebase.database()
const transfrom = data => ({ id: data.key, ...data.val() })

export { dbService, transfrom }
