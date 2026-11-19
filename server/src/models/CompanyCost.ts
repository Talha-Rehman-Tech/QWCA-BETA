import mongoose, { Schema, Document } from 'mongoose';

export interface IEntityTier {
  id: string;
  name: string;
  badge: string;
  desc: string;
  baseFee: number;
  highlight?: boolean;
}

export interface ICapitalTier {
  id: string;
  label: string;
  fee: number;
  rangeText: string;
  secpNote: string;
}

export interface IServiceAddon {
  id: string;
  name: string;
  fee: number;
  desc: string;
  category: string;
  optional: boolean;
}

export interface ICompanyCostConfig extends Document {
  configId: string;
  secpBaseFilingFee: number;
  entityTiers: IEntityTier[];
  capitalTiers: ICapitalTier[];
  serviceAddons: IServiceAddon[];
  updatedAt: Date;
}

const EntityTierSubSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    badge: { type: String, default: '' },
    desc: { type: String, default: '' },
    baseFee: { type: Number, required: true },
    highlight: { type: Boolean, default: false },
  },
  { _id: false }
);

const CapitalTierSubSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    fee: { type: Number, required: true },
    rangeText: { type: String, default: '' },
    secpNote: { type: String, default: '' },
  },
  { _id: false }
);

const ServiceAddonSubSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    fee: { type: Number, required: true },
    desc: { type: String, default: '' },
    category: { type: String, default: 'compliance' },
    optional: { type: Boolean, default: true },
  },
  { _id: false }
);

const CompanyCostSchema = new Schema<ICompanyCostConfig>(
  {
    configId: { type: String, required: true, unique: true, default: 'default' },
    secpBaseFilingFee: { type: Number, default: 4500 },
    entityTiers: [EntityTierSubSchema],
    capitalTiers: [CapitalTierSubSchema],
    serviceAddons: [ServiceAddonSubSchema],
  },
  { timestamps: true }
);

export const CompanyCost = mongoose.models.CompanyCost || mongoose.model<ICompanyCostConfig>('CompanyCost', CompanyCostSchema);
