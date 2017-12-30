import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

/**
 * @title Stepper overview
 */
@Component({
  templateUrl: 'add-profile.component.html',
  styleUrls: ['./add-profile.component.css']
})
export class StepperOverviewExample {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  }
}