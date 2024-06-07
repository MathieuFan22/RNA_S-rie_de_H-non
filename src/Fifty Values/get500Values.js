const calculateXY = (initialX, initialY, iterations) => {
    let dataArray = [];
    let xValues = [initialX];
    let yValues = [initialY];
    const a= 1.4;
    const b= 0.3;
  
    for (let n = 0; n < iterations; n++) {
        let xNext = yValues[n] + 1 - a * xValues[n] ** 2;
        let yNext = b * xValues[n];
  
        xValues.push(parseFloat(xNext.toFixed(8)));
        yValues.push(parseFloat(yNext.toFixed(8)));
    }
  
    for (let i = 0; i < xValues.length; i++) {
        dataArray.push([xValues[i], yValues[i]]);
    }
  
    return dataArray;
};
 export default calculateXY