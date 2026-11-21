import { TaxSlab } from '../models/TaxSlab.js';
import { CompanyCost } from '../models/CompanyCost.js';
import { INITIAL_TAX_YEARS, INITIAL_COMPANY_COST_CONFIG } from '../data/seedData.js';
import { ensureAdminSeeded } from '../controllers/authController.js';

/**
 * Automatically seeds statutory baseline data and single admin user
 * into MongoDB (Local or MongoDB Atlas) if the database is newly provisioned or empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    // 1. Seed Tax Slabs if none exist
    const taxSlabCount = await TaxSlab.countDocuments();
    if (taxSlabCount === 0) {
      console.log('[Database Seed] Fresh MongoDB cluster detected. Seeding statutory Tax Slabs (2026-2027, 2025-2026, etc.)...');
      await TaxSlab.insertMany(INITIAL_TAX_YEARS);
      console.log(`[Database Seed] Successfully seeded ${INITIAL_TAX_YEARS.length} tax year records into MongoDB.`);
    }

    // 2. Seed Company Cost Config if none exists
    const costCount = await CompanyCost.countDocuments();
    if (costCount === 0) {
      console.log('[Database Seed] Seeding statutory Company Cost Estimator configuration...');
      await CompanyCost.create(INITIAL_COMPANY_COST_CONFIG);
      console.log('[Database Seed] Successfully seeded Company Cost configuration into MongoDB.');
    }

    // 3. Ensure Default Single Admin Account is initialized
    await ensureAdminSeeded();
  } catch (err: any) {
    console.error('[Database Seed] Notice during database auto-seed check:', err.message);
  }
}
