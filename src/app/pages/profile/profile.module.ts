import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProfilePage} from './profile.page';

import {ProfilePageRoutingModule} from './profile-routing.module';
import {NewScorePageModule} from '../new-score/new-score.module';
import {EditProfilePageModule} from '../edit-profile/edit-profile.module';
import {UserAvatarComponent} from 'src/app/component/user-avatar/user-avatar.component';
import {ProfileHeaderComponent} from 'src/app/component/profile-header/profile-header.component';
import {ScoreCardComponent} from "../../component/score-card/score-card.component";
import {FloatingMenuComponent} from 'src/app/component/floating-menu/floating-menu.component';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule,
    NewScorePageModule,
    EditProfilePageModule,
    UserAvatarComponent,
    ProfileHeaderComponent,
    ScoreCardComponent,
    FloatingMenuComponent
  ],
})
export class ProfilePageModule {}
