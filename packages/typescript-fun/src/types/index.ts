/**
 * Useful branded and domain types with run-time validations.
 *
 * Domain types consist of branded typed or other domain types.
 * Use domain types to describe the application domain.
 *
 * Branded types are helpers to build domain types. They have a type suffix,
 * for example `NonEmptyString`. Do not use them directly in the application
 * because they could not be safe. For example, `NonEmptyString` has no max length.
 */
import * as t from 'io-ts';
// ES6 version does not work.
// https://github.com/validatorjs/validator.js/issues/1208
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

// Branded types.
// We do not export branded types. They shall be created only via the `decode`
// method to ensure correctness.

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol;
}
export const NonEmptyString = t.brand(
  t.string,
  (s): s is t.Branded<string, NonEmptyStringBrand> => s.length > 0,
  'NonEmptyString',
);

interface TrimmedStringBrand {
  readonly TrimmedString: unique symbol;
}
export const TrimmedString = t.brand(
  t.string,
  (s): s is t.Branded<string, TrimmedStringBrand> =>
    s.trim().length === s.length,
  'TrimmedString',
);

export const NonEmptyTrimmedString = t.intersection([
  // The order matters. UI can show the first error only.
  NonEmptyString,
  TrimmedString,
]);

interface Max64StringBrand {
  readonly Max64String: unique symbol;
}
export const Max64String = t.brand(
  t.string,
  (s): s is t.Branded<string, Max64StringBrand> => s.length <= 64,
  'Max64String',
);

interface Max512StringBrand {
  readonly Max512String: unique symbol;
}
export const Max512String = t.brand(
  t.string,
  (s): s is t.Branded<string, Max512StringBrand> => s.length <= 512,
  'Max512String',
);

interface Min6StringBrand {
  readonly Min6String: unique symbol;
}
export const Min6String = t.brand(
  t.string,
  (s): s is t.Branded<string, Min6StringBrand> => s.length >= 6,
  'Min6String',
);

interface EmailStringBrand {
  readonly EmailString: unique symbol;
}
export const EmailString = t.brand(
  t.string,
  (s): s is t.Branded<string, EmailStringBrand> => isEmail(s),
  'EmailString',
);

interface PhoneStringBrand {
  readonly PhoneString: unique symbol;
}
export const PhoneString = t.brand(
  t.string,
  (s): s is t.Branded<string, PhoneStringBrand> => isMobilePhone(s),
  'PhoneString',
);

// Domain types.

/**
 * Non empty trimmed string with max length 64.
 */
export const String64 = t.intersection([NonEmptyTrimmedString, Max64String]);
export type String64 = t.TypeOf<typeof String64>;

/**
 * Non empty trimmed string with max length 512.
 */
export const String512 = t.intersection([NonEmptyTrimmedString, Max512String]);
export type String512 = t.TypeOf<typeof String512>;

/**
 * Non empty trimmed email string with max length 64 validated by validator.js.
 */
export const Email = t.intersection([String64, EmailString]);
export type Email = t.TypeOf<typeof Email>;

interface ExistingEmailBrand {
  readonly ExistingEmail: unique symbol;
}
/**
 * Existing Email. It's validated as Email, but the decision what is Email and what is
 * ExistingEmail is up to the application itself.
 *
 * @example
 * // we can assign ExistingEmail to Email
 * const a = '' as ExistingEmail
 * const b: Email = a
 * // we can not assign Email to ExistingEmail
 * const a = '' as Email
 * const b: ExistingEmail // error
 */
export const ExistingEmail = t.brand(
  Email,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (s): s is t.Branded<Email, ExistingEmailBrand> => true,
  'ExistingEmail',
);
export type ExistingEmail = t.TypeOf<typeof ExistingEmail>;

/**
 * Non empty trimmed string with max length 512 and min length 6.
 */
export const Password = t.intersection([String512, Min6String]);
export type Password = t.TypeOf<typeof Password>;

interface WrongPasswordBrand {
  readonly WrongPassword: unique symbol;
}
/**
 * Wrong Email. The same pattern as with Email and ExistingEmail.
 */
export const WrongPassword = t.brand(
  Password,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (s): s is t.Branded<Password, WrongPasswordBrand> => true,
  'WrongPassword',
);
export type WrongPassword = t.TypeOf<typeof WrongPassword>;

/**
 * Non empty trimmed phone string validated by validator.js.
 */
export const Phone = t.intersection([NonEmptyTrimmedString, PhoneString]);
export type Phone = t.TypeOf<typeof Phone>;