import { Request, Response } from 'express';
import { TaxSlab } from '../models/TaxSlab.js';
import { INITIAL_TAX_YEARS } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback store initialized with baseline data
let inMemoryTaxYears: any[] = JSON.parse(JSON.stringify(INITIAL_TAX_YEARS));

export async function getAllTaxYears(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      let records = await TaxSlab.find().sort({ year: -1 }).lean();
      if (!records || records.length === 0) {
        // Seed database
        await TaxSlab.insertMany(INITIAL_TAX_YEARS);
        records = await TaxSlab.find().sort({ year: -1 }).lean();
      }
      res.json({ success: true, source: 'mongodb', data: records });
      return;
    }

    res.json({ success: true, source: 'in-memory', data: inMemoryTaxYears });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: inMemoryTaxYears });
  }
}

export async function getTaxSlabByYear(req: Request, res: Response): Promise<void> {
  const { year } = req.params;

  try {
    if (isDbConnected()) {
      const record = await TaxSlab.findOne({ year }).lean();
      if (record) {
        res.json({ success: true, source: 'mongodb', data: record });
        return;
      }
    }

    const found = inMemoryTaxYears.find((item) => item.year === year);
    if (found) {
      res.json({ success: true, source: 'in-memory', data: found });
      return;
    }

    res.status(404).json({ success: false, message: `Tax Year ${year} not found` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function saveTaxSlabYear(req: Request, res: Response): Promise<void> {
  const { year } = req.params;
  const payload = req.body;

  try {
    payload.year = year;
    payload.updatedAt = new Date();

    if (isDbConnected()) {
      const updated = await TaxSlab.findOneAndUpdate(
        { year },
        { $set: payload },
        { upsert: true, new: true }
      ).lean();

      // Keep in-memory cache synchronized
      const idx = inMemoryTaxYears.findIndex((y) => y.year === year);
      if (idx >= 0) inMemoryTaxYears[idx] = updated;
      else inMemoryTaxYears.unshift(updated);

      res.json({ success: true, message: `Tax Year ${year} saved to MongoDB`, data: updated });
      return;
    }

    // Fallback in-memory save
    const idx = inMemoryTaxYears.findIndex((y) => y.year === year);
    if (idx >= 0) {
      inMemoryTaxYears[idx] = { ...inMemoryTaxYears[idx], ...payload };
    } else {
      inMemoryTaxYears.unshift(payload);
    }

    res.json({
      success: true,
      message: `Tax Year ${year} saved (in-memory mode, MongoDB offline)`,
      data: payload,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteTaxSlabYear(req: Request, res: Response): Promise<void> {
  const { year } = req.params;

  try {
    if (isDbConnected()) {
      await TaxSlab.deleteOne({ year });
    }
    inMemoryTaxYears = inMemoryTaxYears.filter((item) => item.year !== year);

    res.json({ success: true, message: `Tax Year ${year} deleted` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetTaxSlabs(req: Request, res: Response): Promise<void> {
  try {
    inMemoryTaxYears = JSON.parse(JSON.stringify(INITIAL_TAX_YEARS));
    if (isDbConnected()) {
      await TaxSlab.deleteMany({});
      await TaxSlab.insertMany(INITIAL_TAX_YEARS);
    }
    res.json({ success: true, message: 'Tax slabs reset to official FBR baseline defaults', data: inMemoryTaxYears });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
