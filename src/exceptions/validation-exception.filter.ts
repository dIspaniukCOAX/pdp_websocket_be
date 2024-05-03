import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const errorFormatter = (errors: ValidationError[]) => {
  const result = errors.map((error) => ({
    name: error.property,
    error: error.constraints[Object.keys(error.constraints)[0]],
  }));

  return new BadRequestException(result, 'Something went wrong');
};
