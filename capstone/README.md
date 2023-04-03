CAPSTONE - JS-Pet
====
#### Video Demo:  <https://youtu.be/ShQRQqIn_NY>
Description
----
Welcome to JS-Pet!

This is my final project for the CS50 web development track. It was built using HTML, CSS, Bootstrap, Python, Django, and of course, JavaScript.

In brief, its a web-based pet ah-la Tomogatchi.
You can give it food and water, play with it or just let it take a nap while you work! The app keeps track of how well the pet is doing and saves itself if you close the browser or navigate away.

Distinctiveness and Complexity
----
****
I think its distinctiveness speaks for itself. Over the length of the course we made a social media site, an email client, a wiki, and even an auction site but nothing even remotely like a virtual pet.

This project runs on Django for the back end and really only required one model I'll describe later. While the login, logout, and register pages are quite standard the real gem of this project and its main claims to complexity lie in its JavaScript. I broke it up into two separate scripts to keep it straight in my head as they each handle very different aspects of the project.

One handles the management of the pet in terms of APIs, saving, loading, updating, as well as notifications to the user.

The second brings the whole thing to life with animation! This required quite a bit of extra homework since this alone far exceeded the complexity of anything I had attempted in any cs50w projects.

How to run
----
Just 'django manage.py runserver' like you would any django project. The default '' url will take you to the index/welcome screen. Register a login and name your new pet.

The Files
====
Lets get the simplest ones out of the way first.
* __layout.html__ contains the basic layout for the entire web app and is extended by the other pages.

* __index.html__ is basically a welcome page.
* __login.html__ allows you to login to the app.
* __register.html__ for registering if you don't already have a login.
* __profile.html__ does most of the work on the html end of things. Its where you name your new pet and where all of the interaction buttons are located.
* __styles.css__ is extremely bare-bones. I was specifically looking for a minimalist vibe and bootstrap did most of the heavy lifting stylistically so I didn't need to write much of my own css.
* __urls.py__ has the typical routes for registering, logging in, and logging out. Additionally there's a route for creating a new pet and an API route used for pet management.
* __models.py__ contains the pet model used for the pets save files. It keeps track of basic info like the pets name, the user it belongs to when the last save was made, and stats like hunger, thirst, and happiness. I also added a handy 'serialize' function that returns all of the relevant data formatted for Json response.
* __views.py__ has the basic login, logout, and register functions you'd expect. The index checks whether the user is logged in and either displays the index page, or the profile page which is then fed the pet. It also has self-explanatory create_pet function as well as the pet_data function with two APIs.
    * GET is used for retrieving a users pet. It requires a login, has csrf protection, and changes no data so I didn't feel a PUSH was required. It returns either the users pet or (if there isn't one) a dummy pet. Either one will be returned in serialized fashion to be reassembled by the front end.
  
    * A PUT request is used to save the pet by updating it in the database.
* __index.js__ and __shadow.js__ each get their own sections as there's way too much there for a short blurb.

index.js
----
This file contains meat of the project.
* I opted to make the pet it's own object so it could self contain most of its own stats and functions. It has the same properties as the pet in models.py like a name, hunger, thirst, etc, as well as a birth date used in case there isn't a last_save for pet retrieval (and for a happy birthday message)

* It has self-contained functions for feeding, watering, and playing which update the relevant stats.
* __since_last__ returns the time since the pet was last saved. This is used primarily in the next function.
* __wake__ uses since_last to check how much time has passed since the last save. It then updates the pets stats to account for the passage of time. Take too long to check on your pet and it will get quite hungry, thirsty, and very lonely. This function also checks to make sure the pet isn't a dummy pet (returned if no pet exists) and starts the timer function for updating pet in real time while you're logged in. This function is called upon instantiation so the pet starts itself and handles everything for itself as soon as it exists.
* __normalize__ keeps the stats in range and floors out any decimals for nice clean values.
* __save_pet__ sends the PUT request used by it's sister function in views.py to update the pet in the database.
* __timer__ updates the pets stats in real time while the page is open so if you leave the tab open while surfing the web the pet will get hungry, thirsty, etc while waiting for you.
* __bark__ was added for debugging purposes and left in because why not?
* __status__ uses several switches to update the messages panel of the page to inform the user of their pets current status.
* The only function here NOT contained within the pet object is __get_pet__. This makes the initial API call for the users pet data used  to instantiate a Pet object which is returned to get the whole process started.

shadow.js
----
This was the most fun, and by far the most challenging part of the entire project. 
While index.js handles the underlying existence and maintenance of the pet, shadow.js brings it to life with animation. To manage all this I created the _Shadow_ class (named after this adorable sprite sheet I found).

It defines the canvas, the image source, and many other parameters such as sprite dimensions, a very basic state machine, coordinates for rendering on the canvas as well as source coordinates for isolating specific frames on the sprite sheet.

Once I had figured out how to isolate specific frames to draw, I created a dictionary of 'state' arrays. Each array is if filled with dictionaries made up of x/y coordinates for each frame in sequence.

In the draw and update functions, by infinitely clearing the canvas, looping through the coordinates in any given state array (slowed down by dividing by the 'staggerframes' variable), and redrawing the new current frame, I can animate the pet like a flip book.

I then set up functions like nap, idle, bite etc for each of the states which manage the state of the pet to alter the animation based on user choices.

Summary
====
By combining all of the animation logic in the Shadow class with the Pet object's data management functionality and using Django to run the back end storing everything in the database, I was able to create a mobile friendly, virtual pet that will easily scale to handle as many users as would like pets. Whats more, with its modular build I could continue to roll out new features such as more interactions or new types of pets with even more animations till the virtual cows come home.
