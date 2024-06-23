import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest(process.env.SERVER_URL);

const testConfig = {
  jwt_secret: process.env.JWT_SECRET,
  dbConnectionString: 'mongodb+srv://pabloamil91:UV3JvqPcG41yKbnu@cluster0.ea2y0wr.mongodb.net/?retryWrites=true&w=majority',
};

describe('Carts creation, permissions', () => {
  beforeEach(function () {
    this.timeout = 5000;
  });

  it('gets all carts created', async () => {
    const createdCarts = await requester.get('api/carts/')
    console.log(createdCarts.body);

    const oldDummyCart = createdCarts.body[createdCarts.body.length - 1]._id;
    console.log(oldDummyCart);

    expect(createdCarts.body).to.be.an('array');
  })


  it('Log in as Admin and create dummy cart for testing', async () => {
    const loginResponse = await requester.post('api/sessions/login')
      .send({
        email: '123@gmail.com',
        password: '123'
      });

    const cookies = loginResponse.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));

    if (jwtCookie) {
      const res = await requester
        .get('api/carts/new')
        .set('Cookie', jwtCookie)
        .expect(200);

      expect(res.body).to.be.an('object');
      console.log(res.body);
    } else {
      console.error('JWT cookie not found in login response');
    }
  });

  it('Logs in, Gets a dummy cart, adds a product, finally empties the cart', async () => {

    const loginResponse = await requester.post('api/sessions/login')
      .send({
        email: '123@gmail.com',
        password: '123'
      });

    const cookies = loginResponse.headers['set-cookie'];
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));

    if (jwtCookie) {
      const carts = await requester
        .get('api/carts/')
        .set('Cookie', jwtCookie)
        .expect(200);

      const cartId = carts.body[carts.body.length - 1]._id;
      const productId = '667605556cf9036ea03bd45f';

      const addProduct = await requester
        .post(`api/carts/${cartId}/addProduct/${productId}`)
        .set('Cookie', jwtCookie)
        .expect(200);

      const productDeletion = await requester
        .delete(`api/carts/${cartId}`)

      expect(productDeletion.status).to.equal(200);

    } else {
      console.error('JWT cookie not found in login response');
    }
  });
});

