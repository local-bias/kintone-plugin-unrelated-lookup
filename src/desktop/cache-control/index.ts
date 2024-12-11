import { manager } from '@/lib/event-manager';
import { isProd } from '@/lib/global';
import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { getAllRecords, getFieldValueAsString, getYuruChara } from '@konomi-app/kintone-utilities';
import { getLookupSrcFields } from '../embedding-lookup-button/action';
import { alreadyCacheAtom } from '../embedding-lookup-button/states';
import { HandledRecord, srcAllRecordsAtom } from '../embedding-lookup-button/states/records';
import { isCacheStartedAtom, validPluginConditionsAtom } from '../states';

manager.add(
  ['app.record.create.show', 'app.record.edit.show', 'app.record.detail.show'],
  async (event) => {
    const filter = (condition: PluginCondition) => !store.get(isCacheStartedAtom(condition.id));

    const conditions = store.get(validPluginConditionsAtom).filter(filter);

    const createCache = async (condition: PluginCondition) => {
      const {
        id,
        srcAppId,
        srcSpaceId,
        isSrcAppGuestSpace,
        query = '',
        isCaseSensitive,
        isKatakanaSensitive,
        isZenkakuEisujiSensitive,
        isHankakuKatakanaSensitive,
      } = condition;

      store.set(isCacheStartedAtom(id), true);

      const fields = getLookupSrcFields(condition);
      await getAllRecords({
        app: srcAppId,
        query,
        fields,
        guestSpaceId: isSrcAppGuestSpace ? (srcSpaceId ?? undefined) : undefined,
        debug: !isProd,
        onStep: ({ records }) => {
          const viewRecords = records.map<HandledRecord>((record) => {
            let __quickSearch = Object.values(record)
              .map((field) => getFieldValueAsString(field))
              .join('__');

            __quickSearch = getYuruChara(__quickSearch, {
              isCaseSensitive,
              isKatakanaSensitive,
              isZenkakuEisujiSensitive,
              isHankakuKatakanaSensitive,
            });

            return { record, __quickSearch };
          });

          store.set(srcAllRecordsAtom(id), viewRecords);
        },
      });
      store.set(alreadyCacheAtom(id), true);
    };

    Promise.all(conditions.map(createCache)).then(() => {
      !isProd && console.log('✨ src cache created');
    });

    return event;
  }
);
