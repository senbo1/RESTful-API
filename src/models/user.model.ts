import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plainPassword: string): Promise<Boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving it to the database 
userSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  // If the password hasn't been modified, move to the next middleware 
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt with a specified number of rounds
  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    
  // Hash the password using the generated salt
  const hash = await bcrypt.hash(user.password, salt);

  // Save the hashed password
  user.password = hash;

  return next();
});

// Method to compare a plain text password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (plainPassword: string): Promise<Boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(plainPassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
