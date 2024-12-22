/*
Welcome to the auth file! Here we have put a config to do basic auth in Keystone.

`createAuth` is an implementation for an email-password login out of the box.
`statelessSessions` is a base implementation of session logic.

For more on auth, check out: https://keystonejs.com/docs/apis/auth#authentication-api
*/

import { createAuth } from '@keystone-6/auth'
// See https://keystonejs.com/docs/apis/session#session-api for the session docs
import { statelessSessions } from '@keystone-6/core/session'
import keys from 'lodash/keys'
import values from 'lodash/values'

import { ACCESS_MODULE_MAP, BASIC_PERMISSION_OPTIONS_MAP } from './src/config/access'
import { SUPER_ROLE_NAME } from './src/constants/access'
import type { AccessModules, BasicPermissionsKey } from './src/types/access'

let sessionSecret = process.env.SESSION_SECRET

// Here is a best practice! It's fine to not have provided a session secret in dev,
// however it should always be there in production.
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The SESSION_SECRET environment variable must be set in production')
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --'
  }
}

type BasicPermissionVal = (typeof BASIC_PERMISSION_OPTIONS_MAP)[BasicPermissionsKey]['value']
// Here we define how auth relates to our schemas.
// What we are saying here is that we want to use the list `User`, and to log in
// we will need their email and password.
const permissionData = values(ACCESS_MODULE_MAP).reduce(
  (acc, curr) => ({
    ...acc,
    ...values(curr.modules).reduce(
      (tableAcc, currTable) => ({
        ...tableAcc,
        [currTable]: values(BASIC_PERMISSION_OPTIONS_MAP).map((item) => item.value),
      }),
      {},
    ),
  }),
  {} as Record<AccessModules, BasicPermissionVal[]>,
)
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    // If there are no items in the database, keystone will ask you to create
    // a new user, filling in these fields.
    fields: ['name', 'email', 'password'],
    itemData: {
      /*
        This creates a related role with full permissions, so that when the first user signs in
        they have complete access to the system (without this, you couldn't do anything)
      */
      roles: {
        create: {
          name: SUPER_ROLE_NAME,
          ...permissionData,
        },
      },
    },
    skipKeystoneWelcome: true,
  },
  /* This loads the related role for the current user, including all permissions */
  sessionData: `
    id
    name
    assignedDomains {
      id
    }
    roles {
      id
      name
      ${keys(permissionData).join()}
    }`,
})

// This defines how long people will remain logged in for.
// This will get refreshed when they log back in.
const sessionMaxAge = 60 * 60 * 24 * 30 // 30 days

// This defines how sessions should work. For more details, check out: https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
})

export { session, withAuth }
