export const ACCESS_MODULE_MAP = {
  access: {
    groupLabel: 'Access',
    modules: {
      role: 'role',
      user: 'user',
    } as const,
  },
  verticals: {
    groupLabel: 'Verticals',
    modules: {
      creditCards: 'creditCards',
      generic: 'generic',
      healthInsurance: 'healthInsurance',
      solar: 'solar',
      personalLoan: 'personalLoan',
      broadband: 'broadband',
      mobile: 'mobile',
      energy: 'energy',
      bundle: 'bundle',
    } as const,
  },
  admin: {
    groupLabel: 'Admin',
    modules: {
      affiliate: 'affiliate',
      subAffiliate: 'subAffiliate',
      csSite: 'csSite',
      vertical: 'vertical',
      lms: 'lms',
      auditLog: 'auditLog',
      apiKey: 'apiKey',
    } as const,
  },
  journey: {
    groupLabel: 'Journey',
    modules: { uiElements: 'uiElements', formElements: 'formElements', scripts: 'scripts' } as const,
  },
  other: {
    groupLabel: 'Other Tables',
    modules: {
      commision: 'commision',
      dialerList: 'dialerList',
      members: 'members',
      pages: 'pages',
      passwordSetting: 'passwordSetting',
      mirn: 'mirn',
      openEnergyBillRule: 'openEnergyBillRule',
      state: 'state',
      tariffCode: 'tariffCode',
      ignoreData: 'ignoreData',
    } as const,
  },
} as const
