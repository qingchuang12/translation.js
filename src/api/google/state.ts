import { RequestOptions } from '../../utils/make-request/types'
import request from '../../utils/make-request'

const cnURL = 'https://translate.google.cn'
const comURL = 'https://translate.google.com'

export function getRoot(com?: boolean) {
  return com ? comURL : cnURL
}

/**
 * 请求谷歌接口时，如果没有特别指定，则同时从 cn 和 com 获取数据
 */
export async function requestGoogleAPI(
  options: RequestOptions,
  path = '',
  com?: boolean
): Promise<{ com: boolean; data: any }> {
  if (com) {
    return {
      com,
      data: await request(comURL + path, options)
    }
  } else if (com === false) {
    return {
      com,
      data: await request(cnURL + path, options)
    }
  }
  return new Promise((resolve, reject) => {
    const pCN = request(cnURL + path, options)
    const pCOM = request(comURL + path, options)

    let fail = 0

    function onFail() {
      fail += 1
      if (fail === 2) {
        reject(new Error())
      }
    }

    pCN.then(res => {
      pCOM.abort()
      resolve({
        com: false,
        data: res
      })
    }, onFail)

    pCOM.then(res => {
      pCN.abort()
      resolve({
        com: true,
        data: res
      })
    }, onFail)
  })
}
