import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { RoleEnum } from '../utils/shopp.enum';
import CustomerMiddleware from '../middlewares/customer';
import { checkRole } from '../middlewares/checkRole';

const routes = Router();

//Get all customers
routes.get(
  '/list-all',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  CustomerMiddleware.listAll
);

// Get one customer
routes.get('/:id', AuthMiddleware.checkJwt, CustomerMiddleware.getOneById);

//Create a new customer
routes.post(
  '/new/:user-id([0-9]+)',
  AuthMiddleware.checkJwt,
  CustomerMiddleware.postNew
);

//Edit one customer
routes.post(
  '/:id',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  CustomerMiddleware.edit
);

export default routes;
