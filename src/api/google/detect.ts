import { StringOrTranslateOptions } from '../types'
import { requestGoogleAPI } from './state'
import sign from './sign'

import getError, { ERROR_CODE } from '../../utils/error'

export default async function(options: StringOrTranslateOptions) {
  const { text, com = undefined } =
    typeof options === 'string' ? { text: options } : options

  const result = (await requestGoogleAPI(
    {
      query: {
        client: 'webapp',
        sl: 'auto',
        tl: 'zh-CN',
        hl: 'zh-CN',
        ssel: '3',
        tsel: '0',
        kc: '0',
        tk: await sign(text, com),
        q: text
      }
    },
    '/translate_a/single',
    com
  )).data

  const src = result && result[2]
  if (src) return src
  throw getError(ERROR_CODE.UNSUPPORTED_LANG)
}
