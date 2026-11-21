import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load server .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function sanitizeUri(uri: string): string {
  try {
    return uri.replace(/:([^:@]+)@/, ':****@');
  } catch {
    return uri;
  }
}

async function runMigration() {
  console.log('====================================================');
  console.log('📦 QWCA MongoDB: Local to Atlas Cloud Migration Tool');
  console.log('====================================================');

  const sourceUri = process.env.SOURCE_MONGODB_URI || 'mongodb://127.0.0.1:27017/qwca_database';
  const targetUri = process.env.TARGET_MONGODB_URI || process.env.MONGODB_URI;

  if (!targetUri || targetUri === sourceUri) {
    console.error('\n❌ [Error] Target MongoDB URI is missing or identical to Source URI.');
    console.error('👉 Please specify TARGET_MONGODB_URI in your server/.env file or run:');
    console.error('   TARGET_MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/qwca_database" npm run migrate:atlas\n');
    process.exit(1);
  }

  console.log(`\n📥 Source Database : ${sanitizeUri(sourceUri)}`);
  console.log(`📤 Target Database : ${sanitizeUri(targetUri)}`);

  let sourceConn: mongoose.Connection | null = null;
  let targetConn: mongoose.Connection | null = null;

  try {
    // 1. Connect to Source
    console.log('\n[1/4] Connecting to Source MongoDB...');
    sourceConn = await mongoose.createConnection(sourceUri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    console.log('  ✅ Connected to Source MongoDB.');

    // 2. Connect to Target (Atlas)
    console.log('\n[2/4] Connecting to Target MongoDB (Atlas)...');
    targetConn = await mongoose.createConnection(targetUri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    }).asPromise();
    console.log('  ✅ Connected to Target MongoDB (Atlas).');

    // 3. Extract Collections from Source
    console.log('\n[3/4] Reading data from Source database collections...');
    const sourceTaxSlabs = await sourceConn.collection('taxslabs').find({}).toArray();
    const sourceCompanyCosts = await sourceConn.collection('companycosts').find({}).toArray();
    const sourceAdmins = await sourceConn.collection('admins').find({}).toArray();

    console.log(`  Found: ${sourceTaxSlabs.length} Tax Slab years`);
    console.log(`  Found: ${sourceCompanyCosts.length} Company Cost configurations`);
    console.log(`  Found: ${sourceAdmins.length} Admin accounts`);

    // 4. Upsert Data into Target
    console.log('\n[4/4] Writing data to Target MongoDB (Atlas)...');

    // Tax Slabs
    if (sourceTaxSlabs.length > 0) {
      const targetTaxSlabs = targetConn.collection('taxslabs');
      for (const item of sourceTaxSlabs) {
        const { _id, ...rest } = item;
        await targetTaxSlabs.updateOne({ year: rest.year }, { $set: rest }, { upsert: true });
      }
      console.log(`  ✅ Upserted ${sourceTaxSlabs.length} Tax Slabs into Atlas.`);
    }

    // Company Cost Config
    if (sourceCompanyCosts.length > 0) {
      const targetCompanyCosts = targetConn.collection('companycosts');
      for (const item of sourceCompanyCosts) {
        const { _id, ...rest } = item;
        await targetCompanyCosts.updateOne({ configId: rest.configId || 'default' }, { $set: rest }, { upsert: true });
      }
      console.log(`  ✅ Upserted ${sourceCompanyCosts.length} Company Cost configs into Atlas.`);
    }

    // Admins
    if (sourceAdmins.length > 0) {
      const targetAdmins = targetConn.collection('admins');
      for (const item of sourceAdmins) {
        const { _id, ...rest } = item;
        await targetAdmins.updateOne({ email: rest.email }, { $set: rest }, { upsert: true });
      }
      console.log(`  ✅ Upserted ${sourceAdmins.length} Admin accounts into Atlas.`);
    }

    console.log('\n====================================================');
    console.log('🎉 SUCCESS: All data migrated to MongoDB Atlas!');
    console.log('====================================================\n');
  } catch (err: any) {
    console.error('\n❌ Migration failed:', err.message);
  } finally {
    if (sourceConn) await sourceConn.close();
    if (targetConn) await targetConn.close();
    process.exit(0);
  }
}

runMigration();
