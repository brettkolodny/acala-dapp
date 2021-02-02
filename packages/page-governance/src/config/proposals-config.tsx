import { upperFirst } from 'lodash';
import { EnsureProportionMoreThan, ensureRootOrHalfHomaCouncil, ensureRootOrHalfHonzonCouncil, ensureRootOrHalfGeneralCouncil, ensureRootOrTwoThirdsGeneralCouncil } from './councils-config';

export interface ModuleCalls {
  document: string;
  name: string;
  call: string;
  section: string;
  origin?: EnsureProportionMoreThan<any, any, any, true>;
  patchParams?: Record<string, any>;
}

export interface ModuleProposalCouncilConfig {
  collective: string;
  calls: ModuleCalls[];
  origin?: EnsureProportionMoreThan<any, any, any, true>;
}

export function formatter (str?: string): string {
  if (!str) return '';

  return str.split('_').map(upperFirst).join(' ');
}

const commonProposalsConfig = [
  {
    calls: [
      {
        call: 'add_member',
        document: 'Add Member To General Council',
        name: 'Add General Council Member',
        section: 'general_council_membership'
      },
      {
        call: 'remove_member',
        document: 'Remove Member From General Council',
        name: 'Remove General Council Member',
        section: 'general_council_membership'
      },
      {
        call: 'add_member',
        document: 'Add Member To Homa Council',
        name: 'Add Homa Council Member',
        section: 'homa_council_membership'
      },
      {
        call: 'remove_member',
        document: 'Remove Member From Homa Council',
        name: 'Remove Homa Council Member',
        section: 'homa_council_membership'
      },
      {
        call: 'add_member',
        document: 'Add Member To Honzon Council',
        name: 'Add Honzon Council Member',
        section: 'honzon_council_membership'
      },
      {
        call: 'remove_member',
        document: 'Remove Member From Honzon Council',
        name: 'Remove Honzon Council Member',
        section: 'honzon_council_membership'
      },
      {
        call: 'add_member',
        document: 'Add Member To Acala Oracle',
        name: 'Add Acala Oracle Member',
        section: 'operator_membership_acala'
      },
      {
        call: 'add_member',
        document: 'Add Member To Band Oracle',
        name: 'Add Band Oracle Member',
        section: 'operator_membership_band'
      }
    ],
    collective: 'Council',
    origin: ensureRootOrTwoThirdsGeneralCouncil
  },
  {
    calls: [
      {
        call: 'auction_surplus',
        document: 'Start surplus auction',
        name: 'Start Auction Surplus',
        section: 'cdp_treasury'
      },
      {
        call: 'auction_debit',
        document: 'Start debit auction',
        name: 'Start Debit Auction',
        section: 'cdp_treasury'
      },
      {
        call: 'auction_collateral',
        document: 'Start collateral auction',
        name: 'Seart Collateral Auction',
        section: 'cdp_treasury'
      },
      {
        call: 'set_collateral_auction_maximum_size',
        document: 'Set collateral auction maximum size',
        name: 'Set Collateral Auction Maximum Size',
        section: 'cdp_treasury'
      },
      {
        call: 'set_global_params',
        document: 'Update global parameters related to risk management of CDP',
        name: 'Set CDP Engine Global Params',
        section: 'cdp_engine'
      },
      {
        call: 'set_collateral_params',
        document: 'Update parameters related to risk management of CDP under specific collateral type',
        name: 'Set Collateral Loan Params',
        section: 'cdp_engine'
      }
    ],
    collective: 'Loan',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      {
        call: 'update_loans_incentive_rewards',
        document: 'Update loans incentive rewawrds',
        name: 'Update Loans Incentive Rewards',
        section: 'incentives'
      },
      {
        call: 'update_dex_incentive_rewards',
        document: 'Update dex incentive rewards',
        name: 'Update Dex Incentive Rewards',
        section: 'incentives'
      },
      {
        call: 'update_homa_incentive_reward',
        document: 'Update homa incentive rewards',
        name: 'Update Homa Incentive Reward',
        section: 'incentives'
      },
      {
        call: 'update_dex_saving_rates',
        document: 'Update dex saving reates',
        name: 'Update Dex Saving Rates',
        section: 'incentives'
      }
    ],
    collective: 'incentives',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      {
        call: 'set_staking_pool_params',
        document: 'Set staking pool params',
        name: 'Set Staking Pool Params',
        section: 'staking_pool'
      }
    ],
    collective: 'staking_pool',
    origin: ensureRootOrHalfHomaCouncil
  },
  {
    calls: [
      {
        call: 'list_trading_pair',
        document: 'List a new trading pair, trading pair will become Enabled status after provision process.',
        name: 'List Trading Pair',
        section: 'dex'
      },
      {
        call: 'enable_trading_pair',
        document: 'Enable a new trading pair(without the provision process),',
        name: 'Enable Trading Pair',
        section: 'dex'
      },
      {
        call: 'disable_trading_pair',
        document: 'Disbale a trading pair',
        name: 'Disable Trading Pair',
        section: 'dex'
      }
    ],
    collective: 'dex',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      {
        call: 'emergency_shutdown',
        document: 'Start emergency shutdown',
        name: 'Emergency Shutdown',
        section: 'emergency_shutdown'
      },
      {
        call: 'open_collateral_refund',
        document: 'Open final redemption if settlement is completed.',
        name: 'Open Collateral Refund',
        section: 'emergency_shutdown'
      }
    ],
    collective: 'emergency_shutdown',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      {
        call: 'transfer',
        document: 'Withdraw Treasury',
        name: 'Withdraw DSWF Treasury',
        origin: ensureRootOrHalfGeneralCouncil,
        patchParams: {
          'change-origin': true,
          'change-origin-data': {
            asOrigin: 'DSWF'
          }
        },
        section: 'currencies'
      },
      {
        call: 'transfer',
        document: 'Withdraw Acala Treasury',
        name: 'Withdraw Acala Treasury',
        origin: ensureRootOrHalfGeneralCouncil,
        patchParams: {
          'change-origin': true,
          'change-origin-data': {
            asOrigin: 'AcalaTreasury'
          }
        },
        section: 'currencies'
      },
      {
        call: 'transfer',
        document: 'Withdraw Honzon Treasury',
        name: 'Withdraw Honzon Treasury',
        origin: ensureRootOrHalfHonzonCouncil,
        patchParams: {
          'change-origin': true,
          'change-origin-data': {
            asOrigin: 'HonzonTreasury'
          }
        },
        section: 'currencies'
      },
      {
        call: 'transfer',
        document: 'Withdraw Treasury',
        name: 'Withdraw Homa Treasury',
        origin: ensureRootOrHalfHomaCouncil,
        patchParams: {
          'change-origin': true,
          'change-origin-data': {
            asOrigin: 'HomaTreasury'
          }
        },
        section: 'currencies'
      }
    ],
    collective: 'treasury',
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
