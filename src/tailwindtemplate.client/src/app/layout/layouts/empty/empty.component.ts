import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { LoadingBarComponent } from '@horesse/components/loading-bar';

@Component({
  selector     : 'empty-layout',
  standalone   : true,
  templateUrl  : './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  imports      : [NgIf, RouterOutlet, LoadingBarComponent]
})
export class EmptyLayoutComponent {

  /**
   * Конструктор
   */
  constructor() {
  }
}
