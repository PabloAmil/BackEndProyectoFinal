import { expect } from 'chai';
import { request } from 'express';
import supertest from "supertest";

const requester = supertest("http://localhost:8080/");

describe('Testing user register, cart creation, password hashing', () => {

  beforeEach(function () {
    this.timeout = 5000;
  });

  it('Testing user register, cart creation and password hashing', async function() {
    const result = await requester.post('api/sessions/register')
      .send({
        first_name: 'Test',
        last_name: 'Test',
        age: '1',
        email: 'Test@gmail.com',
        password: '1234'
      });
    expect(result.status).to.equal(200);
  });

  it ('Already registered user cannot be registered again' , async function() {
    const result = await requester.post('api/sessions/register')
      .send({
        first_name: 'Test',
        last_name: 'Test',
        age: '1',
        email: 'Test@gmail.com',
        password: '1234'
      });
    expect(result.status).to.equal(400);
  });

  it ('Incomplete fields while trying to register' , async function() {
    const result = await requester.post('api/sessions/register')
      .send({
        first_name: '',
        last_name: 'Test',
        age: '1',
        email: 'Test@gmail.com',
        password: '1234'
      });
    expect(result.status).to.equal(400);
  })

  it ('Log in/user existence, fields are complete, decypting encrypted password', async function() {
    const result = await requester.post('api/sessions/login')
      .send({
        email:'Test@gmail.com',
        password: '1234'
      });
    expect(result.status).to.equal(200);
  })
});


