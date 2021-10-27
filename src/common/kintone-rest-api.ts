import { Record } from '@kintone/rest-api-client/lib/client/types';
import { getAppId } from './kintone';

const END_POINT = '/k/v1/records';

const LIMIT_GET = 500;

type GetProps = Readonly<
  Partial<{
    app: number | string;
    fields: string[];
    totalCount: boolean;
    query: string;
    onTotalGet: (total: number) => void;
    onAdvance: (records: Record[]) => void;
  }>
>;

type GetMethod = (props?: GetProps) => Promise<Record[]>;

interface CursorProps {
  id: string;
  onAdvance: ((key?: any) => any) | null;
  loadedData?: Record[];
}

export const getAllRecords: GetMethod = async (props = {}) => {
  const { app = getAppId(), fields = [], query = '', onTotalGet = null, onAdvance = null } = props;

  const param = { app, fields, size: LIMIT_GET, query };

  const cursor = await kintone.api(kintone.api.url(`${END_POINT}/cursor`, true), 'POST', param);

  if (onTotalGet) {
    onTotalGet(Number(cursor.totalCount));
  }

  return getRecordsByCursorId({ id: cursor.id, onAdvance });
};

const getRecordsByCursorId = async ({
  id,
  onAdvance,
  loadedData = [],
}: CursorProps): Promise<Record[]> => {
  const response = await kintone.api(kintone.api.url(`${END_POINT}/cursor`, true), 'GET', { id });

  const newRecords: Record[] = [...loadedData, ...(response.records as Record[])];

  if (onAdvance) {
    onAdvance(newRecords);
  }

  return response.next
    ? getRecordsByCursorId({ id, onAdvance, loadedData: newRecords })
    : newRecords;
};
