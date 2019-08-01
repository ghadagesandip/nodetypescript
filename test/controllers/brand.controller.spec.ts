import { assert, expect } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';
dotenv.config({
    path: '.env.test',
});

// const server: string = 'http://localhost:3000';
// const commonHeaders: Object = { 'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMWNiMTZlY2NhMmI5Njg1MzZhYTUyYyIsImlhdCI6MTU2NDU1MjQ1OSwiZXhwIjoxNTY0NjM4ODU5fQ.IvaWKD-Db57fQAHAKNW-Udk3Jd6eNP8b40NeNOQJECo` };

// describe('Brand module', () => {
//     describe('"brandcontroller.listBrands()"', () => {
//       it('should list brands', async () => {
//         try {
//           const brands: any = await request(server).get('/api/brands').set(commonHeaders);
//           brands.should.be.a('object[]');
//           expect(brands).to.be.equal(Boolean);
//           expect(brands.message).to.be.equal('Success');
//         } catch (err) {
//           expect(err).to.be.equal(err);
//         }
//       });
//     });
//   });

// describe('Brand module', function () {
//     describe('brandcontroller.listBrands()', async () => {
//         it('should return object', async (done) => {
//             http.get('http://127.0.0.1:3000/api/brands', function (response) {
//                 assert.equal(response.statusCode, 200);
//                 var body = '';
//                 response.on('data', function (d) {
//                     body += d;
//                 });
//                 response.on('end', function () {
//                     assert.equal(body, typeof(Object));
//                     done();
//                 });
//             });
//         });
//     });
// });

// describe('/GET book', () => {
//     it('it should GET all the books', (done) => {
//       http.get('http://127.0.0.1:3000/api/brands')
//           .end((res: any) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('array');
//                 res.body.length.should.be.eql(0);
//                 done();
//           });
//     });
// });
