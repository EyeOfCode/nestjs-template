import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import JoiUtil, { JoiConfig } from '../utils/joi';

dotenv.config({ path: '.env' });

export interface AppConfig {
  DB_TYPE: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
}

export default registerAs('db', async (): Promise<AppConfig> => {
  const configs: JoiConfig<AppConfig> = {
    DB_TYPE: {
      value: process.env.DB_TYPE,
      joi: Joi.string()
        .required()
        .valid('postgres', 'mysql')
        .default('postgres'),
    },
    DB_PORT: {
      value: parseInt(process.env.DB_PORT),
      joi: Joi.number().required().default(5432),
    },
    DB_HOST: {
      value: process.env.DB_HOST,
      joi: Joi.string().required().default('localhost'),
    },
    DB_NAME: {
      value: process.env.DB_NAME,
      joi: Joi.string().required(),
    },
    DB_USER: {
      value: process.env.DB_USER,
      joi: Joi.string().required(),
    },
    DB_PASS: {
      value: process.env.DB_PASS,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});
