import styled from '@emotion/styled';
import React, { FCX } from 'react';

const Component: FCX = ({ className }) => (
  <div className={className}>
    <div className='sticky'>
      <iframe src='https://promotion.konomi.app/kintone-plugin/sidebar' loading='lazy' />
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  grid-area: promotion;

  .sticky {
    position: sticky;
    height: calc(100vh - 130px);
    top: 48px;

    iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

export default StyledComponent;
