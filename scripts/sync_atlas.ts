import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { initialMemoryStore } from '../src/lib/db';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch {}

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

async function syncAllToAtlas() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri!, { serverSelectionTimeoutMS: 15000 });

  try {
    await client.connect();
    const db = client.db();
    console.log(`Connected to database: ${db.databaseName}`);

    for (const [colName, rawDocs] of Object.entries(initialMemoryStore)) {
      if (!Array.isArray(rawDocs) || rawDocs.length === 0) continue;
      const col = db.collection(colName);

      // Deduplicate documents by `id`
      const seen = new Set();
      const docs: any[] = [];
      for (const d of rawDocs) {
        const key = d.id || d._id;
        if (!seen.has(key)) {
          seen.add(key);
          docs.push(d);
        }
      }

      console.log(`Processing "${colName}" (${docs.length} unique items)...`);
      
      const operations = docs.map((doc) => {
        const { _id, ...fields } = doc;
        return {
          updateOne: {
            filter: { id: doc.id },
            update: {
              $set: fields,
              $setOnInsert: { _id: _id || `doc-${doc.id}` },
            },
            upsert: true,
          },
        };
      });

      // Execute in chunks of 500
      for (let i = 0; i < operations.length; i += 500) {
        const chunk = operations.slice(i, i + 500);
        await col.bulkWrite(chunk, { ordered: false });
      }

      const totalCount = await col.countDocuments();
      console.log(`Successfully synced "${colName}". Total in Atlas: ${totalCount}`);
    }

    console.log('\n=======================================');
    console.log('--- MongoDB Atlas Sync 100% Complete ---');
    console.log('=======================================');
    const cols = await db.listCollections().toArray();
    for (const c of cols) {
      const cnt = await db.collection(c.name).countDocuments();
      console.log(`-> ${c.name}: ${cnt} documents`);
    }

  } catch (err) {
    console.error('Error during Atlas sync:', err);
  } finally {
    await client.close();
  }
}

syncAllToAtlas();
