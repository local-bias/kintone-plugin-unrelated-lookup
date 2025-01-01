import styled from '@emotion/styled';
import { FCX } from 'react';

const Empty: FCX = ({ className }) => (
  <div {...{ className }}>
    <svg height='200' viewBox='0 0 512 512' width='200'>
      <g>
        <path d='m256 149.554-20.001 131.791 20.001 230.655 198.791-65.896v-230.654z' fill='#bbb' />
        <path d='m57.209 215.45v230.654l198.791 65.896v-362.446z' fill='#ccc' />
        <g fill='#bbb'>
          <path d='m241 0h30v100.174h-30z' />
          <path
            d='m122.957 31.63h30v100.174h-30z'
            transform='matrix(.866 -.5 .5 .866 -22.376 79.926)'
          />
          <path
            d='m323.957 66.717h100.174v30h-100.174z'
            transform='matrix(.5 -.866 .866 .5 116.252 364.788)'
          />
        </g>
        <path d='m198.791 372.217 57.209-90.872-198.791-65.895-57.209 90.872z' fill='#ddd' />
        <path d='m313.209 372.217-57.209-90.872 198.791-65.895 57.209 90.872z' fill='#ccc' />
      </g>
    </svg>
    <h2>条件に一致するレコードが見つかりませんでした。</h2>
    <div>
      <p>左上の検索フィールドの値をご確認ください。</p>
      <p>検索はプラグインに設定した表示フィールドに対してのみ実行されています。</p>
    </div>
  </div>
);

const StyledEmpty = styled(Empty)`
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #0007;
    padding: 0;
    margin: 0;
  }
  p {
    margin: 0;
    color: #0005;
  }
  svg {
    opacity: 0.4;
    filter: drop-shadow(2px 2px 3px #0002);
    width: 200px;
    height: 200px;
  }
`;

export default StyledEmpty;
