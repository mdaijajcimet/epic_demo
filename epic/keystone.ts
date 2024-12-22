/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import dotenv from 'dotenv'
dotenv.config()

import { config } from '@keystone-6/core'
import { lists } from './src/schema'

// import { rules } from './schemas/access'
// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { session, withAuth } from './auth'
import routes from './src/routes'
import { checkEnvVariables } from './src/utils'

const {
  S3_BUCKET_NAME: bucketName = 'keystone-test',
  S3_REGION: region = 'ap-southeast-2',
  S3_ACCESS_KEY_ID: accessKeyId = 'keystone',
  S3_SECRET_ACCESS_KEY: secretAccessKey = 'keystone',
  ASSET_BASE_URL: baseUrl = 'http://localhost:3232',
} = process.env

checkEnvVariables()

export default withAuth(
  config({
    server: {
      cors: {
        origin: [/localhost/],
      },
      maxFileSize: 10 * 1024 ** 2,
      extendExpressApp: (app, commonContext) => routes(app, commonContext),
    },
    // the db sets the database provider
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || 'postgresql://prisma:prisma@localhost:5432/epic?schema=public',
      prismaClientPath: 'node_modules/.prisma/client',
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    // ui: {
    //   // For our starter, we check that someone has session data before letting them see the Admin UI.
    //   isAccessAllowed: rules.canUseAdminUI,
    // },
    lists,
    ui: {
      /* Everyone who is signed in can access the Admin UI */
      isAccessAllowed: ({ session }) => !!session,
    },
    session,
    storage: {
      cimet_s3_media: {
        kind: 's3',
        type: 'file',
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        pathPrefix: 'media/',
        generateUrl: (path) => `${baseUrl}/` + path.split('/').slice(3).join('/'),
      },
    },
  }),
)
