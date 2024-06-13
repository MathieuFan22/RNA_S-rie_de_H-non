I have this :
const desiredOutput = [1, 0.5];
    const step = 0.1;
    const w = [
        [
            [0.1, 0.1],
            [0.2, 0.2],
            [0.2, 0.3]
        ],
        [
            [0.3, 0.2],
            [0.3, 0.2]
        ]
    ];
    
    const prototype = [0, 1, 1];
    const V = [[...prototype], [], []];
    const delta = [[], []];
    const h = [[], [], []]

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);

    const calculateActivation = (weights, inputs) => {
        let sum = weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
        return sum;
    };

    const forwardPropagation = () => {
        console.log("Begin: Vers l'avant");
        for (let m = 0; m < 2; m++) {
            console.log(`Pour m=${m + 2}`);
            for (let i = 0; i < w[m][0].length; i++) {
                // Au lieu de faire un autre boucle for comme dans le leçon (sur m, i et j), 
                // on extracte w[m][j][i] et le stocke dans weight
                const weights = w[m].map(row => row[i]);
                const activation = calculateActivation(weights, V[m]);
                h[m].push(activation)
                V[m + 1].push(sigmoid(activation));
                console.log(sigmoid(activation));
            }
            console.log('\n');
        }
        console.log("End: Vers l'avant");
    };

    const calculateOutputLayerDelta = () => {
        console.log("Begin: Delta sortie");
        for (let i = 0; i < w[1][0].length; i++) {
            let deltaValue = sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]);
            delta[1].push(deltaValue);
        }
        console.log(delta[1]);
        console.log("End: Delta sortie");
    };


    const calculateHiddenLayerDelta = () => {
        console.log("Begin: Delta caché");
        let tmp = []
        for (let i = 0; i < w[1].length; i++) {
            tmp.push(w[1][i].map((e, index) => e * delta[1][index]));
            tmp[i] = tmp[i].reduce((a, b) => a + b)
            let deltaValue = sigmoidDerivative(h[0][i]) * tmp[i];
            delta[0].push(deltaValue)
        }
        console.log(delta[0]);
        console.log("End: Delta caché");
    };

Generate the updateWeight function so that the out is 
updatedW = [
        [
            [0.1 + step * delta[0][0] * V[0][0], 0.1 + step * delta[0][1] * V[0][0]],
            [0.2 + step * delta[0][0] * V[0][1], 0.2 + step * delta[0][1] * V[0][1]],
            [0.2 + step * delta[0][0] * V[0][2], 0.3 + step * delta[0][1] * V[0][2]]
        ],
        [
            [0.3 + step * delta[1][0] * V[1][0], 0.2 + step * delta[1][1] * V[1][0]],
            [0.3 + step * delta[1][0] * V[1][1], 0.2 + step * delta[1][1] * V[1][1]]
        ]
    ];



    ######

    import '../App.css';

