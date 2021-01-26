import React, { FC, createRef, useMemo, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

import { BulletBarDrawer, BulletBarConfigItem } from './bullet-bar-helper';

interface BulletBarProps {
  config: BulletBarConfigItem[];
}

const BulletBarRoot = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px 24px;
  min-height: 120px;
  border-radius: 12px;
  background: #eef5ff;

  .bullet-bar__label-area {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    list-style: none;
  }

  .bullet-bar__label {
    position: relative;
    box-sizing: border-box;
    flex: 0 0 50%;
    padding-left: 16px;


    font-size: 14px;
    line-height: 19px;
    white-space: nowrap;
  }

  .bullet-bar__decoration {
    position: absolute;
    left: 0;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    transform: translate3d(0, -50%, 0);
  }

  .bullet-bar__status {
    display: inline-block;
    margin-left: 6px;
  }
`;

export const BulletBar: FC<BulletBarProps> = ({ config }) => {
  const ref = createRef<HTMLDivElement>();
  const drawerRef = useRef<BulletBarDrawer | null>(null);

  const sortedConfig = useMemo(
    () => config.slice().sort((a: BulletBarConfigItem, b: BulletBarConfigItem): number => a.data - b.data),
    [config]
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    if (!drawerRef.current) {
      drawerRef.current = new BulletBarDrawer(ref.current);
      drawerRef.current.create(config);
    }

    drawerRef.current.update(config);
  }, [ref, config]);

  return (
    <BulletBarRoot>
      <div ref={ref} />
      <ul className='bullet-bar__label-area'>
        {
          sortedConfig.map((item: BulletBarConfigItem): JSX.Element => {
            return (
              <li
                className='bullet-bar__label'
                data-color={item.color}
                key={`label-${item.label}`}
              >
                <div
                  className='bullet-bar__decoration'
                  style={{ background: item.color }}
                />
                {item.label}
                <span
                  className='bullet-bar__status'
                  style={{ color: item.color }}
                >
                  {item.labelStatus}
                </span>
              </li>
            );
          })
        }
      </ul>
    </BulletBarRoot>
  );
};
