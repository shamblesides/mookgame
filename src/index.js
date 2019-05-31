import { pxcan } from 'pxcan/pxcan.js'
import { binds } from './binds.js';
import { worldview } from './mookgame.js';
import { pad } from 'pxcan/pad.js'
import { pointer } from 'pxcan/pointer.js'

pxcan({ height: 224, width: 448, fps: 30 }, [pad(binds), pointer()], worldview).fullscreen();
