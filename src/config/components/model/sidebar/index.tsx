import styled from '@emotion/styled';
import React, { FCX } from 'react';

import AdditionButton from './condition-addition-button';
import Tabs from './condition-tabs';

const Component: FCX = ({ className }) => (
  <div className={className}>
    <div className='condition-tab'>
      <AdditionButton />
      <div className='tabs'>
        <Tabs />
      </div>
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  grid-area: sidebar;

  .condition-tab {
    position: sticky;
    top: 48px;
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-right: 1px solid #0001;
    .tabs {
      overflow: hidden;
      &:hover {
        overflow: auto;
      }
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #0004;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
  }
`;

export default StyledComponent;
