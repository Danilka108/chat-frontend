export interface ISelectorFn<StateType, KeyType> {
    (state: StateType): KeyType
}
