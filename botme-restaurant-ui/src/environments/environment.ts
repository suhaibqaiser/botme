// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiRestaurantUrl: "http://localhost:3100",
  botMeClientAPI: "http://localhost:3000",
  wsEndpoint: "ws://localhost:6380",
  restaurantId: 'DM-1',
  orderType: 'guest',
  datadog: {
    applicationId: '91a121d0-0deb-4fa7-aa88-8beef5945124',
    clientToken: 'pub1c31558c898012c4b17bb8165d3a63b8',
    site: 'datadoghq.com',
    service: 'restaurant-ui',
    env: 'development',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


// export const environment = {
//   production: false,
//   apiRestaurantUrl: "https://api.gofindmenu.com/restaurant",
//   wsEndpoint: "ws://localhost:6380",
//   botMeClientAPI: "https://api.gofindmenu.com/client",
// };
