# Keystone update

[reference](https://github.com/keystonejs/keystone/releases)


## To explore:

1. [Reusability](https://github.com/keystonejs/keystone/pull/8837). Specifically, `TypeInfo`.
2. [Separate operation based hooks for cleaner code](https://github.com/keystonejs/keystone/pull/8826).
   Sample Usage:
   `js
   hooks: {
     beforeOperation: {
       create: (args) => {}
       update: (args) => {}
       delete: (args) => {}
     }
   }
`
3. Use nested inline create since card ui + create has been fixed
4. Apply migrations on-demand using `keystone migrate apply
`
5. Resolve coflicts in migrations instead of DB reset using `keystone prisma migrate resolve`
6. Transactions for better DB migration

### References:

[prisma server commands](https://github.com/keystonejs/keystone/pull/9103#issue-2252038699)

## Changes & checks

### Sep 19, 2023 update

- check id filter in custom fields. ✅
- check/add timestamp description - not needed for now

### Sep 27, 2023 update-

- check code for validateInput hooks for update. type fixed. -✅
- use existing readOnly & fix type for `registerAuditLog` -✅
- fix import for type FieldHooks ✅

### Apr 02, 2024 update-

- update all validateInput hooks to validate for lists. typedefs have been deprecated for fields too, but, functionality is not updated yet. ✅

### Apr 16, 2024 update

#### Breaking changes [[Reference](https://github.com/keystonejs/keystone/releases/tag/2024-04-16)]

- replace removed typedefs ✅
- gqlNames have been removed(needs update in all custom fields & Copy). Temporarily use `context.__internal.lists[listKey].graphql.names` - not needed for now
- try `KeystoneConfig['lists']` ✅
- remove `cofig.db.useMigrations` and add `--with-migrations` to `keystone start` ✅
- check if `keystone dev --no-db-push` works instead of `keystone prisma migrate dev && keystone dev --no-db-push` ✅
- check if we need to add `keystone build/keystone dev` before `keystone prisma...`. Keystone now prevents running of prisma commands before yarn dev/build. Since, migration won't be created on first yarn dev, find alternative.
- added default status route since health check is removed ✅
- added `fp-ts` package as direct dependency until peer dependency for fields-document is fixed by keystoneJS ✅
- added `dotenv` as direct dependency since its removed from KS ✅
- replaced uuid with nanoid for JSONtable, since uuid removed in other places ✅
- update ID field for custom field views ✅
- check if error toast need to be added anywhere since primsa errors are now shown is console instead of UI ✅
