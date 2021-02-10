import { ref } from 'vue'
import { productsRef, imagesRef } from '@/plugins/firebase'

export const useProducts = () => {
  const error = ref(null)
  const progress = ref(null)

  const uploadFile = async file => {
    error.value = null

    try {
      const uploadTask = imagesRef.child(file.name).put(file)

      uploadTask.on(
        'state_changed',
        snapshot => {
          progress.value =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Загружено ${progress.value}%`)

        switch (snapshot.state) {
          case 'paused':
            console.log('Загрузка приостановлена')
            break
          case 'running':
            console.log('Загрузка запущена')
            break
        }
      },
      error => {
        switch (error.code) {
          case 'storage/object-not-found':
            // По желаемой ссылке нет объекта.
            break
          case 'storage/bucket-not-found':
            // Для облачного хранилища не настроен сегмент.
            break
          case 'storage/project-not-found':
            // Для облачного хранилища не настроен ни один проект.
            break
          case 'storage/quota-exceeded':
            // Квота в вашем сегменте Cloud Storage превышена.
            break
          case 'storage/unauthenticated':
            // Пользователь не аутентифицирован, пожалуйста, авторизуйтесь и попробуйте еще раз.
            break
          case 'storage/unauthorized':
            // Пользователь не авторизован для выполнения желаемого действия, проверьте свои правила безопасности, чтобы убедиться, что они верны.
            break
          case 'storage/retry-limit-exceeded':
            // Максимальный временной лимит на операцию (загрузка, загрузка, удаление и т. Д.) Был превышен. Попробуйте загрузить еще раз.
            break
          case 'storage/invalid-checksum':
            // Файл на клиенте не соответствует контрольной сумме файла, полученного сервером. Попробуйте загрузить еще раз.
            break
          case 'storage/canceled':
            // Пользователь отменил операцию.
            break
          case 'storage/invalid-event-name':
            // Указано недопустимое название события. Должен быть одним из [ `running` , `progress` , `pause` ]
            break
          case 'storage/invalid-url':
            // Для refFromURL() предоставлен refFromURL() URL. Должен иметь вид: gs: // bucket / object или https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token= <TOKEN>.
            break
          case 'storage/invalid-argument':
            // Аргумент, передаваемый функции put() должен быть `File`,` Blob` или `UInt8` Array. Аргумент, передаваемый в putString() должен быть необработанной строкой, `Base64` или` Base64URL`.
            break
          case 'storage/no-default-bucket':
            // В свойстве storageBucket вашей конфигурации не storageBucket .
            break
          case 'storage/cannot-slice-blob':
            // Обычно происходит при изменении локального файла (удалении, повторном сохранении и т. Д.). Повторите попытку загрузки, убедившись, что файл не изменился.
            break
          case 'storage/server-file-wrong-size':
            // Файл на клиенте не соответствует размеру файла, полученного сервером. Попробуйте загрузить еще раз.
            break
          case 'storage/unknown':
            // Произошла неизвестная ошибка.
            break
        }
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
        console.log(downloadURL)
      }
    );

      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const addProduct = async product => {
    error.value = null

    try {
      await productsRef.push().set(product)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const updateProduct = async product => {
    error.value = null

    try {
      await productsRef.child(product.id).set(product)
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  const removeProduct = async productID => {
    error.value = null

    try {
      await productsRef.child(productID).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    uploadFile,
    addProduct,
    updateProduct,
    removeProduct,
    error
  }
}
