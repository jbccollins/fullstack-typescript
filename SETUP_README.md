# react-node-fullstack-typescript

## Getting Started

### Prequisite Setup

Let's make sure we have some dependencies installed correctly

#### Dev Server
To run the dev server you will need `watchman`<sup>[1]</sup>

```bash
brew install watchman
```
#### Database
By default this project comes set up to work with [PostgreSQL](https://www.postgresql.org/) for any database stuff. If you don't care about having a database component to your project then skip this section
```bash
brew install postgresql
```

You will then need to run
```bash
brew services start postgresql
```
 once the installation is finished.

See the troubleshooting section if you have any issues

---

## Features
- [Absolute Paths](#absolute-paths) - Pretty import syntax
- [Hot Reloading](#hot-reloading) - Immediate feedback on changes 
- [React Router](https://reactrouter.com/) - Multi-page applications
- [Material-UI](https://material-ui.com/) - Layout and styling
- [Jest](https://jestjs.io/) - Testing
- [Redux Toolkit](https://redux-toolkit.js.org/) - Application state management
- [Axios](https://axios-http.com/) - HTTP client
- [Express](https://expressjs.com/) - Node.js server framework
- [React](https://reactjs.org/) - Front-end browser framework
- [TypeScript](https://www.typescriptlang.org/) - Type safe development
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Sequelize](https://sequelize.org/) - Type safe ORM for PostgreSQL
- [JSON Web Tokens](https://jwt.io/) - Network request security and authorization
- [Argon2](https://en.wikipedia.org/wiki/Argon2) - Password hashing



### Absolute Paths

This project is configured to allow imports using absolute paths in both the client and the server. Instead of importing `../../../../SomeComponent` we can import `@components/SomComponent`! At the moment Typescript does not support this feature out of the box for many use cases.<sup>[2]</sup> We use (slightly clunky) workarounds for this in both the client and the server but I think it's worth it in the end. You can, of course, continue to use relative imports if you so choose.

#### Client:
You must add new absolute paths to both the `paths` section in `client/tsconfig.base.json` and the `resolve: alias` section of `webpack.config.ts`

##### Server:
The server makes use of the [`module-alias`](https://github.com/ilearnio/module-alias) package. You must add new absolute paths to both the `paths` section in `server/tsconfig.json` and the `_moduleAliases` section in `package.json`.

There are plenty of examples to help you figure out how to use absolute paths and create new ones yourself :)

### Hot Reloading
The project uses [react-hot-loader](https://github.com/gaearon/react-hot-loader) to enable [hot module replacement](https://webpack.js.org/guides/hot-module-replacement/). This implementation may change in the future but if it does the functionality will remain the same.<sup>[3]</sup> If you would prefer to use [live reloading](https://stackoverflow.com/questions/41428954/what-is-the-difference-between-hot-reloading-and-live-reloading-in-react-native#:~:text=Live%20reloading%20reloads%20or%20refreshes%20the%20entire%20app%20when%20a%20file%20changes.&text=Hot%20reloading%20only%20refreshes%20the,the%20state%20of%20the%20app.) instead of hot reloading you can just remove the line `hot: IS_DEV` from `webpack.config.js`.

---

## Useful Notes
If you edit in Visual Studio Code and you change something in the tsconfig file you might need to `Cmd+Shift+P > Typescript: Restart TS Server` to clear some errors.

---

## Troubleshooting

### Database
If things aren't working after you've run
```bash
brew services start postgresql
```
then try running
```bash
psql
```
If you get an error like `psql: error: FATAL:  database "your_username" does not exist` then run
```bash
createdb your_username
```
and try running
```bash
psql
```
again. If you enter the `psql` shell then try running `\l` and check that you see the database you just created in that list. Run `\q` to exit the shell.

If you are looking for a pretty way to view what's in your database my preferred free PostgreSQL GUI is [Postico](https://eggerapps.at/postico/).

Postico should connect to the database you just created with `createdb` assuming you created it using the mac account username that was shown in the error message.

---

## References
1. `watchman` is a dependency for `ts-purify` which will clean our `dist` directory of any `dist/.js` files who's corresponding `src/.ts` files have been deleted.
Leaving these orphaned `.js` files in `dist` can cause issues at runtime. Typescript does not support this behaviour when running with the `--watch` flag at the moment :(
    See this issue: https://github.com/microsoft/TypeScript/issues/16057
    - This still leaves orphaned `.d.ts` files but those seem to not cause issues. These get cleaned when a production build is run by just doing `rm -rf dist/*`
2. nodejs cannot interpret paths that are defined in the tsconfig file. https://github.com/microsoft/TypeScript/issues/15479
3. The author of `react-hot-loader` reccomends removing it from your projects once [fast-refresh](https://github.com/facebook/react/issues/16604) is mature enough. I have tried to add fast refresh using a [plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin/) without success and I didn't want to fiddle too hard with something that is so new and likely to change.

---

## TODO:

- Clean .d.ts files from the dist directory for src/.ts files that have been deleted
    - Maybe fork ts-purify and let it purge based on extensions. Like purge unmatched .d.ts and .css files.
- Add https://github.com/shaketbaby/directory-named-webpack-plugin
- Ensure that the paths stuff works when importing a shared file from another shared file in the shared directory
- Ensure that importing .scss in a .tsx component works
- JWT stuff for security
- Database initialization for a clean environment
- Database import/export
- Publish to heroku
- Redux and redux dev tools
- Unit and integration tests for both client and server with mock DB or real clean db
- Setup bash script to install dependencies and configure project options like db or no db?
- Proper logging for DB and Server stuff
    - Including orm generated sql queries
- Add sass support
- Graphql?
- Pull route strings out into constants
- Fix relative import in User.test.tsx. See exclude in client/tsconfig.json and tsconfig-for-tests.json
    - Make `npm run test` work with absolute paths
- Figure out postgresql table and column naming conventions table_name vs TableName vs tableName
- Add linter to production build step. Fail the build if the linter throws.
- Reorganize db.ts and db.test.ts. Put them in the database directory
- Use .env file for DB credentials
- bodyParser is deprecated
- Figure out how to create, run and manage migrations
 - Sync db is not quite enough
- Add Google Analytics
- Add Log In with Google
- Add deploy to heroku: Lint => Test => Build => Publish
- Switch user createdAt and updatedAt from Date to DateTime
- Add a way to rollback heroku to a specific commit or and the last deployed commit
    - Maybe even add a deploy log dashboard where this can be done visually?
- Constant strings
 - UNDEFINED = 'undefined' (used in resolvers/user.ts)
 - Add a cli script in package.json that will automatically add absolute paths for you for both the server and the client
    - yarn run create-abs-path --server --client @database database/*
- Move graphql stuff to it's own directory
    - Audit the absolute import situation for this stuff
- Ensure that type-orm and sequelize can create timestampz Date() types for createdAt and updatedAt
- Make the db sync alter flag configurable
 - Add a package.json script to force a sync
- Audit the mikroorm naming strategy. It may be easy to use column_name in postgres and columnName in ts
- Audit the mikroorm migration config: https://mikro-orm.io/docs/migrations/#configuration
- See if it's possible to set the baseUrl to './src/server' for the root level mikro orm tsconfig to avoid having to 
duplicate the paths there
    - Add the paths documentation for this config if this can't be solved :/
- Move to the latest Node version
- Storybook?
- Add brew install redis to the setup
 - Add redis as a marquee feature to the main readme
 - add `redis-server` to the run script. kill on quit if possible.
- Move to yarn from npm
- SASS global themeing?
 - What is tailwind css?
- Figma frame? https://www.youtube.com/watch?v=1PBNAoKd-70
- Add port conflict resolution from old starter kit
- Ensure that whoever clones this repo knows to copy/pase the graphql-settings.json content into the graphql playground settings tab
 - Or figure out a way to set those settings programatically
- Flesh out authorization for graphql endpoints
    - Add roles like admin and owner
    - Add the ability for an admin/owner to impersonate users with lower roles
    - Protect destructive actions for admin roles
    - Allow admins to create users with a temp password that requires them to reset it on first log in
    - Add a way for admins to invalidate passwords in general
    - Add a way for admins to "delete" users using a "deleted" column
    - Make user first and last names private. When users are deleted have the getFullName field return "[deleted]"
    - Allow users to share their name or just their username
    - Add a timeout to a user session. Log them out after a period of inactivity.
- Protect from graphql spam (see the ben awad graphql playlist on cost)
- Add websocket support and examples (https://www.npmjs.com/package/graphql-ws)
- Add documentation about formik and yup. See Register.tsx
- Add yup validation to the shared folder and use it both client and server side
- Format files on save using eslint rules
- Document the usage of the gen script for graphql
- ~~See if generics can be used in BaseEntity to allow for extensions like User to have static ORM functions like User.Create()~~
    - I don't think this is a good idea actually. A factory is probably better.
- Soft deletion using ORM
- Investigate server side rendering
- Add Nodemailer as a feature
- ~~Hot reload react components instead of live reloading the whole page~~
- ~~Add linting for server, client and shared. Enforce common standards, that are opt in of course~~

VIDEO
- SSR Stuff starts around 4:00. Talks about how to handle stuff like urql.
DEBUGGING STEPS
1. Is node installed and is it the correct version? Check nvm. `nvm list` and `nvm use 12.16.1`
2. Is redis installed and running? `redis-server /usr/local/etc/redis.conf`
3. Is postgres installed and running? `brew services start postgresql`
 - If your computer crashed postgresql might be in a hung state on restart. Stop postgres and follow the steps [here](https://superuser.com/questions/553045/fatal-lock-file-postmaster-pid-already-exists) to correctly kill the hung process and then run the start command again.
4. Are ts-node and typescript installed globally?
 - `npm install -g typescript`
 - `npm install -g ts-node`
USEFULL TOOLS
1. Postico
2. [Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
3. [urql Devtools](https://chrome.google.com/webstore/detail/urql-devtools/mcfphkbpmkbeofnkjehahlmidmceblmm?hl=en-US)
