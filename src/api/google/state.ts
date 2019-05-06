import { RequestOptions } from '../../utils/make-request/types'
import request from '../../utils/make-request'
import oneOf from '../../utils/promise.oneof'

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

  // TODO: 成功得到第一个响应之后，将另一个请求 abort 掉
  const res = await oneOf([
    request(cnURL + path, options),
    request(comURL + path, options)
    // 为了保证跟其他部分的抛错格式一致，这里只抛出请求 CN 出现的 error
  ]).catch(errors => Promise.reject(errors[0]))

  return {
    com: res.index === 1,
    data: res.val
  }
}
