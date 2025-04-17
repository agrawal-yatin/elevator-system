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
      "getFloors",
    ]);
    mockElevatorService.getFloors.and.returnValue(
      Array.from(
        { length: ElevatorConstants.CONFIG.TOTAL_FLOORS },
        (_, i) => i + 1
      )
    );

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
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should initialize floors to 10 items", () => {
    component.ngOnInit();
    expect(component.floors.length).toBe(10);
    expect(component.floors[0]).toBe(1);
    expect(component.floors[9]).toBe(10);
  });

  it("should call requestElevator with correct parameters", () => {
    component.ngOnInit();
    component.requestElevator(3, ElevatorConstants.DIR.UP);
    expect(mockElevatorService.requestElevator).toHaveBeenCalledWith(
      3,
      ElevatorConstants.DIR.UP
    );
  });

  it("should toggle loading during generateRandomRequest call", (done) => {
    expect(component.loading).toBeFalse();
    mockElevatorService.generateRandomRequest.and.callFake(() => {
      setTimeout(() => {
        component.loading = false;
        fixture.detectChanges();
        expect(component.loading).toBeFalse();
        done();
      }, 10);
    });
    component.generateRandomRequest();
    expect(component.loading).toBeTrue();
  });

  it("should set loading to true when generateRandomRequest is called", () => {
    mockElevatorService.generateRandomRequest.and.callFake(() => {});
    component.generateRandomRequest();
    expect(component.loading).toBeTrue();
  });

  it("should call requestElevator method", () => {
    component.ngOnInit();
    component.requestElevator(5, ElevatorConstants.DIR.UP);
    expect(mockElevatorService.requestElevator).toHaveBeenCalledWith(
      5,
      ElevatorConstants.DIR.UP
    );
  });

  it("should render 10 floor panels", () => {
    component.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const floorElements = compiled.querySelectorAll("strong");
    expect(floorElements.length).toBe(10);
  });

  it("should call generateRandomRequest on button click", () => {
    component.ngOnInit();
    component.loading = false;
    fixture.detectChanges();
    spyOn(component, "generateRandomRequest");
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      "button.btn-outline-brand"
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();
    expect(component.generateRandomRequest).toHaveBeenCalled();
  });

  it('should show "Generating..." text when loading is true', () => {
    component.ngOnInit();
    component.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      "button.btn-outline-brand"
    ) as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe("Generating...");
  });
});
