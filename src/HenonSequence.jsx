import React from 'react';
// import './App.css';

const HenonSequences = ({ data }) => {
    const m = 3; // Dimension d'incorporation
    const t = 100; // Délai de mesure

    // Fonction pour construire les séquences x^(i)
    const buildSequence = (index) => {
        const sequence = [];
        for (let j = 0; j < m; j++) {
            sequence.push(data[index + j * t]);
        }
        return sequence;
    };

    return (
        <div className='fifty'>
            {Array.from({ length: data.length - (m - 1) * t }, (_, i) => i).map((index) => (

                <div className='list' key={index}>

                    <p>Pour i = {index + 1} :</p>
                    <p>
                        X({index + 1}) = (
                        {buildSequence(index).map((value, j) => (
                            <span key={j}>{" "}{value}{","}</span>
                        ))}
                        )
                    </p>
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
