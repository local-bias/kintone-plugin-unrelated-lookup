import Launcher from '@common/launcher';

import embedLookupButton from './embedding-lookup-button';
import validation from './validation';
import onSave from './on-save';
import initializeObserver from './initialize-observer';

((PLUGIN_ID) =>
  new Launcher(PLUGIN_ID).launch([initializeObserver, embedLookupButton, validation, onSave]))(
  kintone.$PLUGIN_ID
);
