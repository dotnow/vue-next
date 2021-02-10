import { ref } from 'vue'
import { productsRef, imagesRef } from '@/plugins/firebase'

export const useProducts = () => {
  const error = ref(null)
  const progress = ref(null)
  const imgUrl = ref(null)
  const imgFileName = ref(null)

  // Загрузка файла на сервер
  const uploadFile = async file => {
    error.value = null
    imgFileName.value = null
    progress.value = null

    try {
      imgFileName.value = Date.now() + '.' + file.name.split('.').pop()
      const uploadTask = imagesRef.child(imgFileName.value).put(file)

      await uploadTask.on(
        'state_changed',
        snapshot => {
          progress.value =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Загружено ${progress.value}%`)

          switch (snapshot.state) {
            // case 'paused':
            //   console.log('Загрузка приостановлена')
            //   break
            case 'running':
              console.log('Загрузка запущена')
              break
          }
        },
        err => {
          switch (err.code) {
            case 'storage/object-not-found':
              error.value = 'По желаемой ссылке нет объекта.'
              break
            case 'storage/bucket-not-found':
              error.value = 'Для облачного хранилища не настроен сегмент.'
              break
            case 'storage/project-not-found':
              error.value =
                'Для облачного хранилища не настроен ни один проект.'
              break
            case 'storage/quota-exceeded':
              error.value = 'Квота в вашем сегменте Cloud Storage превышена.'
              break
            case 'storage/unauthenticated':
              error.value =
                'Пользователь не аутентифицирован, пожалуйста, авторизуйтесь и попробуйте еще раз.'
              break
            case 'storage/unauthorized':
              error.value =
                'Пользователь не авторизован для выполнения желаемого действия, проверьте свои правила безопасности, чтобы убедиться, что они верны.'
              break
            case 'storage/retry-limit-exceeded':
              error.value =
                'Максимальный временной лимит на операцию (загрузка, загрузка, удаление и т. Д.) Был превышен. Попробуйте загрузить еще раз.'
              break
            case 'storage/invalid-checksum':
              error.value =
                'Файл на клиенте не соответствует контрольной сумме файла, полученного сервером. Попробуйте загрузить еще раз.'
              break
            case 'storage/canceled':
              error.value = 'Пользователь отменил операцию.'
              break
            case 'storage/invalid-event-name':
              error.value =
                'Указано недопустимое название события. Должен быть одним из [ `running` , `progress` , `pause` ]'
              break
            case 'storage/invalid-url':
              error.value =
                'Для refFromURL() предоставлен refFromURL() URL. Должен иметь вид: gs: // bucket / object или https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token= <TOKEN>.'
              break
            case 'storage/invalid-argument':
              error.value =
                'Аргумент, передаваемый функции put() должен быть `File`,` Blob` или `UInt8` Array. Аргумент, передаваемый в putString() должен быть необработанной строкой, `Base64` или` Base64URL`.'
              break
            case 'storage/no-default-bucket':
              error.value =
                'В свойстве storageBucket вашей конфигурации не storageBucket .'
              break
            case 'storage/cannot-slice-blob':
              error.value =
                'Обычно происходит при изменении локального файла (удалении, повторном сохранении и т. Д.). Повторите попытку загрузки, убедившись, что файл не изменился.'
              break
            case 'storage/server-file-wrong-size':
              error.value =
                'Файл на клиенте не соответствует размеру файла, полученного сервером. Попробуйте загрузить еще раз.'
              break
            case 'storage/unknown':
              error.value = 'Произошла неизвестная ошибка.'
              break
          }
        },
        async () => {
          imgUrl.value = await uploadTask.snapshot.ref.getDownloadURL()
          progress.value = false
        }
      )
    } catch (err) {
      console.log(err.message)
      error.value = err.message
      progress.value = false
    }
  }

  // Удаление файла по названию файла на сервере
  const removeFile = async fileName => {
    error.value = null
    try {
      await imagesRef.child(fileName).delete()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  // Создание нового товара
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

  // Обновление товара
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

  // Удаление товара
  const removeProduct = async product => {
    error.value = null

    try {
      if (product.imgFileName) {
        await removeFile(product.imgFileName)
      }

      await productsRef.child(product.id).remove()
      error.value = null
    } catch (err) {
      console.log(err.message)
      error.value = err.message
    }
  }

  return {
    uploadFile,
    removeFile,
    imgFileName,
    imgUrl,
    progress,
    addProduct,
    updateProduct,
    removeProduct,
    error
  }
}
