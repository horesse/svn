import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LogoComponent } from 'app/layout/common/logo/logo.component';

@Component({
  selector   : 'app-home',
  standalone : true,
  templateUrl: './home.component.html',
  imports    : [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    LogoComponent
  ]
})
export class LandingHomeComponent {

}
