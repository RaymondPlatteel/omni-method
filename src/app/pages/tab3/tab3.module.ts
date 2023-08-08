import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import {Tab3PageRoutingModule} from './tab3-routing.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {ShrinkingHeaderContent, ShrinkingHeaderComponent} from 'src/app/component/shrinking-header/shrinking-header.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // ExploreContainerComponentModule,
    RouterModule.forChild([{path: '', component: Tab3Page}]),
    Tab3PageRoutingModule,
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      appearance: 'line',
      theme: {
        extendsFromRoot: true,
        'margin-bottom': '0px',
      },
    }),
    ShrinkingHeaderComponent,
    ShrinkingHeaderContent
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
