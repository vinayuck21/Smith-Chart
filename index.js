
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scale = 350;
const val = 0.1;
var char = 1;
let dotsize = 1



const slider = document.querySelector('#slider');
const valueOutput = document.querySelector('#value');

slider.addEventListener('input', () => {
  const sliderValue = parseFloat(slider.value);
  dotsize = sliderValue;
  valueOutput.textContent = dotsize;
});


var freq=2000000000;
let prevx = 100000000000
let prevy = 100000000000
let prevR=1000000000000;
let prevX=1000000000000;
let prevY=1000000000000;
let prevG=1000000000000;
let prevDtheta=1000000000000;
let prevVswrrad=100000000000;
canvas.width = 700;
canvas.height = 700;
c.font="10px Arial"
let mod = 0; // initialize mod variable to 0

function setMod(value) {
  mod = value; // set mod variable to the value of the clicked checkbox
}


function updateChar() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    char = document.getElementById("char-input").value;
    DrawReaCircles()
    DrawResCircles()
    DrawCondCircles() 
}
function updateFreq() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    freq = document.getElementById("freq-input").value;
    DrawReaCircles()
    DrawResCircles()
    DrawCondCircles() 
}
document.addEventListener("mousemove", updateCursorValues);

function updateCursorValues(event) {
    // Get the cursor position from the event object
    var x = event.offsetX;
    var y = event.offsetY;

    if(x>=350){
        x-=350
    }
    else if(x<350){
        x=-1*(350-x);
    }
    if(y<=350){
        y=350-y
  
    }
    else if(y>350){
        y=-1*(y-350)
    }
    var vswrrad = Math.sqrt(x*x+y*y)
    x/=scale
    y/=scale

    let numerator = -1 + Math.pow(x, 2) + Math.pow(y, 2);
    let denominator = 1 - 2 * x + Math.pow(x, 2) + Math.pow(y, 2);
    var R = -numerator / denominator;
    var X = (2*y) / (1 - 2*x + x**2 + y**2);

    const z1 = { re: 1, im: 0 }; 
    const z2 = { re: R, im: X };
    const result = complexDivision(z1, z2);
    var Y = result.re
    var G = result.im

    if(x>=0&&y>=0){
        var theta = Math.atan(y / x);
       }
       else if(x>0&&y<0){
           var theta = 2*Math.PI-Math.atan((-1*y)/x);
       }
       else if(x<0&&y<0){
           var theta = Math.PI + Math.atan((-1*y)/(-1*x))
       }
       else{
           var theta = Math.PI - Math.atan(y/(-1*x))
       }
       
       var dtheta = Math.round(100*theta/Math.PI)/100
       dtheta*=180
    var gmag = vswrrad/scale

   
  
    // Update the text of the HTML element with the cursor values
    const cursorValuesElement = document.getElementById("cursorValues");
    cursorValuesElement.innerText = `Gamma: ${gmag.toFixed(2)} ${dtheta.toFixed(2)}° |  R: ${R.toFixed(2)} | X: ${X.toFixed(2)} | rad: ${Math.round(vswrrad)} | Y: ${Y.toFixed(2)} | G: ${G.toFixed(2)}`;
}
// add a click event listener to the canvas 
canvas.addEventListener('click', function(event) {  
  var locx = event.offsetX
  var locy = event.offsetY

  var x = event.offsetX;
  var y = event.offsetY;

  if(x>=350){
      x-=350
  }
  else if(x<350){
      x=-1*(350-x);
  }
  if(y<=350){
      y=350-y

  }
  else if(y>350){
      y=-1*(y-350)
  }

  var vswrrad = Math.sqrt(x*x+y*y)
 
  //console.log(x,y)



  x/=scale
  y/=scale
  if(x>=0&&y>=0){
    var theta = Math.atan(y / x);
   }
   else if(x>0&&y<0){
       var theta = 2*Math.PI-Math.atan((-1*y)/x);
   }
   else if(x<0&&y<0){
       var theta = Math.PI + Math.atan((-1*y)/(-1*x))
   }
   else{
       var theta = Math.PI - Math.atan(y/(-1*x))
   }
   
   const dtheta = Math.round(100*theta/Math.PI)/100
  
  let numerator = -1 + Math.pow(x, 2) + Math.pow(y, 2);
  let denominator = 1 - 2 * x + Math.pow(x, 2) + Math.pow(y, 2);
  var R = -numerator / denominator;
  //var radius = (scale/(R+1))
  //console.log(dtheta)
  var X = (2*y) / (1 - 2*x + x**2 + y**2);

  const z1 = { re: 1, im: 0 }; 
  const z2 = { re: R, im: X };
  const result = complexDivision(z1, z2);
  var Y = result.re
  var G = result.im
  //console.log(prevY)
  //console.log(Y)
  //moving along constant R circle primary
  //console.log(prevR)



if(prevx===100000000000||prevR==R.toFixed(2)||prevY==Y.toFixed(2)||Math.round(vswrrad)==prevVswrrad||R===0){
  c.beginPath()
  c.lineWidth=0.3;
  c.arc(350,350,vswrrad,0,2*Math.PI)
  c.stroke()

  c.beginPath();
  c.arc(locx, locy, dotsize, 0, 2 * Math.PI);
  c.fillStyle = 'red';
  c.fill();
  if(prevR==R.toFixed(2)){
    let delX = -1*(prevX - X.toFixed(2))
   

    if(delX>0){
        //series inductor
        var ind = (delX*char)/(2*Math.PI*freq)
        ind*=1000000000000
        console.log(`${ind.toFixed(2)} pico henry inductor in series`);
        objects.push(new CircuitElement(ind.toFixed(2),'images/seriesind.png'))
        drawCircuit()
    }
    else if(delX<0){
        //series capacitor
        
        var cap = (1/(2*Math.PI*freq*Math.abs(delX)*char))
        cap*=1000000000000
        console.log(`${cap.toFixed(2)} pico farad capacitor in series`);
        objects.push(new CircuitElement(cap.toFixed(2),'images/seriescap.png'))
        drawCircuit()

    }
    //drawArc()
    //calcLump()
    //console.log(R.toFixed(2))
    //console.log(prevx,prevy,locx,locy,radius)
  }
  //moving along constant X circle primary
 
  else if(prevY==Y.toFixed(2)){
    
    let delG=G.toFixed(2)-prevG
    
    if(delG>0){
  
        var cap = (delG/(2*Math.PI*freq*char))
        cap*=1000000000000
        console.log(`${cap.toFixed(2)} pico farad capacitor in parallel`);
        objects.push(new CircuitElement(cap.toFixed(2),'images/shuntcap.png'))
        drawCircuit()

    }
    else if(delG<0){
      
        var ind = (char)/(2*Math.PI*freq*Math.abs(delG))
        ind*=1000000000000
        console.log(`${ind.toFixed(2)} pico henry inductor in parallel`);
        objects.push(new CircuitElement(ind.toFixed(2),'images/shuntind.png'))
        drawCircuit()

    }
   
  }

  var deltheta = prevDtheta-dtheta

  var lambda1 = (deltheta*0.5/2)
  if(lambda1<0){
      lambda1+=0.50
  }
  console.log(lambda1.toFixed(2))
  prevR=R.toFixed(2)
  prevX=X.toFixed(2)
  prevY=Y.toFixed(2)
  prevG=G.toFixed(2)    
  prevx=locx
  prevy=locy
  prevDtheta=dtheta
  prevVswrrad=Math.round(vswrrad)
}
  //console.log(R,X)
  //((1/(R+1))*scale)
  //console.log(scale/X)
  //console.log(solveForR(x,y))





  
   
   //
   //console.log(`${(dtheta)} PI`)
   



   
   
   //console.log(vswr);
   
});

