import { Product } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Product): Promise<Product> => {
  const result = await prisma.product.create({
    data,
  });

  return result;
};

// const getAllFromDB = async (): Promise<Product[]> => {
//   const result = await prisma.product.findMany({});
//   return result;
// };

const getAllFromDB = async (
  options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const result = await prisma.product.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.product.count({}); // Provide an empty object to count all products

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getDataById = async (id: string): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Product>
): Promise<Product> => {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: payload,
  });

  return updatedProduct;
};

const deleteByIdFromDB = async (id: string): Promise<Product> => {
  // Delete the product
  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  return deletedProduct;
};

export const ProductService = {
  insertIntoDB,
  getAllFromDB,
  getDataById,
  updateOneInDB,
  deleteByIdFromDB,
};
