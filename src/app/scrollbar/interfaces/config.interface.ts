import { IScrollbarCssSizeValue, IScrollbarCssSizeValueInput } from './css-value.interface'

export interface IScrollbarCfg {
    initialPosition?: {
        veritcal?: 'top' | 'bottom'
        horizontal?: 'left' | 'right'
    }
    isScroll?: {
        veritcal?: boolean
        horizontal?: boolean
    }
    sensitivity?: {
        mouse?: number
        touch?: number
    }
    trackThickness?: {
        vertical?: IScrollbarCssSizeValueInput
        horizontal?: IScrollbarCssSizeValueInput
    }
}

export interface IScrollbarConfig {
    initialPosition: {
        veritcal: 'top' | 'bottom'
        horizontal: 'left' | 'right'
    }
    isScroll: {
        veritcal: boolean
        horizontal: boolean
    }
    sensitivity: {
        mouse: number
        touch: number
    }
    trackThickness: {
        vertical: IScrollbarCssSizeValue
        horizontal: IScrollbarCssSizeValue
    }
}
