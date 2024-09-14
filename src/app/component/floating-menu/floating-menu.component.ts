import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AnnouncementsService} from '../../services/announcements/announcements.service';
import {UserService} from '../../services/user/user.service';
import {User} from '../../store/user/user.model';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class FloatingMenuComponent implements OnInit {
  @Input() user: User;

  constructor(
    public userService: UserService,
    public announcementService: AnnouncementsService,
  ) {}

  ngOnInit() {}

}
