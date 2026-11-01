# 01-BeamNGAgentic: Messing with our Car 

Before we can get an agent like Claude or Gemini to drive our car, we first need to control it manually, with code, so we can figure out how to set up an MCP for these AIs to interact with. I did some digging, and there's actually several solutions we can use for controlling the car.

* **BeamNGpy + BeamNG.tech** -- apparently, BeamNG already ships a research-oriented version of BeamNG.drive, known as BeamNG.tech, as well as an API written in Python (my hubby) for anyone looking to experiment with ADAS. There's actually a small problem with this, but I'll get to it later. 
* *BeamNG World Editor* -- this is kinda obvious, BeamNG comes already preloaded with a world editor where we can acess data about the car and control it through Lua. I'd need to build a Python bridge for it though.
* *BeamNG Lua -> Python* -- this is sorta an extension of the world editor, but we could directly tap into the Lua code in BeamNG and create some sort of mechanism to control that code with Python. It gives us a LOT of information, but it's complicated as hell.
* *BeamNG's MCP server* -- I actually found this randomly while doing research on the APIs. Turns out BeamNG comes with an MCP server built in (I'm assuming for their new Robot Van) that something like Cursor could access. I might come to it later, but an MCP server might be a little too limiting.|
* *Unofficial BeamNG MCP server* -- there's also an MCP server created by the community. It shows off a lot, but again, an MCP server is harder to control with code. On the topic of MCP, I think it'll actually be better to build our own MCP to talk with our OWN API, so we can grab wtvr we want that BeamNG has available for BeamNG.tech.

## Controlling the Car

The one in bold -- BeamNGpy + BeamNG.tech -- is the one I went with, because I'm a bum and way too lazy to directly talk with BeamNG's Lua. However, I have a small problem -- I don't HAVE BeamNG.tech. Turns out you need to REGISTER for a LICENSE using an ACADEMIC EMAIL (which I have but my bum ahh school blocks external emails) -- and on top of that, it'll take 5 BUSINESS DAYS FOR THEM TO REPLY. like BRO

What's interesting, however, is that BeamNG.drive comes shipped with the BeamNG.tech protocol built in, which could be accessed through a port by passing the `-tcom` flag (BeamNG.tech is just a fork of BeamNG.drive after all, with that data exposed through the UI) -- which meant that using my version of BeamNG was possible. I had another problem, though -- turns out I have to version match the protocol used by BeamNG.tech (or BeamNG.drive in our case) and BeamNGpy -- but BeamNG.tech's newest protocol was newer than the one in the BeamNG.drive retail release. It seems simple (which it is) but it took me FOREVER to get it work because I used ChatGPT to get me the proper release, and its clanker ass was hallucinating versions and going on and on about how "the package version is different that the protocol version" like BRO YOU'VE TOLD ME THIS FOUR TIMES ALREADY... but turns out downgrading one version of BeamNGpy was enough to get the protocol versions to match (if anyone needs it, BeamNGpy should be on 1.35.1 for BeamNG.drive on 0.39.4). 

Now that I had the two versions matching, it's possible to control the car. I experimented using the `python` shell -- I found that was the fastest way to apply controls. Here's the boilerplate I used to get the BeamNG.drive instance available in my code:

```
from beamngpy import BeamNGpy
bng = BeamNGpy("localhost", 25252)
bng.open(launch=False) # <-- set this to launch=True if you don't already have it running from Steam/wherever with the -tcom flag enabled
```

**TIP:** dw if `bng.open()` returns a memory location, that's just it initializing the BeamNG.drive client class.

Now, I can apply some code to get a car to spawn:

```
from beamngpy import Vehicle

pickup = Vehicle("my_pickup", model="pickup") # pickup is BeamNG's name for the Gavril D-Series pickup
bng.spawn_vehicle(pickup, pos=(0, 0, 100)) # it seems anything above 100 just spawns level with the ground. Testing this on the Gridmap V2 though, so it might change on a map to map basis.
```

and then move:

```
pickup.control(throttle=0.5, steering=0.3, brake=0) 
```

`<insert-video-here>`

## Retrieving Data about the Car

While I was showing my dad our discoveries, he asked me if we could give a position where we can move the car to. I checked with ChatGPT (please don't hate on me, the documentation for this is ASS) and it said there wasn't an inbuilt way for us to move the car to a specifc location. Then I got to thinking -- how could we do this (trust me, this is related to retrieving data)?

There are two ways that I could think of:

1. **A custom function that, using the vehicle's current position and the position we need to get to, adjusts the angle of the steering and the throttle to get there.**
2. *A custom AI, forked from BeamNG's own AIs (like the traffic/chase/flee AIs) that can go to any point we need to.*

I chose the first, because 1. the main focus is to control the car using an agent, and once we put in the agent and it's able to see the world, we won't need the extra stuff (like obstacle detection, etc.) that BeamNG's own AI has. 

Now, remember when I said this is related to retrieving data (only 1 paragraph ago btw)? In order to go to a position, we first need to know where WE are, which we can do by retrieving the state of the vehicle. Conceptually, this isn't hard, but this took me FOREVER to do because I had to guess all the function names with ChatGPT. Anyway's here the code:

```
from beamngpy import BeamNGpy
from beamngpy import Vehicle

import time
import math

# Connect to BeamNG.drive
bng = BeamNGpy("localhost", 25252)
bng.open(launch=False)

# Get the currently controlled/player vehicle
current = bng.vehicles.get_current()
car = current["thePlayer"] # Yes, the actual name is "thePlayer". I find it odd too.

# Connect directly to the vehicle
car.connect(bng)

print("Vehicle:", car)
print("Connected:", car.is_connected())
``` 

And the good bit:

```
# Get state of car
state = car.sensors["state"]

car.poll_sensors()

data = state.data
```

Now, I've isolated this snippet because this is a little more interesting:

1. We need to access the SENSORS of the car instead of directly getting the state.
2. We need to poll the sensors to update the data

This actually makes our life easier, because I can continously poll the sensors without having to update the state. But I digress, because now we have the actual data.

Now, the data is a dictionary, containing multiple data points:

```
data["pos"]       # position
data["vel"]       # velocity
data["dir"]       # facing direction
data["up"]        # vehicle's up direction
data["front"]     # point toward front
data["rotation"]  # quaternion rotation
data["time"]      # simulation time

```
