import { isString } from "lodash";
import { LocaleMessage } from "customDefinition";

export class ApiError extends Error {
  statusCode: number;
  language: string;

  constructor(
    statusCode: number,
    language: string,
    message: LocaleMessage | string
  ) {
    super(ApiError.getErrorMessage(language, message));
    this.statusCode = statusCode;
    this.language = language;
    this.message = ApiError.getErrorMessage(language, message);
  }

  private static getErrorMessage(
    lang: string,
    msg: LocaleMessage | string
  ): string {
    if (isString(msg)) {
      return msg;
    }
    return msg[lang as keyof LocaleMessage];
  }

  toJSON(): Record<string, unknown> {
    return {
      code: this.statusCode,
      language: this.language,
      message: this.message,
    };
  }
}
