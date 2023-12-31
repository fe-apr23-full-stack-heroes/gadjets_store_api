import { Request, Response } from 'express';
import { Tablets } from '../models/tablets.model';
import { productService } from '../services/product.service';
import { Product } from '../models/product.model';

const CATEGORY_NAME = 'tablets';

const getAll = async (req: Request, res: Response) => {
  try {
    const tablets = await productService.getAllByCategory(CATEGORY_NAME);

    res.send(tablets);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tablets = await Tablets.findByPk(id, {
      include: {
        model: Product,
        as: 'productItemInfo',
      },
    });

    if (!tablets) {
      res.status(404).send({ message: 'Cannot find Tablet with this ID' });

      return;
    }

    res.send(tablets);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

const getRecommended = async (req: Request, res: Response) => {
  const { id } = req.params;
  const LIMIT = 5;

  try {
    const tablet = await Tablets.findByPk(id);

    if (!tablet) {
      res.status(404).send({ message: 'Cannot find Tablet with this ID' });
      return;
    }

    const recommendedTablets = await productService.getRecomended(
      tablet.id,
      CATEGORY_NAME,
      LIMIT
    );

    res.send(recommendedTablets);
  } catch (error) {
    console.error('Error fetching recommended tablets:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const tabletsController = {
  getAll,
  getById,
  getRecommended,
};
