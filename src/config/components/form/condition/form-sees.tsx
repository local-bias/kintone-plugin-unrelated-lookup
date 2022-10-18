import { AutocompleteKintoneField } from '@common/components/autocomplete-field-input';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { seesState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import produce from 'immer';

import SelectSrcFields from './select-src-fields';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ conditionIndex }) => {
  const sees = useRecoilValue(seesState(conditionIndex));

  const onFieldChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[rowIndex] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex + 1, 0, '');
          })
        );
      },
    []
  );

  const removeField = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number) => {
        set(seesState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(rowIndex, 1);
          })
        );
      },
    []
  );

  return (
    <div className='rows'>
      {sees.map((value, i) => (
        <div key={i}>
          <SelectSrcFields
            conditionIndex={conditionIndex}
            label='表示するフィールド'
            fieldCode={value}
            onChange={(code) => onFieldChange(i, code)}
          />
          <Tooltip title='表示フィールドを追加する'>
            <IconButton size='small' onClick={() => addField(i)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {sees.length > 1 && (
            <Tooltip title='この表示フィールドを削除する'>
              <IconButton size='small' onClick={() => removeField(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const Container: FC<Props> = (props) => {
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
      <Component {...props} />
    </Suspense>
  );
};

export default Container;
