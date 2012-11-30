$(window).load(function(e){
	var pixelSize = 10;
	var can = document.getElementById('canvas');
	var newCan = document.getElementById('newcanvas');
	ctx = can.getContext('2d');
	newCtx = newCan.getContext('2d');

	//Load image
	var img = new Image();
	img.onload = function(){
	    can.width = img.width;
	    can.height = img.height;
	    ctx.drawImage(img, 0, 0, img.width, img.height);
	}
	img.src = 'img/snow.jpg';
	newCan.width = 539;
	newCan.height = 346;
	
	$('#canvas').mousemove(function(e){
		posX = e.pageX - $(this).offset().left;
		posY = e.pageY - $(this).offset().top;
		red = 0; green = 0; blue = 0;
		total = 0;
		var imgd = ctx.getImageData(posX - posX % pixelSize, posY - posY % pixelSize,pixelSize,pixelSize);
		var pix=imgd.data;
		for (var i = 0, n = pix.length; i < n; i += 4) {
		    red += pix[i];
		    green += pix[i+1];
		    blue += pix[i+2];
		    total++;
		}
		red = Math.round(red / total);
		green = Math.round(green / total);
		blue = Math.round(blue / total);
		
		for (var i = 0, n = pix.length; i < n; i += 4) {
			pix[i] = red;
		    pix[i+1] = green;
		    pix[i+2] = blue;
		}
		//ctx.putImageData(imgData,10,70);
		$('#color').css('background-color','rgba('+red+','+green+','+blue+',1)');
		newData = newCtx.getImageData(posX - posX % pixelSize, posY - posY % pixelSize,pixelSize,pixelSize).data;
		newRed = newData[0];
		newGreen = newData[1];
		newBlue = newData[2]
		if(newRed == 0 && newGreen == 0 && newBlue == 0){
			console.log('added')
			newCtx.putImageData(imgd, posX - posX % pixelSize, posY - posY % pixelSize);

			ctx.putImageData(imgd, posX - posX % pixelSize, posY - posY % pixelSize);
			addCube(posX - posX % pixelSize, posY - posY % pixelSize, red, green, blue, pixelSize);
		}
		
	
	});

/*
$(document).click(function(){
	for(var p = 0 ; p < 539; p += pixelSize){
		for(var q = 0; q < 346; q += pixelSize){
			red = 0; green = 0; blue = 0;
			total = 0;
			var imgd = ctx.getImageData(p, q, pixelSize, pixelSize);
			var pix=imgd.data;
			//console.log(p,q)
			for (var i = 0, n = pix.length; i < n; i += 4) {
			    red += pix[i];
			    green += pix[i+1];
			    blue += pix[i+2];
			    total++;
			}
			red = Math.round(red / total);
			green = Math.round(green / total);
			blue = Math.round(blue / total);
			
			for (var i = 0, n = pix.length; i < n; i += 4) {
				pix[i] = red;
			    pix[i+1] = green;
			    pix[i+2] = blue;
			}
			//ctx.putImageData(imgData,10,70);
			//$('#color').css('background-color','rgba('+red+','+green+','+blue+',1)');
			newCtx.putImageData(imgd, p, q);
			addCube(p, q, red, green, blue, pixelSize);
		}
	}
})
*/
	//THREEJS
	// set the scene size
	var WIDTH = 500,
  		HEIGHT = 346;

	// set some camera attributes
	var VIEW_ANGLE = 45,
	  	ASPECT = WIDTH / HEIGHT,
	  	NEAR = 0.1,
	  	FAR = 10000;

	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	var $container = $('#container');

	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer({'antialias':'true'});
	camera =
	  new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.z = 300;
	camera.position.x = 0;
	camera.position.y = 0;
	camera.lookAt(new THREE.Vector3(0,0,0))

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	$container.append(renderer.domElement);


	// create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	
	// create the sphere's material
	


	    // create a point light
	var pointLight =
	new THREE.PointLight(0xFFFFFF);

	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	// add to the scene
	scene.add(pointLight);
	// draw!
	
	animate();
	function addCube(posX,posY,red,green,blue, size){
	// set up the sphere vars
	var side = pixelSize / 2.5;
	    
	var cubeMaterial = new THREE.MeshLambertMaterial( { color: parseInt(rgbToHex(red,green,blue)) } )
	    //console.log(rgbToHex(red,green,blue))
	var cube = new THREE.Mesh(

	  new THREE.CubeGeometry(
	    side,
	    side,
	    side),

	  cubeMaterial);
	//console.log(posX, posY)
	
	

	// add the sphere to the scene
	cube.position.x = posX / 2 - 125;
	cube.position.y = (-1 * posY) / 2 + 75;
	cube.scale.z = 8 -((red + green + blue) / 100);

	scene.add(cube);
	renderer.render(scene, camera);

	$('#container').mousemove(function(e){
		mPosX = e.pageX - $(this).offset().left;
		mPosY = e.pageY - $(this).offset().top;
		camera.position.x = (mPosX - 250) / 2;
		camera.position.y = (mPosY - 170) / 3;
		camera.lookAt(new THREE.Vector3(0,0,0))
		console.log(mPosX, mPosY)

		//renderer.render(scene, camera);
	})
}
$('#container').click(function(){
	
	/*camera.position.x = Math.random() * 500 - 250;
	camera.lookAt = (0,0,0)
	renderer.render(scene, camera);*/
})
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {

	renderer.render( scene, camera );

}
})

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

