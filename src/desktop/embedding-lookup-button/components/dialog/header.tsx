import React, { VFCX } from 'react';
import styled from '@emotion/styled';

import Pagination from './pagination';
import Input from './search-input';

const Component: VFCX = ({ className }) => (
  <div {...{ className }}>
    <Input />
    <Pagination />
  </div>
);

const StyledComponent = styled(Component)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 0 16px;

  position: sticky;
  top: 0;
  height: 60px;
  z-index: 2;
`;

export default StyledComponent;
