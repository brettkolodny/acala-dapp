import React, { FC, ReactElement } from 'react';

import { styled, Tabs, TabHeader, useTabs } from '@acala-dapp/ui-components';
import { useCouncilList } from '@acala-dapp/react-hooks';

import { CouncilsColor, CouncilType } from '../../config';
import { camelToDisplay } from './utils';

const CouncilTabHeader = styled(TabHeader)<{ type: CouncilType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 46px;
  padding: 8px;
  border-radius: 8px;
  margin-right: 18px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  background: ${({ active, type }): string => (CouncilsColor.get(type) as any)[(active ? 'backgroundActive' : 'background')]};
  color: ${({ active, type }): string => active ? '#ffffff' : (CouncilsColor.get(type) as any).text};
  box-shadow: ${({ active, type }): string => {
    if (active) {
      return `0 0 0 4px ${CouncilsColor.get(type)?.shadow || '#ffffff'}`;
    }

    return 'none';
  }};

  &:hover {
    box-shadow: 0 0 0 4px ${({ type }): string => CouncilsColor.get(type)?.shadow || '#ffffff'}
  }

  &::after {
    display: none;
  }
`;

export const CouncilesTab: FC<{ contentRender: (council: CouncilType) => ReactElement }> = ({ contentRender }) => {
  const councils = useCouncilList();
  const { changeTab, currentTab } = useTabs<CouncilType>('generalCouncil');

  return (
    <Tabs
      active={currentTab}
      divider={false}
      onChange={changeTab}
      slider={false}
    >
      {
        councils.map((item) => {
          return (
            <Tabs.Panel
              $key={item}
              header={
                <CouncilTabHeader
                  active={currentTab === item}
                  key={`tab-header-${item}`}
                  onClick={(): void => changeTab(item as any) }
                  type={item as any}
                >
                  {camelToDisplay(item)}
                </CouncilTabHeader>
              }
              key={`council-${item}`}
            >
              {contentRender(item as any)}
            </Tabs.Panel>
          );
        })
      }
    </Tabs>
  );
};
