export const config = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: process.env.SALON_NAME,
    email: process.env.SALON_EMAIL,
    phone: process.env.SALON_PHONE,
    address: process.env.SALON_ADDRESS,
  },
  email: {
    from: process.env.EMAIL_FROM,
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      user: process.env.EMAIL_SERVER_USER,
      password: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  microsoft: {
    graph: {
      clientId: process.env.MICROSOFT_GRAPH_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_GRAPH_TENANT_ID,
      userId: process.env.MICROSOFT_GRAPH_USER_ID,
    },
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    allowedOrigins: [
      'https://www.nfbsalon.nl',
      'https://nfbsalon.nl',
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ],
  },
};

// Warn about missing environment variables (never throw at module load time,
// as that would crash Edge Function bundling on Netlify).
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SITE_URL',
    'SALON_NAME',
    'SALON_EMAIL',
    'SALON_PHONE',
    'SALON_ADDRESS',
    'EMAIL_FROM',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'MICROSOFT_GRAPH_CLIENT_ID',
    'MICROSOFT_GRAPH_CLIENT_SECRET',
    'MICROSOFT_GRAPH_TENANT_ID',
    'MICROSOFT_GRAPH_USER_ID',
    'DATABASE_URL',
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`[config] Missing environment variable: ${envVar}`);
    }
  }
} 