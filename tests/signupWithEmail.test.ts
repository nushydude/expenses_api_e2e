import { gql } from "graphql-request";
import faker from "faker";
import { createAnonymousGraphQLClient } from "../utils/createAnonymousGraphQLClient";
import { generateUniqueEmail } from "../utils/generateUniqueEmail";

const mutation = gql`
  mutation SignUpWithEmail($input: SignUpWithEmailInput!) {
    result: signUpWithEmail(input: $input) {
      created
      jwt
      error {
        code
        message
      }
    }
  }
`;

test("it returns an error for invalid email", async () => {
  const graphqlClient = createAnonymousGraphQLClient();

  const response = await graphqlClient.request(mutation, {
    input: {
      email: "not_an_email",
      password: faker.internet.password(),
      name: `${faker.name.firstName} ${faker.name.lastName}`,
      requiresVerification: false
    }
  });

  expect(response).toStrictEqual({
    result: {
      created: false,
      jwt: null,
      error: {
        code: 21000,
        message: expect.any(String)
      }
    }
  });
});

test("it returns an error if the password is too short", async () => {
  const graphqlClient = createAnonymousGraphQLClient();

  const response = await graphqlClient.request(mutation, {
    input: {
      email: generateUniqueEmail(),
      password: "123",
      name: `${faker.name.firstName} ${faker.name.lastName}`,
      requiresVerification: false
    }
  });

  expect(response).toStrictEqual({
    result: {
      created: false,
      jwt: null,
      error: {
        code: 21100,
        message: expect.any(String)
      }
    }
  });
});

test("it returns an error if the email already exists", async () => {
  const graphqlClient = createAnonymousGraphQLClient();

  const input = {
    email: generateUniqueEmail(),
    password: faker.internet.password(),
    name: `${faker.name.firstName} ${faker.name.lastName}`,
    requiresVerification: false
  };

  const response1 = await graphqlClient.request(mutation, { input });

  expect(response1).toStrictEqual({
    result: {
      created: true,
      jwt: expect.any(String),
      error: null
    }
  });

  const response2 = await graphqlClient.request(mutation, { input });

  expect(response2).toStrictEqual({
    result: {
      created: false,
      jwt: null,
      error: {
        code: 20000,
        message: expect.any(String)
      }
    }
  });
});

test("it correctly signs up a new user", async () => {
  const graphqlClient = createAnonymousGraphQLClient();

  const response = await graphqlClient.request(mutation, {
    input: {
      email: generateUniqueEmail(),
      password: faker.internet.password(),
      name: `${faker.name.firstName} ${faker.name.lastName}`,
      requiresVerification: false
    }
  });

  expect(response).toStrictEqual({
    result: {
      created: true,
      jwt: expect.any(String),
      error: null
    }
  });
});
