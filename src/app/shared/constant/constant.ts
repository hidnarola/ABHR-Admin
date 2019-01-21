export class Constant {
    VERIFICATION_STATUS = [
        { 'key': 0, 'value': 'Not Added' },
        { 'key': 1, 'value': 'Not Verified' },
        { 'key': 2, 'value': 'Verified' }
    ];
}
export class Cancel {
    hours: number;
    rate: number;
    descr: string;

    constructor(hours, rate) {
        this.hours = hours;
        this.rate = rate;
        this.descr = this.hours + ' ' + this.rate;
    }
}
