// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const host = location.host.split(':')[0];
export const environment = {
  production: false,
  apiUrl: 'http://18.219.16.50:4000/',
  imgUrl: 'http://18.219.16.50:4000/upload/',
  socketUrl: 'http://18.219.16.50:4000',
  // socketUrl: 'http://192.168.100.36:4000',
  // apiUrl: 'http://192.168.100.36:4000/',
  // imgUrl: 'http://192.168.100.32:4000/upload/',
  google_api_key: 'AIzaSyBpm9w9TINRaRqoSi8yriMMZwtcBaPkukM',
};
