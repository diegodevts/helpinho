export interface GenericUseCase<T> {
  handle(...[data]: T | any): Promise<T | void>
}
