const isInArea = (fromX, fromY, toX, toY, area = 0) =>
  Math.hypot(fromX - toX, fromY - toY) < area;

const updateCursorStyle = (element, uri) => (element.style.cursor = uri);

const findHoveredPoint = (points, x, y) => {
  const areaSelectPointOffset = 1.5;

  return points.find(point =>
    isInArea(
      x,
      y,
      point.x,
      point.y,
      point.params.radius * areaSelectPointOffset,
    ),
  );
}

/* Not an anonymous function because of 'this' context binding */
const interpolatingPolynomial = function (x) {
  let px = 0;

  for (let i = 0; i < this.points.length; i++) {
    let pi = 1;
    for (let j = 0; j < this.points.length; j++) {
      if (i === j) continue;
      const {x: xj} = this.points[j];
      const {x: xi} = this.points[i];
      pi *= (x - xj) / (xi - xj);
    }
    const {y: yi} = this.points[i];
    px += yi * pi;
  }

  return px;
};
export {
  isInArea,
  updateCursorStyle,
  findHoveredPoint,
  interpolatingPolynomial,
};
