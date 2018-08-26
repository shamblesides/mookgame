import React, { Component } from 'react';
import Screen from './components/Screen';
import Loader from './components/Loader';
import Pad from './components/Pad';
import { sheets, binds, gameloop } from './game';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { sheets, binds, sprites: [], };
    }

    registerPad(pad) {
        this.setState({ pad });
    }

    loop() {
        this.setState({ ...gameloop(this.state) })
        window.requestAnimationFrame(() => this.loop());
    }

    render() {
        return (
            <div style={{backgroundColor:'#45283c', width: '100%', height: 600}}>
                <Pad binds={this.state.binds} register={pad => this.registerPad(pad)} render={() => (
                    <Loader sheets={this.state.sheets} onready={() => window.requestAnimationFrame(() => this.loop())} render={() => (
                        <Screen sprites={this.state.sprites} height={53} width={88} showOverflow/>
                    )}/>
                )}/>
            </div>
        );
    }
}
