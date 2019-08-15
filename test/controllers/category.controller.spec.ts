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
before(async () => {
    const body: any = {
      email: 'sandip@yopmail.com',
      password: 'sandip123',
    };
    const users: any = await request(server).post('/api/auth/login').send(body);
    commonHeaders.Authorization = users.body.data.token;
});

describe('User module', () => {

  describe('"categorycontroller.listCategories()"', () => {
    it('should list categories', async () => {
        const category: any = await request(server).get('/api/categories').set(commonHeaders);
        // console.log(category.body);
        expect(category.body.success, 'success').to.be.equal(true);
        expect(category.body.message).to.be.equal('Success');
        expect(category.body.data).to.be.a('array');
        expect(category.body.data[0]).to.be.a('object');
        expect(category.body.data[0]).to.have.property('name');
        expect(category.body.data[0]).to.have.property('slug');
    });
  });

  describe('"categorycontroller.getHomeList()"', () => {
    it('should list category dashboard-products', async () => {
        const category: any = await request(server).get('/api/categories/dashboard-products');
        // console.log(category.body);
        expect(category.body.success, 'success').to.be.equal(true);
        expect(category.body.message).to.be.equal('Success');
        expect(category.body.data).to.be.a('array');
        expect(category.body.data[0]).to.be.a('object');
        expect(category.body.data[0]).to.have.property('name');
        expect(category.body.data[0]).to.have.property('slug');
    });
  });

  describe('"categorycontroller.getHomeList()"', () => {
    const id: string = '5d224669ca5bec29abdf23ed';
    it('should list category dashboard-products', async () => {
        const category: any = await request(server).get(`/api/categories/${id}/brand-count`);
        // console.log(category.body);
        expect(category.body.success, 'success').to.be.equal(true);
        expect(category.body.message).to.be.equal('Success');
        expect(category.body.data).to.be.a('array');
        expect(category.body.data[0]).to.be.a('object');
        expect(category.body.data[0]).to.have.property('brand_name');
        expect(category.body.data[0]).to.have.property('product_count');
    });
  });

  describe('"categorycontroller.getCategory()"', () => {
    const id: string = '5d224669ca5bec29abdf23ed';
    it('should return a category by id', async () => {
        const category: any = await request(server).get(`/api/categories/${id}`).set(commonHeaders);
        // console.log(category.body);
        expect(category.body.success, 'success').to.be.equal(true);
        expect(category.body.message).to.be.equal('Success');
        expect(category.body.data).to.be.a('object');
        expect(category.body.data).to.have.property('name');
        expect(category.body.data).to.have.property('slug');
    });
  });

  describe('"categorycontroller.updateCategory()"', () => {
    const id: string = '5d3992aeaa4de9491eefcc06';
    const body: Object = {
        name: 'Televisions',
        slug: 'televisions',
    };
    it('should return a category by id', async () => {
        const category: any = await request(server).put(`/api/categories/${id}`).set(commonHeaders).send(body);
        // console.log(category.body);
        expect(category.body.success, 'success').to.be.equal(true);
        expect(category.body.message).to.be.equal('Success');
        expect(category.body.data).to.be.a('object');
        expect(category.body.data).to.have.property('name');
        expect(category.body.data).to.have.property('slug');
    });
  });

//   describe('"categorycontroller.deleteCategory()"', () => {
//     const id: string = '5d38a172531e9a00048089d4';
//     it('should return a category by id', async () => {
//        const category: any = await request(server).delete(`/api/categories/${id}`).set(commonHeaders);
//        // console.log(category.body);
//        expect(category.body.success, 'success').to.be.equal(true);
//        expect(category.body.message).to.be.equal('Success');
//        expect(category.body.data).to.be.a('object');
//        expect(category.body.data).to.have.property('name');
//        expect(category.body.data).to.have.property('slug');
//     });
//   });

});
