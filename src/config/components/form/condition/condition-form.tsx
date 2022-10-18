import React, { useEffect, useState, FC, FCX } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import { Properties as FieldProperties } from '@kintone/rest-api-client/lib/client/types';

import { storageState } from '../../../states/plugin';
import { FormControlLabel, Switch, TextField } from '@mui/material';
import { getFieldProperties, omitFieldProperties } from '@common/kintone-api';

import DstFieldForm from './form-dst-field';
import SrcAppForm from './form-src-app';
import SrcFieldForm from './form-src-field';
import CopiesForm from './form-copies';
import DisplayFieldsForm from './form-sees';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  onEnableCacheChange: (checked: boolean) => void;
  onValidationCheckChange: (checked: boolean) => void;
  onAutoLookupChange: (checked: boolean) => void;
  onSaveAndLookupChange: (checked: boolean) => void;
  setIgnoreLetterCase: (checked: boolean) => void;
  setIgnoreKatakana: (checked: boolean) => void;
};

const Component: FCX<Props> = (props) => (
  <div className={props.className}>
    <div>
      <h3>対象フィールド(ルックアップボタンを設置するフィールド)</h3>
      <DstFieldForm conditionIndex={props.index} />
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
      <SrcAppForm conditionIndex={props.index} />
    </div>
    <div>
      <h3>取得するフィールド(ボタンを設置したフィールドに反映するフィールド)</h3>
      <SrcFieldForm conditionIndex={props.index} />
    </div>

    <div>
      <h3>他のフィールドのコピー</h3>
      <CopiesForm conditionIndex={props.index} />
    </div>
    <div>
      <h3>コピー元のレコードの選択時に表示するフィールド</h3>
      <DisplayFieldsForm conditionIndex={props.index} />
    </div>
    <SortingForm condition={props.condition} index={props.index} />
    <div>
      <h3>その他のオプション</h3>
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.enablesCache} />}
        onChange={(_, checked) => props.onEnableCacheChange(checked)}
        label='事前に参照アプリのレコードを取得し、検索を高速化する(レコード数の少ないアプリ向け)'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.autoLookup} />}
        onChange={(_, checked) => props.onAutoLookupChange(checked)}
        label='コピー先に標準のルックアップフィールドが存在する場合、取得完了後自動的にルックアップを実行する'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.enablesValidation} />}
        onChange={(_, checked) => props.onValidationCheckChange(checked)}
        label='レコード保存時に、ルックアップが実行されていない場合はエラーを表示する'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.saveAndLookup} />}
        onChange={(_, checked) => props.onSaveAndLookupChange(checked)}
        label='レコード保存時に、ルックアップを実行する'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.ignoresLetterCase} />}
        onChange={(_, checked) => props.setIgnoreLetterCase(checked)}
        label='絞り込みの際、大文字と小文字を区別しない'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={props.condition.ignoresKatakana} />}
        onChange={(_, checked) => props.setIgnoreKatakana(checked)}
        label='絞り込みの際、カタカナとひらがなを区別しない'
      />
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

const Container: FC<ContainerProps> = ({ condition, index }) => {
  const setStorage = useSetRecoilState(storageState);

  const onSwitchChange = (checked: boolean, option: keyof kintone.plugin.Condition) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index][option] = checked as never;
      })
    );
  };

  const onEnableCacheChange = (checked: boolean) => onSwitchChange(checked, 'enablesCache');
  const onValidationCheckChange = (checked: boolean) =>
    onSwitchChange(checked, 'enablesValidation');
  const onAutoLookupChange = (checked: boolean) => onSwitchChange(checked, 'autoLookup');
  const onSaveAndLookupChange = (checked: boolean) => onSwitchChange(checked, 'saveAndLookup');
  const setIgnoreLetterCase = (checked: boolean) => onSwitchChange(checked, 'ignoresLetterCase');
  const setIgnoreKatakana = (checked: boolean) => onSwitchChange(checked, 'ignoresKatakana');

  return (
    <StyledComponent
      {...{
        condition,
        index,
        onEnableCacheChange,
        onValidationCheckChange,
        onAutoLookupChange,
        onSaveAndLookupChange,
        setIgnoreLetterCase,
        setIgnoreKatakana,
      }}
    />
  );
};

export default Container;

const SortingForm: FC<{
  condition: kintone.plugin.Condition;
  index: number;
}> = ({ condition, index }) => {
  const onQueryChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(storageState, (_storage) =>
          produce(_storage, (draft) => {
            if (!draft) {
              return;
            }
            draft.conditions[index].query = value;
          })
        );
      },
    [index]
  );

  return (
    <div>
      <h3>コピー元レコードの取得条件</h3>
      <TextField
        label='クエリー'
        placeholder='例: 契約ステータス not in ("解約")'
        value={condition.query || ''}
        onChange={(e) => onQueryChange(e.target.value)}
        sx={{ width: 400 }}
      />
    </div>
  );
};
