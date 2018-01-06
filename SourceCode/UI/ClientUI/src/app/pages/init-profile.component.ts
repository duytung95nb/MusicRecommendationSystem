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
  
  onInitialProfileSubmit (event) {
    var selectedGenreIndexes = this.firstFormGroup.getRawValue().values;
    var genreIndexesArray = new Array();
    genreIndexesArray.length = this.genres.length;
    genreIndexesArray.fill(0);
    for(var i=0; i< selectedGenreIndexes.length; i++) {
      genreIndexesArray[selectedGenreIndexes[i]] = 1;
    }

    var selectedArtistIndexes = this.secondFormGroup.getRawValue().values;
    var artistIndexesArray = new Array();
    artistIndexesArray.length = this.artists.length;
    artistIndexesArray.fill(0);
    for(var i=0; i< selectedArtistIndexes.length; i++) {
      artistIndexesArray[selectedArtistIndexes[i]] = 1;
    }

    var selectedComposerIndexes = this.composerFormGroup.getRawValue().values;
    var composerIndexesArray = new Array();
    composerIndexesArray.length = this.genres.length;
    composerIndexesArray.fill(0);
    for(var i=0; i< selectedComposerIndexes.length; i++) {
      composerIndexesArray[selectedComposerIndexes[i]] = 1;
    }
    this.userService.submitInitialData(this.loggedInUser.id, genreIndexesArray, artistIndexesArray, composerIndexesArray)
      .subscribe(result => {
        console.log(result);
      });
    event.stopPropagation();
  }
}