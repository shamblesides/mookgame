import { pxcan } from 'pxcan/src/pxcan.js'
import { binds } from './binds.js';
import { worldview } from './gameloop.js';
import { pad } from 'pxcan/src/input/pad.js'

pxcan({ height: 60, width: 90 }, [pad(binds)], worldview()).fullscreen();
