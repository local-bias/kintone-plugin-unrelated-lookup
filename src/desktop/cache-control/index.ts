import { manager } from '@/lib/event-manager';
import { isProd } from '@/lib/global';
import { store } from '@/lib/store';
import { PluginCondition } from '@/schema/plugin-config';
import { getAllRecordsWithId } from '@konomi-app/kintone-utilities';
import { getLookupSrcFields } from '../embedding-lookup-button/action';
import { alreadyCacheAtom, cacheErrorAtom } from '../embedding-lookup-button/states';
import { srcAllRawRecordsAtom } from '../embedding-lookup-button/states/records';
import { failSoftModeAtom, isCacheStartedAtom, validPluginConditionsAtom } from '../states';

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
        filterQuery = '',
        isFailSoftEnabled,
      } = condition;

      try {
        store.set(isCacheStartedAtom(id), true);

        const fields = getLookupSrcFields(condition);
        await getAllRecordsWithId({
          app: srcAppId,
          condition: filterQuery,
          fields,
          guestSpaceId: isSrcAppGuestSpace ? (srcSpaceId ?? undefined) : undefined,
          debug: !isProd,
          onStep: ({ records }) => {
            store.set(srcAllRawRecordsAtom(id), records);
          },
        });
        store.set(alreadyCacheAtom(id), true);
      } catch (error) {
        if (isFailSoftEnabled) {
          try {
            !isProd && console.info(`🔥 fail soft mode enabled for ${id}`);
            store.set(failSoftModeAtom(id), true);
            const fields = getLookupSrcFields(condition);
            const records = await getAllRecordsWithId({
              app: srcAppId,
              fields,
              guestSpaceId: isSrcAppGuestSpace ? (srcSpaceId ?? undefined) : undefined,
              debug: !isProd,
            });
            store.set(srcAllRawRecordsAtom(id), records);
            store.set(alreadyCacheAtom(id), true);
            return;
          } catch (error) {
            store.set(failSoftModeAtom(id), false);
            !isProd && console.error(error);
          }
        }

        !isProd && console.error(error);
        if (error instanceof Error) {
          store.set(cacheErrorAtom(id), error.message);
        } else if (
          error instanceof Object &&
          'message' in error &&
          typeof error.message === 'string'
        ) {
          store.set(cacheErrorAtom(id), error.message);
        } else if (typeof error === 'string') {
          store.set(cacheErrorAtom(id), error);
        } else {
          store.set(cacheErrorAtom(id), '不明なエラーが発生しました');
        }
      }
    };

    Promise.all(conditions.map(createCache)).then(() => {
      !isProd && console.log('✨ src cache created');
    });

    return event;
  }
);
