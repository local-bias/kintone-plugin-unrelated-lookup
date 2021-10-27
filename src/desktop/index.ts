import Launcher from '@common/launcher';

import event from './event';
import embedLookupButton from './embedding-lookup-button';

((PLUGIN_ID) => new Launcher(PLUGIN_ID).launch([event, embedLookupButton]))(kintone.$PLUGIN_ID);
