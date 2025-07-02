export const appConfig = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  },
  app: {
    domain: process.env.REACT_APP_DOMAIN || 'localhost',
    port: process.env.REACT_APP_PORT || '3001',
    protocol: process.env.REACT_APP_PROTOCOL || 'http',
  },
};

export const getAppUrl = (): string => {
  const { protocol, domain, port } = appConfig.app;
  return port ? `${protocol}://${domain}:${port}` : `${protocol}://${domain}`;
};
