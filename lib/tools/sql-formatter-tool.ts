export interface SQLFormatterError {
  message: string
}

export interface SQLFormatterResult {
  output: string
  error: SQLFormatterError | null
}

export type SQLDialect =
  | 'sql'
  | 'mysql'
  | 'postgresql'
  | 'sqlite'
  | 'tsql'
  | 'bigquery'

export const SQL_DIALECTS: { value: SQLDialect; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'T-SQL (SQL Server)' },
  { value: 'bigquery', label: 'BigQuery' },
]
