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
const server: string = 'http://localhost:3001';
const commonHeaders: any = {Authorization: ''};
before(async () => {
    const body: any = {
      email: 'abhjit@yopmail.com',
      password: 'abhijit123',
    };
    const users: any = await request(server).post('/api/auth/login').send(body);
    commonHeaders.Authorization = users.body.data.token;
});

describe('User module', () => {

  describe('"BrandController.listBrands()"', () => {
    it('should list of listBrands', async () => {
        const brands: any = await request(server).get('/api/brands').set(commonHeaders);
        expect(brands.body.success, 'success').to.be.equal(true);
        expect(brands.body.message).to.be.equal('Success');
        expect(brands.body.data).to.be.a('array');
        expect(brands.body.data[0]).to.be.a('object');
        expect(brands.body.data[0]).to.have.property('category_id');
        expect(brands.body.data[0]).to.have.property('name');
    });
  });

  describe('"BrandController.addBrand()"', () => {
    const body: Object = {
        name: 'Bosch2',
        image: 'https://pbs.twimg.com/profile_images/982153556072394754/pLH2Pw2M_400x400.jpg',
        category_id: ['5d3992aeaa4de9491eefcc06', '5d2c496974dee60c057faf61'],
        description: 'New Delhi: Chinese television man.',
    };
    it('should add brand in brand collection', async () => {
        const brand: any = await request(server).post('/api/brands').set(commonHeaders).send(body);
        try {
        expect(brand.body.success, 'success').to.be.equal(true);
        expect(brand.body.message).to.be.equal('Success');
        expect(brand.body.data).to.be.a('object');
        expect(brand.body.data).to.have.property('category_id');
        expect(brand.body.data).to.have.property('name');
        } catch (error) {
            throw new Error(brand.body.message);
        }
    });
  });

  describe('"BrandController.updateBrand()"', () => {
    const id: string = '5d3969f0c6fda536e59e96ed';
    const body: Object = {
        category_id: '5d224669ca5bec29abdf23ed',
        name: 'Honor',
    };
    it('should update brand fields', async () => {
        const brand: any = await request(server).put(`/api/brands/${id}`).set(commonHeaders).send(body);
        expect(brand.body.success, 'success').to.be.equal(true);
        expect(brand.body.message).to.be.equal('Success');
        expect(brand.body.data).to.be.a('object');
    });
  });

  describe('"BrandController.deleteBrand()"', () => {
    const id: string = '5d397f3a06ebef43fcc435ef';
    it('should delete brand', async () => {
        const cart: any = await request(server).delete(`/api/brands/${id}`).set(commonHeaders);
        expect(cart.body.success, 'success').to.be.equal(true);
        expect(cart.body.message).to.be.equal('Success');
        expect(cart.body.data).to.be.a('object');
    });
  });

});
