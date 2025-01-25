import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import { JotaiSwitch, JotaiText, JotaiTogglePanel } from '@konomi-app/kintone-utilities-jotai';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from '@konomi-app/kintone-utilities-react';
import { FC } from 'react';
import {
  autoLookupAtom,
  conditionTypeAtom,
  dstSubtableFieldCodeAtom,
  enablesValidationAtom,
  isCaseSensitiveAtom,
  isFailSoftEnabledAtom,
  isHankakuKatakanaSensitiveAtom,
  isKatakanaSensitiveAtom,
  isZenkakuEisujiSensitiveAtom,
  queryAtom,
  saveAndLookupAtom,
} from '../../../states/plugin';
import DeleteButton from './condition-delete-button';
import ConditionTypeForm from './form-condition-type';
import CopiesForm from './form-copies';
import DisplayFieldsForm from './form-display-fields';
import DstFieldForm from './form-dst-field';
import DstSubtableForm from './form-dst-subtable';
import DynamicConditionsForm from './form-dynamic-conditions';
import SortCriteriaForm from './form-sort-criteria';
import SrcAppForm from './form-src-app';
import SrcFieldForm from './form-src-field';

const Component: FC = () => (
  <div className='p-4'>
    <PluginFormSection>
      <PluginFormTitle>対象フィールド(ルックアップボタンを設置するフィールド)</PluginFormTitle>
      <PluginFormDescription>
        <span style={{ color: 'red' }}>文字列1行フィールドを選択してください。</span>
        <span style={{ color: 'orangered' }}>
          ルックアップフィールドを使用することも可能ですが、非推奨です。
        </span>
      </PluginFormDescription>
      <PluginFormDescription last>
        また、対象フィールドにボタンを設置するため、アプリ設定からフィールドの幅に余裕を持たせてください。
      </PluginFormDescription>

      <ConditionTypeForm />

      <JotaiTogglePanel
        className='px-4 py-2 ml-4 mt-2 border-l'
        atom={conditionTypeAtom}
        shouldShow={(value) => value === 'subtable'}
      >
        <PluginFormSection>
          <h3 className='text-base font-bold'>対象となるサブテーブル</h3>
          <PluginFormDescription last>
            ルックアップを設定するサブテーブルを選択してください。
          </PluginFormDescription>
          <DstSubtableForm />

          <JotaiTogglePanel
            className='px-4 py-2 ml-4 mt-2 border-l'
            atom={dstSubtableFieldCodeAtom}
            shouldShow={(value) => !!value}
          >
            <PluginFormSection>
              <h3 className='text-base font-bold'>対象フィールド</h3>
              <PluginFormDescription last>
                サブテーブル内の対象フィールドを選択してください。
              </PluginFormDescription>
              <DstFieldForm />
            </PluginFormSection>
          </JotaiTogglePanel>
        </PluginFormSection>
      </JotaiTogglePanel>
      <JotaiTogglePanel
        className='mt-8'
        atom={conditionTypeAtom}
        shouldShow={(value) => value !== 'subtable'}
      >
        <DstFieldForm />
      </JotaiTogglePanel>
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>参照先アプリ</PluginFormTitle>
      <PluginFormDescription last>
        標準機能の「関連付けるアプリ」にあたる、ルックアップの取得先アプリを選択してください。
      </PluginFormDescription>
      <SrcAppForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>
        取得するフィールド(ボタンを設置したフィールドに反映するフィールド)
      </PluginFormTitle>
      <PluginFormDescription last>
        標準機能の「コピー元のフィールド」にあたる、ルックアップを実行した際に取得先からコピーするフィールドを選択してください。
      </PluginFormDescription>
      <SrcFieldForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>他のフィールドのコピー</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、併せてコピーするフィールドの設定を行います。
      </PluginFormDescription>
      <PluginFormDescription last>
        このアプリに存在するコピー元となるフィールドと、取得先アプリに存在するコピー先となるフィールドを選択してください。
      </PluginFormDescription>
      <CopiesForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>コピー元のレコードの選択時に表示するフィールド</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、対象レコードを選択するダイアログ上に表示するフィールドを選択してください。
      </PluginFormDescription>
      <PluginFormDescription last>
        ここで設定した並び順が、そのままテーブルヘッダーの並び順に反映されます。
      </PluginFormDescription>
      <DisplayFieldsForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>コピー元レコードの取得条件</PluginFormTitle>
      <PluginFormDescription>
        ルックアップ実行時に、対象レコードを絞り込む条件を設定します。
      </PluginFormDescription>
      <PluginFormDescription last>
        ここで指定した条件に合致するレコードのみが、ルックアップの対象となります。
      </PluginFormDescription>
      <JotaiText
        label='クエリー'
        placeholder='例: 契約ステータス not in ("解約")'
        width={400}
        atom={queryAtom}
      />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>対象データの動的絞り込み</PluginFormTitle>
      <PluginFormDescription last>
        参照するデータを、編集しているレコードの特定のフィールドの値によって動的に絞り込むことができます。
      </PluginFormDescription>
      <DynamicConditionsForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>並び替え条件</PluginFormTitle>
      <PluginFormDescription last>
        対象レコードを選択するダイアログ上で表示するレコードの並び順を設定します。
      </PluginFormDescription>
      <SortCriteriaForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>その他のオプション</PluginFormTitle>
      <PluginFormDescription last></PluginFormDescription>
      <div className='flex flex-col gap-1'>
        <div className='px-4 py-2 ml-4 mt-2 border-l'>
          <h3 className='text-base font-bold'>標準機能との連携</h3>
          <JotaiSwitch
            label='コピー先に標準のルックアップフィールドが存在する場合、取得完了後自動的にルックアップを実行する'
            atom={autoLookupAtom}
          />
        </div>
        <div className='px-4 py-2 ml-4 mt-2 border-l'>
          <h3 className='text-base font-bold'>レコード保存時のふるまい</h3>
          <div className='grid gap-1'>
            <JotaiSwitch
              label='レコード保存時に、ルックアップが実行されていない場合はエラーを表示する'
              atom={enablesValidationAtom}
            />
            <JotaiSwitch
              label='レコード保存時に、ルックアップを実行する'
              atom={saveAndLookupAtom}
            />
          </div>
        </div>

        <div className='px-4 py-2 ml-4 mt-2 border-l'>
          <h3 className='text-base font-bold'>あいまい検索の設定</h3>
          <div className='grid gap-1'>
            <JotaiSwitch
              label='絞り込みの際、アルファベットの大文字と小文字を区別する'
              atom={isCaseSensitiveAtom}
            />
            <JotaiSwitch
              label='絞り込みの際、カタカナとひらがなを区別する'
              atom={isKatakanaSensitiveAtom}
            />
            <JotaiSwitch
              label='絞り込みの際、半角カナと全角カナを区別する'
              atom={isHankakuKatakanaSensitiveAtom}
            />
            <JotaiSwitch
              label='絞り込みの際、全角英数字と半角英数字を区別する'
              atom={isZenkakuEisujiSensitiveAtom}
            />
          </div>
        </div>
        <div className='px-4 py-2 ml-4 mt-2 border-l'>
          <h3 className='text-base font-bold'>フェールソフトモード</h3>
          <PluginFormDescription>
            フェールソフトモードを有効にすると、プラグイン設定に誤りがありレコードの取得が正常に行えない場合でも、全件取得を行うことでエラーを回避します。
          </PluginFormDescription>
          <JotaiSwitch label='フェールソフトモードを有効にする' atom={isFailSoftEnabledAtom} />
        </div>
      </div>
    </PluginFormSection>
    <DeleteButton />
  </div>
);

const Container: FC = () => {
  return (
    <PluginErrorBoundary>
      <Component />
    </PluginErrorBoundary>
  );
};

export default Container;
