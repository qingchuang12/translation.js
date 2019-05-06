/**
 * 返回 Promise 数组中第一个成功 resolve 的值；
 * 如果所有 Promise 都 reject 了，则返回一个包含每次 reject 理由的数组。
 * @param promises - Promise 数组
 * @return
 */

/**
 *
 * @param promises
 */
export default function<T>(
  promises: Promise<T>[]
): Promise<{ index: number; val: T }> {
  return new Promise((resolve, reject) => {
    const len = promises.length
    let errLen = 0
    const errors: any[] = []
    const onResolve = (val: T, index: number) => {
      resolve({
        index,
        val
      })
    }

    const onReject = (err: any, index: number) => {
      errors[index] = err
      errLen += 1
      if (errLen === len) {
        reject(errors)
      }
    }

    promises.forEach((promise, index) => {
      promise.then(val => onResolve(val, index), err => onReject(err, index))
    })
  })
}
