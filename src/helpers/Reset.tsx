import React from 'react'

// import a period of time (day, week, other) and return the time at which the reset occurs
export default function getReset(period){
  let reset = new Date();
  if(period === "day"){
      reset.setUTCHours(15);
  } else if(period === "week"){
      // Tuesday @ 8am UTC
      // Need to figure out how to change the date itself
  } else {
      // Based on the text in timer.frequency
      // Need to figure out how I want to store the data
  }
  reset.setUTCMinutes(0);
  reset.setUTCSeconds(0);
  reset.setUTCMilliseconds(0);
  return reset;
}