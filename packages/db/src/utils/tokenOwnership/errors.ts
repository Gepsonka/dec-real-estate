import { ErrorWithContext } from "../types.ts";

export class UserInsufficientTokens extends ErrorWithContext {}
export class UserDoesNotHaveTokens extends ErrorWithContext {}
export class UserNotExists extends ErrorWithContext {}
