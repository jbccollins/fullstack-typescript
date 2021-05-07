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

If you are looking for a pretty way to view what's in your database my preferred free PostgreSQL GUI is [Postico](https://eggerapps.at/postico/).

---

## Features
- [Absolute Paths](#absolute-paths)
- [Hot Reloading](#hot-reloading)

### Absolute Paths

This project is configured to allow imports using absolute paths in both the client and the server. Instead of importing `../../../../SomeComponent` we can import `@components/SomComponent`! At the moment Typescript does not support this feature out of the box for many use cases.<sup>[2]</sup> We use (slightly clunky) workarounds for this in both the client and the server but I think it's worth it in the end. You can, of course, continue to use relative imports if you so choose.

#### Client:
You must add new absolute paths to both the `paths` section in `client/tsconfig.json` and the `resolve : alias` section of `webpack.config.ts`

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
1. ~~Hot reload react components instead of live reloading the whole page~~
2. Clean .d.ts files from the dist directory for src/.ts files that have been deleted
    - Maybe fork ts-purify and let it purge based on extensions. Like purge unmatched .d.ts and .css files.
3. Add https://github.com/shaketbaby/directory-named-webpack-plugin
4. Ensure that the paths stuff works when importing a shared file from another shared file in the shared directory
5. Ensure that importing .scss in a .tsx component works
6. JWT stuff for security
7. Database initialization for a clean environment
8. Database import/export
9. Publish to heroku
10. Redux and redux dev tools
11. Add a linter
12. Unit and integration tests for both client and server with mock DB or real clean db
13. Setup bash script to install dependencies and configure project options like db or no db?
14. Proper logging for DB and Server stuff
15. Add sass support
16. Graphql?
17. Add linting for server, client and shared. Enforce common standards, that are opt in of course
18. Pull route strings out into constants
