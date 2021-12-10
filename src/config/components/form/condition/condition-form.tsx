import React, { ChangeEventHandler, useEffect, useState, VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import {
  App as KintoneApp,
  Properties as FieldProperties,
} from '@kintone/rest-api-client/lib/client/types';

import { appFieldsState, storageState } from '../../../states';
import { FormControlLabel, IconButton, MenuItem, Switch, TextField, Tooltip } from '@mui/material';
import { kintoneAppsState } from '../../../states/kintone-apps';
import { getFieldProperties, omitFieldProperties } from '@common/kintone-api';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import FieldPropertiesSelect from './field-properties-select';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  dstAppProperties: FieldProperties;
  srcAppProperties: FieldProperties | null;
  kintoneApps: KintoneApp[];
  onDstFieldChange: ChangeEventHandler<HTMLInputElement>;
  onSrcAppIdChange: ChangeEventHandler<HTMLInputElement>;
  onSrcFieldChange: ChangeEventHandler<HTMLInputElement>;
  onCopyFromChange: (rowIndex: number, value: string) => void;
  onCopyToChange: (rowIndex: number, value: string) => void;
  onDisplayingFieldsChange: (rowIndex: number, value: string) => void;
  addCopy: (rowIndex: number) => void;
  removeCopy: (rowIndex: number) => void;
  addDisplayingField: (rowIndex: number) => void;
  removeDisplayingField: (rowIndex: number) => void;
  onEnableCacheChange: (checked: boolean) => void;
  onValidationCheckChange: (checked: boolean) => void;
  onAutoLookupChange: (checked: boolean) => void;
};

