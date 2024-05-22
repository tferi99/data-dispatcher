export enum CustomHttpStatus {
  ApplicationError = 520,
  TestError = 521,
}

export enum ServerError {
  Unknown = 'UNKNOWN',
  ConfigException = 'CONFIG_EXCEPTION',
}


export interface ResponseErrorPayload {
  statusCode: number;
  errorCode: ServerError;
  timestamp: string;
  path: string;
  message: string;
}
