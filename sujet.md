Titre : PREDICTION ET MODELISATION DE SERIES TEMPORELLES PAR RESEAUX DE NEURONES ARTIFICIELS MUMTICOUCHES.

La série de Hénon est obtenue en générant les relations de récurrence suivantes :
const a= 1.4;
const b= 0.3;
x(n+1) = y[n] + 1 - a * x[n]²;
y(n+1) = b * x[n];

Travail à effecture :
1 - Générer les 500 premiers valeurs de x(n) et de y(n) en prenant x(0)=0 et y(0)=0.
2 - Tracer y(n) en fonction de x(n)
3 - Prédiction :
Faire la prédiction sur la série par les valeurs de x(n).
    a) Déterminer l'architecture optimale du réseau premettant de faire les meilleures prédictions

    b) Faire l'apprentissage du réseau
   
NB:
Le project est fait avec react js
Les questions 1/2/3-a) sont déjà finies. On pour unité de couche d'entrée : 5, pour la couche cachée: 4, pour la sortie : 1.
Cette fonction calcule les 500 valeurs :
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
Et on extract les valeurs de x avec : 
  const datas = calculateXY(0, 0, 500);
  const data = (datas.map(point => (point[0]))).slice(1);

Fait la question 3-c sans utiliser une bibliothèque de prédiction 

    ###
     c) Effectuer des prédictions à un pas. (10 valeurs prédites pour 10 valeurs existantes)
    d) Effectuer des prédictions à 3 pas en avant, à 10 pas en avant et à 20 pas en avant.