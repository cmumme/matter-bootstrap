import { RunService, ServerScriptService, StarterPlayer } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"
import { matterDebuggerFactory } from "@rbxts/matter-bootstrap"
import { Loader } from "@rbxts/loader"

const SYSTEMS_FOLDER = RunService.IsServer() ?
	ServerScriptService.TS.systems :
	StarterPlayer.StarterPlayerScripts.TS.systems


export default function bootstrap() {
	const template = new Game({
		systems: Loader.Load(SYSTEMS_FOLDER),
		plugins: {
			playerEntities: PlayerEntities,
			debugger: matterDebuggerFactory({ }),
		},
	})

	template.begin()

	return template
}
