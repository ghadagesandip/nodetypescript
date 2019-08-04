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

  describe('"cartcontroller.getCarts()"', () => {
    it('should list of products in cart', async () => {
        const cart: any = await request(server).get('/api/carts').set(commonHeaders);
        // console.log(cart.body);
        expect(cart.body.success, 'success').to.be.equal(true);
        expect(cart.body.message).to.be.equal('Success');
        expect(cart.body.data).to.be.a('array');
        expect(cart.body.data[0]).to.be.a('object');
        expect(cart.body.data[0]).to.have.property('product_id');
        expect(cart.body.data[0]).to.have.property('quantity');
    });
  });

  describe('"cartcontroller.addProductIntoCart()"', () => {
    const body: Object = {
        product_id: '5d2b2790c1a9972bdefcd29b',
        quantity: 1,
    };
    it('should add products in cart', async () => {
        const cart: any = await request(server).post('/api/carts').set(commonHeaders).send(body);
        // console.log(cart.body);
        expect(cart.body.success, 'success').to.be.equal(true);
        expect(cart.body.message).to.be.equal('Success');
        expect(cart.body.data).to.be.a('object');
        expect(cart.body.data).to.have.property('product_id');
        expect(cart.body.data).to.have.property('quantity');
    });
  });

  describe('"cartcontroller.updateCart()"', () => {
    const id: string = '5d34b26b4588c45a097946a5';
    const body: Object = {
        quantity: 1,
    };
    it('should update product quantity in cart', async () => {
        const cart: any = await request(server).put(`/api/carts/${id}`).set(commonHeaders).send(body);
        // console.log(cart.body);
        expect(cart.body.success, 'success').to.be.equal(true);
        expect(cart.body.message).to.be.equal('Success');
        expect(cart.body.data).to.be.a('array');
        expect(cart.body.data[0]).to.be.a('object');
        expect(cart.body.data[0]).to.have.property('product_id');
        expect(cart.body.data[0]).to.have.property('quantity');
    });
  });

  describe('"cartcontroller.deleteCartItem()"', () => {
    const id: string = '5d34b26b4588c45a097946a5';
    const body: Object = {
        product_id: '5d2b2790c1a9972bdefcd29b',
    };
    it('should delete product from cart', async () => {
        const cart: any = await request(server).delete(`/api/carts/${id}`).set(commonHeaders).send(body);
        // console.log(cart.body);
        expect(cart.body.success, 'success').to.be.equal(true);
        expect(cart.body.message).to.be.equal('Success');
        expect(cart.body.data).to.be.a('array');
        expect(cart.body.data[0]).to.be.a('object');
        expect(cart.body.data[0]).to.have.property('product_id');
        expect(cart.body.data[0]).to.have.property('quantity');
    });
  });

});
