import AddonFeature from './AddonFeature'
import Battery from './Battery'
import BundleFeature from './BundleFeature'
import Installer from './Installer'
import Inverter from './Inverter'
import Manufacturer from './Manufacturer'
import SolarBundle from './SolarBundle'
import SolarAddon from './SolarAddon'
import SolarAffiliate from './SolarAffiliate'
import SolarPanel from './SolarPanel'
import InstallerAddon from './InstallerAddon'
import StateWiseRebate from './StateWiseRebate'

export default {
  AddonFeature,
  Battery,
  Manufacturer,
  ...Installer,
  Inverter,
  SolarBundle,
  SolarAddon,
  SolarAffiliate,
  SolarPanel,
  BundleFeature,
  InstallerAddon,
  StateWiseRebate,
}
