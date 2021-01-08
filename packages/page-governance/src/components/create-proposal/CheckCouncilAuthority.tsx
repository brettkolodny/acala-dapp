import React, { FC, useContext, useEffect } from 'react';
import { useAccounts, useAllCouncilMembers } from '@acala-dapp/react-hooks';
import { Button, Card, FlexBox, PageLoading, styled } from '@acala-dapp/ui-components';
import { BareProps } from '@acala-dapp/ui-components/types';
import { CreateContext, ProposalData } from './CreateProvider';

const NoAuthority = styled(({ className }) => {
  const { openSelectAccount } = useAccounts();

  return (
    <Card className={className}>
      <FlexBox justifyContent='space-between'>
        The current account is not a set of council. you can change the current account
        <Button onClick={openSelectAccount}>Chagne Account</Button>
      </FlexBox>
    </Card>
  );
})`
  font-size: 18px;
`;

export const CheckCouncilAuthority: FC<BareProps> = ({ children }) => {
  const { active } = useAccounts();
  const { allowedProposals, currentProposalConfig, setProposalDatas } = useContext(CreateContext);
  const {
    init,
    loading,
    members
  } = useAllCouncilMembers();

  useEffect(() => {
    if (!members.length) return;
    if (!active) return;

    const allowedProposals = currentProposalConfig
      .reduce((acc, cur) => {
        return acc.concat(
          cur.calls.map((item) => ({
            module: cur.module,
            origin: cur.origin,
            ...item
          }))
        );
      }, [] as ProposalData[])
      .filter((config) => {
        const sets = members.find((item) => item.council === config.origin.council);

        return sets && sets.data && sets.data.find((account) => account.toString() === active.address);
      });

    setProposalDatas(allowedProposals);
  }, [members, active, currentProposalConfig, setProposalDatas]);

  if (!init || loading) return <PageLoading />;

  if (allowedProposals.length === 0) {
    return <NoAuthority />;
  }

  return <>{children}</>;
};
