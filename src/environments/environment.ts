// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyD1oJNWyC09Ct4067-o4nGjBW4t6GiyATU',
    authDomain: 'ux-workflow.firebaseapp.com',
    databaseURL: 'https://ux-workflow.firebaseio.com',
    projectId: 'ux-workflow',
    storageBucket: 'ux-workflow.appspot.com',
    messagingSenderId: '858952932517'
  }
};
