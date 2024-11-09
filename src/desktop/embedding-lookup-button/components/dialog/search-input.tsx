import { TextField } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { ChangeEventHandler, FC } from 'react';
import { searchInputAtom } from '../../states';
import { dialogPageIndexAtom } from '../../states/dialog';
import { useConditionId } from '../condition-id-context';

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const SearchInput: FC<Props> = ({ value, onChange }) => (
  <TextField
    label='レコードを検索'
    variant='outlined'
    color='primary'
    size='small'
    {...{ value, onChange }}
  />
);

const SearchInputContainer: FC = () => {
  const conditionId = useConditionId();
  const [value, setValue] = useAtom(searchInputAtom(conditionId));
  const setPageIndex = useSetAtom(dialogPageIndexAtom(conditionId));

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    setPageIndex(1);
  };

  return <SearchInput {...{ value, onChange }} />;
};

export default SearchInputContainer;
