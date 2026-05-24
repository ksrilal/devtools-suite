export interface ConverterError { message: string }
export interface ConvertResult { output: string; error: ConverterError | null }

export async function csvToJSON(csv: string, pretty = true): Promise<ConvertResult> {
  try {
    const Papa = (await import('papaparse')).default
    const result = Papa.parse<Record<string, string>>(csv.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    })
    if (result.errors.length > 0 && result.data.length === 0) {
      return { output: '', error: { message: result.errors[0]?.message ?? 'Parse error' } }
    }
    const json = pretty
      ? JSON.stringify(result.data, null, 2)
      : JSON.stringify(result.data)
    return { output: json, error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}

export async function jsonToCSV(json: string): Promise<ConvertResult> {
  try {
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) {
      return { output: '', error: { message: 'JSON must be an array of objects to convert to CSV.' } }
    }
    const Papa = (await import('papaparse')).default
    const csv = Papa.unparse(parsed as object[])
    return { output: csv, error: null }
  } catch (e) {
    return { output: '', error: { message: e instanceof Error ? e.message : String(e) } }
  }
}
