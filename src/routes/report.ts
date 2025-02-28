import { Router } from 'express';
import AuthMiddleware from '../middlewares/auth';
import { checkRole } from '../middlewares/checkRole';
import ReportMiddleware from '../middlewares/report';
import { RoleEnum } from '../utils/shopp.enum';

const routes = Router();

routes.get(
  '/list-all-in-process',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.listAllReportInProcess
);

routes.get(
  '/list-all-processed',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.listAllReportProcessed
);

routes.get(
  '/view-report/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.viewReport
);

routes.post(
  '/new-for-customer/:shopId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.CUSTOMER)],
  ReportMiddleware.postNewForCustomer
);

routes.post(
  '/new-for-shop/:customerId',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.SHOP)],
  ReportMiddleware.postNewForShop
);

routes.post(
  '/edit-status/:id([0-9]+)',
  [AuthMiddleware.checkJwt, checkRole(RoleEnum.ADMIN)],
  ReportMiddleware.editStatus
);

export default routes;
