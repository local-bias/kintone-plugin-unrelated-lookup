import React, { ChangeEventHandler, useEffect, useState, FC, FCX } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import {
  App as KintoneApp,
  Properties as FieldProperties,
} from '@kintone/rest-api-client/lib/client/types';

import { appFieldsState } from '../../../states/kintone';
import { storageState } from '../../../states/plugin';
import { FormControlLabel, IconButton, MenuItem, Switch, TextField, Tooltip } from '@mui/material';
import { kintoneAppsState } from '../../../states/kintone';
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
  onSaveAndLookupChange: (checked: boolean) => void;
  setIgnoreLetterCase: (checked: boolean) => void;
  setIgnoreKatakana: (checked: boolean) => void;
};

const Component: FCX<Props> = (props) => (
  <div className={props.className}>
    <div>
      <h3>対象フィールド(ルックアップボタンを設置するフィールド)</h3>
      <div>
        <FieldPropertiesSelect
          properties={props.dstAppProperties}
          label='フィールド名'
          value={props.condition.dstField}
          onChange={props.onDstFieldChange}
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
        value={props.condition.srcAppId}
        onChange={props.onSrcAppIdChange}
        sx={{ width: 400 }}
      >
        {props.kintoneApps.map(({ appId, name }, i) => (
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
          properties={props.srcAppProperties}
          label='フィールド名'
          value={props.condition.srcField}
          onChange={props.onSrcFieldChange}
        />
      </div>
    </div>

    <div>
      <h3>他のフィールドのコピー</h3>
      <div className='rows'>
        {props.condition.copies.map(({ from, to }, i) => (
          <div key={i}>
            <FieldPropertiesSelect
              properties={props.srcAppProperties}
              label='コピー元'
              value={from}
              onChange={(e) => props.onCopyFromChange(i, e.target.value)}
            />
            <ArrowForwardIcon />
            <FieldPropertiesSelect
              properties={props.dstAppProperties}
              label='コピー先'
              value={to}
              onChange={(e) => props.onCopyToChange(i, e.target.value)}
            />
            <Tooltip title='コピー設定を追加する'>
              <IconButton size='small' onClick={() => props.addCopy(i)}>
                <AddIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            {props.condition.copies.length > 1 && (
              <Tooltip title='このコピー設定を削除する'>
                <IconButton size='small' onClick={() => props.removeCopy(i)}>
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
        {props.condition.sees.map((field, i) => (
          <div key={i}>
            <FieldPropertiesSelect
              properties={props.srcAppProperties}
              label='表示するフィールド'
              value={field}
              onChange={(e) => props.onDisplayingFieldsChange(i, e.target.value)}
            />

            <Tooltip title='表示フィールドを追加する'>
              <IconButton size='small' onClick={() => props.addDisplayingField(i)}>
                <AddIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            {props.condition.sees.length > 1 && (
              <Tooltip title='この表示フィールドを削除する'>
                <IconButton size='small' onClick={() => props.removeDisplayingField(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
    <SortingForm
      condition={props.condition}
      index={props.index}
      srcAppProperties={props.srcAppProperties}
    />
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
  const onSaveAndLookupChange = (checked: boolean) => onSwitchChange(checked, 'saveAndLookup');
  const setIgnoreLetterCase = (checked: boolean) => onSwitchChange(checked, 'ignoresLetterCase');
  const setIgnoreKatakana = (checked: boolean) => onSwitchChange(checked, 'ignoresKatakana');

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
  srcAppProperties: FieldProperties | null;
}> = ({ condition, index, srcAppProperties }) => {
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
