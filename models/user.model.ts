import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNo: {
    value: string;
    isVerified: boolean;
  };
  password: string;
  isVerified: boolean;
  verifyToken: string;
  verifyTokenExpire: Date;
  getVerificationToken(): string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpire: {
    type: Date,
  },
});

UserSchema.methods.getVerificationToken = function (): string {
  // Generate the token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  // Hash the token
  this.verifyToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.verifyTokenExpire = new Date(Date.now() + 30 * 60 * 1000);

  return verificationToken;
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
