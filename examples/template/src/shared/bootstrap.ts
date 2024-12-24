import { RunService, ServerScriptService, StarterPlayer } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"
import { matterDebuggerFactory } from "@rbxts/matter-bootstrap"

export default function bootstrap() {
	const template = new Game({
		systemsFolder: RunService.IsServer() ? 
			ServerScriptService.TS.systems :
			StarterPlayer.StarterPlayerScripts.TS.systems,
		plugins: {
			playerEntities: PlayerEntities,
			debugger: matterDebuggerFactory({ }),
		},
	})

	template.begin()

	return template
}
