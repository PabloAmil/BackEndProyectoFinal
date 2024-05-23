import { expect } from 'chai';
import supertest from "supertest";
import ProductsDAO from '../dao/mongoDbManagers/productsDbManager.js';

const requester = supertest("http://localhost:8080/");


describe('All fields are complete, jwt created succesfully, product is saved correctly', () => {

  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Log in, jwt auth passed', async function () {
    const result = await requester.post('api/sessions/login')
      .send({
        email: '1234@gmail.com',
        password: '1234'
      });

    expect(result.status).to.equal(200);
  })

  it('Product creation, all fields are complete, product is correctly stored in database', async function () {
    const result = await requester.post('api/products/new')
      .send({
        title: 'Test',
        description: 'Test',
        code: 'Test',
        price: '1234',
        status: 'Test',
        stock: '1234',
        category: 'Test',
      });
    expect(result.status).to.equal(200);
  });

  it ('Find a product, change a property, display it and delete it', async function() {

    

  })
});