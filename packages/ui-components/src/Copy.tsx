import React, { ReactNode, useCallback } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { notification } from './notification';
import { BareProps } from './types';

interface Props extends BareProps {
  text: string;
  display?: string;
  render?: () => ReactNode;
  withCopy?: boolean;
}

export const Copy = styled(({
  className,
  display,
  render,
  text,
  withCopy = true
}) => {
  const handleCopy = useCallback((): void => {
    notification.success({
      message: display || `copy ${text} success`
    });
  }, [display, text]);

  if (withCopy) {
    return (
      <span className={className}>
        { render ? render() : text }
        {
          withCopy ? (
            <CopyToClipboard
              onCopy={handleCopy}
              text={text}
            >
              <CopyOutlined style={{ marginLeft: 6 }} />
            </CopyToClipboard>
          ) : null
        }
      </span>
    );
  }

  return (
    <CopyToClipboard
      onCopy={handleCopy}
      text={text}
    >
      <span className={className}>
        { render ? render() : text }
        { withCopy ? <CopyOutlined style={{ marginLeft: 6 }} /> : null }
      </span>
    </CopyToClipboard>
  );
})`
  display: flex;
  align-items: center;

  > svg {
    margin-left: 8px;
    width: 16px;
    cursor: pointer;
  }
`;
