const TUESDAY = 2;
const DAYS_IN_WEEK = 7;

// import a period of time (day, week, other) and return the time at which the reset occurs
export function getReset(period:String):Date{
  let reset = new Date();
  if(period === "day"){
    if(reset.getUTCHours() > 15){
        // if 1500 UTC has already passed today, set the date to tomorrow
        reset.setUTCDate(reset.getUTCDate()+1);
    }
    // then set the hours to 1500
    reset.setUTCHours(15);
  } else if(period === "week"){
    // Tuesday @ 8am UTC
    if(reset.getUTCDay() === TUESDAY){
        // if it's currently tuesday UTC:
        if(reset.getUTCHours() > 8){
            // if it's after 8, reset will be next week
            reset.setUTCDate(reset.getUTCDate()+DAYS_IN_WEEK);
        }
    } else {
        // it's not Tuesday, so time for some magic:
        let distance = TUESDAY + DAYS_IN_WEEK - reset.getUTCDay();
        reset.setUTCDate(reset.getUTCDate()+distance);
    }
    // regardless of what day it is, reset is at 8 UTC:
    reset.setUTCHours(8);
  } else {
    // Based on the text in timer.frequency
    // Need to figure out how I want to store the data
  }
  // minutes, seconds, and ms should always be 0
  reset.setUTCMinutes(0);
  reset.setUTCSeconds(0);
  reset.setUTCMilliseconds(0);
  return reset;
}

export function setReset(period:String):Date{
  let data = period.split('-');
  let result = new Date();
  // for "interval" type timers
  if(data[0] === 'i'){
    let amount = parseInt(data[1]);
    let unit = data[2]
    switch(unit){
      case "hours":
        result.setHours(result.getHours() + amount);
        break;
      case "days":
        result.setDate(result.getDate() + amount);
        break;
      default:
        console.error("ERROR: interval unit not recognized.");
    }
  } else if(data[0] === 'r'){
    // for "regular" type timers
    // indexes: 1, 2, 3, 5 are currently unused
    let hours = parseInt(data[4]);
    let dayStrings = data[6].split('');
    let daysofweek = dayStrings.map(str=>{
      return parseInt(str);
    });

    if(daysofweek.length === 1){
      if(daysofweek[0] === result.getDay()){
        // if current day is the same as the intended reset day, check hours
        if(result.getHours() >= hours){
          // if the current hours are greater/equal to desired hours, then
          // date should be next week
          let distance = daysofweek[0] + DAYS_IN_WEEK - result.getDay();
          distance %= 7;
          result.setDate(result.getDate() + distance);
        } // otherwise, the date is OK
      } else {
        // current day is not the same as intended day
        // set the date to today plus the number of days between today and the next DoW
        let distance = daysofweek[0] + DAYS_IN_WEEK - result.getDay();
        distance %= 7;
        result.setDate(result.getDate() + distance);
      }
    } else {
      // multiple days specified
      //if result's current Day is in daysofweek:
      if(daysofweek.indexOf(result.getDay()) > -1){
        // check result's hours based on `hours`:
        if(result.getHours() >= hours){
          let index = daysofweek.indexOf(result.getDay()) +1;
          // use next day of week in daysofweek and set that via distance
          if(index === daysofweek.length){
            index = 0;
          }
          console.log("Target day of week: ", daysofweek[index])
          let distance = daysofweek[index] + DAYS_IN_WEEK - result.getDay();
          distance %= 7;
          result.setDate(result.getDate() + distance);
        }
      } else {
        let index = daysofweek.indexOf(result.getDay()) +1;
        // use next day of week in daysofweek and set that via distance
        if(index === daysofweek.length){
          index = 0;
        }
        console.log("Target day of week: ", daysofweek[index])
        let distance = daysofweek[index] + DAYS_IN_WEEK - result.getDay();
        distance %= 7;
        result.setDate(result.getDate() + distance);
      }
    }
    result.setHours(hours);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
  }
  return result;
}

export function checkResets(targetTime:Date){
  let now = new Date()

  // if `now` is MORE than `timer`, reset
  if(now.valueOf() > targetTime.valueOf()){
    return true;
  }
  return false;
}