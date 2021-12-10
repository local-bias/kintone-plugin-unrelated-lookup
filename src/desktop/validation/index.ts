import { cleanseStorage, restoreStorage } from '@common/plugin';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const events: launcher.EventTypes = ['app.record.create.submit', 'app.record.edit.submit'];

const action: launcher.Action = async (event, pluginId) => {
  const { conditions } = cleanseStorage(restoreStorage(pluginId));

  const targetConditions = conditions.filter(
    (condition) => condition.srcField && condition.srcAppId && condition.enablesValidation
  );

  if (!targetConditions.length) {
    return event;
  }

  const client = new KintoneRestAPIClient();

  for (const condition of targetConditions) {
    if (!event.record[condition.dstField] || !event.record[condition.dstField].value) {
      continue;
    }
    const app = condition.srcAppId;
    const value = event.record[condition.dstField].value;
    const query = `${condition.srcField} = "${value}"`;

    const { records } = await client.record.getRecords({ app, query });

    if (!records.length) {
      event.record[condition.dstField].error = '[取得]を押し、参照先からデータを取得してください。';
      event.error = 'ルックアップが完了していないフィールドが存在します';
    }
  }

  return event;
};

export default { action, events };
