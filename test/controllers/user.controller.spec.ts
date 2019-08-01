import { expect, should } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';

dotenv.config({
  path: '.env.test',
});

// let server: http.Server;
// let app: App;
const server: string = 'http://localhost:3000';
const commonHeaders: any = {Authorization: ''};

describe('User module', () => {

  describe('"authcontroller.login()"', () => {
    const body: any = {
        email: 'sandip@yopmail.com',
        password: 'sandip123',
    };
    it('should return success', async () => {
      try {
        const users: any = await request(server).post('/api/auth/login').set({body});
        commonHeaders.Authorization = users.data.token;
        expect(users.success).to.be.equal(true);
        expect(users.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

  describe('"usercontroller.getUsers()"', () => {
    it('should list users', async () => {
      try {
        const users: any = await request(server).get('/api/users').set(commonHeaders);
        users.should.be.a('object[]');
        expect(users.success).to.be.equal(true);
        expect(users.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

  // describe('"usercontroller.getUserById()"', () => {
  //   it('should return a user', async () => {
  //     try {
  //       const id: string = '5d0ded14defdd525bb908fde';
  //       const users: any = await request(server).get(`/api/users/${id}`).set(commonHeaders);
  //       expect(users.success).to.be.equal(true);
  //       expect(users.message).to.be.equal('Success');
  //     } catch (err) {
  //       expect(err).to.be.equal(err);
  //     }
  //   });
  // });

  // describe('"usercontroller.updateUser()"', () => {
  //   const id: string = '5d0ded14defdd525bb908fde';
  //   const body: any = {
  //     email: 'sandip@yopmail.com',
  //     password: 'sandipg123',
  //     first_name: 'Sandip',
  //     last_name: 'Ghadge',
  //   };
  //   it('should update a user', async () => {
  //     try {
  //       const users: any = await request(server).post(`/api/users/${id}`).set(commonHeaders).set({body});
  //       expect(users.success).to.be.equal(true);
  //       expect(users.message).to.be.equal('Success');
  //     } catch (err) {
  //       expect(err).to.be.equal(err);
  //     }
  //   });
  // });

  // describe('"usercontroller.deleteUser()"', () => {
  //   const id: string = '5d0ded14defdd525bb908fde';
  //   const body: any = {
  //     email: 'sandip@yopmail.com',
  //     password: 'sandipg123',
  //   };
  //   it('should delete a user', async () => {
  //     try {
  //       const users: any = await request(server).delete(`/api/users/${id}`).set(commonHeaders).set({body});
  //       expect(users.success).to.be.equal(true);
  //       expect(users.message).to.be.equal('Success');
  //     } catch (err) {
  //       expect(err).to.be.equal(err);
  //     }
  //   });
  // });
});
