all: Engine

Engine:
	cd src
	tsc

clean:
	rm ./build/engine.js
	rm ./build/engine.js.map