import { IParserFn } from './parser-fn.interface'
import { ISelectorFn } from './selector-fn.interface'

export const STORE_I_SELECT_DISCRIMINATOR = 'STORE_I_SELECT_DISCRIMINATOR'
export interface ISelect<StateType, KeyType> {
    discriminator: typeof STORE_I_SELECT_DISCRIMINATOR
    selectorFn: ISelectorFn<StateType, KeyType>
}

export const STORE_I_SELECT_AND_PARSE_DISCRIMINATOR = 'STORE_I_SELECT_AND_PARSE_DISCRIMINATOR'
export interface ISelectAndParse<StateType, KeyType, ReturnType> {
    discriminator: typeof STORE_I_SELECT_AND_PARSE_DISCRIMINATOR
    selectorFn: ISelectorFn<StateType, KeyType>
    parserFn: IParserFn<KeyType, ReturnType>
}
