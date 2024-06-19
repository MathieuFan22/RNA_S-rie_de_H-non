import React from 'react';
// import './App.css';

const HenonSequences = ({ data }) => {
    const m = 9; // Dimension d'incorporation
    const t = 1; // Délai de mesure

    // Fonction pour construire les séquences x^(i)
    const buildSequence = (index) => {
        const sequence = [];
        for (let j = 0; j < m; j++) {
            const dataIndex = index + j * t;
            if (dataIndex < data.length) {
                sequence.push(data[dataIndex]);
            } else {
                break; // Sortir si l'index dépasse la longueur des données
            }
        }
        return sequence;
    };

    // Construire toutes les séquences x^(i)
    const buildAllSequences = () => {
        const sequences = [];
        for (let i = 0; i <= data.length - (m - 1) * t; i++) {
            const sequence = buildSequence(i);
            if (sequence.length === m) {
                sequences.push(sequence);
            }
        }
        return sequences;
    };
    const sequences = buildAllSequences();
    return (

        <div className='fifty'>
            {sequences.map((sequence, index) => (
                <div  className='list' key={index}>
                    <p>Séquence {index + 1}:</p>
                    <ul>
                        {sequence.map((value, i) => (
                            <li key={i}>{value}</li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="scrollButtons">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Up</button>
                <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Down</button>
            </div>
        </div>
    );
};

export default HenonSequences;
