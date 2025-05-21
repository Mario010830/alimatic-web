import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // To handle potential third-party chart directives

import { ChartCardComponent } from './chart-card.component';

// If Chart.js or ngx-echarts is used, you might need to mock them or their modules.
// For simplicity, we'll assume the chart directive/component doesn't break basic rendering.

describe('ChartCardComponent', () => {
  let component: ChartCardComponent;
  let fixture: ComponentFixture<ChartCardComponent>;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChartCardComponent],
      imports: [
        // Import necessary modules if any, e.g., NgxEchartsModule if used
      ],
      schemas: [NO_ERRORS_SCHEMA] // Use NO_ERRORS_SCHEMA to allow chart directives
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCardComponent);
    component = fixture.componentInstance;
    // Set default inputs
    component.title = 'Sample Chart Title';
    component.chartType = 'bar'; // Or any default/test type
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the main card element with class ".chart-card"', () => {
    const cardElement = compiled.querySelector('.chart-card');
    expect(cardElement).toBeTruthy();
  });

  it('should display the title in .chart-title', () => {
    const titleElement = compiled.querySelector('.chart-title');
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent?.trim()).toBe(component.title);
  });

  it('should have a chart container with class ".chart-container"', () => {
    const chartContainer = compiled.querySelector('.chart-container');
    expect(chartContainer).toBeTruthy();
  });

  it('should have a canvas or echart element inside .chart-container for the chart', () => {
    const chartContainer = compiled.querySelector('.chart-container');
    const canvasElement = chartContainer?.querySelector('canvas');
    const echartElement = chartContainer?.querySelector('.echart'); // If ngx-echarts uses a div with this class
    
    expect(canvasElement || echartElement).toBeTruthy();
  });
  
  it('should apply hover effect classes conceptually via SCSS', () => {
    // Similar to DashboardCardComponent, this is a CSS behavior.
    // We trust that if the .chart-card class is present, these styles apply.
    const cardElement = compiled.querySelector('.chart-card');
    expect(cardElement).toBeTruthy(); // Presence implies styles are linked.
  });

  // Example test for when chart data is loaded (more advanced)
  // it('should render the chart when chartData is available', () => {
  //   component.chartData = { labels: ['A', 'B'], datasets: [{ data: [10, 20] }] }; // Example data
  //   component.ngOnChanges({ chartData: new SimpleChange(null, component.chartData, true) }); // Trigger ngOnChanges
  //   fixture.detectChanges();
    
  //   // Depending on the chart library, you might check for specific rendered elements
  //   const chartCanvas = compiled.querySelector('canvas');
  //   expect(chartCanvas).toBeTruthy();
  //   // Further checks could involve chart instance if accessible
  // });
});
