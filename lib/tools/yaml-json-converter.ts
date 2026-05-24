export interface ConverterError {
  message: string
}

export interface ConverterResult {
  output: string
  error: ConverterError | null
}
