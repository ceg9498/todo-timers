export type TimerType = {
  id: number,
  title: string,
  resetTime: Date,
  required: boolean,
  completed: Date[],
  isCompleted: boolean,
  period: string,
  description?:string,
  category?:string,
  countdown?:string
}
/*
  period shoud be set to:

  i-XX-unit:
    interval XX weeks / interval XX hours
  rx-yyyy-mm-dd-hh-mm-#dow: 
    regular(local/global)-year-month-day-hour-minute-# day of week
    where x is 'l' or 'g'

  these strings will be parsed out for dynamic resets
  year/month are not planned to be used right now, but there in case I do decide to use them
  day might be used, undecided (set to 0)
  hours used, as in: 15 UTC for daily/8 UTC for weekly
  # day of week: useful for "do on specific days" such as weekly reset, fashion report, etc.
*/