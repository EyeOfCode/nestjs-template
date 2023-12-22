import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import JoiUtil, { JoiConfig } from '../utils/joi';

dotenv.config({ path: '.env' });

export interface AuthConfig {
  // JWT_SECRET_WEB_KEY: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;
  JWT_EXPIRES_REMEMBER_IN: string;
  JWT_SALT_ROUND: number;
}

export default registerAs('auth', async (): Promise<AuthConfig> => {
  const configs: JoiConfig<AuthConfig> = {
    // JWT_SECRET_WEB_KEY: {
    //   value: process.env.JWT_SECRET_WEB_KEY,
    //   joi: Joi.string().required(),
    // },
    JWT_SECRET_KEY: {
      value: process.env.JWT_SECRET_KEY,
      joi: Joi.string().required(),
    },
    JWT_EXPIRES_IN: {
      value: process.env.JWT_EXPIRES_IN,
      joi: Joi.string().required().default('1d'),
    },
    JWT_EXPIRES_REMEMBER_IN: {
      value: process.env.JWT_EXPIRES_REMEMBER_IN,
      joi: Joi.string().required().default('3d'),
    },
    JWT_SALT_ROUND: {
      value: parseInt(process.env.JWT_SALT_ROUND),
      joi: Joi.number().default(8),
    },
  };

  return JoiUtil.validate(configs);
});
