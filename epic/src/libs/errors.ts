export class ErrorWithStatusCode extends Error {
  statusCode: number
  constructor(msg: string, statusCode = 500) {
    super(msg)
    this.statusCode = statusCode
    this.name = 'ErrorWithStatusCode'
  }
}
