import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as swaggerUi from 'swagger-ui-express';
import * as yaml from 'yamljs';
import { registerRoutes } from './src/routes';

const swagOptions: any = { explorer: false };
const swaggerDocument: any = yaml.load('./swagger/swagger.yaml');

if (process.env.NODE_ENV === 'production') {
  swaggerDocument.host = 'enigmatic-reef-16960.herokuapp.com';
} else {
  swaggerDocument.host = `localhost:${process.env.PORT}`;
}

/**
 * main file
 */
export class App {
  public express: express.Application;
  public mongoUrl: string = process.env.MONGO_URL;
  public httpServer: http.Server;

  public async init(): Promise<void> {
    this.express = express();
    this.httpServer = http.createServer(this.express);
    await this.middleware();
    await this.mongoSetup();
    this.setupRoutes();
  }

  private async middleware(): Promise<void> {
    // cors
    this.express.use(cors());
    // this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    //     const allowedOrigins: string[] = ['http://127.0.0.1:4200', 'http://10.0.29.42:4200', 'http://localhost:4200'];
    //     const origin: any = req.headers.origin;
    //     if (allowedOrigins.indexOf(origin) > -1) {
    //          res.setHeader('Access-Control-Allow-Origin', origin);
    //     }

    //     res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //     res.header('Access-Control-Allow-Credentials', 'true');
    //     next();
    // });

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, swagOptions),
    );
  }

  private setupRoutes(): void {
    registerRoutes(this.express);
  }
  private async mongoSetup(): Promise<void> {
    mongoose.set('debug', true);
    await mongoose.connect(this.mongoUrl, {
      autoIndex: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  }
}
