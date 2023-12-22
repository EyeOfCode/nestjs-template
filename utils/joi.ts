import * as Joi from 'joi';
import { Schema, SchemaMap } from 'joi';

interface ConfigProps {
  value: unknown;
  joi: Schema;
}

export type JoiConfig<T> = Record<keyof T, ConfigProps>;
export default class JoiUtil {
  static validate<T>(config: JoiConfig<T>): T {
    const schemaObj = JoiUtil.extractByPropName(config, 'joi') as SchemaMap<T>;
    const schema = Joi.object(schemaObj);
    const values = JoiUtil.extractByPropName(config, 'value') as T;

    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      throw new Error(
        `Validation failed - Is there an environment variable missing?
        ${error.message}`,
      );
    }

    return values;
  }
  static extractByPropName<T>(
    config: JoiConfig<T>,
    propName: keyof ConfigProps,
  ): T | SchemaMap<T> {
    const arr: any[] = Object.keys(config).map((key) => {
      return {
        [key]: config[key][propName],
      };
    });
    return Object.assign({}, ...arr);
  }
}
