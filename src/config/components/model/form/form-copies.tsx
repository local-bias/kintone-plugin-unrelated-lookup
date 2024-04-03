import { AutocompleteKintoneField } from '@/lib/components/autocomplete-field-input';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { dstAppPropertiesState } from '../../../states/kintone';
import { copiesState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { produce } from 'immer';

import SelectSrcFields from './select-src-fields';

const Component: FCX = () => {
  const dstFields = useRecoilValue(dstAppPropertiesState);

  const copies = useRecoilValue(copiesState);

  const onCopyFromChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copiesState, (current) =>
          produce(current, (draft) => {
            draft[rowIndex].from = value;
          })
        );
      },
    []
  );
  const onCopyToChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copiesState, (current) =>
          produce(current, (draft) => {
            draft[rowIndex].to = value;
          })
        );
      },
    []
  );

  const addCopy = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(copiesState, (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex + 1, 0, { from: '', to: '' });
          })
        );
      },
    []
  );

  const removeCopy = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(copiesState, (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex, 1);
          })
        );
      },
    []
  );

  return (
    <div className='flex flex-col gap-4'>
      {copies.map(({ from, to }, i) => (
        <div key={i} className='flex items-center gap-2'>
          <SelectSrcFields
            label='コピー元'
            fieldCode={from}
            onChange={(code) => onCopyFromChange(i, code)}
          />
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
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton variant='rounded' width={350} height={56} />
            <ArrowForwardIcon />
            <Skeleton variant='rounded' width={350} height={56} />
            <AddIcon fontSize='small' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton variant='rounded' width={350} height={56} />
            <ArrowForwardIcon />
            <Skeleton variant='rounded' width={350} height={56} />
            <AddIcon fontSize='small' />
          </div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default memo(Container);
