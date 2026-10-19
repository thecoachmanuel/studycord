const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV and TXT records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers', e);
}

let uri = process.env.MONGODB_URI;
if (!uri) {
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match) {
      uri = match[1].trim();
    }
  } catch (e) {
    console.error('Could not read .env.local', e);
  }
}

async function runSync() {
  console.log('Connecting to MongoDB Atlas at:', uri.replace(/:[^:]*@/, ':****@'));
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');
    const db = client.db();
    console.log(`Database Name: ${db.databaseName}`);

    await db.command({ ping: 1 });
    console.log('Atlas cluster responded to ping.');

    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));

    return true;
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    return false;
  } finally {
    await client.close();
  }
}

runSync();
