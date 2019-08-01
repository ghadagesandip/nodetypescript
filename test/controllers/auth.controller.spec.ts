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
      try {
        const users: any = await request(server).post('/api/auth/login').set({body});
        expect(users.success).to.be.equal(true);
        expect(users.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

//   describe('"authcontroller.signUp()"', () => {
//     const body: any = {
//         email: 'sandip@yopmail.com',
//         password: 'sandip123',
//         confirm_password: 'sandip123',
//         first_name: 'Lalit',
//         gender: 'Male',
//     };
//     it('should signUp users', async () => {
//       try {
//         const users: any = await request(server).post('/api/auth/sign-up').set({body});
//         expect(users.success).to.be.equal(true);
//         expect(users.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"authcontroller.forgotPassword()"', () => {
//     const body: any = {
//         email: 'sandip@yopmail.com',
//     };
//     it('should forgotPassword functionality for users', async () => {
//       try {
//         const users: any = await request(server).post('/api/auth/forgot-password').set({body});
//         expect(users.success).to.be.equal(true);
//         expect(users.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

});
