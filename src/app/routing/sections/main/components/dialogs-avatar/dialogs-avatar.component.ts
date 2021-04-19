import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-dialogs-avatar',
    templateUrl: './dialogs-avatar.component.html',
    styleUrls: ['./dialogs-avatar.component.scss'],
})
export class DialogsAvatarComponent implements OnInit {
    @Input() size!: number
    @Input() name!: string | null

    symbols = ['', '']

    saturation = 40
    lightness = 60
    leftShift = 60

    color!: string

    ngOnInit(): void {
        const splittedString = this.name === null ? '' : this.name.split(' ')

        if (splittedString[0] && splittedString[0][0]) this.symbols[0] = splittedString[0][0]

        if (splittedString[1] && splittedString[1][0]) this.symbols[1] = splittedString[1][0]

        this.color = this.nameToHslColor(this.name === null ? '' : this.name)
    }

    nameToHslColor(name: string): string {
        let hash = 0

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << this.leftShift) - hash)
        }

        const h = hash % 360

        return `hsl(${h}, ${this.saturation}%, ${this.lightness}%)`
    }
}
