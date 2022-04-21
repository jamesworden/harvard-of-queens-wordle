export class DateUtils {
  static daysBetween(startDate: Date, endDate: Date) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000

    const endDateInMs = this.getDateAsUTC(endDate).getTime()
    const startDateInMs = this.getDateAsUTC(startDate).getTime()
    const timeDiffInMs = endDateInMs - startDateInMs
    const daysAsDecimal = timeDiffInMs / millisecondsPerDay
    const days = Math.floor(daysAsDecimal)

    return days
  }

  private static getDateAsUTC(date: Date) {
    var result = new Date(date)
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
    return result
  }
}
