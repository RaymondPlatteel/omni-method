import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CommunityPageRoutingModule} from './community-routing.module';

import {CommunityPage} from './community.page';
import {UserAvatarComponent} from '../../component/user-avatar/user-avatar.component';
import {FloatingMenuComponent} from '../../component/floating-menu/floating-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    UserAvatarComponent,
    FloatingMenuComponent
  ],
  declarations: [CommunityPage]
})
export class CommunityPageModule {}
