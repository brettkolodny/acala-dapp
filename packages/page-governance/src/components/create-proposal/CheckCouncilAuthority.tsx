import { useAccounts, useAllCouncilMembers } from '@acala-dapp/react-hooks';
import { PageLoading } from '@acala-dapp/ui-components';
import React, { FC, useContext } from 'react';
import { CreateContext } from './CreateProvider';

export const CheckCouncilAuthority: FC = () => {
  const { active } = useAccounts();
  const { selectedModule } = useContext(CreateContext);
  const {
    init,
    loading,
    members
  } = useAllCouncilMembers();

  if (!init || loading) return <PageLoading />;

  return (
    <div>

    </div>
  );
};
