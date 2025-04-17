import { TestBed } from "@angular/core/testing";
import { ElevatorService } from "./elevator.service";
import { Elevator } from "../models/elevator.model";
import { ElevatorConstants } from "../constants/elevator.constants";

describe("ElevatorService", () => {
  let service: ElevatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize 4 elevators", () => {
    expect(service.getElevators().length).toBe(4);
  });

  it("should log a request and assign an elevator", () => {
    service.requestElevator(5, ElevatorConstants.DIR.UP);
    const plainLog = service
      .getLogs()[0]
      .replace(/<[^>]*>/g, "")
      .toLowerCase();
    expect(plainLog).toContain("request at floor 5 (up)");
  });

  // it("should enqueue floor in correct direction queue", () => {
  //   const elevator = service.getElevators()[0];
  //   service["enqueueFloor"](elevator, 3, ElevatorConstants.DIR.UP);
  //   expect(elevator.upQueue).toContain(3);
  // });

  it("should calculate the closest elevator", () => {
    const elevators = [
      {
        id: 1,
        currentFloor: 2,
        direction: ElevatorConstants.DIR.IDLE,
        upQueue: [],
        downQueue: [],
        busy: false,
      },
      {
        id: 2,
        currentFloor: 5,
        direction: ElevatorConstants.DIR.IDLE,
        upQueue: [],
        downQueue: [],
        busy: false,
      },
    ] as Elevator[];
    const closest = service["getClosestElevator"](elevators, 4);
    expect(closest.id).toBe(2);
  });

  it("should track by index", () => {
    expect(service.trackByIndex(3)).toBe(3);
  });

  it("should not move elevator below bottom most floor", () => {
    const elevator = service.getElevators()[0];
    elevator.busy = true;
    service["moveElevator"](elevator);
    expect(elevator.currentFloor).toBe(1);
  });

  it("should generate random request and add a log entry", () => {
    const initialLength = service.getLogs().length;
    service.generateRandomRequest();
    expect(service.getLogs().length).toBeGreaterThan(initialLength);
  });
});
