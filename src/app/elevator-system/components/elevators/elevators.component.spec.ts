import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ElevatorsComponent } from "./elevators.component";
import { ElevatorService } from "../../services/elevator.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ElevatorConstants } from "../../constants/elevator.constants";

describe("ElevatorsComponent", () => {
  let component: ElevatorsComponent;
  let fixture: ComponentFixture<ElevatorsComponent>;
  let mockElevatorService: jasmine.SpyObj<ElevatorService>;

  beforeEach(async () => {
    mockElevatorService = jasmine.createSpyObj("ElevatorService", [
      "getElevators",
      "getLogs",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ElevatorsComponent],
      providers: [{ provide: ElevatorService, useValue: mockElevatorService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // ignore unknown element errors
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElevatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize floors and reversedFloors correctly", () => {
    expect(component.floors.length).toBe(ElevatorConstants.CONFIG.TOTAL_FLOORS);
    expect(component.floors[0]).toBe(1);
    expect(component.reversedFloors[0]).toBe(
      ElevatorConstants.CONFIG.TOTAL_FLOORS
    );
  });

  // it("should render correct number of floor panels in the template", () => {
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const floorElements = compiled.querySelectorAll(".floor-box");
  //   expect(floorElements.length).toBe(ElevatorConstants.CONFIG.TOTAL_FLOORS);
  // });
});