const Component: VFCX<Props> = ({
  className,
  condition,
  dstAppProperties,
  srcAppProperties,
  kintoneApps,
  onDstFieldChange,
  onSrcAppIdChange,
  onSrcFieldChange,
  onCopyFromChange,
  onCopyToChange,
  onDisplayingFieldsChange,
  addCopy,
  removeCopy,
  addDisplayingField,
  removeDisplayingField,
  onEnableCacheChange,
  onValidationCheckChange,
  onAutoLookupChange,
}) => (
  <div {...{ className }}>
    <div>
      <h3>対象フィールド(ルックアップボタンを設置するフィールド)</h3>
      <div>
        <FieldPropertiesSelect
          properties={dstAppProperties}
          label='フィールド名'
          value={condition.dstField}
          onChange={onDstFieldChange}
        />
      </div>
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
      <TextField
        select
        label='アプリ名'
        value={condition.srcAppId}
        onChange={onSrcAppIdChange}
        className='input'
      >
        {kintoneApps.map(({ appId, name }, i) => (
          <MenuItem key={i} value={appId}>
            {name}(id: {appId})
          </MenuItem>
        ))}
      </TextField>
    </div>
    <div>
      <h3>取得するフィールド(ボタンを設置したフィールドに反映するフィールド)</h3>
      <div>
        <FieldPropertiesSelect
          properties={srcAppProperties}
          label='フィールド名'
          value={condition.srcField}
          onChange={onSrcFieldChange}
        />
      </div>
    </div>

    <div>
      <h3>他のフィールドのコピー</h3>
      <div className='rows'>
        {condition.copies.map(({ from, to }, i) => (
          <div key={i}>
            <FieldPropertiesSelect
              properties={srcAppProperties}
              label='コピー元'
              value={from}
              onChange={(e) => onCopyFromChange(i, e.target.value)}
            />
            <ArrowForwardIcon />
            <FieldPropertiesSelect
              properties={dstAppProperties}
              label='コピー先'
              value={to}
              onChange={(e) => onCopyToChange(i, e.target.value)}
            />
            <Tooltip title='コピー設定を追加する'>
              <IconButton size='small' onClick={() => addCopy(i)}>
                <AddIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            {condition.copies.length > 1 && (
              <Tooltip title='このコピー設定を削除する'>
                <IconButton size='small' onClick={() => removeCopy(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3>コピー元のレコードの選択時に表示するフィールド</h3>
      <div className='rows'>
        {condition.sees.map((field, i) => (
          <div key={i}>
            <FieldPropertiesSelect
              properties={srcAppProperties}
              label='表示するフィールド'
              value={field}
              onChange={(e) => onDisplayingFieldsChange(i, e.target.value)}
            />

            <Tooltip title='表示フィールドを追加する'>
              <IconButton size='small' onClick={() => addDisplayingField(i)}>
                <AddIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            {condition.sees.length > 1 && (
              <Tooltip title='この表示フィールドを削除する'>
                <IconButton size='small' onClick={() => removeDisplayingField(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3>その他のオプション</h3>
      <FormControlLabel
        control={<Switch color='primary' checked={condition.enablesCache} />}
        onChange={(_, checked) => onEnableCacheChange(checked)}
        label='事前に参照アプリのレコードを取得し、検索を高速化する(レコード数の少ないアプリ向け)'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={condition.autoLookup} />}
        onChange={(_, checked) => onAutoLookupChange(checked)}
        label='コピー先に標準のルックアップフィールドが存在する場合、取得完了後自動的にルックアップを実行する。'
      />
      <FormControlLabel
        control={<Switch color='primary' checked={condition.enablesValidation} />}
        onChange={(_, checked) => onValidationCheckChange(checked)}
        label='レコード保存時に、入力値を検証する。'
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

const Container: VFC<ContainerProps> = ({ condition, index }) => {
  const dstAppProperties = useRecoilValue(appFieldsState);
  const setStorage = useSetRecoilState(storageState);
  const kintoneApps = useRecoilValue(kintoneAppsState);
  const [srcAppProperties, setSrcAppProperties] = useState<FieldProperties | null>(null);

  useEffect(() => {
    setSrcAppProperties(null);
    (async () => {
      const props = await getFieldProperties(condition.srcAppId);
      const filtered = omitFieldProperties(props, ['GROUP', 'SUBTABLE']);
      setSrcAppProperties(filtered);
    })();
  }, [condition.srcAppId]);

  const setConditionProps = <T extends keyof kintone.plugin.Condition>(
    key: T,
    value: kintone.plugin.Condition[T]
  ) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index][key] = value;
      })
    );
  };

  const onSrcAppIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConditionProps('srcAppId', e.target.value);
  };
  const onSrcFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConditionProps('srcField', e.target.value);
  };
  const onDstFieldChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConditionProps('dstField', e.target.value);
  };

  const onCopyFromChange = (rowIndex: number, value: string) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { copies } = draft.conditions[index];
        copies[rowIndex].from = value;
      })
    );
  };

  const onCopyToChange = (rowIndex: number, value: string) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { copies } = draft.conditions[index];
        copies[rowIndex].to = value;
      })
    );
  };

  const onDisplayingFieldsChange = (rowIndex: number, value: string) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { sees } = draft.conditions[index];
        sees[rowIndex] = value;
      })
    );
  };

  const addCopy = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { copies } = draft.conditions[index];
        copies.splice(rowIndex + 1, 0, { from: '', to: '' });
      })
    );
  };

  const removeCopy = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { copies } = draft.conditions[index];
        copies.splice(rowIndex, 1);
      })
    );
  };

  const addDisplayingField = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { sees } = draft.conditions[index];
        sees.splice(rowIndex + 1, 0, '');
      })
    );
  };

  const removeDisplayingField = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { sees } = draft.conditions[index];
        sees.splice(rowIndex, 1);
      })
    );
  };

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

  return (
    <StyledComponent
      {...{
        condition,
        index,
        dstAppProperties,
        srcAppProperties,
        kintoneApps,
        onDstFieldChange,
        onSrcAppIdChange,
        onSrcFieldChange,
        onCopyFromChange,
        onCopyToChange,
        onDisplayingFieldsChange,
        addCopy,
        removeCopy,
        addDisplayingField,
        removeDisplayingField,
        onEnableCacheChange,
        onValidationCheckChange,
        onAutoLookupChange,
      }}
    />
  );
};

export default Container;
