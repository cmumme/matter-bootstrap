import { GamePlugin } from "@rbxts/matter-bootstrap"
import { Players } from "@rbxts/services"
import components from "shared/components"

// Spawns a new entity with the Player component when a new player joins
export default class PlayerEntities extends GamePlugin {
	public init() {
		Players.PlayerAdded.Connect(player => {
			this.gameClass.world.spawn(components.Player({
				instance: player
			}))
		})
	}

	public start() {
		// Unused
	}
}
