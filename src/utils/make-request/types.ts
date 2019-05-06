import { ParsedUrlQueryInput, ParsedUrlQuery } from 'querystring'
import { StringObject } from '../../types'

export interface RequestOptions {
  query?: ParsedUrlQuery
  method?: 'get' | 'post'
  body?: ParsedUrlQueryInput
  type?: 'form' | 'json'
  headers?: StringObject
  responseType?: 'document' | 'json' | 'text'
}