function solveForR(x, y) {
    let numerator = -1 + x * x + y * y;
    let denominator = 1 - 2 * x + x * x + y * y;
    let R = numerator / denominator;
    return R;
  }

class ResCircle{
    constructor(resistance) {
        this.resistance = resistance;
    }

    draw(){
        
        c.strokeStyle='#ff0000'
        c.beginPath();
        c.arc(this.resistance.center,canvas.height/2,this.resistance.radius,0,2*Math.PI)
        c.stroke()


    }

    mark(){
        c.fillText(this.resistance.value,this.resistance.center-this.resistance.radius,canvas.height/2)
    }
}

class CondCircle{
    constructor(resistance) {
        this.resistance = resistance;
    }

    draw(){
        
        c.strokeStyle='#ff0000'
        c.beginPath();
        c.arc(750-this.resistance.center,canvas.height/2,this.resistance.radius,0,2*Math.PI)
        c.stroke()


    }

    mark(){
        c.fillText(this.resistance.value,this.resistance.center-this.resistance.radius,canvas.height/2)
    }
}

class ReaCircle{
    constructor(reactance) {
        this.reactance = reactance;
    }

    draw(){
        
        c.strokeStyle='#0000ff'
        c.beginPath();
        c.arc(700,canvas.height/2+this.reactance.center,this.reactance.radius,0,2*Math.PI)
        c.arc(700,canvas.height/2-this.reactance.center,this.reactance.radius,0,2*Math.PI)
        c.stroke()


    }

  
}



