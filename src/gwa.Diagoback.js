window.gwa = window.gwa || {};

/**
 * @class Diagoback
 * @namespace  gwa
 */
(function( ns, $ ) { // jshint ignore:line

	/**
	 * @constructor
	 * @param {jQuery} jq
	 */
	ns.Diagoback = function( jq ) {

		// declare private variables
		var
		/**
		 * @property {Object} _interface
		 * @private
		 */
		_interface = {},

		/**
		 * @property {jQuery} _jq
		 * @private
		 */
		_jq = jq,

		/**
		 * @property {jQuery} _jq
		 * @private
		 */
		_wrap,

		/**
		 * Current angle in radians
		 * @property {Number} _angle
		 * @private
		 */
		_angle,

		/**
		 * @property {Boolean} _negative
		 * @private
		 */
		_negative = false,

		_fill,

		/**
		 * @property {jQuery} _svg
		 * @private
		 */
		_svg,

		_defs,

		_path,

		_perc = 1;

		function _init() {
			jq.addClass('db-active');
			_wrap = jq.find('.db-wrap');
			_fill = jq.attr('data-fill');
			jq.prepend(_getSVG());
			_addResizeHandler();
			_interface.setAngle(jq.attr('data-angle'));
		}

		function _addResizeHandler() {
			$(window).on('resize', function() {
				_redraw();
			});
		}

		function _redraw() {
			var owidth = jq.width(), // complete width
				cwidth = _wrap.width(), // content width
				cheight = _wrap.height(), // content height

				adj = cwidth + ((owidth - cwidth) / 2), // adjacent
				opp = Math.tan(_angle) * adj, // opposite = vertical padding necessary
				opp2 = Math.tan(_angle) * (adj - cwidth), // opposite 2 = other side

				oheight = cheight + opp + opp;

			_jq.css('paddingBottom', opp);
			_wrap.css('marginTop', -(opp + cheight));

			_svg.width(owidth).height(oheight);
			_setPathPoints(owidth, oheight, opp, opp2);
		}

		function _getSVG() {
			if (typeof(_svg) === 'undefined') {
				var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
				s.setAttribute('class', 'db-svg');
				_svg = $(s);
			}
			return _svg;
		}

		function _getDefs() {
			if (typeof(_defs) === 'undefined') {
				_defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
				_getSVG().append(_defs);
			}
			return _defs;
		}

		function _getPath() {
			if (typeof(_path) === 'undefined') {
				_path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				_path.setAttribute('style', 'stroke: none; fill: ' + _getFill() + ';');
				_getSVG().append(_path);
			}
			return _path;
		}

		function _getFill() {
			if (_fill.indexOf('|') >= 0) {
				var f = _fill.split('|'),
					g = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient'),
					s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'),
					s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop'),
					id = 'dbgrad' + Math.round(Math.random() * 100000);

				g.setAttribute('id', id);
				g.setAttribute('x1', '0%');
				g.setAttribute('y1', '0%');
				g.setAttribute('x2', '0%');
				g.setAttribute('y2', '100%');

				s1.setAttribute('offset', '0%');
				s1.setAttribute('style', 'stop-color:' + f[0]);
				s2.setAttribute('offset', '100%');
				s2.setAttribute('style', 'stop-color:' + f[1]);

				g.appendChild(s1);
				g.appendChild(s2);

				_getDefs().appendChild(g);

				return 'url(#' + id + ')';
			}
			return _fill;
		}

		function _setPathPoints( width, height, opp, opp2 ) {
			var points = [],
				o = opp * _perc,
				o2 = opp2 * _perc,
				outery = opp - o,
				innery = o + o2;

			if (_negative) {
				points.push('M0,' + outery);
				points.push('L' + width + ',' + innery);
				points.push('L' + width + ',' + (height - outery));
				points.push('L0,' + (height - innery));
			} else {
				points.push('M0,' + innery);
				points.push('L' + width + ',' + outery);
				points.push('L' + width + ',' + (height - innery));
				points.push('L0,' + (height - outery));
			}

			_getPath().setAttribute('d', points.join(' '));
		}

		/**
		 * @method setAngle
		 * @param {Number} deg angle in degrees
		 */
		_interface.setAngle = function( deg ) {
			_negative = deg < 0 ? true : false;
			_angle = Math.abs(deg) * Math.PI / 180;
			_redraw();
		};

		/**
		 * @method getAngle
		 * @return {Number} current angle in degrees
		 */
		_interface.getAngle = function() {
			var a = _angle * 180 / Math.PI;
			return _negative ? a * -1 : a;
		};

		_init();

		return _interface;

	};

}(window.gwa = window.gwa || {}, typeof(jQuery) === 'function' ? jQuery : null));
