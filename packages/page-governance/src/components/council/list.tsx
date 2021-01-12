import React, { FC, useCallback } from 'react';

import { usePageTitle } from '@acala-dapp/react-environment';

import { CouncilesTab } from '../common/CouncliTab';
import { CouncilType } from '../../config';
import { CouncilMembers } from './CouncilMembers';

export const CouncilList: FC = () => {
  usePageTitle({
    breadcrumb: [
      {
        content: 'Governance Overview',
        path: '/governance'
      }
    ],
    content: 'Council'
  });

  const memberRender = useCallback((council: CouncilType) => <CouncilMembers council={council} />, []);

  return <CouncilesTab contentRender={memberRender} />;
};
