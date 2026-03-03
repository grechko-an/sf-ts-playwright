import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  public static generateEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  public static generateLongEmail(): string {
    const local = faker.string.alpha({ length: 64 });
    const domain = faker.string.alpha({ length: 252 }) + '.com';
    return `${local}@${domain}`;
  }

  public static generatePassword(
    minLength: number = 8,
    maxLength: number = 20
  ): string {
    const length = faker.number.int({ min: minLength, max: maxLength });
    const lowercase = faker.string.alpha({ length: 1, casing: 'lower' });
    const uppercase = faker.string.alpha({ length: 1, casing: 'upper' });
    const digit = faker.string.numeric(1);
    const specialChars = '!@#$%^&*()-_=+[]{};:,.<>?';
    const special =
      specialChars[faker.number.int({ min: 0, max: specialChars.length - 1 })];
    const remainingLength = length - 4;
    const remaining = faker.string.alphanumeric(remainingLength);

    return [lowercase, uppercase, digit, special, ...remaining]
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  public static generateUsername(length?: number): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersAndDigits =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

    const finalLength = length ?? Math.floor(Math.random() * (16 - 4 + 1)) + 4;

    let username = letters.charAt(Math.floor(Math.random() * letters.length));

    for (let i = 1; i < finalLength; i++) {
      username += lettersAndDigits.charAt(
        Math.floor(Math.random() * lettersAndDigits.length)
      );
    }

    return username;
  }
}
