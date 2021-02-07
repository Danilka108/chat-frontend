import { Injectable } from '@angular/core'
import * as moment from 'moment'

@Injectable({
    providedIn: 'root',
})
export class DateService {
    parseDate(d: string) {
        const now = moment()
        const date = moment(d)

        const diff = now.diff(date, 'days')

        if (diff < 1) {
            return date.format('HH:mm')
        } else if (diff <= 30) {
            return date.format('DD.MM')
        } else {
            return date.format('DD.MM.YY')
        }
    }

    parseDateWords(d: string) {
        const now = moment()
        const date = moment(d)

        const diff = now.diff(date, 'days')

        if (diff <= 30) {
            return date.format('MMMM DD')
        } else {
            return date.format('MMMM DD, YYYY')
        }
    }

    parseDateOnlyTime(d: string) {
        const date = moment(d)
        return date.format('HH:mm')
    }

    compareDates(a: string, b: string) {
        const dateA = moment(a).valueOf()
        const dateB = moment(b).valueOf()

        if (dateA > dateB) return -1
        else if (dateA === dateB) return 0
        else return 1
    }

    compareDatesASC(dateA: string, dateB: string) {
        const dA = moment(dateA).valueOf()
        const dB = moment(dateB).valueOf()

        if (dA > dB) return 1
        else if (dA === dB) return 0
        else return -1
    }

    isUnequalDays(dateA: string, dateB: string) {
        const dA = moment(dateA).day()
        const dB = moment(dateB).day()

        return dA !== dB
    }

    now() {
        return moment.utc().format()
    }
}
