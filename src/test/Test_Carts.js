import { expect } from 'chai';
import supertest from 'supertest';
import cartService from '../repositories/cartsRepository.js';
import jwt from 'jsonwebtoken';
import userService from '../repositories/usersRepository.js';
import chaiHttp from 'chai-http';
import config from '../config/config.js';


const requester = supertest("http://localhost:8080/");

const testConfig = {
  jwt_secret: process.env.JWT_SECRET,
  dbConnectionString: 'mongodb://localhost:27017/ecommerce', 
};

describe('Carts creation, permissions', () => {
  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Log in as Admin', async function () {
    
    const loginResponse = await requester.post('api/sessions/login')
    .send({
      email: '123@gmail.com',
      password: '123'
    });
  
  const cookies = loginResponse.headers['set-cookie'];
  console.log(cookies); 

  });

  it('should return status 200 and a dummy cart object', async () => {
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
});

