import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    // const info = this.router.getCurrentNavigation().extras.info;
    console.log("homePage ngOnInit navigation extras",
      this.router.getCurrentNavigation().extras);
    // if (Object.keys(info).includes("newUser")) {
    //   console.log("home page newUser");
    //   alert("Welcome consider adding profile picture");
    // }
  }

}
