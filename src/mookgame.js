import { fill } from 'pxcan/fill';
import { flip } from 'pxcan/flip';
import { pane } from 'pxcan/pane';
import { gridSheet } from 'pxcan/gridsheet';
import expressPng from './express.png';
import mookPng from './mook.png';
import objectsPng from './objects.png';
import particlePng from './particle.png';
import wallsPng from './walls.png';

function attachMovie($sheet, $key, $depth) {
	return {
		$sheet, $key, $depth,
		stop() {},
		gotoAndStop(n) { this._currentframe = n },
		nextFrame() { ++this._currentframe; },
		prevFrame() { --this._currentframe; },
		_currentframe: 1,
		_x: 0,
		_y: 0,
		swapDepths(newDepth) {},
	};
}

function trace(str) {
	console.log(str);
}

const _level0 = {
	_x: 0,
	_y: 0,
};

const expressSheet = gridSheet(expressPng, 31, 18)
const mookSheet = gridSheet(mookPng, 28, 28)
const objectSheet = gridSheet(objectsPng, 32, 32)
const particleSheet = gridSheet(particlePng, 18, 18)
const wallSheet = gridSheet(wallsPng, 32, 32)

//  VARIABLES USED!!
// g= INT:size of grid pice
// i= ___:generic temp variable

// q= ST_:stuff about the rooms!
// q.i[]= ARR:initialdepth
// q.j[]= ARR:already rendered rooms
// q.l[]= ARR:total rows
// q.m[]= ARR:total columns
// q.n[]= ARR:objects
// q.k= INT:initial depth with which to create the next room

// p= OBJ:player clip
// p.a= INT:grid position ROW
// p.b= INT:grid position COLUMN
// p.c= INT:grid position COLUMN special left test
// p.d= INT:grid position COLUMN special right test
// p.e= INT:object interaction (ID NUM)
// p.f= INT:downward motion
// p.h= INT:horizontal size of player (/2)
// p.i= INT:dedicated timer for player
// p.j= INT:object interaction (TYPE)
// p.k= INT:player killed-state
// p.l= INT:frames USEPOWER is pressed
// p.m= INT:powerup aimer linkage ID (-1 is none)
// p.n= INT:start post. of player
// p.o= INT:start post. of player
// p.p= INT:powerup
// p.q= INT:xscale of player on start.
// p.s= INT:xspeed of player
// p.t= INT:t is for terminal!! (room)
// p.u= INT:frames UP is pressed
// p.v= INT:vertical size of player
// p.w= INT:grid position for toe-level floor testing. ROW
// p.x= INT:frames INTERACT is pressed
// p.y= INT:player walkframe timeline
// p.z= INT:grid position for special walltest case; ROW

// a= 	OBJ:clip for "!", "?", and crosshairs
// a.s= INT:object's state

// c= 	OBJ:clip for the top and bottom cutscene-lookin' bars.
// c.s= BOO:object's state (false doesn't appear, true does.)

// d[][]= 		ARR:particle effect
// d[][].d[] = 	ARR:single particle
// d[][].a = 	INT:vertical position of attached object
// d[][].b = 	INT:horizontal position of attached object
// d[][].h = 	INT:horizontal parabola modifier
// d[][].k = 	BOO:if true, the stuff will not appear. though still active.
// d[][].v = 	INT:vertical parabola modifier
// d[][].p = 	BOO:whether it is player-centric
// d[][].q = 	INT:type of effect
// d[][].s = 	BOO:activation state; on or off
// d[][].t = 	INT:timer

// r= ARR:tile array

// x= ARR:object array
// x[][].e = INT: attached particle ID
// x[][].o = OBJ:object
// x[][].q = INT:for vine, the ID of the piece starting the vine succession
// x[][].r = INT:for vine, the ID of the piece after the current vine bit
// x[][].v = INT:for vine, the topmost point in terms of block coordinates
// x[][].w = INT:for vine, the bottom-most point in terms of block coordinates

// z= ST_:storage unit; represents temporary object construct
// z.x = INT:horizontal position
// z.y = INT:vertical position
// z.e = ARR:integer array for carrying lots of ID's and stuff
// z.h = INT:height of object
// z.w = INT:width of object

// v= ST_:storage unit; gives camera information like coodinate 
// v.a = DBL:y offset for the view
// v.b = DBL:x offset for the view
// v.c = INT:target y offset for the view
// v.d = INT:target x offset for the view
// v.s = INT:delay of following; 0 is instant
// v.h = INT:stage height
// v.w = INT:stage width

// _quality="LOW";

let g=32;

let r= new Array(4); //tiles
let x=new Array(r.length); //objects
let d=new Array(r.length); //particle effectts

let q={};
q.j=new Array(r.length); //if they're rendered or not
q.l=new Array(r.length); //rows =
q.m=new Array(r.length); //columns ||
q.n=new Array(r.length); //objects
q.i=new Array(r.length); //where depth for stuff in that room starts.
q.k=0;

let i, i1, i2, i3, i4, ia, ib;

initroom(0,7,14,0);
initroom(1,7,14,1);
initroom(2,7,14,3);
initroom(3,10,23,8);
for(i=0;i<r.length;i++)	q.j[i]=false;

let z={};
z.e={};

let v={};
v.b=0;
v.a=0;
v.d=0;
v.c=0;
v.s=16;
v.h=224;
v.w=448;

let p;
{	p=attachMovie("player", "player", -1);
	p.stop();
	p.t=0;
	p.s=0;
	p.h=9;
	p.v=23;
	p.u=0;
	p.f=0;
	p.k=0;
	p.n=0;
	p.o=0;
	p.q=100;
	p.y=1;
	p.x=0;
	p.e=-1;
	p.j=0;
	p.p=0;
	p.l=0;
	p.m=-1;
	depthplayer(p);
}
let a;
let c;
{	a=attachMovie("express","express",-2);
	a._x=-50;
	a._y=-50;
	a._alpha=0;
	a.s=0;
	
	c=attachMovie("anim","anim",-3);
	c.stop();
	c._x=0;
	c._y=0;
	c.s=false;
}

render(0);
reset(3,2);
// render(2)
// reset(5, 2)

let onMouseDown=function() {
	if(p.t==r.length-1) {
		i1=Math.floor(_ymouse/g);
		i2=Math.floor(_xmouse/g);
		if(r[p.t][i1][i2].w._currentframe==1) {
			r[p.t][i1][i2].w.gotoAndStop(2);
		} else if(r[p.t][i1][i2].w._currentframe==2) {
			r[p.t][i1][i2].w.gotoAndStop(1);
		}
	}
}

