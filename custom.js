(function (window, document) {
  /**
  * CAN\VAS Plugin - Adding line breaks to canvas
  * @arg {string} [str=Hello World] - text to be drawn
  * @arg {number} [x=0]             - top left x coordinate of the text
  * @arg {number} [y=textSize]      - top left y coordinate of the text
  * @arg {number} [w=canvasWidth]   - maximum width of drawn text
  * @arg {number} [lh=1]            - line height
  * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
  */

	CanvasRenderingContext2D.prototype.drawBreakingText = function (str, x, y, w, lh, method) {
		// local variables and defaults
		var textSize = parseInt(this.font.replace(/\D/gi, ''));
		var textParts = [];
		var textPartsNo = 0;
		var words = [];
		var currLine = '';
		var testLine = '';
		str = str || '';

    x = x || 0;
		y = y || 0;
		w = w || this.canvas.width;
		lh = lh || 1;
		method = method || 'fill';

    var space = ' ';
    // manual back text fill    
    if (x === 0) {
      str = str.concat(space, str, space);
      str = str.repeat(50);
    }

		// manual linebreaks
		textParts = str.split('\n');
		textPartsNo = textParts.length;

		// split the words of the parts
		for (var i = 0; i < textParts.length; i++) {
			words[i] = textParts[i].split(' ');
		}

		// now that we have extracted the words
		// we reset the textParts
		textParts = [];

		// calculate recommended line breaks
    // split between the words
    var condition = 0
    if (document.getElementById('changeView').checked) {
      if (x === 0) {
        condition = w + 100
      } else {
        condition = w - 230
      }
    } else {
      if (x === 0) {
        condition = w + 100
      } else {
        condition = w - 460
      }
    }
    
    
		for (var i = 0; i < textPartsNo; i++) {
			// clear the testline for the next manually broken line
			currLine = '';

			for (var j = 0; j < words[i].length; j++) {
				testLine = currLine + words[i][j] + ' ';

        // check if the testLine is of good width
				if (this.measureText(testLine).width > condition && j > 0) {
					textParts.push(currLine);
					currLine = words[i][j] + ' ';
				} else {
					currLine = testLine;
        }
			}
      // replace is to remove trailing whitespace
			textParts.push(currLine);
		}
  
    // render the text on the canvas
		for (var i = 0; i < textParts.length; i++) {
			if (method === 'fill') {
        if (x === 0) {
          x_pos = x
          if (i == 0)
            y_pos = y+(textSize*lh*i)
          else
            y_pos = y+(textSize*lh*i*0.8)
        } else {
          x_pos = x
          y_pos = y+(textSize*lh*i)
        }
        this.fillText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x_pos, y_pos);
			} else if (method === 'stroke') {
				this.strokeText(textParts[i].replace(/((\s*\S+)*)\s*/, '$1'), x, y+(textSize*lh*i));
			} else if (method === 'none') {
        return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
			} else {
				return false;
			}
		}

		return {'textParts': textParts, 'textHeight': textSize*lh*textParts.length};
	};
}) (window, document);





var canvas = document.createElement('canvas');
var canvasWrapper = document.getElementById('canvasWrapper');
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var ctx = canvas.getContext('2d');
var padding = 15;
var quote = 'Quote';
var title = 'Author Title';
var author = 'Author';

var image = document.createElement('img');
var image_logo = document.createElement('img');

image.onload = function (ev) {
  // delete and recreate canvas do untaint it
  canvas.outerHTML = '';
  canvas = document.createElement('canvas');
  canvasWrapper.appendChild(canvas);
  ctx = canvas.getContext('2d');
  document.getElementById('trueSize').click();
  // document.getElementById('changeView').click();
  // image.setAttribute('crossorigin', 'anonymous');
  image.crossOrigin = "Anonymous";
  image_logo.crossOrigin = "Anonymous";
  draw();
};

document.getElementById('quote').oninput = function(ev) {
  quote = this.value;
  draw();
};

document.getElementById('title').oninput = function(ev) {
  title = this.value;
  draw();
};

document.getElementById('author').oninput = function(ev) {
  author = this.value;
  draw();
};

document.getElementById('trueSize').onchange = function(ev) {
  if (document.getElementById('trueSize').checked) {
    canvas.classList.remove('fullwidth');
  } else {
    canvas.classList.add('fullwidth');
  }
};

document.getElementById('changeView').onchange = function(ev) {
  if (document.getElementById('changeView').checked) {
    image.src = 'background.png';
  } else {
    image.src = 'background.jpg';
  }
};

document.getElementById('export').onclick = function () { 
    var img = canvas.toDataURL('image/png');
    var image_logo = canvas.toDataURL('image/png');
    var link = document.createElement("a");

    link.download = 'My Meme';
    link.href = img;
    link.click();
  
    var win = window.open('', '_blank');
    win.document.write('<img style="box-shadow: 0 0 1em 0 dimgrey;" src="' + img + '"/>');
    win.document.write('<h1 style="font-family: Helvetica; font-weight: 300">Right Click > Save As<h1>');
    win.document.body.style.padding = '1em';
};

function style(font, size, align, base) {
  ctx.font = size + 'px ' + font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
}

function draw() {
  // set appropriate canvas size
  canvas.width = image.width;
  canvas.height = image.height;
  
  // draw the image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // styles
  ctx.lineWidth = canvas.width*0.004;
  
  var _logo = 175;
  var _quote = 95;
  var _title = 100;
  var _author = 100;
  
  // draw logo text
  ctx.fillStyle = '#0078a6';
  canvas.style.letterSpacing = '-15px';
  style('Roboto Bold', _logo, 'left', 'center');
  ctx.drawBreakingText(quote, 0, 150, null, 1, 'fill');

  // draw quote text
  ctx.fillStyle = '#fff';
  canvas.style.letterSpacing = '0px';
  style('Roboto Bold', _quote, 'left', 'center');
  var { textHeight } = ctx.drawBreakingText(quote, canvas.width/8, _quote+padding * 20, null, 1, 'fill');
  var height_quote = textHeight;
  // draw title text
  style('Roboto Light', _title, 'left', 'center');
  var { textHeight } = ctx.drawBreakingText(title, canvas.width/8, _quote+textHeight + padding * 22, null, 1, 'fill');
  var height_title = textHeight;
  // draw author text
  style('Roboto Light', _author, 'left', 'center');
  ctx.drawBreakingText(author, canvas.width/8, _quote+height_quote+height_title + padding * 22, null, 1, 'fill');

  // draw the image
  if (document.getElementById('changeView').checked)
    ctx.drawImage(image_logo, 970, 940);
  else
    ctx.drawImage(image_logo, 470, 1200);
}

image.src = 'background.jpg';
image_logo.src = 'logo.png';