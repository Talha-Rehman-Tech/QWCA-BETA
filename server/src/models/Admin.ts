import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  lastLogin?: Date;
}

const AdminSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Qummar Waheed, ACA (Managing Partner)',
    },
    role: {
      type: String,
      default: 'superadmin',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
