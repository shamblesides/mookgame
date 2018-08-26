import rand from './rand';
import { sheets } from './sheets';
import { getRoom, GROUND_WIDTH, ROOM_WIDTH } from './rooms';
import { mid, clamp } from './math';
const guysSheet = sheets.find(s => s.name === 'guys');

const ids = (function * () {
    for (let i = 0;;) yield `guy${i++}`;
})();

export default (overrides = {}) => ({
    id: ids.next().value,
    roomNum: null,
    w: 12,
    h: 12,
    x: null,
    y: 20,
    xv: 0,
    yv: 0,
    xa: 0,
    ya: 0.15,
    xfric: 0.5,
    xdrag: 0.1,
    xvmax: 2,
    yvmax: 4,
    flip: '',
    // behavior
    brain: () => ({}),
    act: () => undefined,
    frame: () => 0,
    rand: rand.create(),
    // methods
    left() { return this.x - this.w/2; },
    right() { return this.x + this.w/2; },
    top() { return this.y - this.h/2; },
    bottom() { return this.y + this.h/2; },
    room() { return getRoom(this.roomNum); },
    nextRoom() { return getRoom(this.roomNum + 1); },
    prevRoom() { return getRoom(this.roomNum - 1); },
    groundIndex() { return Math.floor(this.x / GROUND_WIDTH); },
    ground() { return this.room().ground[this.groundIndex()]; },
    isGrounded() { return this.ground().height === this.bottom(); },
    move() {
        // velocity
        this.xv += this.xa;
        var xslow = this.isGrounded()? this.xfric: this.xdrag;
        this.xv = mid(0, this.xv, this.xv-(xslow*Math.sign(this.xv)));
        this.xv = clamp(this.xv, this.xvmax);
        this.yv = Math.max(this.yv + this.ya, -this.yvmax);
        // move x
        var oldx = this.x;
        var wasg = this.isGrounded();
        this.x = mid(this.x + this.xv, 0, ROOM_WIDTH - 1);
        var newg = this.ground();
        if(newg.height < this.bottom() - 3) { this.x = oldx; this.xv = 0; }
        // move y
        this.y = Math.max(this.y + this.yv, 0);
        if(wasg && this.yv > 0 && this.bottom() > this.ground().height - 3) {
            this.y = this.ground().height - this.h/2;
            this.yv = 0;
        }
        else if(this.yv > 0 && this.bottom() > this.ground().height) {
            this.y = this.ground().height - this.h/2;
            this.yv = 0;
        }
    },
    sprite(clock) {
        return {
            key: this.id,
            sheet: guysSheet,
            sprite: this.frame(clock),
            x: this.x,
            y: this.y,
        };
    },
    ...overrides
})