import { isString } from "lodash";
import { LocaleMessage } from "customDefinition";

export class ApiSuccess {
  statusCode: number;
	language: string;
	message: string;

	constructor(
		statusCode: number,
		language: string,
		message: LocaleMessage | string
	) {
    this.statusCode = statusCode;
    this.language = language;
    this.message = ApiSuccess.getSuccessMessage(language, message);
	}

	private static getSuccessMessage(
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
