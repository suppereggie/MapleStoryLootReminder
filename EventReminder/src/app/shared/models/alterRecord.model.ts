export class AlterRecordModel {
    public alertName: string;
    public alertRingtone: string;
    public alerEnabled: boolean;
    public alertInterval: number;

    public constructor() {
        this.alerEnabled = false;
        this.alertName = '';
        this.alertRingtone = '';
        this.alertInterval = 90;
    }
}
