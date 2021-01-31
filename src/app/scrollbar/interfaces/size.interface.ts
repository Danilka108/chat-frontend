interface IScrollbarSize {
    width: number
    height: number
}

export interface IScrollbarElementSize extends IScrollbarSize {
    type: 'view' | 'viewWrapper'
}

export interface IScrollbarViewSize {
    view: IScrollbarSize
    viewWrapper: IScrollbarSize
}
