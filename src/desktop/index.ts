import Launcher from '@common/launcher';

import embedLookupButton from './embedding-lookup-button';
import validation from './validation';

((PLUGIN_ID) => new Launcher(PLUGIN_ID).launch([embedLookupButton, validation]))(
  kintone.$PLUGIN_ID
);
