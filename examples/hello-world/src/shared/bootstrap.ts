import { RunService, ServerScriptService, StarterPlayer } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"
import { matterDebuggerFactory } from "@rbxts/matter-bootstrap"

export default function bootstrap() {
	// A simple game with one system and one plugin
	const helloWorldGame = new Game({
		// The greetPlayers system will say hi for us
		systemsFolder: RunService.IsServer() ? 
			ServerScriptService.TS.systems :
			StarterPlayer.StarterPlayerScripts.TS.systems,
		plugins: {
			// And the PlayerEntities plugin will create Player components to say hi to
			playerEntities: PlayerEntities,
		},
	})

	helloWorldGame.begin()

	return helloWorldGame
}