let onEnterFrame=function(buttons) {
	/// CONTROLS ///
	//trace(p.k);
	if(!c.s && p.m==-1) { // if there's nothing going on in the cutscene, otherwords.
		if(buttons.left.pressed && !buttons.right.pressed) {
			p.s-=2;
			if(p.j==1 && p.e>-1) {//don't change xscale
			} else p._xscale=-100;
		} else if(p.s<0) p.s++;
		
		if(buttons.right.pressed && !buttons.left.pressed) {
			p.s+=2;
			if(p.j==1 && p.e>-1) { //don't change xscale
			} else p._xscale=100;
		} else if(p.s>0) p.s--;
		
		if(p.j==1 && p.e>-1) {
			if(p.s>6) p.s=6;
			else if(p.s<-6) p.s=-6;
		} else {
			if(p.s>10) p.s=10;
			else if(p.s<-10) p.s=-10;
		}
		
		// FRAME MODULATING //
		if((buttons.left.pressed && !buttons.right.pressed) || (buttons.right.pressed && !buttons.left.pressed)){
			if(p.y==1) p.y=8;
			else if(p.j==1 && p.e>-1) {
				p.y+=0.34;
				if(p.y>19.8 || p.y<16)  p.y=16;
			} else {
				p.y++;
				if(p.y>15) p.y=8;
			}
		} else {
			if(p.j==1 && p.e>-1) p.y=18;
			else p.y=1;
		}
		// end frame modulation.
		
		if(buttons.jump.pressed) p.u++;
		else p.u=0;
		
		if(buttons.use.pressed) p.x++;
		else p.x=0;
		
		if(buttons.powerup.pressed) p.l++;
		else p.l=0;
		
	} else if(!c.s) { //THIS IS FOR THE AIMING OF STUFF
		//we want player STOPPED for this
		p.s=0;
		
		//manage aim effect timer; cycle 0 to 31
		if(d[p.t][p.m].t>=31) d[p.t][p.m].t-=31;
		else d[p.t][p.m].t++;
		
		i=false; //this is the trigger for scene change
		
		//manage aim effect locations and each frame of theirs
		for(i2=0;i2<32;i2++) {
			
			ib= p._x+6 + d[p.t][p.m].h*(i2+1); //these get the parabola x
			ia= p._y-6 + d[p.t][p.m].v*(i2+1)+(i2)*(i2+1); //these get the parabola y
			//check for a wall-hit;
			if(r[p.t][Math.floor(ia/g)][Math.floor(ib/g)].w._currentframe==1) {
				for(i3=i2;i3<32;i3++) {
					d[p.t][p.m].d[i3].d._x=-50;
				}
				break;
			}
			//check for hittest on the target;
			for(i1=0;i1<x[p.t].length;i1++) {
				if(x[p.t][i1].o._currentframe==3 || x[p.t][i1].o._currentframe==4)
					if(ib>x[p.t][i1].o._x+5 && ib<x[p.t][i1].o._x+g-5)
						if(ia>x[p.t][i1].o._y && ia<x[p.t][i1].o._y+g) {
							i=true;
							
							z.y= x[p.t][i1].v;
							z.y1=(x[p.t][i1].w+1)*g;
							z.x= x[p.t][i1].o._x+3;
							z.x1=x[p.t][i1].o._x-3 +g;
							
							z.o=i1; //temporary for killing the object later
							break;
						}
			}
			if(i) { //if we've hit something...
				// additional timer increase makes the anim go faster
				d[p.t][p.m].t++; 
				//hide unneeded ones
				for(i3=i2;i3<32;i3++) d[p.t][p.m].d[i3].d._x=-50;
				//do the blue frame mess for all thems
				for(i3=0;i3<i2;i3++){
					if( (d[p.t][p.m].t-i3+32)%32 <16) d[p.t][p.m].d[i3].d.gotoAndStop(4);
					else d[p.t][p.m].d[i3].d.gotoAndStop(5);
				}
				break;
			} else { //if there's no hittest detected yet on the pattern
				d[p.t][p.m].d[i2].d._x=ib;
				d[p.t][p.m].d[i2].d._y=ia; //make the dot go to its spot
				
				if( (d[p.t][p.m].t-i2+32)%32 <16) d[p.t][p.m].d[i2].d.gotoAndStop(2);
				else  d[p.t][p.m].d[i2].d.gotoAndStop(3); //the grey frame mess
			}
		}
		
		//controlling the parabola's trajectory
		if(buttons.up.pressed   && d[p.t][p.m].v>-20)   d[p.t][p.m].v--;
		if(buttons.down.pressed && d[p.t][p.m].v<0) d[p.t][p.m].v++;
		if(buttons.left.pressed && d[p.t][p.m].h>6) d[p.t][p.m].h--;
		if(buttons.right.pressed&& d[p.t][p.m].h<24)d[p.t][p.m].h++;
		
		// key 88 is X
		if(buttons.use.pressed) p.x++;
		else p.x=0;
		
		//if we just barely pressed X && we have a set collision course
		if(p.x==1 && i) {
			//let's use some temporary variables to get the rotation number
			ib=d[p.t][p.m].h;
			ia=d[p.t][p.m].v;
			i2=Math.atan(ib/ia);
			if(ia<0 && ib>0) i1= i2/(Math.PI/-180);
			else if(ia>=0 && ib>=0) i1= 180-i2/(Math.PI/180);
			else if(ia>=0 && ib<0) i1= 180+i2/(Math.PI/-180);
			else i1= 360+i2/(Math.PI/-180);
			//there's gotta be an easier way to do this...
			//remove trajectory particles
			for(i3=0;i3<32;i3++) {
				d[p.t][p.m].d[i3].d._x= -50;
			}
			d[p.t][p.m].r=i1;  //finally, assign it to  the .r of the particle set
			
			c.s=true; //this will triggeer the cutscene!!
			p.i=0; //p.i is the player timer y'see. so here we're starting the sequence
		
		}else if(p.x==1) { //otherwise if we don't have a course but pressed X
			killeffect(p.m);
			p.m=-1;
		}
		//cancel with jump button.
		if(buttons.jump.pressed) {
			p.u++;
			killeffect(p.m);
			p.m=-1;
		}
		
	} else if(p.j==2 && p.e>=0) { /// EATING THE FLOWER CUTSCENE
		if(p._xscale<0) {
			p.s-=2;
			if(p.s<-10)
				p.s=-10;
			p.y++;
			if(p.y>15){
				p.y=8;
			}else if(p.y<8){
				p.y=8;
			}
			if(p._x<x[p.t][p.e].o._x) {
				p._xscale=100;
			}
		} else if(p._x!=x[p.t][p.e].o._x) {
			if(p.s<0) {
				p.s+=3;
			} else if(p._x>=x[p.t][p.e].o._x) {
				p.s=0;
				p._x=x[p.t][p.e].o._x;
			} else if(x[p.t][p.e].o._x-p._x<6) {
				p.s=2;
			} else if(p.s>=4) {
				p.s=4;
			} else {
				p.s+=2;
			}
			p.y+=0.5;
			if(p.y>15){
				p.y=8;
			}else if(p.y<8){
				p.y=8;
			}
		} else {
			if(p.y<16 && p.y!=1) {
				p.y=1;
			} else if(p.y==1) {
				p.y=20;
				p.i=0;
			} else {
				if(p.i<2) {
					p.y=20;
				} else if(p.i<4) {
					p.y=21;
				} else if(p.i<6){
					p.y=22;
				} else if(p.i<8) {
					p.y=21;
				} else if(p.i<28) {
					if(p.i%8==7 || p.i%8==8) {
						p.y=24;
						
					} else {
						p.y=23;
						if(p.i==8) {
							x[p.t][p.e].o.gotoAndStop(6);
						}
					}
				} else if(p.i<29) {
					p.y=25;
				} else if(p.i<33) {
					p.y=26;
				} else if(p.i<35) {
					p.y=27;
				} else if(p.i<36) {
					p.y=28;
					//right here!!!
					d[p.t][x[p.t][p.e].e].p=true;
				} else if(p.i<52) {
					if(p.i%4==0 || p.i%4==1) {
						p.y=29;
					} else {
						p.y=30;
					}
				} else if(p.i<53) {
					p.y=31;
				} else if(p.i<60) {
					p.y=32;
				} else if(p.i<63) {
					p.y=87-p.i;
				} else {
					p.y=1;
					c.s=false;
					p.p=1;
					p.j=0;
					p.e=-1;
				}
				p.i++;
			}
			
		}
	}/// CUTSCENE FOR LAUNCHING ICE BALL
	else if (p.m>-1 && p.p==1 && d[p.t][p.m].t2== -1) {
		p.i++; //increase p.i if it's been activated.
		
		if(p.i<3) {
			p.y=34; //about to blowframe
		} else if(p.i<5) {
			p.y=35; // blow frame
			//we'll get rid of the swirlysnow effect too
			for(i1=0;i1<d[p.t].length;i1++) {
				if(d[p.t][i1].p && d[p.t][i1].q==1) {
					d[p.t][i1].p=false;
					d[p.t][i1].k=true;
				}
			}
			
		} else if(p.i==5) { //initialize the snow and stuff from his mouth
			d[p.t][p.m].t1=0; //set t1 to 0; this sets the secondary function's timer
			for(i=16;i<=30;i++) { //dedicate particles 16 - 30 to the breath
				d[p.t][p.m].d[i].d._x=-50; //initially, we'll want to hide them
				
				//now we get to defining variables of each particles
				
				//slightly alter particle direction
				d[p.t][p.m].d[i].r=d[p.t][p.m].r+(Math.random()+Math.random()+Math.random()+Math.random())*20-40;
				//make sure the .r is from 0 to 359
				if(d[p.t][p.m].d[i].r>=360) d[p.t][p.m].d[i].r-=360;
				else if(d[p.t][p.m].d[i].r<0) d[p.t][p.m].d[i].r+=360;
				//speed of particles
				d[p.t][p.m].d[i].s=(Math.random()*10+2)/3;
				//these next lines randomize particle type, partly based on its speed
				i3=(Math.random()*5+1)/3.1;
				if(i3>d[p.t][p.m].d[i].s) d[p.t][p.m].d[i].d.gotoAndStop(Math.floor(Math.random()*1.5)+8);
				else d[p.t][p.m].d[i].d.gotoAndStop(1);
				//how fast the particle goes away
				d[p.t][p.m].d[i].f=Math.floor(Math.random()*12);
			}
		} else if(p.i<17) {
			//wait
		} else if(p.i<19) {
			///make the player return to about-to-blow position
			p.y=34;
		} else if(p.i<20) {
			//set player go to normal frame.
			p.y=1;
		}
		
		
		
		if(d[p.t][p.m].t1<=0) { //we won't do anything yet if .t1 is 0
		} else if(d[p.t][p.m].t1<=16) { //this is for the snowblow effect from mouth
			for(i=16;i<=30;i++) { //just particles 16 to 30; 31 is ice ball
				//do some mumbo with sin and cos to make it move x and y
				d[p.t][p.m].d[i].d._x=p._x+6+Math.sin(d[p.t][p.m].d[i].r*(Math.PI/180))*d[p.t][p.m].t1*d[p.t][p.m].d[i].s;
				d[p.t][p.m].d[i].d._y=p._y-6-Math.cos(d[p.t][p.m].d[i].r*(Math.PI/180))*d[p.t][p.m].t1*d[p.t][p.m].d[i].s;
				
				if(d[p.t][p.m].d[i].d._currentframe==1) { //manage alpha for snow
					if(d[p.t][p.m].t1 > 12-d[p.t][p.m].d[i].f)
						d[p.t][p.m].d[i].d._alpha=(32-d[p.t][p.m].t1*2-d[p.t][p.m].d[i].f)*5;
					else d[p.t][p.m].d[i].d._alpha=100;
				} else { //manage alpha for puff
					if(d[p.t][p.m].t1 > 12-d[p.t][p.m].d[i].f)
						d[p.t][p.m].d[i].d._alpha=(32-d[p.t][p.m].t1*2-d[p.t][p.m].d[i].f)*1.5;
					else if(d[p.t][p.m].t1<4) d[p.t][p.m].d[i].d._alpha=d[p.t][p.m].t1*5;
					else d[p.t][p.m].d[i].d._alpha=30;
				}
				
			}
		}
		
		//this segment is for the ice ball and its puffs
		if(d[p.t][p.m].t1>=3) {
			if(d[p.t][p.m].t1==3) {
				//particle 31 is set to iceball appear graphic
				d[p.t][p.m].d[31].d.gotoAndStop(7);
				//hide all the particles that aren't in use
				for(i=15;i<31;i++) d[p.t][p.m].d[i].d._alpha=0;
			}
			else d[p.t][p.m].d[31].d.gotoAndStop(6);
			// ^-- sets particle 31 to regular iceball if it isn't just initializing
			
			//for this instance, i is speed of the ball
			i=(d[p.t][p.m].t1*2-7)/(Math.pow(d[p.t][p.m].h,0.3))*0.7;
			
			//set the particular x and y of the ice ball
			ib= p._x+6 + d[p.t][p.m].h*(i+1);
			ia= p._y-6 + d[p.t][p.m].v*(i+1)+(i)*(i+1);
			
			d[p.t][p.m].d[31].d._x=ib;
			d[p.t][p.m].d[31].d._y=ia;
			
			//hittest on the vine
			if(ia > z.y && ia < z.y1) {
			if(ib > z.x && ib < z.x1) {
				d[p.t][p.m].t2=0;
				d[p.t][p.m].d[31].d.gotoAndStop(7);
			}}
			
			//this block moves the poof particles to initial spots
			i1=d[p.t][p.m].t1-3;
			//trace(i1);
			d[p.t][p.m].d[i1%31].d._alpha=40;
			d[p.t][p.m].d[i1%31].d.gotoAndStop(9);
			d[p.t][p.m].d[i1%31].d._x=ib;
			d[p.t][p.m].d[i1%31].d._y=ia;
			d[p.t][p.m].d[i1%31].r=Math.random()*360;
			for(i=(i1<8?0:(i1-8));i<i1;i++) {
				d[p.t][p.m].d[i%31].d._x+=Math.sin(d[p.t][p.m].d[i%31].r*(Math.PI/180));
				d[p.t][p.m].d[i%31].d._y-=Math.cos(d[p.t][p.m].d[i%31].r*(Math.PI/180));
				d[p.t][p.m].d[i%31].d._alpha=40-(i1-i+1)*5;
				//if(i%31<0) trace("hi;"+i%31);
			}
		}
		
		if(d[p.t][p.m].t1>=0) d[p.t][p.m].t1++;
		
	} //ICE BALL RUINING OF VINE
	else if(p.m>-1 && p.p==1) {
		
		//initialize explosion stuff
		if(d[p.t][p.m].t2==0) {
			d[p.t][p.m].e=d[p.t][p.m].t1+25;
			i1=d[p.t][p.m].e;
			for(i=(i1-16);i<(i1-8);i++) {
				d[p.t][p.m].d[i%31].r=Math.random()*360;
				d[p.t][p.m].d[i%31].s=2+Math.random()*1;
				d[p.t][p.m].d[i%31].d._x=d[p.t][p.m].d[31].d._x;
				d[p.t][p.m].d[i%31].d._y=d[p.t][p.m].d[31].d._y;
				switch(Math.floor(Math.random()*5)) {
					case 0: case 1:
					d[p.t][p.m].d[i%31].d.gotoAndStop(10+Math.floor(d[p.t][p.m].d[i%31].r/90));
					break;
					
					case 2: d[p.t][p.m].d[i%31].d.gotoAndStop(9); break;
					case 3: d[p.t][p.m].d[i%31].d.gotoAndStop(8); break;
					case 4: d[p.t][p.m].d[i%31].d.gotoAndStop(1); break;
				}
			}
			d[p.t][p.m].d[31].d._x=-50;
		}
		//this has to do with alpha timing
		//as well as looking at which particle to initialize
		i1=d[p.t][p.m].e;
		i2=d[p.t][p.m].t1+25;
			
		//this is when it's all flashing and blrlkghkbhgh
		if(d[p.t][p.m].t2<30) {
			
			//this part manages the exploded particles
			for(i=(i1-16);i<(i1-8);i++) {
				d[p.t][p.m].d[i%31].d._x+=Math.sin(d[p.t][p.m].d[i%31].r*(Math.PI/180))*d[p.t][p.m].d[i%31].s;
				d[p.t][p.m].d[i%31].d._y-=Math.cos(d[p.t][p.m].d[i%31].r*(Math.PI/180))*d[p.t][p.m].d[i%31].s;
				d[p.t][p.m].d[i%31].d._alpha=80-(i2-i1)*8;
			}
			//set i4; the end of the particles that move chain.
			//if not set, they'll stop appearing.
			i4=i2;
			
			//add the next particle to eminate from the vine
			d[p.t][p.m].d[i2%31].r=Math.random()*360;
			d[p.t][p.m].d[i2%31].s=2+Math.random()*1;
			d[p.t][p.m].d[i2%31].d._y=Math.random()*(z.y1-z.y) +z.y;
			if(d[p.t][p.m].d[i2%31].r < 180)
				d[p.t][p.m].d[i2%31].d._x=z.x +(g/2) + Math.random()*10;
			else
				d[p.t][p.m].d[i2%31].d._x=z.x +(g/2) - Math.random()*10;
			switch(Math.floor(Math.random()*3)) {
				case 0: d[p.t][p.m].d[i2%31].d.gotoAndStop(9); break;
				case 1: d[p.t][p.m].d[i2%31].d.gotoAndStop(8); break;
				case 2: d[p.t][p.m].d[i2%31].d.gotoAndStop(1); break;
			}
			d[p.t][p.m].d[i2%31].d._alpha=80;
			
			//vinestuff
			i1=x[p.t][z.o].q;
			//we don't need i1 anymore in this block so we use it again here
			while(true) {
				if(d[p.t][p.m].t2%6<3) {
					x[p.t][i1].o.gotoAndStop(8- x[p.t][i1].o._currentframe%2);
				}
				else {
					x[p.t][i1].o.gotoAndStop(10- x[p.t][i1].o._currentframe%2);
				}
				if(d[p.t][p.m].t2%3>0) x[p.t][i1].o._alpha=0;
				else x[p.t][i1].o._alpha=100;
				
				i1=x[p.t][i1].r;
				if(i1==-1) break;
			}
				
			
		} else if(d[p.t][p.m].t2==40) {
			// NO MORE CUSTCE$NE
			c.s=false;
			p.m=-1;
			p.p=0;
			i1=x[p.t][z.o].q;
			while(true) {
				killobj(i1);
				
				i1=x[p.t][i1].r;
				if(i1==-1) break;
			}
		}
			
		//handle trailing iceball poofs as well as ones radiating from vine
		for(i=(i2-8);i<=i4;i++) {
			d[p.t][p.m].d[i%31].d._x+=Math.sin(d[p.t][p.m].d[i%31].r*(Math.PI/180));
			d[p.t][p.m].d[i%31].d._y-=Math.cos(d[p.t][p.m].d[i%31].r*(Math.PI/180));
			d[p.t][p.m].d[i%31].d._alpha=40-(i2-i)*5;
		}
		
		//timer
		if (d[p.t][p.m]) {
			d[p.t][p.m].t1++;
			d[p.t][p.m].t2++;
		}
	}
	/////////////////////////////////////////
	
	// SWIRLY SNOW PARTICLE EFFECT //
	for(i1=0;i1<d[p.t].length;i1++) {
		if(d[p.t][i1].s && d[p.t][i1].q==1)
			for(i2=0;i2<16;i2++) {
				d[p.t][i1].d[i2].t+=2;
				if(d[p.t][i1].d[i2].t%64==0) {
					d[p.t][i1].d[i2].t=0;
					d[p.t][i1].d[i2].d._alpha=0;
					d[p.t][i1].d[i2].r=Math.random()*360;
					if(d[p.t][i1].k) {
						d[p.t][i1].d[i2].b=-100;
					} else if(d[p.t][i1].p) {
						d[p.t][i1].d[i2].b=p._x;
						d[p.t][i1].d[i2].a=p._y-g;
					}
				} else if(d[p.t][i1].d[i2].t>=0) {
					if(d[p.t][i1].d[i2].t%64>=54) {
						d[p.t][i1].d[i2].d._alpha=(63-d[p.t][i1].d[i2].t)*10;
					} else if(d[p.t][i1].d[i2].t%64<=10) {
						d[p.t][i1].d[i2].d._alpha=(d[p.t][i1].d[i2].t)*10;
					}
					ia=Math.floor(d[p.t][i1].d[i2].d._y/g);
					ib=Math.floor(d[p.t][i1].d[i2].d._x/g);
					d[p.t][i1].d[i2].r+=5;
					d[p.t][i1].d[i2].d._x=d[p.t][i1].d[i2].b+Math.sin(d[p.t][i1].d[i2].r*(Math.PI/180))*16;
					d[p.t][i1].d[i2].d._y=d[p.t][i1].d[i2].a-(Math.cos(d[p.t][i1].d[i2].r*(Math.PI/180))*6)+d[p.t][i1].d[i2].t/2;
					//particle depth base
					i3=Math.floor(Math.cos( d[p.t][i1].d[i2].r*(Math.PI/180) )*-512);
					//trace(i3);
					if(i3<0)i3+= q.i[p.t] +q.l[p.t]*q.m[p.t] +512;
					else 	i3+= q.i[p.t] +q.l[p.t]*q.m[p.t] +512 +q.n[p.t]+1;
					//trace(i3);
					d[p.t][i1].d[i2].d.swapDepths(i3);

				}
			}
	}
	
	// CEILING //
	if(p.k<2){
		p._y+=p.f;
	}
	coord();
	
	if(p.k<2 && p._y-p.v<=r[p.t][p.w][p.b].w._y && r[p.t][p.w-1][p.b].w._currentframe==1) {
		p._y=r[p.t][p.w][p.b].w._y+p.v;
		if(p.f<0) p.f=0;
	}
	coord();
	
	// THE GROUND //
	
	i2=false;
	if(r[p.t][p.a][p.c].w._currentframe==1 || r[p.t][p.a][p.d].w._currentframe==1) {
		i2=true;
	}
	for(i1=0;i1<x[p.t].length;i1++) {
		if(x[p.t][i1].o._x<p._x+p.h && x[p.t][i1].o._x+g>p._x-p.h) 
			if(x[p.t][i1].o._y<=p._y && x[p.t][i1].o._y+g>p._y)
				if(x[p.t][i1].o._currentframe==2) 
					i2=true;
	}
	
	if(i2) {
		//don't fall!!!
		if(p.f>=0) {
			p._y=r[p.t][p.a][p.b].w._y;
			
			if(p.u<2 && p.u!=0) {
				p.f=-9;
				p.e=-1;
				if(p._currentframe!=5)
					p.gotoAndStop(2);
			} else {
				p.f=-1;
				if(p.k==0){
					p.gotoAndStop(Math.floor(p.y));
				}else if(p.k==1){
					p.k=2;
					p.gotoAndStop(6);
					if(p.s!=0) {
						p._xscale *=-1;
					}
				} else{
					p.k++;
					if(p.k>20&& p.k<40 && p.k%10==5) {
						p.gotoAndStop(7);
						
					}else if(p.k%10==8) {
						p.gotoAndStop(6);
					}
				}
					
			}
		}
	} else {
		if(p.e>=0 && x[p.t][p.e].o._currentframe==2) {
			p.e=-1;
			
		}
		
		if(p.k==0&& r[p.t][p.a][p.b].l._currentframe==2 && p._y>r[p.t][p.a][p.b].l._y-(g*r[p.t][p.a][p.b].l._yscale/100)) {
			//DEATH TO THE PLAYER
			p.k=1;
			p.gotoAndStop(5);
			p.f=-12;
			c.s=true;
		} else if(p.f>1 && p._currentframe!=3 && p._currentframe != 4 && p.k==0){
			//this is if he just falls off a cliff
			p.gotoAndStop(2);
		}
	}
	
	//misc stuff at the end
	p.f++; //increase velocity
	if(p.k<1) {
		if(p._currentframe==2 && p.f>= 0) { //jump frame TRANSITION
			p.gotoAndStop(3);
		} else if(p._currentframe==3 &&p.f>=0) { //jump frame DOWN
			p.gotoAndStop(4);
		}
	}
	if(p.k==0 && p.f>8) {
		p.f=8; // terminal velocity
	}
	
	coord();
	
	/// WALL TEST //
	if(p.k<2){
		p._x+=Math.round(p.s/2);
		if(p.j>0 && p.e==-1) { //if not attached to block
			p.j=0;
			//reset if not attached to block.
		} else if(p.j==1) {
			if(p.x==1) {
				p.j=0;
				p.e=-1;
			} else {
				x[p.t][p.e].o._x=p._x-(g/2)+(p._xscale/100)*(g/2+p.h);
			}
		}
	}
	
	//this first one is for walltesting w/ block
	if(p.j==1 && p.e>=0 && p.k<2 && p._xscale<0 && p._x-p.h<=r[p.t][p.a][p.b].w._x && (r[p.t][p.w][p.b-2].w._currentframe==1 || r[p.t][p.z][p.b-2].w._currentframe==1)) {
		p._x=r[p.t][p.a][p.b].w._x+p.h;
		if(p.s<0) {
			p.s=0;
		}
	}
	//this one is for without
	if(p.k<2 && p._x-p.h<=r[p.t][p.a][p.b].w._x  && (r[p.t][p.w][p.b-1].w._currentframe==1 || r[p.t][p.z][p.b-1].w._currentframe==1)) {
		p._x=r[p.t][p.a][p.b].w._x+p.h;
		if(r[p.t][p.a-1][p.b].w._currentframe==3 || r[p.t][p.a-1][p.b].w._currentframe==4) {
			transition();
		}
		if(p.s<0) {
			p.s=0;
		}
	}
	//this one tests actual contact with blocks
	if(!c.s && p.k<2) {
		for(i1=0;i1<x[p.t].length;i1++) {
			if(p._x-p.h<=x[p.t][i1].o._x+g && p._x-p.h>x[p.t][i1].o._x) 
				if(p._y>x[p.t][i1].o._y && p._y-p.v<x[p.t][i1].o._y+g) 
					if(i1!=p.e && x[p.t][i1].o._currentframe==2){//makes sure it's not the one we're moving! && it's actually a block.
						p.j=1;
						p.e=-1;
						i=i1; //i is changed to NOT -1 if it is touching a block
						break;
					}
						
		}
		if(p.j==1 && p.e==-1 && p._xscale<0) { //if it's touching one
			p._x=x[p.t][i].o._x+g+p.h; //push him out
			if(i2){ //i2 is true if he's on ground
				if(p.x==1 && a._alpha>0) { // if you're pressing x, and is applicable
					p.e=i; //p.e is set to block's ID. attached!
					p.s=0;
				}
			}
			if(p.s<0) {
				p.s=0;
			}
		}
	}
	
	//this extra coord is here to remove screwups with world shifting.
	coord();
	
	//now for the other side!!
	//this first one is for walltesting w/ block
	if(p.j==1 && p.e>=0  && p.k<2 && p._xscale>0 && p._x+p.h>=r[p.t][p.a][p.b+1].w._x&& (r[p.t][p.w][p.b+2].w._currentframe==1 || r[p.t][p.z][p.b+2].w._currentframe==1)) {
		p._x=r[p.t][p.a][p.b+1].w._x-p.h;
		if(p.s>0) p.s=0;
	}
	//this is for walltesting without
	if(p.k<2 && p._x+p.h>=r[p.t][p.a][p.b+1].w._x&& (r[p.t][p.w][p.b+1].w._currentframe==1 || r[p.t][p.z][p.b+1].w._currentframe==1)) {
		p._x=r[p.t][p.a][p.b+1].w._x-p.h;
		if(r[p.t][p.a-1][p.b].w._currentframe==3 || r[p.t][p.a-1][p.b].w._currentframe==4) {
			transition();
		}
		if(p.s>0) p.s=0;
	}
	//this one tests actual contact with blocks
	if(!c.s && p.k<2) {
		i=-1;
		for(i1=0;i1<x[p.t].length;i1++) {
			if(p._x+p.h>=x[p.t][i1].o._x && p._x+p.h<x[p.t][i1].o._x+g) 
				if(p._y>x[p.t][i1].o._y && p._y-p.v<x[p.t][i1].o._y+g) 
					if(i1!=p.e && x[p.t][i1].o._currentframe==2) { //makes sure it's not the one we're moving! && it's actually a block.
						p.j=1;
						p.e=-1;
						i=i1; //i is changed to NOT -1 if it is touching a block
						break;
					}
		}
		if(p.j==1 && p.e==-1 && p._xscale>0) { //if it's touching one
			p._x=x[p.t][i1].o._x-p.h; //push him out
			if(i2){ //i2 is true if he's on ground
				if(p.x==1 && a._alpha>0) { // if you're pressing x, and is applicable
					p.e=i; //p.e is set to block's ID. attached!
					p.s=0;
				}
			}
			if(p.s>0) p.s=0;
		}
	}
	//weed hit-test
	if(p.k<2 && !c.s) {
		i=-1;
		for(i1=0;i1<x[p.t].length;i1++) {
			if(p._x+p.h-10>=x[p.t][i1].o._x && p._x+p.h<x[p.t][i1].o._x+g) 
				if(p._y>x[p.t][i1].o._y && p._y-p.v<x[p.t][i1].o._y+g) 
					if(x[p.t][i1].o._currentframe==3 || x[p.t][i1].o._currentframe==4){ //checks if object is a weed.
						//trace(p.s);
						if(p.s>0) {
							p.s*=-1;
							p.s-=2;
							if(p.s<-8)
								p.s=-8;
						}
						if(p._x+p.h-14>=x[p.t][i1].o._x) { //if he's too deep in
							p._x=x[p.t][i1].o._x-p.h+12; //push him out
						}
						break;
					}
		}
	}
	
	//this just ensures block is next to player at the end.
	if(p.k<1&&p.j==1&&p.e>-1) {
		x[p.t][p.e].o._x=p._x-(g/2)+(p._xscale/100)*(g/2+p.h);
	}
	
	/// ETCETERA ///
	
	//use powerup
	if(i2 && p.p>0 && p.l==1 && p.m==-1) {
		puteffect(0,0,2);
		p.l=2;
		p.m=i3;
		p.y=1;
	}
	
	//flower
	if(!c.s && i2 && p.j!=1 && p.p==0) {
		for(i1=0;i1<x[p.t].length;i1++) {
			if(x[p.t][i1].o._currentframe==5)
				if(p._x+p.h>x[p.t][i1].o._x && p._x-p.h<x[p.t][i1].o._x+g)
					if(p._y > x[p.t][i1].o._y && p._y<=x[p.t][i1].o._y+g) {
						p.j=2;
						if(p.x==1 && a._alpha>0) {
							p.e=i1;
							c.s=true;
							p._xscale=-100;
						}
					}
		}
	}
	
	// alert bubble //
	if(p.k<1 && p.j>0 && p.e==-1 && i2) {
		if(a._alpha<=0) {
			if(p._xscale>0) {
				a.gotoAndStop(1);
			} else {
				a.gotoAndStop(2);
			}
		}
		if(a._alpha<100) {
			a._alpha+=10;
			a._alpha=10*Math.round(a._alpha/10);
			a._y=p._y-p.v-10+Math.round(a._alpha/10);
		}
		a._x=p._x+p.h*(a._currentframe*2-3);
	} else {
		if(a._alpha>0) {
			a._alpha-=10;
			a._alpha=10*Math.round(a._alpha/10);
			a._y++;
		}
	}
	
	//cutscene looking top thing.
	if(c.s && c._currentframe<9) {
		c.nextFrame();
	} else if(!c.s && c._currentframe>1) {
		c.prevFrame();
	}
	
	//death reset code.
	if(p.k>65 || p._y>(q.l[p.t]+4)*g) {
		p.k=0;
		p.gotoAndStop(1);
		p._xscale=100;
		p.s=0;
		p.f=0;
		p._xscale=p.q;
		c.s=false;
		doreset();
	}
	//trace(p.j+" for "+p.e);
	
	//camera!
	v.d=(v.w/2)-p._x;
	v.c=(v.h/2)-p._y;
	if(v.d > 0) v.d= 0;
	if(v.c > 0) v.c= 0;
	if(v.d < (v.w)-(g*q.m[p.t]) ) v.d= (v.w)-(g*q.m[p.t]);
	if(v.c < (v.h)-(g*q.l[p.t]) ) v.c= (v.h)-(g*q.l[p.t]);
	
	v.b=(v.b*(v.s-1)+v.d)/v.s;
	v.a=(v.a*(v.s-1)+v.c)/v.s;
	
	_level0._x=Math.round(v.b);
	_level0._y=Math.round(v.a);
}

