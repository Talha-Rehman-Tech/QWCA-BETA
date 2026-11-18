import mongoose, { Schema, Document } from 'mongoose';

export interface ISalarySlab {
  min: number;
  max: number;
  rate: number;
  baseTax: number;
  rangeText: string;
  rateText: string;
  payableText: string;
  formulaDesc: string;
}

export interface INonSalariedSlab {
  min: number;
  max: number;
  rate: number;
  fixed: number;
  rangeText: string;
  desc: string;
}

export interface ICorporateRates {
  general: number;
  small: number;
  banking: number;
  modaraba: number;
  sme_cat1: number;
  sme_cat2: number;
}

export interface ISuperTaxBracket {
  min: number;
  max: number;
  text: string;
  rateText: string;
  rate: number;
}

export interface IRentalSlab {
  min: number;
  max: number;
  rate: number;
  rateText: string;
  rangeText: string;
  formula: string;
}

export interface IPropertyPurchaseSlab {
  min: number;
  max: number;
  filerRate: number;
  nonFilerRate: number;
  overseasRate: number;
  label: string;
}

export interface IPropertySaleRates {
  filer: number;
  nonFiler: number;
  overseas: number;
}

export interface ICGTHoldingBracket {
  periodId: string;
  label: string;
  openPlotRate: number;
  constructedRate: number;
  flatRate: number;
}

export interface ITaxSlabConfig extends Document {
  year: string;
  label: string;
  title: string;
  desc: string;
  salarySlabs: ISalarySlab[];
  nonSalariedSlabs: INonSalariedSlab[];
  corporateRates: ICorporateRates;
  superTaxBrackets: ISuperTaxBracket[];
  rentalSlabs: IRentalSlab[];
  propertyPurchaseSlabs: IPropertyPurchaseSlab[];
  propertySaleRates: IPropertySaleRates;
  cgtHoldingSchedule: ICGTHoldingBracket[];
  updatedAt: Date;
}

const TaxSlabSchema = new Schema<ITaxSlabConfig>(
  {
    year: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    salarySlabs: [
      {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        rate: { type: Number, required: true },
        baseTax: { type: Number, default: 0 },
        rangeText: { type: String, default: '' },
        rateText: { type: String, default: '' },
        payableText: { type: String, default: '' },
        formulaDesc: { type: String, default: '' },
      },
    ],
    nonSalariedSlabs: [
      {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        rate: { type: Number, required: true },
        fixed: { type: Number, default: 0 },
        rangeText: { type: String, default: '' },
        desc: { type: String, default: '' },
      },
    ],
    corporateRates: {
      general: { type: Number, default: 0.29 },
      small: { type: Number, default: 0.20 },
      banking: { type: Number, default: 0.39 },
      modaraba: { type: Number, default: 0.25 },
      sme_cat1: { type: Number, default: 0.075 },
      sme_cat2: { type: Number, default: 0.15 },
    },
    superTaxBrackets: [
      {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        text: { type: String, default: '' },
        rateText: { type: String, default: '' },
        rate: { type: Number, required: true },
      },
    ],
    rentalSlabs: [
      {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        rate: { type: Number, required: true },
        rateText: { type: String, default: '' },
        rangeText: { type: String, default: '' },
        formula: { type: String, default: '' },
      },
    ],
    propertyPurchaseSlabs: [
      {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        filerRate: { type: Number, default: 0.0125 },
        nonFilerRate: { type: Number, default: 0.105 },
        overseasRate: { type: Number, default: 0.0125 },
        label: { type: String, default: '' },
      },
    ],
    propertySaleRates: {
      filer: { type: Number, default: 0.0275 },
      nonFiler: { type: Number, default: 0.115 },
      overseas: { type: Number, default: 0.0275 },
    },
    cgtHoldingSchedule: [
      {
        periodId: { type: String, required: true },
        label: { type: String, required: true },
        openPlotRate: { type: Number, default: 0 },
        constructedRate: { type: Number, default: 0 },
        flatRate: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const TaxSlab = mongoose.models.TaxSlab || mongoose.model<ITaxSlabConfig>('TaxSlab', TaxSlabSchema);
