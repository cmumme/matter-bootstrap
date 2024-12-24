import { RunService, ServerScriptService, StarterPlayer } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"
import { matterDebuggerFactory } from "@rbxts/matter-bootstrap"
import { Loader } from "@rbxts/loader"

const SYSTEMS_FOLDER = RunService.IsServer() ?
	ServerScriptService.TS.systems :
	StarterPlayer.StarterPlayerScripts.TS.systems

export default function bootstrap() {
	// A simple game with one system and one plugin
	const helloWorldGame = new Game({
		// The greetPlayers system will say hi for us
		systems: Loader.Load(SYSTEMS_FOLDER),
		plugins: {
			// And the PlayerEntities plugin will create Player components to say hi to
			playerEntities: PlayerEntities,
			// The Matter debugger with default configuration
			debugger: matterDebuggerFactory({ }),
		},
	})

	helloWorldGame.begin()

	return helloWorldGame
}
