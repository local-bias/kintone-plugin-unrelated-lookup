import styled from '@emotion/styled';
import { FCX } from 'react';
import Pagination from './pagination';
import Input from './search-input';

const DialogTitleComponent: FCX<{
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ className, searchInputRef }) => (
  <div {...{ className }}>
    <Input ref={searchInputRef} />
    <Pagination />
  </div>
);

const StyledDialogTitleComponent = styled(DialogTitleComponent)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 0 16px;

  position: sticky;
  top: 0;
  min-height: 60px;
  z-index: 2;
`;

export default StyledDialogTitleComponent;
