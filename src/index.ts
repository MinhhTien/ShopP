import express from "express";
import ShopPConfig from "./utils/shopp.config";
import routes from "./routes";
import { ShopPDataSource } from "./data";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import http from "http";

ShopPDataSource.initialize()
    .then(source => {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
        app.use(helmet())
        app.use(routes);
        const server = http.createServer(app);
        server.listen(ShopPConfig.PORT, () => {
            console.log(`Server is listenning at port ${ShopPConfig.PORT}!`);
        });
    })
    .catch(err => {
        console.error('There are some errors while initialzing data source!');
        console.error('Detail:');
        console.log(err);
    });