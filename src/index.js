import { pxcan } from 'pxcan/pxcan.js'
import { binds } from './binds.js';
import { worldview } from './mookgame.js';
import { pad } from 'pxcan/pad.js'

pxcan({ height: 224, width: 448 }, [pad(binds)], worldview).fullscreen();
