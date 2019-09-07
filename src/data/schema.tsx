export type TimerType = {
  id: Number,
  title: String,
  resetTime: Date,
  required: Boolean,
  completed: Date[],
  isCompleted: Boolean,
  period: String,
}
/*
  period shoud be set to:

  i-XX-unit: interval XX weeks / interval XX hours
  r-yyyy-mm-dd-hh-mm-#dow: regular year-month-day-hour-minute-# day of week

  these strings will be parsed out for dynamic resets
  year/month are not planned to be used right now, but there in case I do decide to use them
  day might be used, undecided (set to 0)
  hours used, as in: 15 UTC for daily/8 UTC for weekly
  minutes set to 0 right now, not used.
  # day of week: useful for "do on specific days" such as weekly reset, fashion report, etc.
*/