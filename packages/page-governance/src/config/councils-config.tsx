export type CouncilType = 'general' | 'honzon' | 'homa' | 'technicalCommittee';

export type EnsureProportionMoreThan<N extends number, D extends number, C extends CouncilType, R extends boolean> = {
  numerator: N;
  denominator: D;
  council: C;
  root: R;
}

export function ensureProportionMoreThan (n: number, d: number, c: CouncilType, r: boolean): EnsureProportionMoreThan<number, number, CouncilType, boolean> {
  return {
    council: c,
    denominator: d,
    numerator: n,
    root: r
  };
}

export const ensureRootOrHalfGeneralCouncil = ensureProportionMoreThan(1, 2, 'general', true);

export const ensureRootOrHalfHonzonCouncil = ensureProportionMoreThan(1, 2, 'honzon', true);

export const ensureRootOrHalfHomaCouncil = ensureProportionMoreThan(1, 2, 'homa', true);

export const ensureRootOrTwoThirdsGeneralCouncil = ensureProportionMoreThan(2, 3, 'general', true);

export const ensureRootOrThreeFourthsGeneralCouncil = ensureProportionMoreThan(3, 4, 'general', true);

export const ensureRootOrOneThirdsTechnicalCommittee = ensureProportionMoreThan(1, 3, 'technicalCommittee', true);

export const ensureRootOrTwoThirdsTechnicalCommittee = ensureProportionMoreThan(2, 3, 'technicalCommittee', true);

export interface CouncilColorConfig {
  background: string;
  backgroundActive: string;
  text: string;
  shadow: string;
}

export const CouncilsColor = new Map<CouncilType, CouncilColorConfig>([
  [
    'general',
    {
      background: 'rgba(247, 181, 0, 0.1)',
      backgroundActive: '#f7b500',
      shadow: 'rgba(247, 181, 0, 0.4)',
      text: '#f7b500'
    }
  ],
  [
    'honzon',
    {
      background: 'rgba(250, 0, 0, 0.1)',
      backgroundActive: '#fa0000',
      shadow: 'rgba(250, 0, 0, 0.4)',
      text: '#fa0000'
    }
  ],
  [
    'homa',
    {
      background: 'rgba(98, 54, 2550, 0.1)',
      backgroundActive: '#6236FF',
      shadow: 'rgba(98, 54, 255, 0.4)',
      text: '#6236FF'
    }
  ],
  [
    'technicalCommittee',
    {
      background: 'rgba(143, 206, 101, 0.1)',
      backgroundActive: '#8FCE65',
      shadow: 'rgba(143, 206, 101, 0.4)',
      text: '#8FCE65'
    }
  ]
]);
