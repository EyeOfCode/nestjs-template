import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import JoiUtil, { JoiConfig } from '../utils/joi';

dotenv.config({ path: '.env' });

export interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  CLIENT_HOST: string;
}

export default registerAs('app', async (): Promise<AppConfig> => {
  const configs: JoiConfig<AppConfig> = {
    NODE_ENV: {
      value: process.env.NODE_ENV,
      joi: Joi.string()
        .required()
        .valid('development', 'production', 'staging', 'docker')
        .default('development'),
    },
    PORT: {
      value: parseInt(process.env.PORT),
      joi: Joi.number().required(),
    },
    CLIENT_HOST: {
      value: process.env.CLIENT_HOST,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});
