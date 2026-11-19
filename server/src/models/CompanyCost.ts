import mongoose, { Schema, Document } from 'mongoose';

export interface IEntityTier {
  id: string;
  name: string;
  badge: string;
  desc: string;
  baseFee: number;
  baseGovFee?: number;
  baseConsultingFee?: number;
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
  govtFee: number;
  consultingFee: number;
  desc: string;
  category: string;
  required?: boolean;
  defaultChecked?: boolean;
  optional?: boolean;
}

export interface ICustomCostItem {
  id: string;
  title: string;
  fee: number;
  govtFee?: number;
  consultingFee?: number;
  desc?: string;
  category?: string;
}

export interface ICompanyCostConfig extends Document {
  configId: string;
  secpBaseFilingFee: number;
  entityTiers: IEntityTier[];
  capitalTiers: ICapitalTier[];
  serviceAddons: IServiceAddon[];
  customCostItems?: ICustomCostItem[];
  updatedAt: Date;
}

const EntityTierSubSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    badge: { type: String, default: '' },
    desc: { type: String, default: '' },
    baseFee: { type: Number, required: true },
    baseGovFee: { type: Number, default: 0 },
    baseConsultingFee: { type: Number, default: 0 },
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
    govtFee: { type: Number, default: 0 },
    consultingFee: { type: Number, default: 0 },
    desc: { type: String, default: '' },
    category: { type: String, default: 'SECP & Incorporation' },
    required: { type: Boolean, default: false },
    defaultChecked: { type: Boolean, default: false },
    optional: { type: Boolean, default: true },
  },
  { _id: false }
);

const CustomCostItemSubSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    fee: { type: Number, required: true },
    govtFee: { type: Number, default: 0 },
    consultingFee: { type: Number, default: 0 },
    desc: { type: String, default: '' },
    category: { type: String, default: 'Custom Services' },
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
    customCostItems: [CustomCostItemSubSchema],
  },
  { timestamps: true }
);

export const CompanyCost = mongoose.models.CompanyCost || mongoose.model<ICompanyCostConfig>('CompanyCost', CompanyCostSchema);
