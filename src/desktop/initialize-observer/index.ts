import { cleanseStorage, restoreStorage } from '@common/plugin';
import { lookupObserver } from '../lookup-observer';

const events: launcher.EventTypes = ['app.record.create.show', 'app.record.edit.show'];

const action: launcher.Action = async (event, pluginId) => {
  const { conditions } = cleanseStorage(restoreStorage(pluginId));

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId
  );

  if (!targetConditions.length) {
    return event;
  }

  for (const condition of targetConditions) {
    if (!event.record[condition.dstField]) {
      continue;
    }

    lookupObserver[condition.dstField] = {
      atStart: event.record[condition.dstField].value || '',
      lookuped: false,
    };
  }

  console.log({ lookupObserver });

  return event;
};

export default { events, action };
