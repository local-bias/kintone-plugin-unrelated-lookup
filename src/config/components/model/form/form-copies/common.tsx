import { AutocompleteKintoneField } from '@/lib/components/autocomplete-field-input';
import { getNewCondition } from '@/lib/plugin';
import { useRecoilRow } from '@konomi-app/kintone-utilities-react';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { FC, FCX, Suspense } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilCallback, useRecoilValue } from 'recoil';
import SelectSrcFields from '../select-src-fields';
import { kintoneAPI } from '@konomi-app/kintone-utilities';

type Props = {
  appPropertiesState: RecoilValueReadOnly<kintoneAPI.FieldProperty[]>;
  copiesState: RecoilState<Plugin.Condition['copies'] | Plugin.Condition['insubtableCopies']>;
};

const Component: FCX<Props> = ({ appPropertiesState, copiesState }) => {
  const dstFields = useRecoilValue(appPropertiesState);

  const copies = useRecoilValue(copiesState);
  const { addRow, deleteRow } = useRecoilRow({
    state: copiesState,
    getNewRow: () => getNewCondition().copies[0],
  });

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
            <IconButton size='small' onClick={() => addRow(i)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {copies.length > 1 && (
            <Tooltip title='このコピー設定を削除する'>
              <IconButton size='small' onClick={() => deleteRow(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const ConditionCopiesForm: FC<Props> = (props) => {
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
      <Component {...props} />
    </Suspense>
  );
};

export default ConditionCopiesForm;
