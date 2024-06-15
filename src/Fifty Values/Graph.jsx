import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import calculateXY from "./get500Values";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);


const Graph= () => {
  
const dataPoints = calculateXY(0, 0, 500)
const data = {
  labels: dataPoints.map(point => point[0].toFixed(2)),
  datasets: [{
      label: 'Data 1',
      data: dataPoints.map(point => (point[1])),
      backgroundColor: 'rgb(16,217,219)',
      borderColor: 'black',
      pointBorderColor: 'transparent',
      tension: 0.4,
      showLine: false
    }
  ]
};

const options= {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: {
        display: true,
      },
      min: -1.5,
      max: 1.5,
      ticks: {
        stepSize: 0.05
      },
      grid: {
        color: 'rgba(220, 220, 220, 0.05)' 
      }
    },
    y: {
      type: 'linear',
      title: {
        display: true,
      },
      min: -0.5,
      max: 0.5,
      ticks: {
        stepSize: 0.05
      },
      grid: {
        color: 'rgba(220, 220, 220, 0.05)' 
      }
    }
  }
};

  return (
      <Line data={data} options={options} className='chartjs' />
  );
};

export default Graph;
