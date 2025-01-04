import { RunService, ServerScriptService, StarterPlayer } from "@rbxts/services"
import { Game } from "@rbxts/matter-bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"
import { matterDebuggerFactory } from "@rbxts/matter-bootstrap"
import { Loader } from "@rbxts/loader"
import components from "./components"

const SYSTEMS_FOLDER = RunService.IsServer() ?
	ServerScriptService.TS.systems :
	StarterPlayer.StarterPlayerScripts.TS.systems


export default function bootstrap() {
	const attackOfTheKillerRoombas = new Game({
		systems: Loader.Load(SYSTEMS_FOLDER),
		plugins: {
			playerEntities: PlayerEntities,
			debugger: matterDebuggerFactory({
				findInstanceFromEntity: (id): Model | undefined => {
					if(!attackOfTheKillerRoombas.world.contains(id)) return

					return attackOfTheKillerRoombas.world.get(id, components.Model)?.model
				},
			}),
		},
	})

	attackOfTheKillerRoombas.begin()

	return attackOfTheKillerRoombas
}
