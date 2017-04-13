// Debouncer
function debounce(funct, timeout) {
   var timeoutID , timeout = timeout || 200;
   return function () {
      var scope = this , args = arguments;
      clearTimeout( timeoutID );
      timeoutID = setTimeout( function () {
          funct.apply( scope , Array.prototype.slice.call( args ) );
      } , timeout );
   }
}

// setAttribute multiple
Element.prototype.setAttributes = function(attrs) {
  for(var key in attrs) {
    this.setAttribute(key, attrs[key]);
  }
}

// Trianglified header
var points = [],
    polygons = [],
    oldWidth = 0;
function trianglifyLimit() {
    limit = window.innerHeight - window.pageYOffset;
    polygons.forEach(function(polygon, index) {
        if(window.pageYOffset == 0 || Math.max.apply(null, polygon.getAttribute('points').replace(new RegExp(/[\d\.]+\,/g), '').split(' ').map(function(element) { return parseFloat(element); })) < limit) {
            polygon.classList.add('visible');
        } else {
            polygon.classList.remove('visible');
        }
    });
}
function trianglify() {
  if(oldWidth == window.innerWidth) {
    return;
  }
  var header = document.querySelector('.page-content header'),
      svg = document.querySelector('#canvas'),
      svgBackground = document.querySelector('#canvas-background'),
      svgPolygons = document.querySelector('#canvas-polygons'),
      svgMask = document.querySelector('#canvas-mask');

  points = [];
  polygons = [];
  oldWidth = window.innerWidth;
  while (svgPolygons.firstChild) {
      svgPolygons.removeChild(svgPolygons.firstChild);
  }
  while (svgMask.firstChild) {
      svgMask.removeChild(svgMask.firstChild);
  }

  var margin = 0,
      fullWidth = window.innerWidth - margin * 2,
      fullHeight = header.classList.contains('small-header') ? 300 : window.innerHeight - margin * 2,
      attributes = {
        'class': header.classList.contains('small-header') ? 'small' : '',
        'width': fullWidth,
        'height': fullHeight
      }

  svg.setAttributes(attributes);
  svgPolygons.setAttributes(attributes);
  svgBackground.setAttributes(attributes);

  var unitSize = (fullWidth+fullHeight)/20;
      numPointsX = Math.ceil(fullWidth/unitSize)+1;
      numPointsY = Math.ceil(fullHeight/unitSize)+1;
      unitWidth = Math.ceil(fullWidth/(numPointsX-1));
      unitHeight = Math.ceil(fullHeight/(numPointsY-1));

  for(var y = 0; y < numPointsY; y++) {
      for(var x = 0; x < numPointsX; x++) {
          points.push([
              unitWidth * x + ((x == 0 || x == numPointsX - 1) ? 0 : (Math.random() * unitWidth - unitWidth / 2) / 1.4),
              unitHeight * y + ((y == 0 || y == numPointsY - 1) ? 0 : (Math.random() * unitHeight - unitHeight / 2) / 1.4)
          ]);
      }
  }

  for(var i = 0; i < points.length; i++) {
      if(i % numPointsX != numPointsX - 1 && i <= numPointsY * numPointsX - numPointsX - 1) {
          var rando = Math.floor(Math.random()*2);
          for(var n = 0; n < 2; n++) {
              var polygon = document.createElementNS(svg.namespaceURI, 'polygon'),
                  coords = '';
              if(rando==0) {
                  if(n==0) {
                      coords = points[i].join(',')+' '+points[i+numPointsX].join(',')+' '+points[i+numPointsX+1].join(',');
                  } else if(n==1) {
                      coords = points[i].join(',')+' '+points[i+1].join(',')+' '+points[i+numPointsX+1].join(',');
                  }
              } else if(rando==1) {
                  if(n==0) {
                      coords = points[i].join(',')+' '+points[i+numPointsX].join(',')+' '+points[i+1].join(',');
                  } else if(n==1) {
                      coords = points[i+numPointsX].join(',')+' '+points[i+1].join(',')+' '+points[i+numPointsX+1].join(',');
                  }
              }
              polygon.setAttributes({
                'points': coords,
                'fill': 'rgba(0,0,0,'+(Math.random()/4)+')'
              });
              polygonClone = polygon.cloneNode();
              polygons.push(polygon);
              polygons.push(polygonClone);
              svgPolygons.appendChild(polygonClone);
              svgMask.appendChild(polygon);
          }
      }
  }

  trianglifyLimit();
  document.addEventListener('scroll', trianglifyLimit);
}
document.addEventListener('DOMContentLoaded', trianglify);
window.addEventListener('resize', debounce(trianglify, 50));
