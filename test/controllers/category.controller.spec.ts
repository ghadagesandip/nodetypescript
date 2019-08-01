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

  describe('"categorycontroller.listCategories()"', () => {
    it('should list categories', async () => {
      try {
        const category: any = await request(server).get('/api/categories').set(commonHeaders);
        expect(category.success).to.be.equal(true);
        expect(category.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

  describe('"categorycontroller.getHomeList()"', () => {
    it('should list category dashboard-products', async () => {
      try {
        const category: any = await request(server).get('/api/categories/dashboard-products');
        expect(category.success).to.be.equal(true);
        expect(category.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

  describe('"categorycontroller.getHomeList()"', () => {
    const id: string = '5d224669ca5bec29abdf23ed';
    it('should list category dashboard-products', async () => {
      try {
        const category: any = await request(server).get(`/api/categories/${id}/brand-count`);
        expect(category.success).to.be.equal(true);
        expect(category.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

  describe('"categorycontroller.getCategory()"', () => {
    const id: string = '5d224669ca5bec29abdf23ed';
    it('should return a category by id', async () => {
      try {
        const category: any = await request(server).get(`/api/categories/${id}`).set(commonHeaders);
        expect(category.success).to.be.equal(true);
        expect(category.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

//   describe('"categorycontroller.updateCategory()"', () => {
//     const id: string = '5d224669ca5bec29abdf23ed';
//     const body: Object = {};
//     it('should return a category by id', async () => {
//       try {
//         const category: any = await request(server).put(`/api/categories/${id}`).set(commonHeaders).set({body});
//         expect(category.success).to.be.equal(true);
//         expect(category.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"categorycontroller.deleteCategory()"', () => {
//     const id: string = '5d224669ca5bec29abdf23ed';
//     it('should return a category by id', async () => {
//       try {
//         const category: any = await request(server).delete(`/api/categories/${id}`).set(commonHeaders);
//         expect(category.success).to.be.equal(true);
//         expect(category.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

});
