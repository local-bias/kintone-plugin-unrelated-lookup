import { pluginConditionAtom } from '@/desktop/embedding-lookup-button/states';
import { srcAppPropertiesAtom } from '@/desktop/embedding-lookup-button/states/kintone';
import { useAtomValue } from 'jotai';
import { Suspense, type FC } from 'react';
import { useAttachmentProps } from '../../attachment-context';

const TableHeaderCell: FC<{ fieldCode: string }> = ({ fieldCode }) => {
  const { conditionId } = useAttachmentProps();
  const properties = useAtomValue(srcAppPropertiesAtom(conditionId));

  const found = Object.values(properties).find((property) => property.code === fieldCode);

  return <th>{found?.label ?? fieldCode}</th>;
};

const TableHeader: FC = () => {
  const { conditionId } = useAttachmentProps();
  const condition = useAtomValue(pluginConditionAtom(conditionId));

  return (
    <thead>
      <tr>
        {condition.displayFields.map((field, i) => (
          <Suspense key={i} fallback={<th>{field.fieldCode}</th>}>
            <TableHeaderCell fieldCode={field.fieldCode} />
          </Suspense>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
