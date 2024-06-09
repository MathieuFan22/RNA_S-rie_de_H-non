import '../App.css';
// import calculateXY from './get500Values';

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
    
    const V = [[...prototype], [], []];
    const delta = [[], []];
    
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    
    const sigmoidDerivative = (x) => Math.exp(-x) / ((1 + Math.exp(-x)) ** 2);
    
    const calculateActivation = (weights, inputs) => {
        let sum = weights.reduce((sum, weight, index) => sum + weight * inputs[index], 0);
        return sigmoid(sum);
    };
    
    const forwardPropagation = () => {
        console.log("Begin: Vers l'avant");
        for (let m = 0; m < 2; m++) {
            console.log(`Pour m=${m + 2}`);
            for (let i = 0; i < w[m][0].length; i++) {
                // Au lieu de faire un autre boucle for comme dans le leçon (sur m, i et j), on extracte w[m][j][i] et le stocke dans weight
                const weights = w[m].map(row => row[i]);
                const activation = calculateActivation(weights, V[m]);
                V[m + 1].push(activation);
                console.log(activation);
            }
            console.log('\n\n');
        }
        console.log("End: Vers l'avant");
        calculateOutputLayerDelta();
    };
    
    const calculateOutputLayerDelta = () => {
        console.log("Begin: Delta sortie");
        for (let i = 0; i < w[1][0].length; i++) {
            // Au lieu de faire un autre boucle for comme dans le leçon (sur m, i et j), on extracte w[m][j][i] et le stocke dans weight
            const weights = w[1].map(row => row[i]);
            let sum = weights.reduce((acc, weight, index) => acc + weight * V[1][index], 0);
            let deltaValue = sigmoidDerivative(sum) * (desiredOutput[i] - V[2][i]);
            delta[0].push(deltaValue);
        }
        console.log(delta[0]);
        console.log("End: Delta sortie");
    };
    
  
   
    
    
    const hiddenLayerDelta = () => {
        let tmp = [];
        for (let i = 0; i < w[0].length; i++) {
            let error = 0;
            for (let j = 0; j < w[1].length; j++) {
                error += delta[0][j] * w[1][j][i];
            }
            tmp[i] = error * sigmoideFunctionDerivated(V[0][i]);
        }
        delta.unshift(tmp);
    };

    const updateWeights = () => {
        for (let m = 0; m < w.length; m++) {
            for (let i = 0; i < w[m].length; i++) {
                for (let j = 0; j < w[m][i].length; j++) {
                    w[m][i][j] += step * delta[m][i] * V[m][j];
                }
            }
        }
    };

    const train = () => {
        forwardPropagation();
        outputLayerDelta();
        hiddenLayerDelta();
        // updateWeights();
        // console.log('Updated weights:', w);
    };
    return (
        <div className='fifty'>
            <button type="button" onClick={forwardPropagation}>Alefaso</button>
            <button type="button" onClick={train}>Jereo</button>
            <h1>Test</h1>
        </div>
    );
}

export default WeightUpdate;
