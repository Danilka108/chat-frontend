export interface ISelectFn<StateType, ItemType> {
    (state: StateType): ItemType
}
