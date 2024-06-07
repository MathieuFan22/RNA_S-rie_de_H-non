import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import calculateXY from './get500Values';
// import calculateXY from './get500Values';

function FiftyValues() {
    // const data = calculateXY(0, 0, 500);
    const data = calculateXY(0, 0, 500)
    return (
        <div className='fifty'>
            {data.map(([xVal, yVal], index) => {
                if (index === 0) {
                    return (
                        <div className='list' >
                            <div>Pour n = 0</div>
                            <div>
                                x(0) = 0
                            </div>
                            <div>
                                y(0) = 0
                            </div>
                        </div>
                    );
                }

                return (
                    <div className='list' key={index} >
                        <div>Pour n = {index}</div>
                        <div>
                            x({index}) = {xVal}
                        </div>
                        <div>
                            y({index}) ={yVal}
                        </div>
                    </div>
                );
            })}
            <div className="scrollButtons">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><FontAwesomeIcon icon={faCaretUp} /></button>
                <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}><FontAwesomeIcon icon={faCaretDown} /></button>
            </div>
        </div>
    );
}

export default FiftyValues;
