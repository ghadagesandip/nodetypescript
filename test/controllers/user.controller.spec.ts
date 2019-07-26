import { expect } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';

dotenv.config({
  path: '.env.test',
});

let server: http.Server;
// tslint:disable-next-line:mocha-no-side-effect-code
const app: App = new App();

before(() => {
  app
    .init()
    .then(() => {
      server = app.httpServer;
      server.on('error', function(): void {
        logger.log('testing server ');
      });
      server.on('listening', function(): void {
        logger.info('testing server started');
      });
      server.listen(process.env.PORT);
    })
    .catch((err: Error) => {
      logger.error(err.name);
      logger.error(err.message);
      logger.error(err.stack);
    });
});

describe('User module', () => {
  describe('"usercontroller.getUsers()"', () => {
    it('should list users', async () => {
      try {
        const users: any = await request(app).get('/api/products/home-list');
        console.log('user', users);
        logger.info(JSON.stringify({ 'jso data': users }));
      } catch (err) {
        logger.log('err: ::', err.statusCode);
        expect(err.statusCode).to.be.equal(401); // this is called
      }
    });
  });
});
