import { Request, Response } from 'express';
import {
  CreateProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from '../service/product.service';

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) {
  // get the userId from the locals object of the response
  const userId = res.locals.user._id;

  // get the product data from request body
  const body = req.body;

  // call the createProduct service to create the product
  const product = await createProduct({ ...body, user: userId });

  // return the created product to the client
  return res.send(product);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id;

  // get the productId from the request parameters and update data from the request body
  const productId = req.params.productId;
  const update = req.body;

  // find the product in the database
  const product = await findProduct({ _id: productId });

  // Return a 404 NOT Found status code, if the product is not found
  if (!product) {
    return res.sendStatus(404);
  }

  // Return 403 Forbidden status code , if product doesn't belongs to the user
  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  // Call the findandupdateproduct service
  const updatedProduct = await findAndUpdateProduct(
    { _id: productId },
    update,
    { new: true }
  );

  // Return the updatedproduct
  return res.send(updatedProduct);
}

export async function deleteProductHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;

  const product = await findProduct({ _id: productId });

  // Return a 404 NOT Found status code, if the product is not found
  if (!product) {
    return res.sendStatus(404);
  }

  // Return 403 Forbidden status code , if product doesn't belongs to the user
  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ _id: productId });

  return res.sendStatus(200);
}

export async function getProductHandler(
  req: Request<GetProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ _id: productId });

  // Return a 404 NOT Found status code, if the product is not found
  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}
