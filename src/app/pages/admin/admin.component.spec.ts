import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To ignore unknown elements like app-admin-sidebar

import { AdminComponent } from './admin.component';
// Import any services or modules AdminComponent might directly depend on, if any.
// For this component, it seems to be mostly structural.

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [
        // Import modules AdminComponent might need, e.g., RouterTestingModule if it uses router-outlet
        // For now, assuming it's primarily structural and child components are handled via NO_ERRORS_SCHEMA
      ],
      providers: [
        // Provide mocks for any services AdminComponent directly injects
      ],
      schemas: [NO_ERRORS_SCHEMA] // Use NO_ERRORS_SCHEMA to allow <app-admin-sidebar> etc.
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the main layout class ".admin-layout"', () => {
    expect(compiled.querySelector('.admin-layout')).toBeTruthy();
  });

  it('should have an "<app-admin-sidebar>" element', () => {
    // This test relies on NO_ERRORS_SCHEMA.
    // A more robust test would involve ensuring AdminSidebarComponent is imported and rendered.
    expect(compiled.querySelector('app-admin-sidebar')).toBeTruthy();
  });

  it('should have a main content area with class ".admin-main"', () => {
    expect(compiled.querySelector('.admin-main')).toBeTruthy();
  });
  
  it('should have a dashboard content area with class ".admin-dashboard-content"', () => {
    const adminMain = compiled.querySelector('.admin-main');
    expect(adminMain?.querySelector('.admin-dashboard-content')).toBeTruthy();
  });

  it('should have a row for dashboard cards with class ".dashboard-cards-row"', () => {
    const dashboardContent = compiled.querySelector('.admin-dashboard-content');
    expect(dashboardContent?.querySelector('.dashboard-cards-row')).toBeTruthy();
  });

  it('should render <app-dashboard-card> components inside .dashboard-cards-row', () => {
    // This test assumes that NO_ERRORS_SCHEMA is used.
    // It checks if the custom elements are present in the DOM.
    const cardsRow = compiled.querySelector('.dashboard-cards-row');
    expect(cardsRow).toBeTruthy();
    expect(cardsRow?.querySelectorAll('app-dashboard-card').length).toBeGreaterThan(0); // Expecting at least one
  });

  it('should have a row for charts with class ".dashboard-charts-row"', () => {
    const dashboardContent = compiled.querySelector('.admin-dashboard-content');
    expect(dashboardContent?.querySelector('.dashboard-charts-row')).toBeTruthy();
  });
  
  it('should render <app-chart-card> components inside .dashboard-charts-row', () => {
    const chartsRow = compiled.querySelector('.dashboard-charts-row');
    expect(chartsRow).toBeTruthy();
    expect(chartsRow?.querySelectorAll('app-chart-card').length).toBeGreaterThan(0);
  });

  it('should have a row for activity lists with class ".dashboard-activity-row"', () => {
    const dashboardContent = compiled.querySelector('.admin-dashboard-content');
    expect(dashboardContent?.querySelector('.dashboard-activity-row')).toBeTruthy();
  });

  it('should render <app-activity-list> components inside .dashboard-activity-row', () => {
    const activityRow = compiled.querySelector('.dashboard-activity-row');
    expect(activityRow).toBeTruthy();
    expect(activityRow?.querySelectorAll('app-activity-list').length).toBeGreaterThan(0);
  });

});
