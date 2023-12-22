import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import JoiUtil, { JoiConfig } from '../utils/joi';

dotenv.config({ path: '.env' });

export interface ThrottlerConfig {
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
}

export default registerAs('throttler', async (): Promise<ThrottlerConfig> => {
  const configs: JoiConfig<ThrottlerConfig> = {
    THROTTLE_TTL: {
      value: parseInt(process.env.THROTTLE_TTL),
      joi: Joi.number().required().default(50000),
    },
    THROTTLE_LIMIT: {
      value: parseInt(process.env.THROTTLE_TTL),
      joi: Joi.number().required().default(10),
    },
  };

  return JoiUtil.validate(configs);
});
