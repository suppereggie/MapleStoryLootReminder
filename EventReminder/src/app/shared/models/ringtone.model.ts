export class Ringtone {

    public displayName: string;
    public fileName: string;

    public constructor(displayName?: string, fileName?: string) {
        this.displayName = displayName ?? '';
        this.fileName = fileName != null ? `/assets/${fileName}` : '';
    }

    
}