function WeightUpdate() {
    const prototype = [0, 1, 1];
    const step = 0.1;
    const desiredOutput = [1, 0.5, 0.3];
    const w = [
        [
            [0.1, 0.1],
            [0.2, 0.3],
            [0.1, 0.2]
        ],
        [
            [0.2, 0.2, 0.2],
            [0.1, 0.3, 0.1]
        ]
    ];

    //Examen
    // const desiredOutput = [1, 0.5];
    // const step = 0.1;
    // const w = [
    //     [
    //         [0.1, 0.1],
    //         [0.2, 0.2],
    //         [0.2, 0.3]
    //     ],
    //     [
    //         [0.3, 0.2],
    //         [0.3, 0.2]
    //     ]
    // ];
    
    // const prototype = [0, 1, 1];


    const V = [[...prototype], [], []];
    const delta = [[], []];
    const h = [[], [], []]

    const sigmoid = (x) => 1 / (1 + Math.exp(-x));

    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);

    const calculateActivation = (weights, inputs) => {
        let sum = weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
        return sum;
    };

    const forwardPropagation = () => {
        console.log("Begin: Vers l'avant");
        for (let m = 0; m < w.length; m++) {
            console.log(`Pour m=${m + 2}`);
            for (let i = 0; i < w[m][0].length; i++) {
                // Au lieu de faire un autre boucle for comme dans le leçon (sur m, i et j), 
                // on extracte w[m][j][i] et le stocke dans weight
                const weights = w[m].map(row => row[i]);
                const activation = calculateActivation(weights, V[m]);
                h[m].push(activation)
                V[m + 1].push(sigmoid(activation));
                console.log(sigmoid(activation));
            }
            console.log('\n');
        }
        console.log("End: Vers l'avant");
        console.log(V);
    };

    const calculateOutputLayerDelta = () => {
        console.log("Begin: Delta sortie");
        for (let i = 0; i < w[1][0].length; i++) {
            let deltaValue = sigmoidDerivative(h[1][i]) * (desiredOutput[i] - V[2][i]);
            delta[1].push(deltaValue);
        }
        console.log(delta[1]);
        console.log("End: Delta sortie");
    };


    const calculateHiddenLayerDelta = () => {
        console.log("Begin: Delta caché");
        let tmp = []
        for (let i = 0; i < w[1].length; i++) {
            tmp.push(w[1][i].map((e, index) => e * delta[1][index]));
            tmp[i] = tmp[i].reduce((a, b) => a + b)
            let deltaValue = sigmoidDerivative(h[0][i]) * tmp[i];
            delta[0].push(deltaValue)
        }
        console.log(delta[0]);
        console.log("End: Delta caché");
    };

    const updateWeights = () => {
        // For m = 0
        w[0][0][0] = w[0][0][0] + step * delta[0][0] * V[0][0]
        w[0][0][1] = w[0][0][1] + step * delta[0][1] * V[0][0]

        w[0][1][0] = w[0][1][0] + step * delta[0][0] * V[0][1]
        w[0][1][1] = w[0][1][1] + step * delta[0][1] * V[0][1]

        w[0][2][0] = w[0][2][0] + step * delta[0][0] * V[0][2]
        w[0][2][1] = w[0][2][1] + step * delta[0][1] * V[0][2]

        // For m = 1
        w[1][0][0] = w[1][0][0] + step * delta[1][0] * V[1][0]
        w[1][0][1] = w[1][0][1] + step * delta[1][1] * V[1][0]
        w[1][0][2] = w[1][0][2] + step * delta[1][2] * V[1][0]

        w[1][1][0] = w[1][1][0] + step * delta[1][0] * V[1][1]
        w[1][1][1] = w[1][1][1] + step * delta[1][1] * V[1][1]
        w[1][1][2] = w[1][1][2] + step * delta[1][2] * V[1][1]

    };

    const train = () => {
        forwardPropagation();
        console.log('\n\n');
        console.log('\n\n');
        calculateOutputLayerDelta();
        console.log('\n\n');
        console.log('\n\n');
        calculateHiddenLayerDelta();
        console.log('\n\n');
        console.log('\n\n');
        updateWeights();
        console.log('Updated weights:', w);
        
    };
    return (
        <div className='fifty'>
            <button type="button" onClick={train}>Jereo</button>
            <h1>Test</h1>
        </div>
    );
}

export default WeightUpdate;

[
    [Var(X¹), Cov(X¹X²), ..., Cov(X¹X^n)],
    [Cov(X²X¹), Var(X²),  ..., Cov(X²X^n)],
    .
    .
    .
    [Cov(X^nX¹), Cov(X^nX²),  ..., Var(X^n)],
]

Var(X) = Somme de i=1 à n de (xi - Xbar)² avec Xbar la moyenne
Cov(XY) = Somme de i=1 à n de (xi - Xbar)(yi - Ybar) avec Xbar et Ybar les moyennes