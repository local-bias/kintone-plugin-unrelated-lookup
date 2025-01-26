import { createTheme } from '@mui/material';
import { LANGUAGE } from './global';
import { enUS, esES, jaJP, zhCN } from '@mui/material/locale';

export const ui = {
  ja: {
    'common.cancel': 'キャンセル',
    'common.clear': 'クリア',
    'common.get': '取得',

    'desktop.lookupDialog.empty.title': '条件に一致するレコードが見つかりませんでした。',
    'desktop.lookupDialog.empty.description.1': '左上の検索フィールドの値をご確認ください。',
    'desktop.lookupDialog.empty.description.2':
      '検索はプラグインに設定した表示フィールドに対してのみ実行されています。',
    'desktop.lookupDialog.searchInput.label': 'レコードを検索',
    'desktop.lookupDialog.dynamicCondition.label': '{0} に「{1}」を{2}',
    'desktop.lookupDialog.dynamicCondition.label.include': '含む',
    'desktop.lookupDialog.dynamicCondition.label.exclude': '含まない',

    'desktop.toast.action.undo': '元に戻す',
    'desktop.toast.success.undo': 'ルックアップを元に戻しました',
    'desktop.toast.success.clear': '参照先フィールドをクリアしました',
    'desktop.toast.error.missingRowNumberInSubtableMode':
      'サブテーブルモードで行番号が指定されていません',
    'desktop.toast.error.unknown': 'ルックアップ時にエラーが発生しました',

    'desktop.error.dstFieldNotFound': 'ルックアップ先のフィールドが見つかりません',
    'desktop.error.srcFieldNotFound':
      'ルックアップの参照元フィールドが存在しません。プラグインの設定を確認してください。',
    'desktop.error.dstSubtableFieldNotFound':
      'ルックアップフィールドを設置するサブテーブルが見つかりません。プラグインの設定を確認してください。',
    'desktop.error.dstSubtableRowNotFound': 'ルックアップ先のサブテーブル行が見つかりません',
    'desktop.error.multipleSrcRecordsFound':
      '入力された値に一致するレコードが複数見つかりました。取得ボタンを押して選択してください',
    'desktop.error.invalidLicense': 'ライセンスが無効です',
    'desktop.error.srcRecordNotFound': '入力された値に一致するレコードが見つかりませんでした',
    'desktop.fieldError.buttonNotPressedError':
      '「取得」を押し、参照先からデータを取得してください。',
    'desktop.fieldError.unknownError': '入力値に誤りがあります',
    'desktop.fieldError.invalidFieldType': '自動入力されるフィールドを更新することはできません',
    'desktop.fieldError.invalidNumber':
      '参照元の値が数値ではないため、コピーは実行されませんでした',
    'desktop.fieldError.invalidDate':
      '参照元のフォーマットが適切でないため、コピーは実行されませんでした',
    'desktop.fieldError.invalidOption':
      '参照元の値が選択肢に含まれていないため、コピーは実行されませんでした',
    'desktop.eventError.lookupFailed': '{0}のルックアップを実行しましたが、{1}',
    'desktop.eventError.lookupFailedUnknown':
      '{0}のルックアップを実行しましたが、正しく取得することができませんでした。入力値に誤りがないか確認してください。',
  },
  en: {
    'common.cancel': 'Cancel',
    'common.clear': 'Clear',
    'common.get': 'Get',

    'desktop.lookupDialog.empty.title': 'No records matching the criteria were found.',
    'desktop.lookupDialog.empty.description.1':
      'Please check the value in the search field at the top left.',
    'desktop.lookupDialog.empty.description.2':
      'The search is only performed on the display fields set in the plugin.',
    'desktop.lookupDialog.searchInput.label': 'Search records',
    'desktop.lookupDialog.dynamicCondition.label': '{0} {2} "{1}"',
    'desktop.lookupDialog.dynamicCondition.label.include': 'includes',
    'desktop.lookupDialog.dynamicCondition.label.exclude': 'does not include',

    'desktop.toast.action.undo': 'Undo',
    'desktop.toast.success.undo': 'Lookup has been undone',
    'desktop.toast.success.clear': 'Reference field has been cleared',
    'desktop.toast.error.missingRowNumberInSubtableMode':
      'Row number is not specified in subtable mode',
    'desktop.toast.error.unknown': 'An error occurred during lookup',

    'desktop.error.dstFieldNotFound': 'Destination field for lookup not found',
    'desktop.error.srcFieldNotFound':
      'Source field for lookup does not exist. Please check the plugin settings.',
    'desktop.error.dstSubtableFieldNotFound':
      'Subtable to place the lookup field not found. Please check the plugin settings.',
    'desktop.error.dstSubtableRowNotFound': 'Destination subtable row for lookup not found',
    'desktop.error.multipleSrcRecordsFound':
      'Multiple records matching the entered value were found. Please press the get button to select.',
    'desktop.error.invalidLicense': 'License is invalid',
    'desktop.error.srcRecordNotFound': 'No records matching the entered value were found',
    'desktop.fieldError.buttonNotPressedError':
      'Please press "Get" to retrieve data from the reference.',
    'desktop.fieldError.unknownError': 'There is an error in the input value',
    'desktop.fieldError.invalidFieldType': 'Auto-populated fields cannot be updated',
    'desktop.fieldError.invalidNumber':
      'Copy was not executed because the reference value is not a number',
    'desktop.fieldError.invalidDate':
      'Copy was not executed because the reference format is not appropriate',
    'desktop.fieldError.invalidOption':
      'Copy was not executed because the reference value is not included in the options',
    'desktop.eventError.lookupFailed': 'Lookup for {0} was executed, but {1}',
    'desktop.eventError.lookupFailedUnknown':
      'Lookup for {0} was executed, but it could not be retrieved correctly. Please check if there is an error in the input value.',
  },
  es: {
    'common.cancel': 'Cancelar',
    'common.clear': 'Limpiar',
    'common.get': 'Obtener',

    'desktop.lookupDialog.empty.title':
      'No se encontraron registros que coincidan con los criterios.',
    'desktop.lookupDialog.empty.description.1':
      'Por favor, verifique el valor del campo de búsqueda en la esquina superior izquierda.',
    'desktop.lookupDialog.empty.description.2':
      'La búsqueda solo se realiza en los campos de visualización configurados en el plugin.',
    'desktop.lookupDialog.searchInput.label': 'Buscar registros',
    'desktop.lookupDialog.dynamicCondition.label': '{0} contiene "{1}" en {2}',
    'desktop.lookupDialog.dynamicCondition.label.include': 'Incluir',
    'desktop.lookupDialog.dynamicCondition.label.exclude': 'Excluir',

    'desktop.toast.action.undo': 'Deshacer',
    'desktop.toast.success.undo': 'Se ha deshecho la búsqueda',
    'desktop.toast.success.clear': 'Se ha limpiado el campo de referencia',
    'desktop.toast.error.missingRowNumberInSubtableMode':
      'No se ha especificado el número de fila en el modo de subtabla',
    'desktop.toast.error.unknown': 'Se produjo un error durante la búsqueda',

    'desktop.error.dstFieldNotFound': 'No se encontró el campo de destino de la búsqueda',
    'desktop.error.srcFieldNotFound':
      'No existe el campo de referencia de la búsqueda. Por favor, verifique la configuración del plugin.',
    'desktop.error.dstSubtableFieldNotFound':
      'No se encontró la subtabla donde se debe colocar el campo de búsqueda. Por favor, verifique la configuración del plugin.',
    'desktop.error.dstSubtableRowNotFound':
      'No se encontró la fila de la subtabla de destino de la búsqueda',
    'desktop.error.multipleSrcRecordsFound':
      'Se encontraron múltiples registros que coinciden con el valor ingresado. Por favor, presione el botón de obtener y seleccione uno.',
    'desktop.error.invalidLicense': 'La licencia no es válida',
    'desktop.error.srcRecordNotFound':
      'No se encontraron registros que coincidan con el valor ingresado',
    'desktop.fieldError.buttonNotPressedError':
      'Por favor, presione "Obtener" para obtener datos del campo de referencia.',
    'desktop.fieldError.unknownError': 'Hay un error en el valor ingresado',
    'desktop.fieldError.invalidFieldType': 'No se pueden actualizar los campos de autocompletado',
    'desktop.fieldError.invalidNumber':
      'No se ejecutó la copia porque el valor de referencia no es un número',
    'desktop.fieldError.invalidDate':
      'No se ejecutó la copia porque el formato de referencia no es apropiado',
    'desktop.fieldError.invalidOption':
      'No se ejecutó la copia porque el valor de referencia no está incluido en las opciones',
    'desktop.eventError.lookupFailed': 'Se ejecutó la búsqueda de {0}, pero {1}',
    'desktop.eventError.lookupFailedUnknown':
      'Se ejecutó la búsqueda de {0}, pero no se pudo obtener correctamente. Por favor, verifique si hay algún error en el valor ingresado.',
  },
  zh: {
    'common.cancel': '取消',
    'common.clear': '清除',
    'common.get': '获取',

    'desktop.lookupDialog.empty.title': '未找到符合条件的记录。',
    'desktop.lookupDialog.empty.description.1': '请检查左上角的搜索字段值。',
    'desktop.lookupDialog.empty.description.2': '搜索仅在插件设置的显示字段中执行。',
    'desktop.lookupDialog.searchInput.label': '搜索记录',
    'desktop.lookupDialog.dynamicCondition.label': '{0} 中包含“{1}”的{2}',
    'desktop.lookupDialog.dynamicCondition.label.include': '包含',
    'desktop.lookupDialog.dynamicCondition.label.exclude': '不包含',

    'desktop.toast.action.undo': '撤销',
    'desktop.toast.success.undo': '已撤销查找',
    'desktop.toast.success.clear': '已清除引用字段',
    'desktop.toast.error.missingRowNumberInSubtableMode': '子表模式下未指定行号',
    'desktop.toast.error.unknown': '查找时发生错误',

    'desktop.error.dstFieldNotFound': '未找到查找目标字段',
    'desktop.error.srcFieldNotFound': '未找到查找源字段。请检查插件设置。',
    'desktop.error.dstSubtableFieldNotFound': '未找到放置查找字段的子表。请检查插件设置。',
    'desktop.error.dstSubtableRowNotFound': '未找到查找目标子表行',
    'desktop.error.multipleSrcRecordsFound': '找到多个与输入值匹配的记录。请按获取按钮进行选择。',
    'desktop.error.invalidLicense': '许可证无效',
    'desktop.error.srcRecordNotFound': '未找到与输入值匹配的记录',
    'desktop.fieldError.buttonNotPressedError': '请按“获取”按钮，从引用中获取数据。',
    'desktop.fieldError.unknownError': '输入值有误',
    'desktop.fieldError.invalidFieldType': '无法更新自动填充字段',
    'desktop.fieldError.invalidNumber': '由于引用值不是数字，未执行复制',
    'desktop.fieldError.invalidDate': '由于引用格式不正确，未执行复制',
    'desktop.fieldError.invalidOption': '由于引用值未包含在选项中，未执行复制',
    'desktop.eventError.lookupFailed': '执行{0}的查找时，{1}',
    'desktop.eventError.lookupFailedUnknown':
      '执行{0}的查找时，未能正确获取。请检查输入值是否有误。',
  },
  'zh-TW': {
    'common.cancel': '取消',
    'common.clear': '清除',
    'common.get': '取得',

    'desktop.lookupDialog.empty.title': '未找到符合條件的記錄。',
    'desktop.lookupDialog.empty.description.1': '請檢查左上角的搜索字段值。',
    'desktop.lookupDialog.empty.description.2': '搜索僅針對插件中設置的顯示字段進行。',
    'desktop.lookupDialog.searchInput.label': '搜索記錄',
    'desktop.lookupDialog.dynamicCondition.label': '{0} 中「{1}」為{2}',
    'desktop.lookupDialog.dynamicCondition.label.include': '包含',
    'desktop.lookupDialog.dynamicCondition.label.exclude': '不包含',

    'desktop.toast.action.undo': '撤銷',
    'desktop.toast.success.undo': '已撤銷查找',
    'desktop.toast.success.clear': '已清除參照字段',
    'desktop.toast.error.missingRowNumberInSubtableMode': '子表模式下未指定行號',
    'desktop.toast.error.unknown': '查找時發生錯誤',

    'desktop.error.dstFieldNotFound': '未找到查找目標字段',
    'desktop.error.srcFieldNotFound': '未找到查找源字段。請檢查插件設置。',
    'desktop.error.dstSubtableFieldNotFound': '未找到設置查找字段的子表。請檢查插件設置。',
    'desktop.error.dstSubtableRowNotFound': '未找到查找目標的子表行',
    'desktop.error.multipleSrcRecordsFound': '找到多個與輸入值匹配的記錄。請按取得按鈕進行選擇。',
    'desktop.error.invalidLicense': '許可證無效',
    'desktop.error.srcRecordNotFound': '未找到與輸入值匹配的記錄',
    'desktop.fieldError.buttonNotPressedError': '請按「取得」按鈕從參照中獲取數據。',
    'desktop.fieldError.unknownError': '輸入值有誤',
    'desktop.fieldError.invalidFieldType': '無法更新自動填充字段',
    'desktop.fieldError.invalidNumber': '由於引用值不是數字，未執行複制',
    'desktop.fieldError.invalidDate': '由於引用格式不正確，未執行複制',
    'desktop.fieldError.invalidOption': '由於引用值未包含在選項中，未執行複制',
    'desktop.eventError.lookupFailed': '執行{0}的查找時，{1}',
    'desktop.eventError.lookupFailedUnknown':
      '執行{0}的查找時，無法正確取得。請檢查輸入值是否有誤。',
  },
} as const;