function coord() {
	p.a=Math.floor(p._y/g);
	p.z=Math.floor((p._y-p.v)/g);
	p.w=Math.floor((p._y-2)/g);
	p.b=Math.floor(p._x/g);
	p.c=Math.floor((p._x-p.h)/g);
	p.d=Math.floor((p._x+p.h-1)/g);
}
function reset(i1,i2) {
	p.n=i1;
	p.o=i2;
	doreset();
}
function doreset() {
	p._x=p.o*g;
	p._y=(p.n+1)*g;
}

function render(i) {
	p.t=i;
	setroom(i);
	q.j[p.t]=true;
	switch(p.t) {
		case 0:
		for(i=4;i<=10;i++)
			nowall(1,i);
		for(i=4;i<=11;i++)
			nowall(2,i);
		for(i=1;i<=11;i++)
			nowall(3,i);
		nowall(4,6);
		nowall(4,7);
		nowall(5,6);
		nowall(5,7);
		rwall(3,12,1,3,2);
		putlava(5,7,200);
		break;
		
		case 1:
		for(i=7;i<=10;i++)
			nowall(1,i);
		for(i=6;i<=10;i++)
			nowall(2,i);
		for(i=2;i<=7;i++)
			nowall(3,i);
		for(i=4;i<=7;i++)
			nowall(4,i);
		putblock(4,4);
		//putlava(4,4,100);
		lwall(3,1,0,3,12);
		for(i=9;i<=11;i++)
			nowall(3,i);
		nowall(4,10);
		nowall(4,11);
		nowall(5,10);
		nowall(5,11);
		rwall(5,12,2,5,2);
		break;
		
		case 2:
		for(i=3;i<=5;i++)
			nowall(1,i);
		for(i=1;i<=8;i++)
			nowall(2,i);
		for(i=1;i<=10;i++)
			nowall(3,i);
		for(i=4;i<=5;i++)
			nowall(4,i);
		for(i=9;i<=11;i++)
			nowall(4,i);
		for(i=2;i<=4;i++)
			nowall(5,i);
		lwall(5,1,1,5,12);
		rwall(4,12,3,3,2);
		//putlava(5,10,150);
		putweed(3,7);
		putflowerB(3,2);
		//putblock(3,6);
		//putblock(2,6);
		break;
		
		case 3:
		lwall(3,1,2,4,12);
		for(i=2;i<=7;i++)
			nowall(3,i);
		for(i=4;i<=14;i++)
			nowall(2,i);
		for(i=9;i<=12;i++)
			nowall(1,i);
		for(i=11;i<=18;i++)
			nowall(3,i);
		for(i=16;i<=18;i++)
			nowall(2,i);
		for(i=5;i<=6;i++)
			nowall(4,i);
		nowall(4,13);
		for(i=6;i<=9;i++)
			nowall(5,i);
		for(i=13;i<=14;i++)
			nowall(5,i);
		for(i=7;i<=19;i++)
			nowall(6,i);
		for(i=8;i<=20;i++)
			nowall(7,i);
		for(i=12;i<=15;i++)
			nowall(8,i);
		rwall(7,21,4,4,1);
		putblock(3,18);
		putflowerB(7,10);
		putlava(8,13,200);
		break;
	}
		
}
function initroom(i,ia,ib,i1) {
	//arrays for length, width, #objs in room
	q.l[i]=ia;
	q.m[i]=ib;
	q.n[i]=i1;
	
	//set q.i[] at this room's position to the base depth
	q.i[i]=q.k;
	//meanwhile i4 is the additional thing
	i4=0;
	
	// tilespace; 0 -> +( q.l * q.m )
	// lower particlespace; -> +16*32 || +512
	// object space; -> +q.n +1
	// upper particlespace; -> +16*32 || +512
	// liquidspace; -> +( q.l * q.m )
	// wallspace; -> +( q.l * q.m )
	
	//the panels!
	r[i]={};
	r[i]=new Array(q.l[i]);
	d[i]={};
	d[i]=new Array(16);
	x[i]={};
	x[i]=new Array(q.n[i]);
	
	//back tile
	for(i1=0;i1<r[i].length;i1++) {
		r[i][i1]={};
		r[i][i1]=new Array(q.m[i]);
		for(i2=0;i2<r[i][i1].length;i2++) {
			r[i][i1][i2]={};
			r[i][i1][i2].t=attachMovie("tile", "tile"+i+"-"+(i1*q.m[i]+i2), (i1*q.m[i]+i2) +i4+q.i[i] );
			r[i][i1][i2].t._x=i2*g;
			r[i][i1][i2].t._y=i1*g;
			r[i][i1][i2].t.stop();
			r[i][i1][i2].t._visible=false;
		}
	}
	i4+= q.l[i]*q.m[i];
	
	//particles
	for(i1=0;i1<16;i1++) {
		d[i][i1]={};
		d[i][i1].s=false;
		d[i][i1].d=new Array(32);
		for(i2=0;i2<32;i2++) {
			d[i][i1].d[i2]={};
			d[i][i1].d[i2].d=attachMovie("particle","particle"+i+"-"+(i1*32+i2), (i1*32+i2)+i4+q.i[i]);
			d[i][i1].d[i2].d._x=-50+i1;
			d[i][i1].d[i2].d._alpha=0;
		}
	}
	i4+=512;
	
	//objects
	for(i1=0;i1<x[i].length;i1++) {
		x[i][i1]={};
		x[i][i1].o=attachMovie("obj","obj"+i1, i4+q.i[i]+1 +i1);
		x[i][i1].o.stop();
	}
	i4+=q.n[i]+1; //extra one for player spot
	
	//placeholders for particles
	i4+=512;
	
	//liquid
	for(i1=0;i1<r[i].length;i1++) {
		for(i2=0;i2<r[i][i1].length;i2++) {
			r[i][i1][i2].l=attachMovie("lq", "lq"+i+"-"+(i1*q.m[i]+i2), (i1*q.m[i]+i2) +i4+q.i[i]);
			r[i][i1][i2].l._x=i2*g;
			r[i][i1][i2].l._y=(i1+1)*g;
			r[i][i1][i2].l._yscale=0;
			r[i][i1][i2].l.stop();
			r[i][i1][i2].l._visible=false;
		}
	}
	i4+= q.l[i]*q.m[i];
	
	//walls
	for(i1=0;i1<r[i].length;i1++) {
		for(i2=0;i2<r[i][i1].length;i2++) {
			r[i][i1][i2].w=attachMovie("wall", "wall"+i+"-"+(i1*q.m[i]+i2), (i1*q.m[i]+i2) +i4+q.i[i]);
			r[i][i1][i2].w._x=i2*g;
			r[i][i1][i2].w._y=i1*g;
			r[i][i1][i2].w.stop();
			r[i][i1][i2].w._visible=false;
		}
	}
	i4+= q.l[i]*q.m[i];
	
	//two extra spots...
	q.k= i4+q.i[i] ;
}
function setroom(i) {
	p.t=i;
	for(i1=0;i1<q.l[p.t];i1++) {
		for(i2=0;i2<q.m[p.t];i2++) {
			r[p.t][i1][i2].w._visible=true;
			r[p.t][i1][i2].l._visible=true;
			r[p.t][i1][i2].t._visible=true;
		}
	}
	for(i1=0;i1<q.n[p.t];i1++) {
		x[p.t][i1].o._visible=true;
	}
	for(i1=0;i1<16;i1++) {
		if(d[p.t][i1].q>-1) {
			d[p.t][i1].s=true;
			
		}
	}
	if(i4 && (typeof i4 === 'object')) {
		trace(i4);
		puteffect(0,0,i4.q);
		d[p.t][i3].p=true;
		killeffectPos(i4);
	}
	depthplayer(p);
}
function wiperoom() {
	for(i1=0;i1<q.l[p.t];i1++) {
		for(i2=0;i2<q.m[p.t];i2++) {
			r[p.t][i1][i2].w._visible=false;
			r[p.t][i1][i2].l._visible=false;
			r[p.t][i1][i2].t._visible=false;
		}
	}
	for(i1=0;i1<q.n[p.t];i1++) {
		x[p.t][i1].o._visible=false;
	}
	for(i1=0;i1<16;i1++) {
		//trace(d[p.t][i1].p+" " +i1)
		if(d[p.t][i1].p) {
			i4=d[p.t][i1];
		} else {
			d[p.t][i1].s=false;
			for(i2=0;i2<32;i2++) {
				d[p.t][i1].d[i2].d._x=-50+i1;
			}
		}
	}
}
function depthplayer(i) {
	i.swapDepths(q.l[i.t]*q.m[i.t]+512 +q.i[i.t]);
	if (a) a.swapDepths(1048574);
	if (c) c.swapDepths(1048575);
	//i.swapDepths(10000);
}

