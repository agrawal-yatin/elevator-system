import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RequestLogsComponent } from "./request-logs.component";
import { ElevatorService } from "../../services/elevator.service";

describe("RequestLogsComponent", () => {
  let component: RequestLogsComponent;
  let fixture: ComponentFixture<RequestLogsComponent>;
  let mockElevatorService: jasmine.SpyObj<ElevatorService>;

  beforeEach(async () => {
    mockElevatorService = jasmine.createSpyObj("ElevatorService", [], {
      requestLogs: ["Log 1", "Log 2"],
    });

    await TestBed.configureTestingModule({
      declarations: [RequestLogsComponent],
      providers: [{ provide: ElevatorService, useValue: mockElevatorService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should render logs from the elevator service", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Log 1");
    expect(compiled.textContent).toContain("Log 2");
  });

  it("should render the correct number of log entries in the DOM", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logItems = compiled.querySelectorAll(".log-container > div");
    expect(logItems.length).toBe(2);
    expect(logItems[0].textContent).toContain("Log 1");
    expect(logItems[1].textContent).toContain("Log 2");
  });

  it('should display "Request Log" heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector("span");
    fixture.detectChanges();
    expect(heading?.textContent).toContain("Request Log");
  });
});
