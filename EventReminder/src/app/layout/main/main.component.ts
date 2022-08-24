import { formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { AlterRecordModel } from 'src/app/shared/models/alterRecord.model';
import { Ringtone } from 'src/app/shared/models/ringtone.model';
import { Guid } from 'typescript-guid';

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  selector: 'app-main',
})
export class MainComponent implements OnInit, OnDestroy {
  private subscribes: Array<Subscription> = [];
  ringtones: Array<Ringtone> = [];
  mainForm: FormGroup = new FormGroup({});
  timerStarted: boolean = false;
  timerMap: Map<string, any> = new Map([]);

  // Getter for formArry
  get alerts(): FormArray {
    return this.mainForm.get('alerts') as FormArray;
  }

  constructor(private fb: FormBuilder) {
    this.ringtones = [
      { displayName: 'loot', fileName: 'loot.mp3' },
      { displayName: 'mvp', fileName: 'mvp.mp3' },
      { displayName: 'exp', fileName: 'exp.mp3' },
      { displayName: 'other', fileName: 'other.mp3' },
      { displayName: 'pew', fileName: 'pew.mp3' },
    ];
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Used to init the formgroup
   */
  createForm() {
    this.mainForm = new FormGroup({
      alerts: new FormArray([]),
    });
    this.addRow(new AlterRecordModel());
  }

  /**
   * Insert a new row to the alert list
   * @param input
   */
  addRow(input?: AlterRecordModel) {
    this.alerts.push(this.newAlert(input ?? new AlterRecordModel()));
  }

  /**
   * Remove a formgroup from the array
   * @param i index of the formGroup
   */
  removeAlert(i: number) {
    var formGroup = this.alerts.at(i) as FormGroup;
    var timertag = formGroup.controls['timerTag']?.value;
    if(timertag && timertag != null){
      this.clearTimer(timertag);
    }

    this.alerts.removeAt(i);
  }

  /**
   * 
   * @param input 
   * @returns fromGroup
   */
  private newAlert(input: AlterRecordModel): FormGroup {
    var form = this.fb.group({
      alertName: new FormControl(input.alertName, [Validators.required]),
      alertRingtone: new FormControl(input.alertRingtone, [
        Validators.required,
      ]),
      alerEnabled: new FormControl(input.alerEnabled, []),
      alertInterval: new FormControl(input.alertInterval, [
        Validators.required,
      ]),
      alertTimer: new FormControl(input.alertInterval, []),
      timerTag: new FormControl('', []),
    });

    let checkboxChange = form.controls.alerEnabled.valueChanges.subscribe(
      (e) => {

        // case that start event timer, and the check box is toggled
        if (e && this.timerStarted) {
          // start timer
          this.startTimer(form);
        } else {
          // cancle timer
          let timerTag = form.controls.timerTag.value;
          if (timerTag && timerTag != null) {
            this.clearTimer(timerTag);
          }
          form.controls.alertTimer.setValue(form.controls.alertInterval.value);
        }
      }
    );

    let intervalChange = form.controls.alertInterval.valueChanges.subscribe((e) => {
      form.controls.alertTimer.setValue(e);
    })

    this.subscribes.push(checkboxChange);
    return form;
  }

  printValue() {
    for (var formGroup of this.alerts.controls) {
      console.log(formGroup.get('alertName')?.value);
      console.log(formGroup.get('alertRingtone')?.value);
      console.log(formGroup.get('alerEnabled')?.value);
      console.log(formGroup.get('alertInterval')?.value);
    }
  }

  startTimer(form: FormGroup) {
    var timer = setInterval(() => {
      let currentTimerValue = form.controls['alertTimer'].value as number;
      if (currentTimerValue > 0) {
        form.controls['alertTimer'].setValue(currentTimerValue - 1);
      } else {
        window.alert(`${form.controls['alertName'].value} --- triggered`);
        form.controls['alertTimer'].setValue(form.controls['alertInterval'].value as number - 1);
      }
      console.log(currentTimerValue);
    }, 1000);
    let timerTag = Guid.create().toString();
    form.controls['timerTag'].setValue(timerTag);
    this.timerMap.set(timerTag, timer);
  }

  clearTimer(timerTag: string) {
    let timer = this.timerMap.get(timerTag);
    clearInterval(timer);
    this.timerMap.delete(timerTag);
  }

  start() {
    this.timerStarted = !this.timerStarted;
    if(this.timerStarted){
      for (const formGroup of this.alerts.controls) {
        if((formGroup.get('alerEnabled')?.value ?? false) && Number.parseInt(formGroup.get('alertInterval')?.value ?? 0) > 0) {
          this.startTimer(formGroup as FormGroup);
        }
      }
    } else {
      this.timerMap.forEach((timer,key) => {
        this.clearTimer(key);
      })
      for (const formGroup of this.alerts.controls) {
        let originInterval = formGroup.get('alertInterval')?.value;
        let timerTag = formGroup.get('timerTag')?.value ?? '';
        this.clearTimer(timerTag);
        formGroup.get('alertTimer')?.setValue(originInterval);
      }
    }
  }
}
