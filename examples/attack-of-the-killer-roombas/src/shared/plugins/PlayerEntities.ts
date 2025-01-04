import { AnyEntity } from "@rbxts/matter"
import { GamePlugin } from "@rbxts/matter-bootstrap"
import { Players } from "@rbxts/services"
import components from "shared/components"

// Spawns a new entity with the Player component when a new player joins
export default class PlayerEntities extends GamePlugin {
	public playerEntityMap = new Map<Player, AnyEntity>()

	public init() {
		Players.PlayerAdded.Connect(player => {
			const playerEntity = this.gameClass.world.spawn(
				components.Player({
					instance: player
				})
			)
			this.playerEntityMap.set(player, playerEntity)

			player.CharacterAdded.Connect(character => {
				this.gameClass.world.insert(
					playerEntity,
					components.Transform(),
					components.Target(),
					components.Model({
						model: character
					})
				)
			})

			player.CharacterRemoving.Connect(() => {
				this.gameClass.world.remove(playerEntity, components.Transform, components.Target, components.Model)
			})
		})
	}

	public start() {
		// Unused
	}
}
