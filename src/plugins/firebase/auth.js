import firebase from './init'
import 'firebase/auth'

const authService = firebase.auth()
authService.languageCode = 'ru'

const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {},
  'expired-callback': () => {}
})

export { authService, appVerifier }
