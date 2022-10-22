import { AutocompleteKintoneField } from '@common/components/autocomplete-field-input';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppPropertiesState } from '../../states/kintone';
import { copiesState } from '../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import produce from 'immer';

import SelectSrcFields from '../form/condition/select-src-fields';
import { useConditionIndex } from './condition-index-provider';

const Component: FCX = () => {
  const conditionIndex = useConditionIndex();
  const dstFields = useRecoilValue(dstAppPropertiesState);

  const copies = useRecoilValue(copiesState(conditionIndex));

  const onCopyFromChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copiesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[rowIndex].from = value;
          })
        );
      },
    [conditionIndex]
  );
  const onCopyToChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copiesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[rowIndex].to = value;
          })
        );
      },
    [conditionIndex]
  );

  const addCopy = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(copiesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex + 1, 0, { from: '', to: '' });
          })
        );
      },
    [conditionIndex]
  );

  const removeCopy = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(copiesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex, 1);
          })
        );
      },
    [conditionIndex]
  );

  return (
    <div className='rows'>
      {copies.map(({ from, to }, i) => (
        <div key={i}>
          <Suspense fallback={<Skeleton width={370} height={70} />}>
            <SelectSrcFields
              conditionIndex={conditionIndex}
              label='コピー元'
              fieldCode={from}
              onChange={(code) => onCopyFromChange(i, code)}
            />
          </Suspense>
          <ArrowForwardIcon />
          <AutocompleteKintoneField
            label='コピー先'
            fields={dstFields}
            fieldCode={to}
            onChange={(code) => onCopyToChange(i, code)}
          />
          <Tooltip title='コピー設定を追加する'>
            <IconButton size='small' onClick={() => addCopy(i)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {copies.length > 1 && (
            <Tooltip title='このコピー設定を削除する'>
              <IconButton size='small' onClick={() => removeCopy(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const Container: FC = () => {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 380px)', gap: '8px' }}>
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default memo(Container);
