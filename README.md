# @rbxts/matter-bootstrap
Handles everything to setup [Matter](https://matter-ecs.github.io/matter/). Includes a versatile plugins system to enable any mix of these functions:
- Hot-reloading
- Networking (using [@rbxts/yetanothernet](https://yetanotherclown.github.io/YetAnotherNet/))
- Component replication
- Matter debugger
- ...and more! You can create your own plugins as seen in the [example game](examples/hello-world/)

## Code examples
See the [example game](examples/hello-world/) for more details
```ts
// server/bootstrap.server.ts
import { ServerScriptService } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"

// A simple game with one system and one plugin
const helloWorldGame: HelloWorldGame = new Game({
	// The greetPlayers system will say hi for us
	systemsFolder: ServerScriptService.TS.systems,
	plugins: {
		// And the PlayerEntities plugin will create Player components to say hi to
		playerEntities: PlayerEntities
	},
})

helloWorldGame.begin()
```

```ts
// server/systems/greetPlayers.ts
import components from "shared/components"

// Greets new players
export = function({ world }: HelloWorldGame) {
	for(const [,playerRecord] of world.queryChanged(components.Player)) {
		if(playerRecord.new && !playerRecord.old) {
			// Player has just spawned, greet them!
			const player = playerRecord.new.instance
			print(`Hello, ${player.DisplayName} (@${player.Name})`)
		}
	}
}
```
