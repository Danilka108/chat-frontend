export interface IAction<TypeT, payloadT> {
    type: TypeT
    payload: payloadT
}
