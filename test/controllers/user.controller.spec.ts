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
let app: App;
const commonHeaders: any = {Authorization: ''};

before(async () => {
  app = new App();
  await app
    .init()
    .then(() => {
      server = app.httpServer;
      server.on('error', function(): void {
        // logger.log('testing server ');
      });
      server.on('listening', function(): void {
        // logger.info('testing server started');
      });
      server.listen(process.env.PORT);
    })
    .then(async () => {
        // call login api
        const body: any = {
            email: 'admin-shopping@yopmail.com',
            password: 'admin123',
        };
        const users: any = await request(server).post('/api/auth/login').send(body);
        commonHeaders.Authorization = users.body.data.token;
    })
    .catch((err: Error) => {
      logger.error(err.name);
      logger.error(err.message);
      logger.error(err.stack);
    });
});

describe('User module', () => {
  describe('"usercontroller.getUsers()"', () => {
    it('should should list users', async () => {
      try {
        logger.info({token_found : commonHeaders});
        const users: any = await request(server).get('/api/users').set(commonHeaders);
        expect(users.body.success, 'success').to.be.equal(true);
        expect(users.body.message).to.be.equal('Success');
        expect(users.body.data).to.be.a('array');
        expect(users.body.data[0]).to.be.a('object');
        expect(users.body.data[0]).to.have.property('userRole');
        expect(users.body.data[0]).to.have.property('email');
        expect(users.body.data[0]).to.have.property('first_name');

      } catch (err) {
        expect(err.statusCode).to.be.equal(401);
      }
    });
  });

  describe('"usercontroller.getUserById()"', () => {
    it('should return a user', async () => {
      const id: string = '5d1cb16ecca2b968536aa52c';
      const users: any = await request(server).get(`/api/users/${id}`).set(commonHeaders);
      expect(users.body.success, 'success').to.be.equal(true);
      expect(users.body.message).to.be.equal('Success');
      expect(users.body.data).to.be.a('object');
      expect(users.body.data).to.have.property('userRole');
      expect(users.body.data).to.have.property('email');
      expect(users.body.data).to.have.property('first_name');
    });
  });

  // describe('"usercontroller.updateUser()"', () => {
  //   const id: string = '5d1cb16ecca2b968536aa52c';
  //   const body: any = {
  //     email: 'sandip@yopmail.com',
  //     password: 'sandipg123',
  //     first_name: 'Sandip',
  //     last_name: 'Ghadge',
  //   };
  //   it('should update a user', async () => {
  //     const users: any = await request(server).put(`/api/users/${id}`).set(commonHeaders).send(body);
  //     expect(users.body.success, 'success').to.be.equal(true);
  //     expect(users.body.message).to.be.equal('Success');
  //     expect(users.body.data).to.be.a('object');
  //     expect(users.body.data).to.have.property('userRole');
  //     expect(users.body.data).to.have.property('email');
  //     expect(users.body.data).to.have.property('first_name');
  //   });
  // });

});
