import mongoose, { Schema } from 'mongoose';
import { UserDocument } from './user.model';

export interface ProductDocument extends mongoose.Document {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;
