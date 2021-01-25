export interface ISelectFn<Store, Item> {
    (state: Store): Item
}
