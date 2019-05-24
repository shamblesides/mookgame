import { pxcan } from 'pxcan/pxcan.js'
import { binds } from './binds.js';
import { worldview } from './gameloop.js';
import { pad } from 'pxcan/pad.js'

pxcan({ height: 60, width: 90 }, [pad(binds)], worldview()).fullscreen();
