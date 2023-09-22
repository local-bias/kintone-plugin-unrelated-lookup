import React, { FC, FCX, memo } from 'react';
import styled from '@emotion/styled';

import DstFieldForm from './form-dst-field';
import SrcAppForm from './form-src-app';
import SrcFieldForm from './form-src-field';
import CopiesForm from './form-copies';
import DisplayFieldsForm from './form-sees';
import QueryForm from './form-query';
import EnablesCacheForm from './form-enables-cache';
import AutoLookupForm from './form-auto-lookup';
import EnablesValidationForm from './form-enables-validation';
import SaveAndLookupState from './form-save-and-lookup';
import LetterCaseForm from './form-letter-case';
import KatakanaForm from './form-katakana';
import ZenkakuEisujiForm from './form-zenkaku-eisuji';
import HankakuKatakanaForm from './form-hankaku-katakana';
import { useConditionIndex } from '../../../functional/condition-index-provider';
import { useRecoilValue } from 'recoil';
import { tabIndexState } from '../../../../states/plugin';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from '@konomi-app/kintone-utility-component';

const Component: FCX = ({ className }) => (
  <div className={className}>
    <PluginFormSection>
      <PluginFormTitle>対象フィールド(ルックアップボタンを設置するフィールド)</PluginFormTitle>
      <PluginFormDescription>
        <span style={{ color: 'red' }}>
          ルックアップフィールドは使用しません。文字列1行フィールドを選択してください。
        </span>
      </PluginFormDescription>
      <PluginFormDescription last>
        また、対象フィールドにボタンを設置するため、アプリ設定からフィールドの幅に余裕を持たせてください。
      </PluginFormDescription>
      <DstFieldForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>関連付けないアプリ(参照先アプリ)</PluginFormTitle>
      <PluginFormDescription last>
        標準機能の「関連付けるアプリ」にあたる、ルックアップの取得先アプリを選択してください。
      </PluginFormDescription>
      <SrcAppForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>
        取得するフィールド(ボタンを設置したフィールドに反映するフィールド)
      </PluginFormTitle>
      <PluginFormDescription last>
        標準機能の「コピー元のフィールド」にあたる、ルックアップを実行した際に取得先からコピーするフィールドを選択してください。
      </PluginFormDescription>
      <SrcFieldForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>他のフィールドのコピー</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、併せてコピーするフィールドの設定を行います。
      </PluginFormDescription>
      <PluginFormDescription last>
        このアプリに存在するコピー元となるフィールドと、取得先アプリに存在するコピー先となるフィールドを選択してください。
      </PluginFormDescription>
      <CopiesForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>コピー元のレコードの選択時に表示するフィールド</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、対象レコードを選択するダイアログ上に表示するフィールドを選択してください。
      </PluginFormDescription>
      <PluginFormDescription last>
        「取得するフィールド」に指定し他フィールドは、必ず行の先頭に表示されます。
      </PluginFormDescription>
      <DisplayFieldsForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>コピー元レコードの取得条件</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、対象レコードを絞り込む条件を設定します。
      </PluginFormDescription>
      <PluginFormDescription last>
        ここで指定した条件に合致するレコードのみが、ルックアップの対象となります。
      </PluginFormDescription>
      <QueryForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>その他のオプション</PluginFormTitle>
      <PluginFormDescription last></PluginFormDescription>
      <div className='flex flex-col gap-1'>
        <EnablesCacheForm />
        <AutoLookupForm />
        <EnablesValidationForm />
        <SaveAndLookupState />
        <LetterCaseForm />
        <KatakanaForm />
        <HankakuKatakanaForm />
        <ZenkakuEisujiForm />
      </div>
    </PluginFormSection>
  </div>
);

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

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
  const conditionIndex = useConditionIndex();
  const tabIndex = useRecoilValue(tabIndexState);
  return conditionIndex === tabIndex ? <StyledComponent /> : null;
};

export default memo(Container);