export type Language = keyof typeof ui;

export const defaultLang = 'ja' satisfies Language;

const isSupportedLang = (lang: string): lang is Language => lang in ui;

/**
 * 指定された言語に対応する翻訳関数を返します。
 * @param lang - 言語のキー
 * @returns 指定された言語に対応する翻訳関数
 */
export function useTranslations(lang: string) {
  const validLang = isSupportedLang(lang) ? lang : defaultLang;

  return function t(key: keyof (typeof ui)[typeof defaultLang], ...args: string[]): string {
    /* eslint @typescript-eslint/ban-ts-comment: 0 */
    // @ts-ignore デフォルト言語以外の設定が不十分な場合は、デフォルト言語の設定を使用します
    let translation: string = ui[validLang][key] ?? ui[defaultLang][key];

    // プレースホルダーを置換
    args.forEach((arg, index) => {
      translation = translation.replace(`{${index}}`, arg);
    });

    return translation;
  };
}

export const t = useTranslations(LANGUAGE);

const getMUILang = () => {
  switch (LANGUAGE) {
    case 'en': {
      return enUS;
    }
    case 'zh': {
      return zhCN;
    }
    case 'es': {
      return esES;
    }
    case 'ja':
    default: {
      return jaJP;
    }
  }
};

export const getMUITheme = () => {
  return createTheme(
    {
      palette: {
        primary: {
          main: '#3498db',
        },
      },
    },
    getMUILang()
  );
};
