
/* eslint-disable */
// @ts-nocheck
// auto generate by buildI18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import appsEN from '@acala-dapp/apps/i18n/en.json';
import pageWalletEN from '@acala-dapp/page-wallet/i18n/en.json';
import pageLoanEN from '@acala-dapp/page-loan/i18n/en.json';
import pageSwapEN from '@acala-dapp/page-swap/i18n/en.json';
import pageHomaEN from '@acala-dapp/page-homa/i18n/en.json';
import pageOraclePriceEN from '@acala-dapp/page-oracle-price/i18n/en.json';
import pageGovernanceEN from '@acala-dapp/page-governance/i18n/en.json';
import reactComponentsEN from '@acala-dapp/react-components/i18n/en.json';
import appsZH from '@acala-dapp/apps/i18n/zh.json';
import pageWalletZH from '@acala-dapp/page-wallet/i18n/zh.json';
import pageLoanZH from '@acala-dapp/page-loan/i18n/zh.json';
import pageSwapZH from '@acala-dapp/page-swap/i18n/zh.json';
import pageHomaZH from '@acala-dapp/page-homa/i18n/zh.json';
import pageOraclePriceZH from '@acala-dapp/page-oracle-price/i18n/zh.json';
import pageGovernanceZH from '@acala-dapp/page-governance/i18n/zh.json';
import reactComponentsZH from '@acala-dapp/react-components/i18n/zh.json';

const resources = {
  en: {
    'apps': appsEN,
    'page-wallet': pageWalletEN,
    'page-loan': pageLoanEN,
    'page-swap': pageSwapEN,
    'page-homa': pageHomaEN,
    'page-oracle-price': pageOraclePriceEN,
    'page-governance': pageGovernanceEN,
    'react-components': reactComponentsEN,
  },
  zh: {
    'apps': appsZH,
    'page-wallet': pageWalletZH,
    'page-loan': pageLoanZH,
    'page-swap': pageSwapZH,
    'page-homa': pageHomaZH,
    'page-oracle-price': pageOraclePriceZH,
    'page-governance': pageGovernanceZH,
    'react-components': reactComponentsZH,
  }
}
      

// for debug
if (process.env.NODE_ENV === 'development') {
  window.i18n = i18n;
}

i18n.use(initReactI18next).init({
  defaultNS: 'translations',
  fallbackLng: 'en',
  ns: ['apps', 'page-wallet', 'page-loan', 'page-swap', 'page-homa', 'page-oracle-price', 'page-governance', 'react-components'],
  resources
});
