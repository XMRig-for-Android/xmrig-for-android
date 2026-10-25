import 'text-encoding-polyfill';
import Joi from 'joi';
import { ConfigurationMode, RandomXMode } from '../settings/settings.interface';

export const hostnameValidator = Joi.string().min(3).max(30).required();
export const usernameValidator = Joi.optional();
export const passwordValidator = Joi.optional();
export const portValidator = Joi.number().integer().min(1).max(65535)
  .required();

export const poolValidator = Joi.object({
  hostname: hostnameValidator,
  username: usernameValidator,
  password: passwordValidator,
  port: portValidator,
  sslEnabled: Joi.boolean(),
});

export const validateWalletAddress = (addr?: string): boolean => addr != null
  && /^[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}([1-9A-HJ-NP-Za-km-z]{11})?$/.test(addr);

export const yieldValidator = Joi.boolean().required();
export const priorityValidator = Joi.number().min(1).max(5).allow(null)
  .optional();
export const maxThreadsHintValidator = Joi.number().min(1).max(100).required();
export const randomXModedValidator = Joi
  .string()
  .valid(RandomXMode.AUTO, RandomXMode.FAST, RandomXMode.LIGHT)
  .required();

export const cpuValidator = Joi.object({
  yield: yieldValidator,
  priority: priorityValidator,
  max_threads_hint: maxThreadsHintValidator,
  random_x_mode: randomXModedValidator,
});

export const configurationModeValidator = Joi
  .string()
  .valid(ConfigurationMode.SIMPLE, ConfigurationMode.ADVANCE)
  .required();

export const getConfigurationNameValidator = (names: string[]) => Joi
  .string()
  .min(1)
  .max(30)
  .custom((value, helper:Joi.CustomHelpers) => {
    if (names.includes(value)) {
      return helper.message({ '*': 'Configuration name already exists' });
    }
    return value;
  })
  .required();

export const getConfigurationValidator = (names: string[]) => Joi.object({
  name: getConfigurationNameValidator(names),
  mode: configurationModeValidator,
});
