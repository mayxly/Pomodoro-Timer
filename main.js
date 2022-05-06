const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0
};

let interval;

//Listener for mode buttons to be clicked
const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

//If mode button clicked, then switch modes
function handleMode(event){
    const {mode} = event.target.dataset;
    if(!mode) return;
    switchMode(mode);
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    //Active class removed from all mode buttons and set to the one
    //that was clicked. Backaground changes depending on mode.
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
  
    updateClock();
  }

  //Returns the remaining time on the clock.
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }

  //Start the timer.
  function startTimer() {
    let {total} = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    if (timer.mode === 'pomodoro') {
        timer.sessions++;
    }

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      //Change modes when timer ends.
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
        if (timer.mode === 'pomodoro') {
            if (timer.sessions % timer.longBreakInterval === 0) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            } 
        }
        else {
            switchMode('pomodoro');
        }
        startTimer();
      }
    }, 1000);
  }


  //Update the clock when mode changes or timer is started.
  function updateClock() {
      const { remainingTime } = timer;
      const minutes = `${remainingTime.minutes}`.padStart(2, '0');
      const seconds = `${remainingTime.seconds}`.padStart(2, '0');

      const min = document.getElementById('js-minutes');
      const sec = document.getElementById('js-seconds');
      min.textContent = minutes;
      sec.textContent = seconds;
  }

