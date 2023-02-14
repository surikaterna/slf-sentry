import { Integrations } from '@sentry/node';
import type { Integration, IntegrationClass } from '@sentry/types';
import type { IntegrationsOptions } from './createSlfSentryDriver';

const createIntegrationOptions = (options?: Partial<IntegrationsOptions>) => {
  if (!options) {
    return [];
  }

  const overridesIntegrationsOptions: Array<Integration> = [];

  Object.entries(options).forEach(([key, value]) => {
    const NewIntegration = Integrations[key as keyof typeof Integrations] as IntegrationClass<Integration>;

    if (NewIntegration) {
      overridesIntegrationsOptions.push(new NewIntegration(value));
    }
  });

  return overridesIntegrationsOptions;
};

export default createIntegrationOptions;
