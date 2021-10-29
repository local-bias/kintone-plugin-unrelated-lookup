import { someRecord } from '@common/kintone-api';
import { selector } from 'recoil';
import { searchInputState, srcAllRecordsState } from '.';

const state = selector<any[]>({
  key: 'filteredRecordsState',
  get: ({ get }) => {
    const cachedRecords = get(srcAllRecordsState);
    const input = get(searchInputState);

    return cachedRecords.filter((record) => someRecord(record, input));
  },
});

export default state;
