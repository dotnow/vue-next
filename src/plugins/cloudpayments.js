export const pay = ({
  amount,
  description,
  accountId,
  data = {},
  skin = 'classic'
}) =>
  new Promise((resolve, reject) => {
    /* eslint-disable no-undef */
    new cp.CloudPayments().pay(
      'charge',
      {
        publicId: 'test_api_00000000000000000000001',
        currency: 'RUB',
        skin,
        description,
        amount,
        accountId,
        data
      },
      {
        onSuccess: options => resolve(options),
        onFail: reason => reject(reason)
      }
    )
  })
