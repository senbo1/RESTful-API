import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Not a valid email'
    ),
    name: string({ required_error: 'Name is required' }),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password must be 6 characters long'
    ),
    passwordConfirmation: string({
      required_error: 'password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
