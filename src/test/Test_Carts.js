import { expect } from 'chai';
import supertest from "supertest";
import cartService from '../repositories/cartsRepository.js';

const requester = supertest("http://localhost:8080/");

describe('Carts creation, permissions', () => {

  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Log in as Admin', async function () {

    const login = await requester.post('login')
      .send({
        email: '123@gmail.com',
        password: '123'
      });
    expect(login.status).to.equal(200);
  });

  it('Only an Admin can create dummy cart for testing', async function () {
    const result = await requester.get('api/carts/new')
    console.log(result.body)
    expect(result).to.be.an('object');
  })




});