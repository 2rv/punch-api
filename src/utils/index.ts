import generateHash from 'random-hash';
import * as pThrottle from 'p-throttle';

const PasswordPrefix = '@123TestPass';
const LoginPrefix = 'user';

export const LocalError = error => ({ localErrorId: error });

export const Translate = message => message;

export const GenerateRandomLogin = () =>
  `${LoginPrefix}${generateHash({ length: 5 })}`;

export const GenerateRandomPassword = () =>
  `${PasswordPrefix}${generateHash({ length: 10 })}`;

export const ValidateLimit = num => {
  if (!num) {
    return null;
  }

  if (num <= 0) {
    return null;
  }

  return num;
};

export const ValidateOffset = num => {
  if (!num) {
    return null;
  }

  if (num <= 0) {
    return null;
  }

  return num;
};

export const isStringNumber = str => {
  const strNum = String(Number(str));

  return str.length === strNum.length;
};

export const Throttle = (fn, limit, rate) => pThrottle(fn, limit, rate);
