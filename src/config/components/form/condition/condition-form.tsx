import React, { FC, FCX, memo } from 'react';
import styled from '@emotion/styled';

import DstFieldForm from '../../functional/form-dst-field';
import SrcAppForm from '../../functional/form-src-app';
import SrcFieldForm from '../../functional/form-src-field';
import CopiesForm from '../../functional/form-copies';
import DisplayFieldsForm from '../../functional/form-sees';
import QueryForm from '../../functional/form-query';
import EnablesCacheForm from '../../functional/form-enables-cache';
import AutoLookupForm from '../../functional/form-auto-lookup';
import EnablesValidationForm from '../../functional/form-enables-validation';
import SaveAndLookupState from '../../functional/form-save-and-lookup';
import LetterCaseForm from '../../functional/form-letter-case';
import KatakanaForm from '../../functional/form-katakana';
import ZenkakuEisujiForm from '../../functional/form-zenkaku-eisuji';
import HankakuKatakanaForm from '../../functional/form-hankaku-katakana';

const Component: FCX = ({ className }) => (
  <div className={className}>
    <div>
      <h3>対象フィールド(ルックアップボタンを設置するフィールド)</h3>
      <DstFieldForm />
      <div>
        <small>
          ルックアップフィールドは使用しません。ここでは文字列1行フィールドを選択してください。
        </small>
      </div>
      <small>
        また、対象フィールドにボタンを設置するため、アプリ設定からフィールドの幅に余裕を持たせてください。
      </small>
    </div>
    <div>
      <h3>関連付けないアプリ(参照先アプリ)</h3>
      <SrcAppForm />
    </div>
    <div>
      <h3>取得するフィールド(ボタンを設置したフィールドに反映するフィールド)</h3>
      <SrcFieldForm />
    </div>

    <div>
      <h3>他のフィールドのコピー</h3>
      <CopiesForm />
    </div>
    <div>
      <h3>コピー元のレコードの選択時に表示するフィールド</h3>
      <DisplayFieldsForm />
    </div>
    <div>
      <h3>コピー元レコードの取得条件</h3>
      <QueryForm />
    </div>
    <div>
      <h3>その他のオプション</h3>
      <EnablesCacheForm />
      <AutoLookupForm />
      <EnablesValidationForm />
      <SaveAndLookupState />
      <LetterCaseForm />
      <KatakanaForm />
      <HankakuKatakanaForm />
      <ZenkakuEisujiForm />
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  > div {
    padding: 8px 8px 8px 16px;
    border-left: 2px solid #0002;
    display: flex;
    flex-direction: column;
  }

  .input {
    min-width: 250px;
  }

  small {
    color: #f80;
  }

  h3 {
    color: #0009;
    margin-bottom: 16px;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      > svg {
        fill: #0006;
      }
    }
  }
`;

const Container: FC = () => {
  return <StyledComponent />;
};

export default memo(Container);
