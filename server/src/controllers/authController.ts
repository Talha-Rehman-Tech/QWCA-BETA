import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { isDbConnected } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  email: process.env.ADMIN_EMAIL || 'admin@qwca.com.pk',
  password: process.env.ADMIN_PASSWORD || 'qwcaAdmin@2026!',
  name: 'Qummar Waheed, ACA (Managing Partner)',
  role: 'superadmin',
};

const JWT_SECRET = process.env.JWT_SECRET || 'qwca_jwt_secure_secret_key_987123_managing_partner';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Ensure a single admin user exists in MongoDB when connected
 */
export async function ensureAdminSeeded(): Promise<void> {
  if (!isDbConnected()) return;

  try {
    const existing = await Admin.findOne();
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, salt);

      await Admin.create({
        username: DEFAULT_ADMIN.username.toLowerCase(),
        email: DEFAULT_ADMIN.email.toLowerCase(),
        passwordHash,
        name: DEFAULT_ADMIN.name,
        role: DEFAULT_ADMIN.role,
      });

      console.log(`[Auth] Default single admin account initialized: ${DEFAULT_ADMIN.email}`);
    }
  } catch (error: any) {
    console.error('[Auth] Error seeding admin user:', error.message);
  }
}

/**
 * Single Admin Login Controller
 * POST /api/auth/login
 */
export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: 'Username/Email and Password are required.',
      });
      return;
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const cleanPassword = String(password);

    let adminData: {
      username: string;
      email: string;
      name: string;
      role: string;
      passwordHash?: string;
    } | null = null;

    let isMatch = false;

    if (isDbConnected()) {
      // 1. Try DB single admin lookup
      const dbAdmin = await Admin.findOne({
        $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
      });

      if (dbAdmin) {
        adminData = {
          username: dbAdmin.username,
          email: dbAdmin.email,
          name: dbAdmin.name,
          role: dbAdmin.role,
          passwordHash: dbAdmin.passwordHash,
        };
        isMatch = await bcrypt.compare(cleanPassword, dbAdmin.passwordHash);

        if (isMatch) {
          dbAdmin.lastLogin = new Date();
          await dbAdmin.save().catch(() => {});
        }
      }
    }

    // 2. Fallback check against environment if DB is offline or admin not yet in DB
    if (!adminData) {
      const matchesEnvIdentifier =
        cleanIdentifier === DEFAULT_ADMIN.username.toLowerCase() ||
        cleanIdentifier === DEFAULT_ADMIN.email.toLowerCase();

      if (matchesEnvIdentifier && cleanPassword === DEFAULT_ADMIN.password) {
        isMatch = true;
        adminData = {
          username: DEFAULT_ADMIN.username,
          email: DEFAULT_ADMIN.email,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
        };
      }
    }

    if (!isMatch || !adminData) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Access restricted to authorized firm administrator.',
      });
      return;
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        username: adminData.username,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Authentication successful. Welcome to QWCA Executive Portal.',
      token,
      admin: {
        username: adminData.username,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
      },
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An internal authentication error occurred.',
      error: error.message,
    });
  }
}

/**
 * Verify current session token
 * GET /api/auth/verify
 */
export async function verifyAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.json({
    success: true,
    message: 'Token is valid.',
    admin: req.admin,
  });
}

/**
 * Change Admin Password
 * PUT /api/auth/change-password
 */
export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.',
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
      return;
    }

    if (isDbConnected() && req.admin) {
      const admin = await Admin.findOne({ email: req.admin.email });
      if (!admin) {
        res.status(404).json({ success: false, message: 'Admin record not found.' });
        return;
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isCurrentValid) {
        res.status(401).json({ success: false, message: 'Current password does not match.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(newPassword, salt);
      await admin.save();

      res.json({
        success: true,
        message: 'Admin password updated successfully in MongoDB.',
      });
      return;
    }

    // In-memory fallback notification
    res.json({
      success: true,
      message: 'Password validation accepted. Update ADMIN_PASSWORD in server/.env for persistent in-memory overrides.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update password.',
      error: error.message,
    });
  }
}
