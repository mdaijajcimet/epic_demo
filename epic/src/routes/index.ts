/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import { type Express } from 'express'

import { getTableData } from '../api/common'

import { exportData, exportMirn, exportPages, exportTariffCodes } from '../api/export'
import { importData, mirnPresignUrl, importPages, importSolarData, importTariffCodes } from '../api/import'

import { deleteMirn } from '../api/deleteMirn'
import { publishOpenEnergyRules } from '../api/publishOEBillRules'
import { PUBLISH_OPEN_ENERGY_RULES } from '../constants/routesNames'

const routes = (app: Express, commonContext: KeystoneContext<BaseKeystoneTypeInfo>) => {
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.get('/status', async (req, res) => {
    res.status(200).json({ status: 'up' })
  })
  app.post('/api/import-solar', fileUpload(), (req, res) => {
    importSolarData(req, res, commonContext)
  })
  app.post('/api/import-data', fileUpload(), (req, res) => {
    importData(req, res, commonContext)
  })
  app.post('/api/export-data', fileUpload(), (req, res) => {
    exportData(req, res, commonContext)
  })
  app.post('/api/import-pages', fileUpload(), (req, res) => {
    importPages(req, res, commonContext)
  })
  app.post('/api/export-pages', fileUpload(), (req, res) => {
    exportPages(req, res, commonContext)
  })

  app.post('/api/table-data', (req, res) => {
    getTableData(req, res, commonContext)
  })
  app.post('/api/import-tariff-codes', fileUpload(), (req, res) => {
    importTariffCodes(req, res, commonContext)
  })
  app.post('/api/get-presign-mirn-url', (req, res) => {
    mirnPresignUrl(req, res, commonContext)
  })
  app.post('/api/export-mirn', (req, res) => {
    exportMirn(req, res)
  })

  app.post('/api/delete-mirn', (req, res) => {
    deleteMirn(req, res, commonContext)
  })

  app.post('/api/export-tariff-codes', fileUpload(), (req, res) => {
    exportTariffCodes(req, res, commonContext)
  })

  app.post(PUBLISH_OPEN_ENERGY_RULES, (req, res) => publishOpenEnergyRules(req, res, commonContext))
}

export default routes
