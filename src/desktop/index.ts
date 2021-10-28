import Launcher from '@common/launcher';

import embedLookupButton from './embedding-lookup-button';

((PLUGIN_ID) => new Launcher(PLUGIN_ID).launch([embedLookupButton]))(kintone.$PLUGIN_ID);
