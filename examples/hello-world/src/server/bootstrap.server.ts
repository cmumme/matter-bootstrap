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
