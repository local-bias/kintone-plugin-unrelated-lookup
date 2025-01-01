import { PluginErrorBoundary } from "@/lib/components/error-boundary";
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from "@konomi-app/kintone-utilities-react";
import {
  RecoilSwitch,
  RecoilText,
  RecoilTogglePanel,
} from "@konomi-app/kintone-utilities-recoil";
import { FC } from "react";
import {
  autoLookupState,
  conditionTypeState,
  enablesValidationState,
  isCaseSensitiveState,
  isFailSoftEnabledState,
  isHankakuKatakanaSensitiveState,
  isKatakanaSensitiveState,
  isZenkakuEisujiSensitiveState,
  queryState,
  saveAndLookupState,
} from "../../../states/plugin";
import DeleteButton from "./condition-delete-button";
import ConditionTypeForm from "./form-condition-type";
import CopiesForm from "./form-copies";
import DisplayFieldsForm from "./form-display-fields";
import DstFieldForm from "./form-dst-field";
import DstSubtableForm from "./form-dst-subtable";
import DynamicConditionsForm from "./form-dynamic-conditions";
import SrcAppForm from "./form-src-app";
import SrcFieldForm from "./form-src-field";
import SortCriteriaForm from "./form-sort-criteria";

const Component: FC = () => (
  <div className="p-4">
    <PluginFormSection>
      <PluginFormTitle>サブテーブルモード</PluginFormTitle>
      <PluginFormDescription last>
        サブテーブル内の文字列１行フィールドを対象とする場合は、この設定を有効にしてください。
      </PluginFormDescription>
      <ConditionTypeForm />
      <RecoilTogglePanel
        className="px-4 py-2 ml-4 mt-2 border-l"
        atom={conditionTypeState}
        shouldShow={(value) => value === "subtable"}
      >
        <PluginFormSection>
          <h3 className="text-base font-bold">対象となるサブテーブル</h3>
          <PluginFormDescription last>
            ルックアップを設定するサブテーブルを選択してください。
          </PluginFormDescription>
          <DstSubtableForm />
        </PluginFormSection>
      </RecoilTogglePanel>
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>
        対象フィールド(ルックアップボタンを設置するフィールド)
      </PluginFormTitle>
      <PluginFormDescription>
        <span style={{ color: "red" }}>
          文字列1行フィールドを選択してください。
        </span>
        <span style={{ color: "orangered" }}>
          ルックアップフィールドを使用することも可能ですが、非推奨です。
        </span>
      </PluginFormDescription>
      <PluginFormDescription last>
        また、対象フィールドにボタンを設置するため、アプリ設定からフィールドの幅に余裕を持たせてください。
      </PluginFormDescription>
      <DstFieldForm />
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
      <PluginFormTitle>
        コピー元のレコードの選択時に表示するフィールド
      </PluginFormTitle>
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
        label="クエリー"
        placeholder='例: 契約ステータス not in ("解約")'
        width={400}
        state={queryState}
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
      <div className="flex flex-col gap-1">
        <div className="px-4 py-2 ml-4 mt-2 border-l">
          <h3 className="text-base font-bold">標準機能との連携</h3>
          <RecoilSwitch
            label="コピー先に標準のルックアップフィールドが存在する場合、取得完了後自動的にルックアップを実行する"
            state={autoLookupState}
          />
        </div>
        <div className="px-4 py-2 ml-4 mt-2 border-l">
          <h3 className="text-base font-bold">レコード保存時のふるまい</h3>
          <div className="grid gap-1">
            <RecoilSwitch
              label="レコード保存時に、ルックアップが実行されていない場合はエラーを表示する"
              state={enablesValidationState}
            />
            <RecoilSwitch
              label="レコード保存時に、ルックアップを実行する"
              state={saveAndLookupState}
            />
          </div>
        </div>

        <div className="px-4 py-2 ml-4 mt-2 border-l">
          <h3 className="text-base font-bold">あいまい検索の設定</h3>
          <div className="grid gap-1">
            <RecoilSwitch
              label="絞り込みの際、アルファベットの大文字と小文字を区別する"
              state={isCaseSensitiveState}
            />
            <RecoilSwitch
              label="絞り込みの際、カタカナとひらがなを区別する"
              state={isKatakanaSensitiveState}
            />
            <RecoilSwitch
              label="絞り込みの際、半角カナと全角カナを区別する"
              state={isHankakuKatakanaSensitiveState}
            />
            <RecoilSwitch
              label="絞り込みの際、全角英数字と半角英数字を区別する"
              state={isZenkakuEisujiSensitiveState}
            />
          </div>
        </div>
        <div className="px-4 py-2 ml-4 mt-2 border-l">
          <h3 className="text-base font-bold">フェールソフトモード</h3>
          <PluginFormDescription>
            フェールソフトモードを有効にすると、プラグイン設定に誤りがありレコードの取得が正常に行えない場合でも、全件取得を行うことでエラーを回避します。
          </PluginFormDescription>
          <RecoilSwitch
            label="フェールソフトモードを有効にする"
            state={isFailSoftEnabledState}
          />
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
