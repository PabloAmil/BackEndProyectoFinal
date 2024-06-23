import { expect } from 'chai';
import supertest from "supertest";

const requester = supertest(process.env.SERVER_URL);

describe('All fields are complete, jwt created succesfully, product is saved correctly', () => {

  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Log in first to create product', async function () {
    const result = await requester.post('api/sessions/login')
      .send({
        email: '123@gmail.com',
        password: '123'
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

  it ('Reject product creation if user is not loged in', async function() {
    const result = await requester.get('api/products/new');
    expect(result.status).to.equal(401);
  })
});