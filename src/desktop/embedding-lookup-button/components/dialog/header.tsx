import styled from '@emotion/styled';
import { FCX } from 'react';
import Pagination from './pagination';
import Input from './search-input';

const DialogTitleComponent: FCX = ({ className }) => (
  <div {...{ className }}>
    <Input />
    <div></div>
    <Pagination />
  </div>
);

const StyledDialogTitleComponent = styled(DialogTitleComponent)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background-color: #fff;
  padding: 0 16px;

  position: sticky;
  top: 0;
  min-height: 60px;
  z-index: 2;
`;

export default StyledDialogTitleComponent;
