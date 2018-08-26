import rootRand from "./rand";
import { guyTypes } from './guys';
import { mid } from "./math";
import { sheets } from './sheets';
const groundSheet = sheets.find(s => s.name === 'ground');
const propsSheet = sheets.find(s => s.name === 'props');

export const ROOM_SEGMENTS = 22;
export const GROUND_WIDTH = 4;
export const ROOM_WIDTH = ROOM_SEGMENTS * GROUND_WIDTH;
export const ROOM_HEIGHT = 53;
export const MIN_GROUND_HEIGHT = 35;
export const MAX_GROUND_HEIGHT = 50;
export const NUM_PROPS = 22;

const rand = rootRand.create(404);

function sprites() {
    const sprites = [];

    this.ground.forEach((g, i) => {
        for(var y = g.height; y < ROOM_HEIGHT; y += 8) {
            sprites.push({
                key: `ground${i}-${y}`,
                sheet: groundSheet,
                sprite: 0,
                x: i*4,
                y
            });
        }
        sprites.push(
            ...g.props.map((p, pIdx) => ({
                key: `prop${i}-${pIdx}`,
                sheet: propsSheet,
                sprite: p,
                x: (i+0.5)*GROUND_WIDTH,
                y: g.height + 8,
            }))
        );
    });

    return sprites;
}

function makeRoom(prevRoom) {
    const startGround = (prevRoom) ? 
        {...prevRoom.ground[prevRoom.ground.length-1], props: [] } :
        { height: (MIN_GROUND_HEIGHT + MAX_GROUND_HEIGHT) / 2, frame: 0, props: [] };
    const roomNum = (prevRoom) ? prevRoom.roomNum + 1 : 0;
    const ground = [startGround];
    const guys = [];
    for(var i = 1; i < ROOM_SEGMENTS; ++i) {
        var h = ground[i-1].height + rand(-2, 2);
        if(rand()<0.05) h += rand(-20, 20);
        h = mid(MIN_GROUND_HEIGHT, h, MAX_GROUND_HEIGHT);
        ground[i] = { height: h, frame: startGround.frame, props: [] };
    }
    for(var i = 1; rand() < i; i *= 0.94) {
        ground[rand(ROOM_SEGMENTS)].props.push(rand(NUM_PROPS));
    }
    for(var i = 0.8; rand() < i; i *= 0.8) {
        const guyType = rand(guyTypes);
        const guy = {...guyType({ roomNum, x: rand(40, 80), rand: rand.create() })}
        guys.push(guy);
    }
    return { ground, guys, roomNum, sprites };
}

const rooms = [];

export function getRoom(roomNum) {
    if (roomNum < 0) return null;

    if (!rooms[roomNum]) {
        rooms[roomNum] = makeRoom(roomNum === 0 ? null : getRoom(roomNum - 1));
    }

    return rooms[roomNum];
}

