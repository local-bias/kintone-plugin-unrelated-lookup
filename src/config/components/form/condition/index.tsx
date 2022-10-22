import React, { memo, useState, FC, FCX } from 'react';
import { Accordion, AccordionActions, AccordionDetails } from '@mui/material';

import AccordionSummary from '../../ui/accordion-summary';

import ConditionForm from './condition-form';
import ConditionDeletionButton from '../../functional/condition-deletion-button';
import { useConditionIndex } from '../../functional/condition-index-provider';

type Props = {
  expanded: boolean;
  onChange: () => void;
};

const Component: FCX<Props> = ({ className, expanded, onChange }) => (
  <Accordion {...{ expanded, onChange, className }} variant='outlined' square>
    <AccordionSummary />
    <AccordionDetails>
      <ConditionForm />
    </AccordionDetails>
    <AccordionActions>
      <ConditionDeletionButton />
    </AccordionActions>
  </Accordion>
);

const Container: FC = memo(() => {
  const index = useConditionIndex();
  const [expanded, setExpanded] = useState<boolean>(index === 0);

  const onChange = () => setExpanded((_expanded) => !_expanded);

  return <Component {...{ expanded, onChange }} />;
});

export default Container;