c.lineWidth=10






 
function DrawResCircles(){

//plotting all circles
    for(var j=0;j<=100;j=j+0.01){
        const rescircle = new ResCircle({
            
            center: 700 -((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: (j)*char
        })
        
        c.lineWidth=0.1;
        if(j>100){
            c.lineWidth=0.0001;
        }
        rescircle.draw() 
    }

//labelling 0 to 1
    for(var j=0;j<0.9;j=j+0.1){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()
    }
//labelling 1 to 2
    for(var j=1;j<1.9;j=j+0.2){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()
    }
//labelling 2 to 10
    for(var j=2;j<10;j=j+1){
        const rescircle = new ResCircle({
            center: 700-((1/(j+1))*scale),
            radius: (1/(j+1))*scale,
            value: Math.round((j)*char*10)/10
        })
        
        c.lineWidth=0.3;

        rescircle.draw()
        rescircle.mark()

    }
}

function DrawReaCircles(){

    c.fillText(0.1*char,7,282)
    c.fillText(0.2*char,27,220)
    c.fillText(0.3*char,59,159)
    c.fillText(0.4*char,99,110)
    c.fillText(0.5*char,142,74)
    c.fillText(0.6*char,188,47)
    c.fillText((0.7*char),231,30)
    c.fillText((0.8*char),274,17)
    c.fillText((0.9*char),313,10)
    c.fillText((1*char),350,9)
    c.fillText(1.2*char,411,15)
    c.fillText(1.4*char,460,29)
    c.fillText(1.6*char,490,45)
    c.fillText(1.8*char,515,56)
    c.fillText(2*char,553,78)
    c.fillText(3*char,592,112)
    c.fillText(4*char,617,141)
    c.fillText(5*char,634,164)
    c.fillText(-0.1*char, 7, -282);


    



    //plotting all circles
    c.strokeStyle='#0000ff'
    c.lineWidth=0.5;
    c.beginPath();
    c.moveTo(canvas.width/2+scale, canvas.height/2);
    c.lineTo(canvas.width/2-scale, canvas.height/2);
    c.stroke();

        for(var j=0;j<=1000;j=j+0.01){
            const reacircle = new ReaCircle({
                
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: (j)*char
            })
            
            c.lineWidth=0.01;
            if(j>10){
                c.lineWidth=0.0001;
            }
      
            reacircle.draw() 
        }
    
    //labelling 0 to 1
        for(var j=0;j<0.9;j=j+0.1){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //reacircle.mark()
        }
    //labelling 1 to 2
        for(var j=1;j<1.9;j=j+0.2){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //rescircle.mark()
        }
    //labelling 2 to 10
        for(var j=2;j<100;j=j+0.5){
            const reacircle = new ReaCircle({
                center: ((1/(j))*scale),
                radius: (1/(j))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.3;
    
            reacircle.draw()
            //reacircle.mark()
    
        }

    }



    
    //rescircle.draw()
    //rescircle.mark()



DrawResCircles()
DrawReaCircles()
c.fillText("O",canvas.width,canvas.height/2)


function calcLump(){


}








function DrawCondCircles(){


    //plotting all circles
        for(var j=0;j<=100;j=j+0.01){
            const condcircle = new CondCircle({
                
                center: 750 -((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: (j)*char
            })
            
            c.lineWidth=0.1;

            condcircle.draw() 
        }
    
    //labelling 0 to 1
        for(var j=0;j<0.9;j=j+0.1){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
        }
        const condcircle = new CondCircle({
            center: 750-((1/(1+1))*scale),
            radius: (1/(1+1))*scale,
            value: Math.round((1)*char*10)/10
        })
        
        c.lineWidth=0.3;

        condcircle.draw()
    //labelling 1 to 2
        for(var j=1;j<1.9;j=j+0.2){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
        }
    //labelling 2 to 10
        for(var j=2;j<10;j=j+1){
            const condcircle = new CondCircle({
                center: 750-((1/(j+1))*scale),
                radius: (1/(j+1))*scale,
                value: Math.round((j)*char*10)/10
            })
            
            c.lineWidth=0.1;
    
            condcircle.draw()
            //condcircle.mark()
    
        }
    }

    function complexDivision(z1, z2) {
        const denominator = z2.re * z2.re + z2.im * z2.im;
        const realPart = (z1.re * z2.re + z1.im * z2.im) / denominator;
        const imagPart = (z1.im * z2.re - z1.re * z2.im) / denominator;
        return { re: realPart, im: imagPart };
      }
      
   DrawCondCircles()






   // Define the class
class CircuitElement {
    constructor(value, imageUrl) {
      this.value = value;
      this.imageUrl = imageUrl;
    }
}
  
  // Create some instances of the class
  const objects = [
        new CircuitElement(0,'images/load.png')
 
  ];
  
  // Get the container element to display the objects
  const container = document.getElementById('container');
  
  // Loop through the objects array and create a new HTML element for each object

  function drawCircuit() {
    // Clear the previous circuit diagram
 
    container.innerHTML = '';
  
    objects.forEach((object) => {
      // Create a new element for the object
      const objectElement = document.createElement('div');
  
      // Add a class to the object element
      objectElement.classList.add('circuit-object'); // Add a class to each object
  
      // Add the image to the element
      const imageElement = document.createElement('img');
      imageElement.src = object.imageUrl;
      objectElement.appendChild(imageElement);
  
      // Add the value to the element
      const valueElement = document.createElement('p');
      valueElement.innerText = `Value: ${object.value}`;
      objectElement.appendChild(valueElement);
  
      // Add the object element to the container
      container.appendChild(objectElement);
    });
  }

  drawCircuit()
  
  
  
  