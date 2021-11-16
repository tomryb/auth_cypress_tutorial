const Guid = require('guid');

describe('user/register', () => {
  const registerEndpoint = 'http://localhost:3000/api/user/register';

  it('returns 400 with no body', () => {
    cy.request({
      method: 'POST',
      url: registerEndpoint,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('doesnt allow user create with bad user body', () => {
    let badTestUserBody = {
      name: '1',
      email: 'test',
      password: '1',
    };
    cy.request({
      method: 'POST',
      url: registerEndpoint,
      failOnStatusCode: false,
      body: badTestUserBody,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('doesnt allow user create with bad email', () => {
    let badTestUserBody = {
      name: 'ValidName',
      email: 'invalidMail',
      password: 'ValidPassword',
    };
    cy.request({
      method: 'POST',
      url: registerEndpoint,
      failOnStatusCode: false,
      body: badTestUserBody,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.eq('"email" must be a valid email');
    });
  });

  it(' create user with valid body', () => {
    let dynamicEmail = Guid.raw() + '@test.com';
    let body = {
      name: 'tomaszTest',
      email: dynamicEmail,
      password: 'test123456',
    };
    cy.request('POST', registerEndpoint, body).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq('tomaszTest');
      expect(response.body.email).to.eq(dynamicEmail);
      expect(response.body.password).to.not.eq('test123456');
    });
  });
  it('cant create duplicate user', () => {
    let goodTestBody = {
      name: 'ValidName',
      email: 'email@email.com',
      password: 'ValidPassword',
    };
    cy.request({
      method: 'POST',
      url: registerEndpoint,
      failOnStatusCode: false,
      body: goodTestBody,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.eq('Email already registered');
    });
  });
});
