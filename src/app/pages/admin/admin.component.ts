import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminHeaderComponent } from './header/header.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { ActivityListComponent } from './activity-list/activity-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    SidebarComponent,
    DashboardCardComponent,
    ChartCardComponent,
    ActivityListComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {} 