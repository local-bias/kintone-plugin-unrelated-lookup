type Field = {
  fieldCode: string;
  valueAtStart: string;
  lookuped: boolean;
};

/**
 * レコード編集開始時とレコード保存時で、フィールドの値が変更されているか監視するためのオブザーバー
 */
export const lookupObserver: { [conditionId: string]: Field } = {};
