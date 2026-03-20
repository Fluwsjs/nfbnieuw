import { MongoClient, Db } from 'mongodb';

// Globale variabelen om caching te ondersteunen
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Als we al een verbinding hebben, gebruik deze
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Controleer of de omgevingsvariabele bestaat
  const uri = process.env.DATABASE_URL;
  const dbName = process.env.MONGODB_DB || 'bookings';

  if (!uri) {
    console.error('Geen DATABASE_URL omgevingsvariabele gevonden. Zorg ervoor dat deze is ingesteld in .env.local');
    throw new Error('MongoDB connection string not found');
  }

  try {
    // Log eerste deel van de URI voor debugging (zonder wachtwoord te tonen)
    console.log(`Connecting to MongoDB with URI starting with: ${uri.substring(0, 20)}...`);
    console.log(`Protocol used: ${uri.split('://')[0]}`);
    
    // Maak verbinding met de database
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Cache de client en database voor toekomstig gebruik
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
} 