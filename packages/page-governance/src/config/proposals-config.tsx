import { upperFirst } from 'lodash';
import { EnsureProportionMoreThan, ensureRootOrHalfHomaCouncil, ensureRootOrHalfHonzonCouncil, ensureRootOrHalfGeneralCouncil, ensureRootOrTwoThirdsGeneralCouncil } from './councils-config';

export type ModuleProposalCouncilConfig = {
  collective: string;
  calls: {
    document: string;
    name: string;
    section: string;
    origin?: EnsureProportionMoreThan<any, any, any, true>;
    showChangeOrigin?: boolean;
  }[];
  origin: EnsureProportionMoreThan<any, any, any, true>;
}

export function formatter (str?: string): string {
  if (!str) return '';

  return str.split('_').map(upperFirst).join(' ');
}

const commonProposalsConfig = [
  {
    calls: [
      {
        document: 'Add Member To General Council',
        name: 'add_member',
        section: 'general_council_membership'
      },
      {
        document: 'Remove Member From General Council',
        name: 'remove_member',
        section: 'general_council_membership'
      },
      {
        document: 'Add Member To Homa Council',
        name: 'add_member',
        section: 'homa_council_membership'
      },
      {
        document: 'Remove Member From Homa Council',
        name: 'remove_member',
        section: 'homa_council_membership'
      },
      {
        document: 'Add Member To Honzon Council',
        name: 'add_member',
        section: 'honzon_council_membership'
      },
      {
        document: 'Remove Member From Honzon Council',
        name: 'remove_member',
        section: 'honzon_council_membership'
      }
    ],
    collective: 'Council',
    origin: ensureRootOrTwoThirdsGeneralCouncil
  },
  {
    calls: [
      {
        document: 'Start surplus auction',
        name: 'auction_surplus',
        section: 'cdp_treasury'
      },
      {
        document: 'Start debit auction',
        name: 'auction_debit',
        section: 'cdp_treasury'
      },
      {
        document: 'Start collateral auction',
        name: 'auction_collateral',
        section: 'cdp_treasury'
      },
      {
        document: 'Set collateral auction maximum size',
        name: 'set_collateral_auction_maximum_size',
        section: 'cdp_treasury'
      },
      {
        document: 'Update global parameters related to risk management of CDP',
        name: 'set_global_params',
        section: 'cdp_engine'
      },
      {
        document: 'Update parameters related to risk management of CDP under specific collateral type',
        name: 'set_collateral_params',
        section: 'cdp_engine'
      },
      {
        document: 'Update parameters related to risk management of CDP under specific collateral type',
        name: 'set_collateral_params',
        section: 'cdp_engine'
      },
      {
        document: 'Withdraw Treasury',
        name: 'transfer',
        section: 'currencies',
        showChangeOrigin: true
      }
    ],
    collective: 'Loan',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      {
        document: 'Update loans incentive rewawrds',
        name: 'update_loans_incentive_rewards',
        section: 'incentives'
      },
      {
        document: 'Update dex incentive rewards',
        name: 'update_dex_incentive_rewards',
        section: 'incentives'
      },
      {
        document: 'Update homa incentive rewards',
        name: 'update_homa_incentive_reward',
        section: 'incentives'
      },
      {
        document: 'Update dex saving reates',
        name: 'update_dex_saving_rates',
        section: 'incentives'
      }
    ],
    collective: 'incentives',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      {
        document: 'Set staking pool params',
        name: 'set_staking_pool_params',
        section: 'staking_pool'
      }
    ],
    collective: 'staking_pool',
    origin: ensureRootOrHalfHomaCouncil
  },
  // {
  //   calls: [
  //     {
  //       document: 'List a new trading pair, trading pair will become Enabled status after provision process.',
  //       name: 'list_trading_pair'
  //     },
  //     {
  //       document: 'Enable a new trading pair(without the provision process),',
  //       name: 'enable_trading_pair'
  //     },
  //     {
  //       document: 'Disbale a trading pair',
  //       name: 'disable_trading_pair'
  //     }
  //   ],
  //   module: 'dex',
  //   origin: ensureRootOrHalfGeneralCouncil
  // },
  {
    calls: [
      {
        document: 'Start emergency shutdown',
        name: 'emergency_shutdown',
        section: 'emergency_shutdown'
      },
      {
        document: 'Open final redemption if settlement is completed.',
        name: 'open_collateral_refund',
        section: 'emergency_shutdown'
      }
    ],
    collective: 'emergency_shutdown',
    origin: ensureRootOrHalfGeneralCouncil
  }
];

// the proposals config
export const proposalsConfig = {
  acala: commonProposalsConfig,
  karura: commonProposalsConfig,
  mandala: commonProposalsConfig
} as {
  acala: ModuleProposalCouncilConfig[];
  karura: ModuleProposalCouncilConfig[];
  mandala: ModuleProposalCouncilConfig[];
  [k: string]: ModuleProposalCouncilConfig[];
};

export const getProposalsConfig = <U extends keyof typeof proposalsConfig>(key: U): ModuleProposalCouncilConfig[] => {
  return proposalsConfig[key];
};
