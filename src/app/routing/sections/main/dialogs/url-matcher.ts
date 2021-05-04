import { UrlSegment } from '@angular/router'

export const urlMathcer = (
    url: UrlSegment[]
): {
    consumed: UrlSegment[]
} => {
    return {
        consumed: url,
    }
}
