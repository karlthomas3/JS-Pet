//pet is global
var myPet;

document.addEventListener("DOMContentLoaded", async function () {
	// add interactions to buttons if manage view is shown
	let manageView = this.getElementById("manage-view");
	if (manageView) {
		myPet = await get_pet();
		window.addEventListener("beforeunload", function () {
			myPet.save_pet();
		});

		document.getElementById("play-btn").onclick = () => myPet.play();
		document.getElementById("feed-btn").onclick = () => myPet.feed();
		document.getElementById("water-btn").onclick = () => myPet.water();
	}
});

// define pets
function Pet(
	user = "foo",
	name = "NOBODY",
	thirst = 0,
	happiness = 0,
	hunger = 0,
	last_save = "",
	birth_date = new Date().toISOString()
) {
	// properties
	this.owner = user;
	this.petName = name;
	this.thirst = thirst;
	this.happiness = happiness;
	this.hunger = hunger;
	this.lastSave = last_save;
	this.birthDate = birth_date;

	// methods for interacting with pet
	this.feed = function () {
		this.hunger -= 5;
		this.happiness += 2;
		this.normalize();
		this.status();
		console.log(`${this.petName} has been fed`);
	};

	this.water = function () {
		this.thirst -= 5;
		this.normalize();
		this.status();
		console.log(`${this.petName} drank some water`);
	};

	this.play = function () {
		this.happiness += 5;
		this.hunger += 1;
		this.thirst += 1;
		this.normalize();
		this.status();
		console.log(`${this.petName} played for a while`);
	};

	// returns hours since last save
	this.since_last = function () {
		let last = new Date(this.lastSave || this.birthDate);
		let now = new Date();
		return Math.floor((now - last) / 60000 / 60);
	};

	// update stats based on since_last
	this.wake = function () {
		let sleepTime = this.since_last() / 3;
		this.happiness -= sleepTime;
		this.hunger += sleepTime;
		this.thirst += sleepTime;

		// normalize values
		this.normalize();

		// welcome message about time since last visit
		let sl = this.since_last();
		let missed = document.getElementById("missed");
		missed.innerText = `It's been ${sl} hours since you visited ${this.petName}`;
		let erase = setInterval(function () {
			missed.innerText = "";
			clearInterval(erase);
		}, 20000);
		this.status();

		// start interval timer if not dummy pet
		if (this.petName != "NOBODY") {
			this.timer();
		}
	};

	// a function for keeping values in range
	this.normalize = () => {
		this.happiness = Math.min(10, Math.max(0, Math.ceil(this.happiness)));
		this.hunger = Math.min(10, Math.max(0, Math.ceil(this.hunger)));
		this.thirst = Math.min(10, Math.max(0, Math.ceil(this.thirst)));
	};

	// save changes to pet stats
	this.save_pet = function () {
		const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0]
			.value;

		// only attempt save if not dummy pet
		if (this.petName != "NOBODY") {
			let now = new Date().toISOString();
			fetch("pet/", {
				method: "PUT",
				body: JSON.stringify({
					thirst: this.thirst,
					happiness: this.happiness,
					hunger: this.hunger,
					now: now,
				}),
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
			}).catch((error) => {
				console.error(error);
			});
		}
	};

	// interval timer so time passes for pet while page is active
	this.timer = function () {
		let minutes = 2;
		console.log("pet.timer started");
		setInterval(function () {
			myPet.thirst += 1;
			myPet.hunger += 1;
			myPet.normalize();
			myPet.status();
			// bark for debug
			myPet.bark();
		}, 60000 * minutes);
	};

	// bar to scare away bugs!
	this.bark = function () {
		console.log("bark");
	};
	// add status messages based on how pet is doing
	this.status = function () {
		let messages = document.getElementById("pet-status");
		let happy = document.getElementById("happy");
		let hungry = document.getElementById("hungry");
		let thirsty = document.getElementById("thirsty");

		if (messages) {
			// happy switch
			switch (true) {
				case this.happiness < 2:
					happy.innerText = `${this.petName} is feeling so sad and lonely. You should play with them!`;
					break;
				case this.happiness > 8:
					happy.innerText = `${this.petName} is so happy right you're here.`;
					break;
				default:
					happy.innerText = ``;
			}
			// hungry switch
			switch (true) {
				case this.hunger > 8:
					hungry.innerText = `${this.petName} is starving and really needs to eat`;
					break;
				case this.hunger > 5:
					hungry.innerText = `${this.petName} is hungry`;
					break;
				default:
					hungry.innerText = ``;
					break;
			}
			// thirsty switch
			switch (true) {
				case this.thirst > 8:
					thirsty.innerText = `${this.petName} desperately needs to drink some water`;
					break;
				case this.thirst > 5:
					thirsty.innerText = `${this.petName} is thirsty`;
					break;
				default:
					thirsty.innerText = ``;
					break;
			}
		}
		let today = new Date().toISOString();
		if(this.birthDate == today){
			let bday = document.createElement('div');
			bday.innerHTML =`It's ${this.petName}'s birthday! you guys should celebrate!!`;
		}
	};

	//wake pet on creation
	this.wake();
}

function get_pet() {
	return fetch("pet/")
		.then((response) => response.json())
		.then((data) => {
			let p = data.pet;
			// console.log(data.pet);
			return new Pet(
				p.user,
				p.name,
				p.thirst,
				p.happiness,
				p.hunger,
				p.last_save,
				p.birth_date
			);
		})
		.catch((error) => {
			console.error(error);
		});
}
