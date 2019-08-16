import { expect, should } from 'chai';
import * as dotenv from 'dotenv';
import * as request from 'supertest';

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
  describe('"usercontroller.getUsers()"', () => {
    it('should list users', async () => {
      const users: any = await request(server).get('/api/users').set(commonHeaders);
      expect(users.body.success, 'success').to.be.equal(true);
      expect(users.body.message).to.be.equal('Success');
      expect(users.body.data).to.be.a('array');
      expect(users.body.data[0]).to.be.a('object');
      expect(users.body.data[0]).to.have.property('userRole');
      expect(users.body.data[0]).to.have.property('email');
      expect(users.body.data[0]).to.have.property('first_name');
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

  describe('"usercontroller.updateUser()"', () => {
    const id: string = '5d1cb16ecca2b968536aa52c';
    const body: any = {
      email: 'sandip@yopmail.com',
      password: 'sandipg123',
      first_name: 'Sandip',
      last_name: 'Ghadge',
    };
    it('should update a user', async () => {
      const users: any = await request(server).put(`/api/users/${id}`).set(commonHeaders).send(body);
      expect(users.body.success, 'success').to.be.equal(true);
      expect(users.body.message).to.be.equal('Success');
      expect(users.body.data).to.be.a('object');
      expect(users.body.data).to.have.property('userRole');
      expect(users.body.data).to.have.property('email');
      expect(users.body.data).to.have.property('first_name');
    });
  });

  // describe('"usercontroller.deleteUser()"', () => {
  //   const id: string = '5d1cb16ecca2b968536aa52c';
  //   const body: any = {
  //     email: 'sandip@yopmail.com',
  //     password: 'sandipg123',
  //   };
  //   it('should delete a user', async () => {
  //     const users: any = await request(server).delete(`/api/users/${id}`).set(commonHeaders).send(body);
  //     expect(users.body.success, 'success').to.be.equal(true);
  //     expect(users.body.message).to.be.equal('Success');
  //     expect(users.body.data).to.be.a('object');
  //     expect(users.body.data).to.have.property('userRole');
  //     expect(users.body.data).to.have.property('email');
  //     expect(users.body.data).to.have.property('first_name');
  //   });
  // });
});
