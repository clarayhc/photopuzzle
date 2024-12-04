export default class R<T> {
  code: number
  message: string
  data?: T

  constructor(code: number, message: string, data?: T) {
    this.code = code
    this.message = message
    this.data = data
  }

  static ok<T>(data: T) {
    return new this(200, 'ok', data)
  }

  static error(message: string = 'wrong request') {
    return new this(500, message)
  }
}
