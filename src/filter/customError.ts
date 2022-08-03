type ValidValueType<T> = [T, undefined?]
type ErrorValueType = [undefined, Error]
export type ReturnValueType<T> = ValidValueType<T> | ErrorValueType
