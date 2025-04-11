import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ControlPanelComponent } from "./control-panel.component";
import { ElevatorService } from "../../services/elevator.service";
import { ElevatorConstants } from "../../constants/elevator.constants";

describe("ControlPanelComponent", () => {
  let component: ControlPanelComponent;
  let fixture: ComponentFixture<ControlPanelComponent>;
  let mockElevatorService: jasmine.SpyObj<ElevatorService>;

  beforeEach(async () => {
    mockElevatorService = jasmine.createSpyObj("ElevatorService", [
      "requestElevator",
      "generateRandomRequest",
    ]);

    await TestBed.configureTestingModule({
      declarations: [ControlPanelComponent],
      providers: [{ provide: ElevatorService, useValue: mockElevatorService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize floors to 10 items", () => {
    expect(component.floors.length).toBe(10);
    expect(component.floors[0]).toBe(1);
    expect(component.floors[9]).toBe(10);
  });

  it("should call requestElevator with correct parameters", () => {
    component.requestElevator(3, ElevatorConstants.DIR.UP);
    expect(mockElevatorService.requestElevator).toHaveBeenCalledWith(
      3,
      ElevatorConstants.DIR.UP
    );
  });

  it("should toggle loading during generateRandomRequest call", (done) => {
    expect(component.loading).toBeFalse();
    component.generateRandomRequest();
    expect(component.loading).toBeTrue();

    setTimeout(() => {
      expect(mockElevatorService.generateRandomRequest).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      done();
    }, 500);
  });

  it("should set loading to true when generateRandomRequest is called", () => {
    component.generateRandomRequest();
    expect(component.loading).toBeTrue();
  });

  it("should call requestElevator method", () => {
    spyOn(component, "requestElevator");
    component.requestElevator(5, ElevatorConstants.DIR.UP);
    expect(component.requestElevator).toHaveBeenCalledWith(
      5,
      ElevatorConstants.DIR.UP
    );
  });

  it("should render 10 floor panels", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const floorElements = compiled.querySelectorAll("strong");
    expect(floorElements.length).toBe(10);
  });

  // it("should disable the Up button on floor 10", () => {
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const floorItems = compiled.querySelectorAll(".floor-panel");

  //   const floor10 = Array.from(floorItems).find((item) =>
  //     item.textContent?.includes("Floor 10")
  //   );

  //   const upButton = floor10?.querySelector("button.btn-outline-primary");
  //   expect(upButton?.hasAttribute("disabled")).toBeTrue();
  // });

  // it("should disable the Down button on floor 1", () => {
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const floorItems = compiled.querySelectorAll(".floor-panel");

  //   const floor1 = Array.from(floorItems).find((item) =>
  //     item.textContent?.includes("Floor 1")
  //   );

  //   const downButton = floor1?.querySelector("button.btn-outline-danger");
  //   expect(downButton?.hasAttribute("disabled")).toBeTrue();
  // });

  it("should call generateRandomRequest on button click", () => {
    spyOn(component, "generateRandomRequest");
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      "button.btn-primary"
    ) as HTMLButtonElement;
    button.click();
    expect(component.generateRandomRequest).toHaveBeenCalled();
  });

  it('should show "Generating..." text when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      "button.btn-primary"
    ) as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe("Generating...");
  });
});
