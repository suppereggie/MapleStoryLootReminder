export class AlterRecordModel {
    public alertName: string;
    public alertRingtone: string;
    public alertEnabled: boolean;
    public alertInterval: number;

    public constructor() {
        this.alertEnabled = false;
        this.alertName = '';
        this.alertRingtone = '';
        this.alertInterval = 90;
    }

    
}
