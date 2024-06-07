import '../App.css';
// import calculateXY from './get500Values';

function WeightUpdate() {
    const prototype = [1, 0, 1]
    const step = 0.1
    const desiredOutput = [1]
    const w = [
        [
            [0.2, 0.3],
            [0.1, 0.2],
            [0.1, 0.3]
        ],
        [
            [0.2],
            [0.3]
        ]
    ]
    
    const V = [[...prototype], []]
    const delta = []

    const sigmoideFunction = (x) => {
        return 1 / (1 + Math.exp(-x))
    }
    const sigmoideFunctionDerivated = (x) => {
        return Math.exp(-x) / (1 + Math.exp(-x))**2
    }
    const forwardPropagation = () => {
        let tmp = []
        let s = 0
        for (let m = 0; m < 2; m++) {
            console.log("Pour m=" + parseInt(m+2))
            for (let i = 0; i < w[m][0].length; i++) {
                console.log("\tPour i= " + parseInt(i+1))
                for (let j = 0; j < w[m].length; j++) {
                   tmp.push(w[m][j][i]);
                }
                for (let index = 0; index < tmp.length; index++) {
                    tmp[index] = tmp[index] * V[m][index] 
                }
                s = tmp.reduce((a, b)=> {
                    return a+b
                });
                V[1].push(sigmoideFunction(s))
                console.log(sigmoideFunction(s))
                tmp.length = 0
            }
            console.log('\n\n')
        }
        console.log(V)
    }

    const outputLayerDelta = () => {
        let tmp = []
        for (let m = 0; m < w[1][0].length; m++) {
            
            
        }
    }

    return (
        <div className='fifty'>
            <button type="button" onClick={forwardPropagation}>Alefaso</button>
            <h1>Test</h1>
        </div>
    );
}

export default WeightUpdate;
