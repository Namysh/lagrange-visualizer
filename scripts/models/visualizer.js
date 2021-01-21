import Point from './point.js';
import Curve from './curve.js';
import {make, find} from '../utils/dom.js';
import {
  isInArea,
  updateCursorStyle,
  findHoveredPoint,
  interpolatingPolynomial,
} from '../utils/index.js';

const ACTIONS = {
  default: 1,
  dragMap: 2,
  dragPoint: 3,
};

const EVENTS = {
  mousemove: 1,
  mousedown: 2,
  mouseup: 3,
};

const CURSORS = {
  [ACTIONS.default]: 'default',
  [ACTIONS.dragMap]: 'grab',
  [ACTIONS.dragPoint]: 'move',
};

class Visualizer {
  _action = ACTIONS.default;
  _actionData = {};
  _curves = [];
  points = [];

  constructor() {
    this.canvas = find('canvas');
    this.context = this.canvas.getContext('2d');

    find('.action-bar').appendChild(
      make('li', {
        className: 'action-bar__item',
        innerText: 'Reset',
        onclick: this._handleReset.bind(this),
      }),
    );

    this._initActionsEvents();

    this.canvas.addEventListener('mouseout', this._handleMouseOut.bind(this));
    this.canvas.addEventListener('mousedown', () => {
      const tip = find('.tip');

      if (tip.classList.contains('tip--hidden')) return;

      tip.classList.add('tip--hidden');

      const showTipButton = find('.action-bar').appendChild(
        make('li', {
          className:
            'action-bar__item action-bar__item--secondary action-bar__item--unfocusable',
          innerText: 'Tip',
          onclick: function () {
            tip.classList.remove('tip--hidden');
            this.remove();
          },
        }),
      );

      /* After the animation we make the button focusable again */
      setTimeout(
        () => showTipButton.classList.remove('action-bar__item--unfocusable'),
        250,
      );
    });

    window.addEventListener('resize', this._handleResize.bind(this));
    this._handleResize();

    this._curves.push(new Curve(interpolatingPolynomial.bind(this)));
  }

  _render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.points.length) {
      this._curves.forEach(curve =>
        curve.render(this.context, 0, this.canvas.width),
      );
      this.points.forEach(point => point.render(this.context));
    }
  }

  _dragMapHandlers = {
    [EVENTS.mousedown]: ({offsetX: mouseX, offsetY: mouseY}) => {
      updateCursorStyle(this.canvas, CURSORS[ACTIONS.dragMap]);
      this._actionData.dragMapStartX = this._actionData.dragMapLastX = mouseX;
      this._actionData.dragMapStartY = this._actionData.dragMapLastY = mouseY;
    },
    [EVENTS.mousemove]: ({offsetX: mouseX, offsetY: mouseY}) => {
      this.points.forEach(point =>
        point.moveBy(
          mouseX - this._actionData.dragMapLastX,
          mouseY - this._actionData.dragMapLastY,
        ),
      );
      this._actionData.dragMapLastX = mouseX;
      this._actionData.dragMapLastY = mouseY;
      this._render();
    },
    [EVENTS.mouseup]: ({offsetX: mouseX, offsetY: mouseY}) => {
      const areaCreatePointOffset = 3;
      /* If the mouse is still in the starting drag area (mouse hasn't mouve much)
      and if we aren't hovering a point, then we create a point */
      if (
        isInArea(
          this._actionData.dragMapStartX,
          this._actionData.dragMapStartY,
          mouseX,
          mouseY,
          areaCreatePointOffset,
        ) &&
        !this._actionData.hoveredPoint
      ) {
        this.points.push(
          (this._actionData.hoveredPoint = new Point(mouseX, mouseY)),
        );
        this._handleHoverPoint();
      }
      this._action = ACTIONS.default;
    },
  };

  _dragPointHandlers = {
    [EVENTS.mousemove]: ({offsetX, offsetY}) => {
      this._actionData.hoveredPoint.moveTo(offsetX, offsetY);
      this._render();
    },
    [EVENTS.mouseup]: () => {
      this._action = ACTIONS.default;
    },
  };

  _defaultHandlers = {
    [EVENTS.mousedown]: event => {
      if (this._actionData.hoveredPoint) this._action = ACTIONS.dragPoint;
      else this._action = ACTIONS.dragMap;

      if (this._actionsHandlers[this._action][EVENTS.mousedown])
        this._actionsHandlers[this._action][EVENTS.mousedown](event);
    },
    [EVENTS.mousemove]: ({offsetX: mouseX, offsetY: mouseY}) => {
      const hoveredPoint = findHoveredPoint(this.points, mouseX, mouseY);

      if (
        this._actionData.hoveredPoint &&
        (!hoveredPoint || hoveredPoint !== this._actionData.hoveredPoint)
      ) {
        this._actionData.hoveredPoint.hover = false;
        this._render();
      }

      this._actionData.hoveredPoint = hoveredPoint;

      if (hoveredPoint) this._handleHoverPoint();
    },
  };

  _actionsHandlers = {
    [ACTIONS.dragPoint]: this._dragPointHandlers,
    [ACTIONS.dragMap]: this._dragMapHandlers,
    [ACTIONS.default]: this._defaultHandlers,
  };

  _initActionsEvents() {
    Object.entries(EVENTS).forEach(([eventName, eventId]) => {
      this.canvas.addEventListener(eventName, event => {
        updateCursorStyle(this.canvas, CURSORS[this._action]);

        if (this._actionsHandlers[this._action][eventId])
          this._actionsHandlers[this._action][eventId](event);
      });
    });
  }

  _handleMouseOut() {
    this._action = ACTIONS.default;

    if (!this._actionData.hoveredPoint) return;

    this._actionData.hoveredPoint.hover = false;
    this._render();
  }

  _handleHoverPoint() {
    updateCursorStyle(this.canvas, CURSORS[ACTIONS.dragPoint]);

    if (!this._actionData.hoveredPoint.hover) {
      this._actionData.hoveredPoint.hover = true;
      this._render();
    }
  }

  _handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._render();
  }

  _handleReset() {
    this.points.length = 0;
    this._render();
  }
}

export default Visualizer;
