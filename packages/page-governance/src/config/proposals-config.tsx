import { EnsureProportionMoreThan, ensureRootOrHalfHomaCouncil, ensureRootOrHalfHonzonCouncil, ensureRootOrHalfGeneralCouncil } from './councils-config';

export type ModuleProposalCouncilConfig = {
  module: string;
  calls: {
    name: string;
    origin?: EnsureProportionMoreThan<any, any, any, true>;
  }[];
  origin: EnsureProportionMoreThan<any, any, any, true>;
}

const commonProposalsConfig = [
  {
    calls: [
      { name: 'auction_surplus' },
      { name: 'auction_debit' },
      { name: 'auction_collateral' },
      { name: 'set_collateral_auction_maximum_size' },
    ],
    module: 'cdp_treasury',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      { name: 'update_loans_incentive_rewards' },
      { name: 'update_dex_incentive_rewards' },
      { name: 'update_homa_incentive_reward' },
      { name: 'update_dex_saving_rates' }
    ],
    module: 'incentives',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      { name: 'set_global_params' },
      { name: 'set_collateral_params' }
    ],
    module: 'cdp_engine',
    origin: ensureRootOrHalfHonzonCouncil
  },
  {
    calls: [
      { name: 'set_staking_pool_params' }
    ],
    module: 'staking_pool',
    origin: ensureRootOrHalfHomaCouncil
  },
  {
    calls: [
      { name: 'list_trading_pair' },
      { name: 'enable_trading_pair' },
      { name: 'disable_trading_pair' }
    ],
    module: 'dex',
    origin: ensureRootOrHalfGeneralCouncil
  },
  {
    calls: [
      { name: 'emergency_shutdown' },
      { name: 'open_collateral_refund' }
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
} as Record<string, ModuleProposalCouncilConfig[]>;
