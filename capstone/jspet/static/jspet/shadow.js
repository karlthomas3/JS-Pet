window.addEventListener("load", function () {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 600;

	class Shadow {
		constructor(canvasWidth, canvasHeight) {
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.image = document.getElementById("sprite-sheet");
			this.spriteWidth = 575;
			this.spriteHeight = 523;
			this.width = this.spriteWidth;
			this.height = this.spriteHeight;
			this.scale = 1;
			this.x = this.canvasWidth / 2 - (this.width * this.scale) / 2;
			this.y = this.canvasHeight / 2 - (this.height * this.scale) / 2;
			this.frame = 0;
			this.frameX = 0;
			this.frameY = 0;
			this.state = "sleeping";
			this.staggerFrames = 5;
			// a dict of state animations
			this.spriteAnimations =
				// each state is a dict containing an array dicts
				{
					idle: [
						// each of those dicts contain the x/y of the frame
						{ x: 0, y: 0 },
						{ x: 1, y: 0 },
						{ x: 2, y: 0 },
						{ x: 3, y: 0 },
						{ x: 4, y: 0 },
						{ x: 5, y: 0 },
						{ x: 6, y: 0 },
					],
					roll: [
						{ x: 0, y: 6 },
						{ x: 1, y: 6 },
						{ x: 2, y: 6 },
						{ x: 3, y: 6 },
						{ x: 4, y: 6 },
						{ x: 5, y: 6 },
						{ x: 6, y: 6 },
						{ x: 0, y: 4 },
						{ x: 1, y: 4 },
						{ x: 2, y: 4 },
						{ x: 3, y: 4 },
						{ x: 4, y: 4 },
						{ x: 5, y: 4 },
						{ x: 6, y: 4 },
						{ x: 7, y: 4 },
						{ x: 8, y: 4 },
						{ x: 9, y: 4 },
						{ x: 10, y: 4 },
						{ x: 0, y: 4 },
						{ x: 1, y: 4 },
						{ x: 2, y: 4 },
						{ x: 3, y: 4 },
						{ x: 4, y: 4 },
						{ x: 5, y: 4 },
						{ x: 6, y: 4 },
						{ x: 7, y: 4 },
						{ x: 8, y: 4 },
						{ x: 9, y: 4 },
						{ x: 10, y: 4 },
					],
					sleep: [
						{ x: 0, y: 8 },
						{ x: 1, y: 8 },
						{ x: 2, y: 8 },
						{ x: 3, y: 8 },
						{ x: 4, y: 8 },
						{ x: 5, y: 8 },
						{ x: 6, y: 8 },
						{ x: 7, y: 8 },
						{ x: 8, y: 8 },
						{ x: 9, y: 8 },
						{ x: 10, y: 8 },
						{ x: 11, y: 8 },
					],
					sleeping: [
						{ x: 8, y: 8 },
						{ x: 8, y: 8 },
						{ x: 8, y: 8 },
						{ x: 9, y: 8 },
						{ x: 9, y: 8 },
						{ x: 9, y: 8 },
						{ x: 10, y: 8 },
						{ x: 10, y: 8 },
						{ x: 10, y: 8 },
						{ x: 11, y: 8 },
						{ x: 11, y: 8 },
						{ x: 11, y: 8 },
					],
					bite: [
						{ x: 0, y: 7 },
						{ x: 1, y: 7 },
						{ x: 2, y: 7 },
						{ x: 3, y: 7 },
						{ x: 4, y: 7 },
						{ x: 5, y: 7 },
						{ x: 6, y: 7 },
					],
					wake: [
						{ x: 11, y: 8 },
						{ x: 10, y: 8 },
						{ x: 9, y: 8 },
						{ x: 8, y: 8 },
						{ x: 7, y: 8 },
						{ x: 6, y: 8 },
						{ x: 5, y: 8 },
						{ x: 4, y: 8 },
						{ x: 3, y: 8 },
						{ x: 2, y: 8 },
						{ x: 1, y: 8 },
						{ x: 0, y: 8 },
					],
					sit: [
						{ x: 0, y: 5 },
						{ x: 1, y: 5 },
						{ x: 2, y: 5 },
						{ x: 3, y: 5 },
						{ x: 4, y: 5 },
					],
					run: [
						{ x: 0, y: 3 },
						{ x: 1, y: 3 },
						{ x: 2, y: 3 },
						{ x: 3, y: 3 },
						{ x: 4, y: 3 },
						{ x: 5, y: 3 },
						{ x: 6, y: 3 },
						{ x: 7, y: 3 },
						{ x: 8, y: 3 },
					],
				};
			console.log(this.spriteAnimations);
		}

		draw(context) {
			// draw the pet
			context.drawImage(
				this.image,
				this.frameX * this.spriteWidth,
				this.frameY * this.spriteHeight,
				this.spriteWidth,
				this.spriteHeight,
				this.x,
				this.y,
				this.width * this.scale,
				this.height * this.scale
			);
		}

		update() {
			// get the current frame and set x/y
			let state = this.spriteAnimations[this.state];
			//loop through frames of given state
			// divide by staggerframes to slow down animation
			let position =
				Math.floor(this.frame / this.staggerFrames) % state.length;

			this.frameX = state[position].x;
			this.frameY = state[position].y;
			this.frame++;
		}
		// animation functions
		nap() {
			shadow.frame = 0;
			shadow.state = "sleep";
			let timer = setInterval(function () {
				shadow.state = "sleeping";
				clearInterval(timer);
			}, 900);
		}
		wake() {
			shadow.frame = 0;
			shadow.state = "wake";
			let timer = setInterval(function () {
				shadow.idle();
				clearInterval(timer);
			}, 800);
		}
		bite() {
			shadow.frame = 0;
			shadow.state = "bite";
			let timer = setInterval(function () {
				shadow.idle();
				clearInterval(timer);
			}, 2000);
		}
		play() {
			shadow.frame = 0;

			let choice = Math.floor(Math.random() * 2);
			if (choice == 0) {
				shadow.state = "roll";
			} else {
				shadow.state = "run";
			}

			let timer = setInterval(function () {
				shadow.idle();
				clearInterval(timer);
			}, 3000);
		}
		idle() {
			shadow.frame = 0;
			let choice = Math.floor(Math.random() * 2);
			if (choice == 0) {
				shadow.state = "idle";
			} else {
				shadow.state = "sit";
			}
		}
	}

	const shadow = new Shadow(canvas.width, canvas.height);

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		shadow.draw(ctx);
		shadow.update();
		requestAnimationFrame(animate);
	}
	animate();
	shadow.wake();

	// buttons cause interactions
	let napBtn = document.getElementById("nap-btn");
	if (napBtn) {
		//nap time
		napBtn.addEventListener("click", () => shadow.nap());
		// wake up
		document
			.getElementById("wake-btn")
			.addEventListener("click", () => shadow.wake());

		// eating
		document
			.getElementById("feed-btn")
			.addEventListener("click", () => shadow.bite());

		// drinking
		document
			.getElementById("water-btn")
			.addEventListener("click", () => shadow.bite());

		// play time!!
		document
			.getElementById("play-btn")
			.addEventListener("click", () => shadow.play());
	}
});
