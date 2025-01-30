import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

const uri = 'https://api.escuelajs.co/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  provideHttpClient(),
  provideApollo(() => {
    const httpLink = new HttpLink(inject(HttpClient));
    return {
      link: httpLink.create({ uri }),
      cache: new InMemoryCache(),
    };
  }),
];
