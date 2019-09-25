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
    let index:number;
    let distance:number;

    // if today is a reset day
    if(daysofweek.indexOf(result.getDay()) > -1){
      // get the index of the day of week
      index = daysofweek.indexOf(result.getDay());

      // if the target hours are later than current hour:
      if(result.getHours() >= hours) {
        if(daysofweek.length === 1){
          // when there's only one day, set the result to the next occurance
          distance = 7;
        } else {
          // set the reset to the next day
          index++;
          console.log(daysofweek[index]);
          distance = (DAYS_IN_WEEK + daysofweek[index] - result.getDay()) % 7;
          console.log("Distance: ",distance)
        }
      } else {
        // when the hours haven't passed, it's the same day.
        distance = 0;
      }
    } else {
      // get the next day of week from today, and use it as the index
      for(let day of daysofweek){
        if(day > result.getDay()){
          distance = (DAYS_IN_WEEK + day - result.getDay()) % 7;
          break;
        }
      }
      // for loop will fail to set day if the next occurance has already passed
      if(distance === undefined){
        distance = (DAYS_IN_WEEK + daysofweek[0] - result.getDay()) % 7;
      }
    }
    // calculate & set the date
    result.setDate(result.getDate() + distance);

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