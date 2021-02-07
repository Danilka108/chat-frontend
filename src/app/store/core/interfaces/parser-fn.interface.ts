export interface IParserFn<InputType, OutputType> {
    (value: InputType): OutputType
}
