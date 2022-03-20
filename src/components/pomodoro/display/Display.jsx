import './style.css'

const Display = (props) => {


    const secToTime = (sec) => {
        var pad = function(num, size) { return ('000' + num).slice(size * -1); }
        let time = parseFloat(sec).toFixed(3);
        let hours = Math.floor(time / 60 / 60);
        let minutes = Math.floor(time / 60) % 60;
        let seconds = Math.floor(time - minutes * 60);
        //let milliseconds = time.slice(-3);        
       return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);       
    }

    return (
        
        <div className="base-timer">
            {props.timeLeft}
            <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g className="base-timer__circle">
                <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path
                    id="base-timer-path-remaining"             
                    className={`base-timer__path-remaining ${props.clockColor}`}
                    d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                    "
                ></path>
                </g>
            </svg>
            <span id="base-timer-label" className="base-timer__label">
               { secToTime( props.timeLeft  ) }
            </span>
        </div>
    )
}

export default Display;