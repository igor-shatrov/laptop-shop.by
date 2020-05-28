import React from 'react';
import './Main.css';
import Carusel from './Carusel/Carusel';
import Popular from './Popular/Popular';
import Advantages from './Advantages/Advantages';


class Main extends React.Component {
    render() {
        return (
            <main>
                <Carusel />
                <Popular />
                <Advantages />
            </main>

        );
    }
}

export default Main;
