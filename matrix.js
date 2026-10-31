// Credit to Riaz Laskar on CodePen for this.

window.addEventListener('DOMContentLoaded', function() {

  // Get the canvas element and its 2D rendering context
  var canvas = document.getElementById( 'canvas' ),
      ctx = canvas.getContext( '2d' ),

      // Canvas dimensions — read from the computed CSS size (set in index.css)
      // so the canvas size is decided by stylesheet, not this file.
      cw = parseFloat( window.getComputedStyle( canvas ).width ),
      ch = parseFloat( window.getComputedStyle( canvas ).height ),

      // Scale the internal bitmap for crisp rendering on high-DPI screens.
      // The visible CSS size (cw x ch) stays unchanged; only the buffer resolution
      // and the context transform are scaled, so drawing stays in CSS pixels.
      dpr = window.devicePixelRatio || 1,

      // Pool of characters that fall down the screen
      charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],

      // Array holding all the falling character objects
      fallingCharArr = [],

      // Matrix font color — read from CSS variable --matrix-color (try canvas, then root)
      matrixColor = getComputedStyle( canvas ).getPropertyValue( '--matrix-color' ).trim()
          || getComputedStyle( document.documentElement ).getPropertyValue( '--matrix-color' ).trim()
          || '#FF6D1F',

      // Matrix background color + alpha — read from CSS variables
      matrixBgColor = getComputedStyle( canvas ).getPropertyValue( '--matrix-bg-color' ).trim()
          || getComputedStyle( document.documentElement ).getPropertyValue( '--matrix-bg-color' ).trim()
          || '#222222',
      matrixBgAlpha = parseFloat( getComputedStyle( canvas ).getPropertyValue( '--matrix-bg-alpha' ) )
          || parseFloat( getComputedStyle( document.documentElement ).getPropertyValue( '--matrix-bg-alpha' ) )
          || 0.15,
      matrixBg = 'rgba(' + parseInt(matrixBgColor.slice(1,3),16) + ',' + parseInt(matrixBgColor.slice(3,5),16) + ',' + parseInt(matrixBgColor.slice(5,7),16) + ',' + matrixBgAlpha + ')',

      // Size of each character in pixels
      fontSize = 16,

      // How many columns of characters fit across the canvas width
      maxColums = cw/(fontSize),

      // Delay between frames in milliseconds (higher = slower animation)
      frameDelay = 25;

  // Set the canvas internal buffer size (scaled by devicePixelRatio for crispness,
  // but CSS display size stays cw x ch so nothing looks stretched or zoomed).
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  ctx.scale(dpr, dpr);


  // Returns a random integer between min (inclusive) and max (exclusive)
  function randomInt( min, max ) {
    return Math.floor(Math.random() * ( max - min ) + min);
  }

  // Returns a random floating-point number between min and max
  function randomFloat( min, max ) {
    return Math.random() * ( max - min ) + min;
  }

  // Pauses execution for the given number of milliseconds.
  // Returns a Promise that resolves after the delay, allowing `await` in async functions.
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Constructor for a single falling character
  function Point(x,y) {
    this.x = x;          // Horizontal position on the canvas
    this.y = y;          // Vertical position on the canvas
  }

  // Draw method: picks a random letter, draws it, then moves it down
  Point.prototype.draw = function(ctx){

    // Pick a random character from the pool and make it uppercase
    this.value = charArr[randomInt(0,charArr.length-1)].toUpperCase();

    // Assign a random fall speed
    this.speed = randomFloat(1,5);

    // Set fill color to the CSS variable --matrix-color and font: bold Terminus (falls back to monospace)
    ctx.fillStyle = matrixColor;
    ctx.font = "bold " + fontSize + "px 'Terminus', monospace";

    // Draw the character at its current (x, y) position
    ctx.fillText(this.value,this.x,this.y);


    // Move the character down by its speed
    this.y += this.speed;

    // If it has fallen past the bottom, reset it to the top with a new random speed
    if(this.y > ch)
    {
      this.y = randomFloat(-100,0);
      this.speed = randomFloat(2,5);
    }
  }

  // Create one falling character for each column, starting at random heights above the canvas
  for(var i = 0; i < maxColums ; i++) {
    fallingCharArr.push(new Point(i*fontSize,randomFloat(-500,0)));
  }


  // Main animation loop (async so we can use await sleep)
  async function update()
  {
    // Paint a rectangle over the whole canvas each frame using --matrix-bg-color with --matrix-bg-alpha transparency.
    // This creates the fading "trail" effect behind falling characters while keeping the canvas color controllable via CSS.
    ctx.fillStyle = matrixBg;
    ctx.fillRect(0,0,cw,ch);

    // Draw and advance every falling character
    var i = fallingCharArr.length;

    while (i--) {
      fallingCharArr[i].draw(ctx);
    }

    // Wait before the next frame — this is what slows the animation down.
    // Increase frameDelay for slower motion, decrease for faster.
    await sleep(frameDelay);

    // Schedule the next frame
    requestAnimationFrame(update);
  }

  // Start the animation
  update();

});