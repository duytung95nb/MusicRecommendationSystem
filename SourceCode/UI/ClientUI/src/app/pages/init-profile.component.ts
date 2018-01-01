import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { UserService } from '../helper/userService';

/**
 * @title Stepper overview
 */
@Component({
  templateUrl: 'init-profile.component.html',
  styleUrls: ['./init-profile.component.css']
})
export class InitProfile {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  composerFormGroup: FormGroup;
  genres: Array<any>;
  artists: Array<any>;
  composers: Array<any>;
  private loggedInInfo: any;
  private loggedInUser: any;
  constructor(private _formBuilder: FormBuilder, private userService: UserService) {
    this.loggedInInfo = localStorage.getItem('loggedInInfo');
    if (this.loggedInInfo) {
        this.loggedInUser = JSON.parse(this.loggedInInfo).userInfo;
    }
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      values: this._formBuilder.array([])
    });
    this.secondFormGroup = this._formBuilder.group({
      values: this._formBuilder.array([])
    });
    this.composerFormGroup = this._formBuilder.group({
      values: this._formBuilder.array([])
    });

    var self = this;
    this.userService.getInitialData()
    .subscribe(initialData => {
      self.genres = initialData.value.genres;
      self.artists = initialData.value.artists;
      self.composers = initialData.value.composers;
    });
  }
  onCheckedChange(value:string, isChecked: boolean) {
    var formValues = <FormArray>this.firstFormGroup.controls.values;
  
    if(isChecked) {
      formValues.push(new FormControl(value));
    } else {
      let index = formValues.controls.findIndex(x => x.value == value)
      formValues.removeAt(index);
    }
  }

  onGenresSubmit() {
    var selectedGenreIndexes = this.firstFormGroup.getRawValue().values;
    var indexesArray = new Array();
    indexesArray.length = this.genres.length;
    indexesArray.fill(0);
    for(var i=0; i< selectedGenreIndexes.length; i++) {
      indexesArray[selectedGenreIndexes[i]] = 1;
    }

    this.userService.submitInitialData(this.loggedInUser.id, indexesArray)
      .subscribe(result => {
        console.log(result);
      });
  }
  
  onArtistsSubmit = () => {
    var selectedArtistIndexes = this.secondFormGroup.getRawValue().values;
    var indexesArray = new Array();
    indexesArray.length = this.genres.length;
    indexesArray.fill(0);
    for(var i=0; i< selectedArtistIndexes.length; i++) {
      indexesArray[selectedArtistIndexes[i]] = 1;
    }
    this.userService.submitInitialData(this.loggedInUser.id, indexesArray)
      .subscribe(result => {
        console.log(result);
      });
  }
  
  onComposersSubmit = () => {
    var selectedComposerIndexes = this.composerFormGroup.getRawValue().values;
    var indexesArray = new Array();
    indexesArray.length = this.genres.length;
    indexesArray.fill(0);
    for(var i=0; i< selectedComposerIndexes.length; i++) {
      indexesArray[selectedComposerIndexes[i]] = 1;
    }
    this.userService.submitInitialData(this.loggedInUser.id, indexesArray)
      .subscribe(result => {
        console.log(result);
      });
  }
}