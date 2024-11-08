import { PluginErrorBoundary } from '@/lib/components/error-boundary';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
  RecoilSwitch,
  RecoilText,
} from '@konomi-app/kintone-utilities-react';
import { FC } from 'react';
import {
  autoLookupState,
  enablesCacheState,
  enablesValidationState,
  isCaseSensitiveState,
  isHankakuKatakanaSensitiveState,
  isKatakanaSensitiveState,
  isZenkakuEisujiSensitiveState,
  queryState,
  saveAndLookupState,
} from '../../../states/plugin';
import DeleteButton from './condition-delete-button';
import CopiesForm from './form-copies';
import DisplayFieldsForm from './form-display-fields';
import DstFieldForm from './form-dst-field';
import SrcAppForm from './form-src-app';
import SrcFieldForm from './form-src-field';

const Component: FC = () => (
  <div className='p-4'>
    <PluginFormSection>
      <PluginFormTitle>対象フィールド(ルックアップボタンを設置するフィールド)</PluginFormTitle>
      <PluginFormDescription>
        <span style={{ color: 'red' }}>
          ルックアップフィールドは使用しません。文字列1行フィールドを選択してください。
        </span>
      </PluginFormDescription>
      <PluginFormDescription last>
        また、対象フィールドにボタンを設置するため、アプリ設定からフィールドの幅に余裕を持たせてください。
      </PluginFormDescription>
      <DstFieldForm />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>関連付けないアプリ(参照先アプリ)</PluginFormTitle>
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
      <RecoilText
        label='クエリー'
        placeholder='例: 契約ステータス not in ("解約")'
        width={400}
        state={queryState}
      />
    </PluginFormSection>

    <PluginFormSection>
      <PluginFormTitle>その他のオプション</PluginFormTitle>
      <PluginFormDescription last></PluginFormDescription>
      <div className='flex flex-col gap-1'>
        <RecoilSwitch
          label='事前に参照アプリのレコードを取得し、検索を高速化する'
          state={enablesCacheState}
        />
        <RecoilSwitch
          label='コピー先に標準のルックアップフィールドが存在する場合、取得完了後自動的にルックアップを実行する'
          state={autoLookupState}
        />
        <RecoilSwitch
          label='レコード保存時に、ルックアップが実行されていない場合はエラーを表示する'
          state={enablesValidationState}
        />
        <RecoilSwitch label='レコード保存時に、ルックアップを実行する' state={saveAndLookupState} />
        <RecoilSwitch
          label='絞り込みの際、アルファベットの大文字と小文字を区別する'
          state={isCaseSensitiveState}
        />
        <RecoilSwitch
          label='絞り込みの際、カタカナとひらがなを区別する'
          state={isKatakanaSensitiveState}
        />
        <RecoilSwitch
          label='絞り込みの際、半角カナと全角カナを区別する'
          state={isHankakuKatakanaSensitiveState}
        />
        <RecoilSwitch
          label='絞り込みの際、全角英数字と半角英数字を区別する'
          state={isZenkakuEisujiSensitiveState}
        />
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
