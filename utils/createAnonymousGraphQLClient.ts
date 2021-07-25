import { ENDPOINT } from "./../consts";
import { GraphQLClient } from "graphql-request";

export function createAnonymousGraphQLClient(): GraphQLClient {
  return new GraphQLClient(ENDPOINT, {
    headers: {
      "x-app-id": "E2E_TEST"
    }
  });
}
