import * as Captcha from 'captchagen';

interface CaptchaDataType {
  data: string;
  text: string;
}

export const createCaptcha = async (): Promise<CaptchaDataType> => {
  const captcha = await Captcha.create({ height: 50, width: 100 });

  const text = await captcha.text();

  await captcha.generate();
  const data = await captcha.uri();

  return {
    data,
    text,
  };
};
