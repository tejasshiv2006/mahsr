/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/journey-tracking`; params?: Router.UnknownInputParams; } | { pathname: `/seat-selection`; params?: Router.UnknownInputParams; } | { pathname: `/ticket`; params?: Router.UnknownInputParams; } | { pathname: `/train-details`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/search` | `/search`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/tickets` | `/tickets`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/journey-tracking`; params?: Router.UnknownOutputParams; } | { pathname: `/seat-selection`; params?: Router.UnknownOutputParams; } | { pathname: `/ticket`; params?: Router.UnknownOutputParams; } | { pathname: `/train-details`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/search` | `/search`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/tickets` | `/tickets`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/journey-tracking${`?${string}` | `#${string}` | ''}` | `/seat-selection${`?${string}` | `#${string}` | ''}` | `/ticket${`?${string}` | `#${string}` | ''}` | `/train-details${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/search${`?${string}` | `#${string}` | ''}` | `/search${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/tickets${`?${string}` | `#${string}` | ''}` | `/tickets${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString | Router.ExternalPathString | `/` | `/journey-tracking` | `/seat-selection` | `/ticket` | `/train-details` | `/_sitemap` | `${'/(tabs)'}/search` | `/search` | `${'/(tabs)'}/tickets` | `/tickets`; params?: Router.UnknownInputParams; };
    }
  }
}
