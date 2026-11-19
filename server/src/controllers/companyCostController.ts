import { Request, Response } from 'express';
import { CompanyCost } from '../models/CompanyCost.js';
import { INITIAL_COMPANY_COST_CONFIG } from '../data/seedData.js';
import { isDbConnected } from '../config/db.js';
import { broadcastRealtimeEvent } from '../services/realtimeService.js';

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

function stripMongoIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripMongoIds);
  } else if (obj !== null && typeof obj === 'object') {
    const clean: any = {};
    for (const key of Object.keys(obj)) {
      if (key === '_id' || key === '__v') continue;
      clean[key] = stripMongoIds(obj[key]);
    }
    return clean;
  }
  return obj;
}

export async function saveCompanyCostConfig(req: Request, res: Response): Promise<void> {
  try {
    const payload = stripMongoIds(req.body);
    payload.configId = 'default';
    payload.updatedAt = new Date();

    if (isDbConnected()) {
      const updated = await CompanyCost.findOneAndUpdate(
        { configId: 'default' },
        { $set: payload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      inMemoryCostConfig = updated;

      broadcastRealtimeEvent('company_cost_updated', {
        action: 'save',
        data: updated,
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: 'Company cost configuration saved to MongoDB', data: updated });
      return;
    }

    inMemoryCostConfig = { ...inMemoryCostConfig, ...payload };

    broadcastRealtimeEvent('company_cost_updated', {
      action: 'save',
      data: inMemoryCostConfig,
      timestamp: new Date().toISOString(),
    });

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

    broadcastRealtimeEvent('company_cost_updated', {
      action: 'reset',
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Company cost configuration reset to official baseline defaults',
      data: inMemoryCostConfig,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
