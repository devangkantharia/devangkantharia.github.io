/// <reference lib="dom" />

import Kinet from "kinet";
import throttle from "lodash/throttle";

export default class Magnetic {
  private readonly kinetInstance: Kinet;
  private readonly throttledMouseMove: (event: MouseEvent) => void;
  private readonly element: HTMLElement;
  private rect: DOMRect;
  private center: { x: number; y: number };
  private maxDistanceX: number;
  private maxDistanceY: number;
  private destroying = false;
  private fastReturn = false;
  public onTick: (() => void) | null = null;

  constructor(element: HTMLElement) {
    this.kinetInstance = new Kinet({
      names: ["x", "y"],
      acceleration: 0.1,
      friction: 0.4,
    });

    this.element = element;
    this.rect = this.element.getBoundingClientRect();

    this.center = {
      x: this.rect.x + window.scrollX + this.element.offsetWidth / 2,
      y: this.rect.y + window.scrollY + this.element.offsetHeight / 2,
    };

    this.maxDistanceX = this.element.offsetWidth / 2;
    this.maxDistanceY = this.element.offsetWidth / 2;

    this.throttledMouseMove = throttle(this.mouseMove);
    window.addEventListener("mousemove", this.throttledMouseMove, {
      passive: true,
    });

    this.kinetInstance.on("tick", (instances) => {
      if (this.destroying) {
        // While destroying we want to rapidly settle back to origin and then clear transform.
        if (
          Math.abs(instances.x.current) < 0.5 &&
          Math.abs(instances.y.current) < 0.5
        ) {
          this.element.style.transform = "";
        } else {
          this.element.style.transform = `translate3d(${instances.x.current}px, ${instances.y.current}px, 0)`;
        }
        return; // skip extra rotations / onTick while returning
      }
      this.element.style.transform = `translate3d(${instances.x.current}px, ${
        instances.y.current
      }px, 0) rotateY(${instances.x.current / 2}deg) rotateX(${
        instances.y.current / 2
      }deg)`;
      if (this.onTick) {
        this.onTick();
      }
    });

    this.kinetInstance.on("end", () => {
      if (this.destroying) {
        this.element.style.transform = "";
      }
    });
  }

  public destroy = () => {
    window.removeEventListener("mousemove", this.throttledMouseMove);
    this.destroying = true;
    // Increase acceleration/friction for fast return
    this.kinetInstance._instances.x._acceleration = 0.3;
    this.kinetInstance._instances.y._acceleration = 0.3;
    this.kinetInstance._instances.x._friction = 1 - 0.6; // higher friction => faster stop
    this.kinetInstance._instances.y._friction = 1 - 0.6;
    this.kinetInstance.animate("x", 0);
    this.kinetInstance.animate("y", 0);
  };

  private mouseMove = (event: MouseEvent) => {
    const distance = this.getDistance(
      event.clientX + window.scrollX,
      event.clientY + window.scrollY,
    );
    this.render(
      distance,
      -1 * (this.center.x - event.clientX - window.scrollX),
      -1 * (this.center.y - event.clientY - window.scrollY),
    );
  };

  private getDistance(x: number, y: number) {
    return Math.round(
      Math.sqrt(
        Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2),
      ),
    );
  }

  render(distance: number, x: number, y: number) {
    if (Math.abs(x) < this.maxDistanceX && Math.abs(y) < this.maxDistanceY) {
      const percentX = x / this.maxDistanceX;
      const percentY = y / this.maxDistanceY;

      this.kinetInstance.animate("x", Math.round(20 * percentX));
      this.kinetInstance.animate("y", Math.round(20 * percentY));
    } else {
      this.kinetInstance.animate("x", 0);
      this.kinetInstance.animate("y", 0);
    }
  }
}
