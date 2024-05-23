import { expect } from 'chai';
import supertest from "supertest";

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

  it ('Get all dummy carts', async function() {
    const result = await requester.get('/api/carts/');
    expect(result.status).to.equal(200);
  })

  it ('Check that only admin can delete carts', async function () {
    const result = await requester.post('/api/carts/664e5174ae8354b494505be8')
    expect(result.status).to.equal(200)
  })
});