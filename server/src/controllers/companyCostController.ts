import { Request, Response } from 'express';
import { CompanyCost } from '../models/CompanyCost.js';
import { INITIAL_COMPANY_COST_CONFIG } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';

let inMemoryCostConfig: any = JSON.parse(JSON.stringify(INITIAL_COMPANY_COST_CONFIG));

export async function getCompanyCostConfig(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      let record = await CompanyCost.findOne({ configId: 'default' }).lean();
      if (!record) {
        await CompanyCost.create(INITIAL_COMPANY_COST_CONFIG);
        record = await CompanyCost.findOne({ configId: 'default' }).lean();
      }
      res.json({ success: true, source: 'mongodb', data: record });
      return;
    }

    res.json({ success: true, source: 'in-memory', data: inMemoryCostConfig });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: inMemoryCostConfig });
  }
}

export async function saveCompanyCostConfig(req: Request, res: Response): Promise<void> {
  const payload = req.body;

  try {
    payload.configId = 'default';
    payload.updatedAt = new Date();

    if (isDbConnected()) {
      const updated = await CompanyCost.findOneAndUpdate(
        { configId: 'default' },
        { $set: payload },
        { upsert: true, new: true }
      ).lean();
      inMemoryCostConfig = updated;
      res.json({ success: true, message: 'Company cost configuration saved to MongoDB', data: updated });
      return;
    }

    inMemoryCostConfig = { ...inMemoryCostConfig, ...payload };
    res.json({
      success: true,
      message: 'Company cost configuration saved (in-memory mode, MongoDB offline)',
      data: inMemoryCostConfig,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetCompanyCostConfig(req: Request, res: Response): Promise<void> {
  try {
    inMemoryCostConfig = JSON.parse(JSON.stringify(INITIAL_COMPANY_COST_CONFIG));
    if (isDbConnected()) {
      await CompanyCost.findOneAndUpdate(
        { configId: 'default' },
        { $set: INITIAL_COMPANY_COST_CONFIG },
        { upsert: true }
      );
    }
    res.json({
      success: true,
      message: 'Company cost configuration reset to official baseline defaults',
      data: inMemoryCostConfig,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
