// Credit to Riaz Laskar on CodePen for this.

window.addEventListener('DOMContentLoaded', function() {

  // Get the canvas element and its 2D rendering context
  var canvas = document.getElementById( 'canvas' ),
      ctx = canvas.getContext( '2d' ),

      // Canvas dimensions (kept small to fit inside .container)
      cw = 545,
      ch = 300,

      // Pool of characters that fall down the screen
      charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],

      // Array holding all the falling character objects
      fallingCharArr = [],

      // Size of each character in pixels
      fontSize = 20,

      // How many columns of characters fit across the canvas width
      maxColums = cw/(fontSize),

      // Delay between frames in milliseconds (higher = slower animation)
      frameDelay = 25;

  // Set the canvas internal buffer size (must match CSS display size to avoid stretching)
  canvas.width = cw;
  canvas.height = ch;


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

    // Set fill color to orange (#F2613F) and font: bold Terminus (falls back to monospace)
    ctx.fillStyle = "#FF6D1F";
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
    // Paint a semi-transparent black rectangle over the whole canvas each frame.
    // Low alpha creates the fading "trail" effect behind falling characters.
    ctx.fillStyle = "#22222224";
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