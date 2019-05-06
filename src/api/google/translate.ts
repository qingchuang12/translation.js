import {
  StringOrTranslateOptions,
  TranslateOptions,
  TranslateResult
} from '../types'
import { getRoot, requestGoogleAPI } from './state'
import detect from './detect'
import sign from './sign'

export default async function(options: StringOrTranslateOptions) {
  let { text, com = undefined, from = '', to = '' } =
    typeof options === 'string' ? { text: options } : options

  if (!from) {
    from = await detect(options)
  }
  if (!to) {
    to = from.startsWith('zh') ? 'en' : 'zh-CN'
  }

  const res = await requestGoogleAPI(
    {
      query: {
        client: 'webapp',
        sl: from,
        tl: to,
        hl: 'zh-CN',
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        otf: '2',
        ssel: '3',
        tsel: '0',
        kc: '6',
        tk: await sign(text, com),
        q: text
      }
    },
    '/translate_a/single',
    com
  )

  return transformRaw(res.data, {
    from,
    to,
    com: res.com,
    text
  })
}

function transformRaw(body: any[], queryObj: TranslateOptions) {
  const { text, com, to } = queryObj
  const googleFrom = body[2]

  const result: TranslateResult = {
    text,
    raw: body,
    from: googleFrom,
    to: to!,
    link: `${getRoot(
      com
    )}/#view=home&op=translate&sl=${googleFrom}&tl=${to}&text=${encodeURIComponent(
      text
    )}`,
    com
  }

  try {
    result.dict = body[1].map((arr: any[]) => {
      return arr[0] + '：' + arr[1].join('，')
    })
  } catch (e) {}

  try {
    result.result = body[0]
      .map((arr: string[]) => arr[0])
      .filter((x: string) => x)
      .map((x: string) => x.trim())
  } catch (e) {}

  return result
}
