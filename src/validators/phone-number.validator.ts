import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import parsePhoneNumberFromString from 'libphonenumber-js';

@ValidatorConstraint({ async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
  validate(phoneNumber: string) {
    if (typeof phoneNumber !== 'string') return false;

    return !!parsePhoneNumberFromString(phoneNumber)?.isValid();
  }

  defaultMessage() {
    return 'Invalid phone number';
  }
}
