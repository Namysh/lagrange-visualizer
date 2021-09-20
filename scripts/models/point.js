const DEFAULT_PARAMS = {
  color: 'rgba(50, 50, 50, 1)',
  colorHover: 'rgba(0, 0, 0, 1)',
  radius: 8
};

class Point {
  hover = false;

  constructor(x, y, params) {
    this.x = x;
    this.y = y;
    this.params = {...DEFAULT_PARAMS, ...params};
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  moveBy(x, y) {
    this.x += x;
    this.y += y;
  }

  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.params.radius, 0, 2 * Math.PI, true);
    context.fillStyle = this.hover ? this.params.colorHover : this.params.color;
    context.fill();
  }
}

export default Point;
