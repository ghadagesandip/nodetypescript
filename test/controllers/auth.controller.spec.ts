import { expect, should } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';

dotenv.config({
  path: '.env.test',
});

const server: string = 'http://localhost:3000';

describe('Auth module', () => {
  describe('"authcontroller.login()"', () => {
    const body: any = {
        email: 'sandip@yopmail.com',
        password: 'sandip123',
    };
    it('should return success', async () => {
      const users: any = await request(server).post('/api/auth/login').send(body);
      // console.log(users.body);
      expect(users.body.success, 'success').to.be.equal(true);
      expect(users.body.message).to.be.equal('Success');
      expect(users.body.data).to.be.a('object');
      expect(users.body.data).to.have.property('user');
      expect(users.body.data).to.have.property('token');
    });
  });

  // describe('"authcontroller.signUp()"', () => {
  //   const body: any = {
  //       email: 'sandip@yopmail.com',
  //       password: 'sandip123',
  //       confirm_password: 'sandip123',
  //       first_name: 'Lalit',
  //       gender: 'Male',
  //   };
  //   it('should signUp users', async () => {
  //     const users: any = await request(server).post('/api/auth/sign-up').send(body);
  //     // console.log(users.body);
  //     expect(users.body.success, 'success').to.be.equal(true);
  //     expect(users.body.message).to.be.equal('Success');
  //     expect(users.body.data).to.be.a('object');
  //     expect(users.body.data).to.have.property('user');
  //     expect(users.body.data).to.have.property('token');
  //   });
  // });

  // describe('"authcontroller.forgotPassword()"', () => {
  //   const body: any = {
  //       email: 'sandip@yopmail.com',
  //   };
  //   it('should forgotPassword functionality for users', async () => {
  //     const users: any = await request(server).post('/api/auth/forgot-password').send(body);
  //     // console.log(users.body);
  //     expect(users.body.success, 'success').to.be.equal(true);
  //     expect(users.body.message).to.be.equal('Success');
  //   });
  // });

});
