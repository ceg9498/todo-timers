const DAYS_IN_WEEK = 7;

export function setReset(period:String):Date{
  let data = period.split('.');
  let result = new Date();
  // for "interval" type timers
  if(data[0] === 'i'){
    let amount = parseInt(data[1]);
    let unit = data[2];
    switch(unit){
      case "minutes":
        result.setMinutes(result.getMinutes() + amount);
        break;
      case "hours":
        result.setHours(result.getHours() + amount);
        break;
      case "days":
        result.setDate(result.getDate() + amount);
        break;
      default:
        console.error("ERROR: interval unit not recognized.");
    }
  } else if(data[0][0] === 'r'){
    // for "regular" type timers
    // data[0][1] is 'l' for local time or 'g' for global(UTC) time
    let useUTC = false;
    if(data[0][1] === 'g'){
      useUTC = true;
    }
    /* 
      0: 'r(g/l)'
      1: year // currently unused
      2: month // currently unused
      3: day of month // currently unused
      4: hours
      5: minutes
      6: days of week
    */
    let hours = parseInt(data[4]);
    let minutes = parseInt(data[5]);
    let dayStrings = data[6].split('');
    let daysofweek = dayStrings.map(str=>{
      return parseInt(str);
    });

    // this logic block is specifically for Days of Week
    if(daysofweek.length === 1){
      if(daysofweek[0] === result.getDay()){
        // if current day is the same as the intended reset day, check hours
        if(result.getHours() >= hours){
          // if the current hours are greater/equal to desired hours, then
          // date should be next week (just add DAYS_IN_WEEK to current date)
          result.setDate(result.getDate() + DAYS_IN_WEEK);
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
        let distance = daysofweek[index] + DAYS_IN_WEEK - result.getDay();
        distance %= 7;
        result.setDate(result.getDate() + distance);
      }
    } // end Days of Week logic block

    if(useUTC){
      result.setUTCHours(hours);
      result.setUTCMinutes(minutes);
    } else {
      result.setHours(hours);
      result.setMinutes(minutes);
    }
    result.setSeconds(0);
    result.setMilliseconds(0);
  }
  return result;
}

export function checkResets(targetTime:Date){
  let now = new Date();
  // if `now` is MORE than `timer`, reset
  if(now.valueOf() > targetTime.valueOf()){
    return true;
  }
  return false;
}