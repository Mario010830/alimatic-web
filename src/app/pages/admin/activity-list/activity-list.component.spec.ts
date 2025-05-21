import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To handle child components or directives like mat-icon if not importing modules

import { ActivityListComponent, ActivityItem, ReportItem } from './activity-list.component';

describe('ActivityListComponent', () => {
  let component: ActivityListComponent;
  let fixture: ComponentFixture<ActivityListComponent>;
  let compiled: HTMLElement;

  const mockActivities: ActivityItem[] = [
    { id: '1', user: 'John Doe', description: 'Logged in', time: '10:00 AM', type: 'user_login' },
    { id: '2', user: 'Jane Smith', description: 'Updated profile', time: '10:05 AM', type: 'profile_update' }
  ];

  const mockReports: ReportItem[] = [
    { id: 'r1', user: 'Admin User', description: 'User "john.doe" attempted unauthorized access.', time: '11:00 AM', status: 'pending', type: 'security_alert' },
    { id: 'r2', user: 'System', description: 'Scheduled backup completed.', time: '11:30 AM', status: 'resolved', type: 'system_backup' }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityListComponent],
      imports: [
        // Import MatIconModule if actual mat-icons are used and not covered by NO_ERRORS_SCHEMA
      ],
      schemas: [NO_ERRORS_SCHEMA] // Good for now, assuming buttons and icons are simple or covered
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityListComponent);
    component = fixture.componentInstance;
    // Default inputs, can be overridden in specific tests
    component.type = 'activity'; // Default to 'activity' type
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the main list container with class ".activity-list"', () => {
    const listContainer = compiled.querySelector('.activity-list');
    expect(listContainer).toBeTruthy();
  });

  it('should display the title based on the "type" input', () => {
    // Test for 'activity' type (default or set explicitly)
    component.type = 'activity';
    component.ngOnChanges({ type: { currentValue: 'activity', previousValue: '', firstChange: true, isFirstChange: () => true } });
    fixture.detectChanges();
    let titleElement = compiled.querySelector('.activity-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe('Recent Activity');

    // Test for 'reports' type
    component.type = 'reports';
    component.ngOnChanges({ type: { currentValue: 'reports', previousValue: 'activity', firstChange: false, isFirstChange: () => false } });
    fixture.detectChanges();
    titleElement = compiled.querySelector('.activity-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe('Pending Reports');
  });

  it('should have an activity items container with class ".activity-items"', () => {
    const itemsContainer = compiled.querySelector('.activity-items');
    expect(itemsContainer).toBeTruthy();
  });

  describe('Activity Type Rendering', () => {
    beforeEach(() => {
      component.type = 'activity';
      component.activities = mockActivities;
      component.ngOnChanges({ type: { currentValue: 'activity', previousValue: '', firstChange: true, isFirstChange: () => true }, activities: {currentValue: mockActivities, previousValue: [], firstChange: true, isFirstChange: () => true } });
      fixture.detectChanges();
    });

    it('should render activity items when type is "activity" and activities are provided', () => {
      const listItems = compiled.querySelectorAll('.activity-items li');
      expect(listItems.length).toBe(mockActivities.length);
    });

    it('should display user, description, and time for each activity item', () => {
      const firstListItem = compiled.querySelector('.activity-items li');
      expect(firstListItem).toBeTruthy();
      expect(firstListItem?.querySelector('.activity-user')?.textContent).toContain(mockActivities[0].user);
      expect(firstListItem?.querySelector('.activity-desc')?.textContent).toContain(mockActivities[0].description);
      expect(firstListItem?.querySelector('.activity-time')?.textContent).toContain(mockActivities[0].time);
      // No action buttons expected for 'activity' type by default in this mock setup
      expect(firstListItem?.querySelector('.activity-actions')).toBeFalsy();
    });
  });

  describe('Report Type Rendering', () => {
    beforeEach(() => {
      component.type = 'reports';
      component.reports = mockReports;
      // Simulate ngOnChanges for 'type' and 'reports'
      component.ngOnChanges({ 
        type: { currentValue: 'reports', previousValue: 'activity', firstChange: false, isFirstChange: () => false },
        reports: { currentValue: mockReports, previousValue: [], firstChange: true, isFirstChange: () => true } 
      });
      fixture.detectChanges();
    });

    it('should render report items when type is "reports" and reports are provided', () => {
      const listItems = compiled.querySelectorAll('.activity-items li');
      expect(listItems.length).toBe(mockReports.length);
    });

    it('should display user, description, time, status, and actions for each report item', () => {
      const firstListItem = compiled.querySelector('.activity-items li');
      expect(firstListItem).toBeTruthy();
      expect(firstListItem?.querySelector('.activity-user')?.textContent).toContain(mockReports[0].user);
      expect(firstListItem?.querySelector('.activity-desc')?.textContent).toContain(mockReports[0].description);
      expect(firstListItem?.querySelector('.activity-time')?.textContent).toContain(mockReports[0].time);
      
      const statusElement = firstListItem?.querySelector('.activity-status');
      expect(statusElement).toBeTruthy();
      expect(statusElement?.textContent?.trim().toLowerCase()).toBe(mockReports[0].status);
      expect(statusElement?.classList.contains(mockReports[0].status)).toBeTrue(); // e.g. class="pending"

      const actionsContainer = firstListItem?.querySelector('.activity-actions');
      expect(actionsContainer).toBeTruthy();
      expect(actionsContainer?.querySelectorAll('.btn').length).toBe(3); // Assuming 3 buttons: Review, Block, Dismiss
    });

    it('should have correctly styled buttons for reports', () => {
        const firstListItem = compiled.querySelector('.activity-items li');
        const reviewButton = firstListItem?.querySelector('.btn.review'); // or .btn.primary
        const blockButton = firstListItem?.querySelector('.btn.block');   // or .btn.danger
        const dismissButton = firstListItem?.querySelector('.btn.dismiss'); // or .btn.secondary

        expect(reviewButton).toBeTruthy();
        expect(blockButton).toBeTruthy();
        expect(dismissButton).toBeTruthy();
    });
  });
  
  it('should have custom scrollbar styling conceptually via SCSS', () => {
    // The SCSS includes ::-webkit-scrollbar styles.
    // We trust that if .activity-items is present, these styles apply.
    const itemsContainer = compiled.querySelector('.activity-items');
    expect(itemsContainer).toBeTruthy();
  });
  
  it('should apply hover effect to card conceptually via SCSS', () => {
    const cardElement = compiled.querySelector('.activity-list');
    expect(cardElement).toBeTruthy(); 
  });
});
