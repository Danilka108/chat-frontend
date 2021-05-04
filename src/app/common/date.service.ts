import { Injectable } from '@angular/core'

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

@Injectable({
    providedIn: 'root',
})
export class DateService {
    parseDate(d: string): string {
        const now = Date.now()
        const date = new Date(d)

        const diff = Math.abs(now - date.getTime()) / (1000 * 60 * 60 * 24)

        const hours = ('0' + date.getHours().toString()).slice(-2)
        const minutes = ('0' + date.getMinutes().toString()).slice(-2)
        const day = ('0' + date.getDate().toString()).slice(-2)
        const month = ('0' + date.getMonth().toString()).slice(-2)
        const year = date.getFullYear().toString().slice(-2)

        if (diff < 1) {
            return `${hours}:${minutes}`
        } else if (diff <= 30) {
            return `${day}.${month}`
        } else {
            return `${day}.${month}.${year}`
        }
    }

    getIDFromDate(d: string): string {
        const date = new Date(d)

        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }

    parseDateWords(d: string): string {
        const now = Date.now()
        const date = new Date(d)

        const diff = Math.abs(now - date.getTime()) / (1000 * 60 * 60 * 24)

        const day = ('0' + date.getDate().toString()).slice(-2)
        const month = monthNames[date.getMonth()]

        if (diff <= 30) {
            return `${month} ${day}`
        } else {
            return `${month} ${day}, ${date.getFullYear()}`
        }
    }

    parseDateOnlyTime(d: string): string {
        const date = new Date(d)

        const hours = ('0' + date.getHours().toString()).slice(-2)
        const minutes = ('0' + date.getMinutes().toString()).slice(-2)

        return `${hours}:${minutes}`
    }

    compareDates(a: string, b: string): -1 | 0 | 1 {
        const dA = new Date(a).getTime()
        const dB = new Date(b).getTime()

        if (dA > dB) return -1
        else if (dA === dB) return 0
        else return 1
    }

    compareDatesASC(a: string, b: string): -1 | 0 | 1 {
        const dA = new Date(a).getTime()
        const dB = new Date(b).getTime()

        if (dA > dB) return 1
        else if (dA === dB) return 0
        else return -1
    }

    isUnequalDays(dateA: string, dateB: string): boolean {
        const dA = new Date(dateA)
        const dB = new Date(dateB)

        return !(
            dA.getFullYear() === dB.getFullYear() &&
            dA.getMonth() === dB.getMonth() &&
            dA.getDate() === dB.getDate()
        )
    }

    now(): string {
        return new Date().toISOString().slice(0, -5) + 'Z'
    }
}
