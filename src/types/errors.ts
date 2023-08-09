export class RequestError extends Error {
  status: number
  info: any

  constructor (message: string, info: any, status: number) {
    super(message)
    this.info = info
    this.status = status
  }
}
