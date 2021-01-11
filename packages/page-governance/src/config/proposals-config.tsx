import { upperFirst } from 'lodash';
import { EnsureProportionMoreThan, ensureRootOrHalfHomaCouncil, ensureRootOrHalfHonzonCouncil, ensureRootOrHalfGeneralCouncil } from './councils-config';

export type ModuleProposalCouncilConfig = {
  module: string;
  calls: {
    document: string;
    name: string;
    origin?: EnsureProportionMoreThan<any, any, any, true>;
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
        document: 'Start surplus auction',
        name: 'auction_surplus'
      },
      {
        document: 'Start debit auction',
        name: 'auction_debit'
      },
      {
        document: 'Start collateral auction',
        name: 'auction_collateral'
      },
      {
        document: 'Set collateral auction maximum size',
        name: 'set_collateral_auction_maximum_size'
      }
    ],
    module: 'cdp_treasury',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      {
        document: 'Update loans incentive rewawrds',
        name: 'update_loans_incentive_rewards'
      },
      {
        document: 'Update dex incentive rewards',
        name: 'update_dex_incentive_rewards'
      },
      {
        document: 'Update homa incentive rewards',
        name: 'update_homa_incentive_reward'
      },
      {
        document: 'Update dex saving reates',
        name: 'update_dex_saving_rates'
      }
    ],
    module: 'incentives',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      {
        document: 'Update global parameters related to risk management of CDP',
        name: 'set_global_params'
      },
      {
        document: 'Update parameters related to risk management of CDP under specific collateral type',
        name: 'set_collateral_params'
      }
    ],
    module: 'cdp_engine',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      {
        document: 'Set staking pool params',
        name: 'set_staking_pool_params'
      }
    ],
    module: 'staking_pool',
    origin: ensureRootOrHalfHomaCouncil
  },
  {
    calls: [
      {
        document: 'List a new trading pair, trading pair will become Enabled status after provision process.',
        name: 'list_trading_pair'
      },
      {
        document: 'Enable a new trading pair(without the provision process),',
        name: 'enable_trading_pair'
      },
      {
        document: 'Disbale a trading pair',
        name: 'disable_trading_pair'
      }
    ],
    module: 'dex',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      {
        document: 'Start emergency shutdown',
        name: 'emergency_shutdown'
      },
      {
        document: 'Open final redemption if settlement is completed.',
        name: 'open_collateral_refund'
      }
    ],
    module: 'emergency_shutdown',
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

export const proposalModules = Array.from(
  new Set(
    Object.keys(proposalsConfig).reduce((acc, item) => {
      return acc.concat((proposalsConfig[item] as any as ModuleProposalCouncilConfig[]).map((i) => i.module));
    }, [] as string[])
  )
);

export const getProposalsConfig = <U extends keyof typeof proposalsConfig>(key: U): ModuleProposalCouncilConfig[] => {
  return proposalsConfig[key];
};
