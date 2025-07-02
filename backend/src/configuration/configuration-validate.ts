import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigurationScheme } from './configuration-scheme';

export function configurationValidate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(ConfigurationScheme, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
