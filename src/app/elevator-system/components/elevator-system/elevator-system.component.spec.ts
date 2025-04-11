import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ElevatorSystemComponent } from "./elevator-system.component";
import { ElevatorService } from "../../services/elevator.service";
import { ElevatorConstants } from "../../constants/elevator.constants";

describe("ElevatorSystemComponent", () => {
  let component: ElevatorSystemComponent;
  let fixture: ComponentFixture<ElevatorSystemComponent>;
  let mockElevatorService: jasmine.SpyObj<ElevatorService>;

  beforeEach(async () => {
    mockElevatorService = jasmine.createSpyObj("ElevatorService", [
      "getElevators",
      "getLogs",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ElevatorSystemComponent],
      providers: [{ provide: ElevatorService, useValue: mockElevatorService }],
    }).compileComponents();
  });

  beforeEach(() => {
    mockElevatorService.getElevators.and.returnValue([
      {
        id: 1,
        currentFloor: 1,
        direction: ElevatorConstants.DIR.IDLE,
        upQueue: [],
        downQueue: [],
        busy: false,
      },
    ]);
    mockElevatorService.getLogs.and.returnValue(["Test log entry"]);

    fixture = TestBed.createComponent(ElevatorSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize elevators from the service", () => {
    expect(component.elevators.length).toBe(1);
    expect(component.elevators[0].id).toBe(1);
  });

  it("should initialize logs from the service", () => {
    expect(component.requestLogs.length).toBe(1);
    expect(component.requestLogs[0]).toBe("Test log entry");
  });

  it("should render child components", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("app-control-panel")).toBeTruthy();
    expect(compiled.querySelector("app-elevators")).toBeTruthy();
    expect(compiled.querySelector("app-request-logs")).toBeTruthy();
  });
});
