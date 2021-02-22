import { IParserFn } from './parser-fn.interface'
import { ISelectorFn } from './selector-fn.interface'

export const STORE_I_SELECT_DISCRIMINATOR = 'STORE_I_SELECT_DISCRIMINATOR'
export interface ISelect<StateType, KeyType, ReturnType = KeyType> {
    selectorFn: (state: StateType) => KeyType
    parserFn?: (value: KeyType) => ReturnType
}

export const STORE_I_SELECT_AND_PARSE_DISCRIMINATOR = 'STORE_I_SELECT_AND_PARSE_DISCRIMINATOR'
export interface ISelectAndParse<StateType, KeyType, ReturnType> {
    selectorFn: (state: StateType) => KeyType
    parserFn: (value: KeyType) => ReturnType
}