function transition() {
	reset(r[p.t][p.a-1][p.b].w.a,r[p.t][p.a-1][p.b].w.b);
	p.q=p._xscale;
	i=r[p.t][p.a-1][p.b].w.t;
	i4=false;
	wiperoom();
	if(!q.j[i]) {
		render(i);
	} else {
		setroom(i);
	}
}

function nowall(i1,i2) {
	r[p.t][i1][i2].w.gotoAndStop(2);
}
function lwall(i1,i2,i,ia,ib) {
	r[p.t][i1][i2].w.gotoAndStop(3);
	r[p.t][i1][i2].w.t=i;
	r[p.t][i1][i2].w.a=ia;
	r[p.t][i1][i2].w.b=ib;
}
function rwall(i1,i2,i,ia,ib) {
	r[p.t][i1][i2].w.gotoAndStop(4);
	r[p.t][i1][i2].w.t=i;
	r[p.t][i1][i2].w.a=ia;
	r[p.t][i1][i2].w.b=ib;
}
function putlava(ia,ib,i1) {
	i4=0;
	while(true) {
		if(r[p.t][ia+1][ib].w._currentframe!=1 && r[p.t][ia+1][ib].l._yscale<100) {
			ia++;
			continue;
		}
		if(r[p.t][ia][ib].w._currentframe==1 || r[p.t][ia][ib].l._yscale>=100) {
			ia--;
			if(ia<0 || r[p.t][ia][ib].w._currentframe==1) {
				trace("LAVA OVERFLOW");
				break;
			} else{
				continue;
			}
		}
		//trace(r[p.t][ia][ib].l._yscale);
		let bl=ib;
		while(r[p.t][ia][bl-1].w._currentframe!=1) {
			bl--;
			if(r[p.t][ia+1][bl].w._currentframe!=1 && r[p.t][ia+1][bl].l._yscale<100) {
				ib=bl;
				ia++;
				continue;
			}
		}
		let br=ib;
		while(r[p.t][ia][br+1].w._currentframe!=1) {
			br++;
			if(r[p.t][ia+1][br].w._currentframe!=1 && r[p.t][ia+1][br].l._yscale<100) {
				ib=br;
				ia++;
				continue;
			}
		}
		let div=(br-bl)+1;
		for(i=bl;i<=br;i++) {
			r[p.t][ia][i].l.gotoAndStop(2);
		}
		while(i4<i1) {
			for(i=bl;i<=br;i++) {
				r[p.t][ia][i].l._yscale+=10/div;
			}
			i4+=10;
			//trace(i);
			if(Math.round(r[p.t][ia][i].l._yscale)>=100) {
				r[p.t][ia][i].l._yscale=100;
				break;
			}
		}
		if(i4>=i1) {
			break;
		}
	}
	
}

