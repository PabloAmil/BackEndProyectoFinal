import { expect } from 'chai';
import supertest from "supertest";
import cartService from '../repositories/cartsRepository.js';

const requester = supertest("http://localhost:8080/");

describe('Carts creation, permissions', () => {

  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Admin credentials grant permission to create a Dummy Cart', async function () {

    const result = await requester.get('api/cars/new')
      .send({
        email:'Test@gmail.com',
        password: '1234'
      });
    expect(result.status).to.equal(200);
  });

  after('User log out', async function () {
    const result = await requester.get('/api/sessions/logout/') 
    expect(result.status).to.equal(200);
  })

});