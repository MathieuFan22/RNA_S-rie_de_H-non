import React from 'react';

const Landing = ({ toPage }) => {
    const toFiftyValues = () => {
        toPage(1);
    };

    return (
        <div>
            <div className="title-project">
                <h1>
                    PREDICTION ET MODELISATION DE SERIES TEMPORELLES PAR RESEAUX DE NEURONES ARTIFICIELS MULTICOUCHES
                </h1>
            </div>
            <div className="name-student">
                <div className="lastname">ANDRIANANDRAINA</div>
                <div className="firstname">Anja Fanirintsoa <u>Mathieu</u></div>
                <div className="classe">ISAIA 4 - 2024</div>
                <div className="num">N°: 02</div>
            </div>
            <button onClick={toFiftyValues} className='centred start'>Commencer la présentation</button>
        </div>
    );
}

export default Landing;