function putblock(ia,ib) {
	putobj(ia,ib,2);
}
function putflowerB(ia,ib) {
	putobj(ia,ib,5);
}
function putweed(ia,ib) {
	
	while(ia>=0) {
		if(r[p.t][ia-1][ib].w._currentframe==2) {
			ia--;
		} else {
			break;
		}

	}
	i2=ia;
	while(ia<=q.l[p.t]) {
		if(r[p.t][ia+1][ib].w._currentframe==2) {
			ia++;
		} else {
			break;
		}
	}
	i4=ia;
	z.e=new Array();
	for(ia=i2;ia<=i4;ia++) {
		if(ia==i2) putobj(ia,ib,3);
		else putobj(ia,ib,4);
		z.e[ia]={};
		z.e[ia].i=i;
	}
	for(ia=i2;ia<=i4;ia++) {
		i= z.e[ia].i;
		x[p.t][i].v=i2;
		x[p.t][i].w=i4;
		//first block
		x[p.t][i].q= z.e[i2].i;
		//successive block
		if(ia==i4) x[p.t][i].r= -1;
		else x[p.t][i].r= z.e[ia+1].i;
	}
}
function puteffect(ia,ib,i1) {
	//trace(d[p.t].length);
	for(i3=0;i3<d[p.t].length;i3++) {
		if(!d[p.t][i3].s)
			break;
		else if(i3+1==d[p.t].length)
			trace("PARTICLE OVERFLOW");
	}
	
	d[p.t][i3].s=true;
	d[p.t][i3].q=i1;
	d[p.t][i3].p=false;
	d[p.t][i3].k=false;
	switch(i1) {
		case 1: //ice flower
		for(i2=0;i2<16;i2++) {
			d[p.t][i3].d[i2].d.gotoAndStop(1);
			d[p.t][i3].d[i2].b=ib*g+g/2;
			d[p.t][i3].d[i2].a=ia*g;
			d[p.t][i3].d[i2].t=i2*-4;
			d[p.t][i3].d[i2].r=Math.random()*360;
			d[p.t][i3].d[i2].d._alpha=0;
		}
		break;
		
		case 2: //ice flower effects
		d[p.t][i3].v=-8;
		d[p.t][i3].h=p._xscale/10;
		d[p.t][i3].t=0;
		d[p.t][i3].t1=-1;
		d[p.t][i3].t2=-1;
		
		for(i2=0;i2<32;i2++) {
			d[p.t][i3].d[i2].d._alpha=100;
		}
		break;
	}
	
}
function killeffect(i3) {
	d[p.t][i3].s=false;
	d[p.t][i3].q=-1;
	d[p.t][i3].p=false;
	for(i2=0;i2<32;i2++) {
		d[p.t][i3].d[i2].d._x=-50;
	}
}
function killeffectPos(i3) {
	i3.s=false;
	i3.q=-1;
	i3.p=false;
	for(i2=0;i2<32;i2++) {
		i3.d[i2].d._x=-50;
	}
}
function putobj(ia,ib,i1) {
	for(i=0;true;i++) {
		if(i>=x[p.t].length) {
			trace("OBJECT OVERFLOW!!!");
			break;
		}
		if(x[p.t][i].o._currentframe==1) {
			x[p.t][i].o.gotoAndStop(i1);
			x[p.t][i].o._x=ib*g;
			x[p.t][i].o._y=ia*g;
			if(i1==5) {
				puteffect(ia,ib,1);
				//"i3" should have been changed in puteffect
				x[p.t][i].e=i3;
			} else {
				x[p.t][i].e=0;
			}
			break;
		}
	}
}
function killobj(i3) {
	x[p.t][i3].o.gotoAndStop(1);
	x[p.t][i3].o._x=-50;
	x[p.t][i3].e=0;
}

const roomSprites = [];

export function worldview({ buttons }) {
	onEnterFrame(buttons);
	if (!roomSprites[p.t]) {
		roomSprites[p.t] = pane(q.m[p.t]*g, q.l[p.t]*g, [
			...r[p.t]
				.reduce((arr, x) => arr.concat(x))
				.map(s => wallSheet.sprite(s.w._currentframe-1).at(s.w._x, s.w._y)),
			...r[p.t]
				.reduce((arr, x) => arr.concat(x))
				.filter(s => s.l._currentframe === 2)
				.map(s => fill('rgba(255, 80, 0, 0.5)', s.l._x, s.l._y, g, -g*(s.l._yscale/100))),
		]);
	}
	return { sprites: [
		fill('#FEDBCB'),
		...x[p.t]
			.filter(s => s.o._currentframe !== 1)
			.map(s => objectSheet.sprite(s.o._currentframe-1).at(s.o._x, s.o._y).move(_level0._x, _level0._y)),
		mookSheet.sprite(p._currentframe-1).transform(flip(p._xscale < 0 ? 'h' : '')).at(p._x-14, p._y-25).move(_level0._x, _level0._y),
		roomSprites[p.t].move(_level0._x, _level0._y),
	] };
}
