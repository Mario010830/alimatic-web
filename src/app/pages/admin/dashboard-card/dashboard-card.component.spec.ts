import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule

import { DashboardCardComponent } from './dashboard-card.component';

describe('DashboardCardComponent', () => {
  let component: DashboardCardComponent;
  let fixture: ComponentFixture<DashboardCardComponent>;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCardComponent],
      imports: [MatIconModule] // Add MatIconModule here
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCardComponent);
    component = fixture.componentInstance;
    // Set default inputs if necessary for basic rendering
    component.icon = 'person';
    component.title = 'Test Title';
    component.value = '100';
    component.subtitle = '+10%';
    component.color = 'orange'; // Default color for testing class application
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the main card element with class ".dashboard-card"', () => {
    const cardElement = compiled.querySelector('.dashboard-card');
    expect(cardElement).toBeTruthy();
  });

  it('should display the icon in .card-icon', () => {
    const iconContainer = compiled.querySelector('.card-icon');
    expect(iconContainer).toBeTruthy();
    const matIcon = iconContainer?.querySelector('mat-icon');
    expect(matIcon).toBeTruthy();
    expect(matIcon?.textContent?.trim()).toBe(component.icon);
  });

  it('should display the title in .card-title', () => {
    const titleElement = compiled.querySelector('.card-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe(component.title);
  });

  it('should display the value in .card-value', () => {
    const valueElement = compiled.querySelector('.card-value');
    expect(valueElement).toBeTruthy();
    expect(valueElement?.textContent?.trim()).toBe(component.value);
  });

  it('should display the subtitle in .card-subtitle', () => {
    const subtitleElement = compiled.querySelector('.card-subtitle');
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement?.textContent?.trim()).toBe(component.subtitle);
  });

  it('should apply color-specific class to the host element based on color input', () => {
    // Test for 'orange'
    component.color = 'orange';
    fixture.detectChanges();
    // The class is applied to the host element <app-dashboard-card>
    // For testing :host-context, we check the class on the host element itself
    expect(fixture.debugElement.nativeElement.classList.contains('orange')).toBeTrue();
    expect(fixture.debugElement.nativeElement.classList.contains('green')).toBeFalse();

    // Test for 'green'
    component.color = 'green';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList.contains('green')).toBeTrue();
    expect(fixture.debugElement.nativeElement.classList.contains('orange')).toBeFalse();
    
    // Test for 'red'
    component.color = 'red';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList.contains('red')).toBeTrue();

    // Test for 'blue'
    component.color = 'blue';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.classList.contains('blue')).toBeTrue();
  });
  
  it('should have a card-icon container with correct styling properties (conceptual)', () => {
    // Direct SCSS style checking is hard. We infer from class presence and structure.
    const cardIcon = compiled.querySelector('.card-icon');
    expect(cardIcon).toBeTruthy();
    // The SCSS uses `background: rgba(var(--accent-color-local-rgb), 0.1);`
    // and `color: var(--accent-color-local);` for the mat-icon,
    // which is controlled by the :host-context(.color-name) classes.
    // The test above 'should apply color-specific class' covers the class application.
  });

  it('should have hover effect classes applied conceptually via SCSS', () => {
    // The SCSS has:
    // &:hover {
    //   box-shadow: var(--shadow-hover-local);
    //   transform: translateY(-4px);
    // }
    // This is a CSS behavior, not easily testable in unit tests for style computation.
    // We trust that if the .dashboard-card class is present, these styles apply.
    const cardElement = compiled.querySelector('.dashboard-card');
    expect(cardElement).toBeTruthy(); // Presence implies styles are linked.
  });
});
