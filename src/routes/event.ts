import { Router } from 'express';
import EventMiddleware from '../middlewares/event';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import { RoleEnum } from '../utils/shopp.enum';
const routes = Router();

// list events created by admin
routes.get(
  '/list-admin-events',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.listAll
);

// list events created by shop
routes.get(
  '/list-shop-events',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.listShopEvents
);

// create a new event
routes.post(
  '/new',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.newEvent
);

// edit an event
routes.post(
  '/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.editEvent
);

// delete an event
routes.get(
  '/delete/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.deleteEvent
);

// find an event
routes.get(
  '/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.findEventById
);

// join event
routes.post(
  '/join-event/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.joinEvent
);

// edit products discount of event
routes.post(
  '/edit-products-discount/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.editProductDiscountFromEvent
);

// delete products of event
routes.post(
  '/delete-products/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  EventMiddleware.deleteProductsOfEvent
);

// show products of event
routes.get(
  '/show-products/:eventId([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  EventMiddleware.showAllProductsOfEvent
);

export default routes;
