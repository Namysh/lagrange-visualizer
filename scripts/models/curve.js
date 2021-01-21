const DEFAULT_PARAMS = {
  thickness: 8,
  color: '#658abd',
};

class Curve {
  constructor(fn, params) {
    this.fn = fn;
    this.params = {...DEFAULT_PARAMS, ...params};
  }

  render(context, fromX, toX) {
    context.beginPath();
    context.lineWidth = this.params.thickness;

    for (let x = fromX - 5; x < toX + 5; x += 0.5) {
      const y = this.fn(x);
      context.lineTo(x, y);
    }

    context.strokeStyle = this.params.color;
    context.stroke();
  }
}

export default Curve;
