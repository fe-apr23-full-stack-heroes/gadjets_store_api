import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { FindOptions, Order } from 'sequelize';

async function getProducts(req: Request, res: Response) {
  try {
    const { productType, page, limit, sortBy, order } = req.query;
    const isDefaultRoot = req.path === '/products';
    const defaultSortBy: Order = [['year', 'DESC']];

    const findOptions: FindOptions = {};

    findOptions.order = defaultSortBy;

    if (isDefaultRoot && productType) {
      findOptions.where = { category: productType };
    }

    if (!isDefaultRoot) {
      const categoryFromPath = req.path.slice(1);
      console.log(categoryFromPath);
      findOptions.where = { category: categoryFromPath };
    }

    if (page) {
      const defaultAmmount = 12;
      const itemsByPage = Number(limit) || defaultAmmount;
      const offset = (Number(page) - 1) * itemsByPage;
      findOptions.offset = offset;
      findOptions.limit = itemsByPage;
    }

    if (sortBy) {
      const orderByVariations = ['price', 'screen', 'capacity', 'ram', 'year'];
      const isString = typeof sortBy === 'string';
      const isReverse = Boolean(order);

      if (isString && orderByVariations.includes(sortBy)) {
        findOptions.order = [[sortBy, isReverse ? 'ASC' : 'DESC']];
      }
    }

    const productsOnPage = await productService.getAllByOptionsCount(
      findOptions
    );

    res.send(productsOnPage);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
}

const getNew = async (req: Request, res: Response) => {
  const limit = 20;

  try {
    const newProducts = await productService.getNew(limit);

    res.send(newProducts);
  } catch (error) {
    console.error('Error fetching new phones:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getWithDiscount = async (req: Request, res: Response) => {
  const LIMIT = 24;

  try {
    const discountedProducts = await productService.getWithMaxDiscount(LIMIT);

    res.send(discountedProducts);
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getSearch = async (req: Request, res: Response) => {
  const { searchQuery } = req.query;
  if (!searchQuery || typeof searchQuery !== 'string') {
    return;
  }

  try {
    const searchProducts = await productService.getSearch(searchQuery);

    res.send(searchProducts);
  } catch (error) {
    console.error('Error fetching phones:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const productsController = {
  getProducts,
  getWithDiscount,
  getNew,
  getSearch,
};
