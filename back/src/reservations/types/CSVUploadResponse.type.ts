interface CSVUploadResponse {
  errors: ErrorRows[];
}

interface ErrorRows {
  row: number;
  errorMessages: string | string[];
}
