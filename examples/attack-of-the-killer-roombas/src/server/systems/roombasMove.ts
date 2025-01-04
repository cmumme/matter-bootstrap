import { useThrottle } from "@rbxts/matter"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import components from "shared/components"

export = function({ world }: AttackOfTheKillerRoombas) {
	for(const [id] of
		world.query(components.Transform, components.Roomba)
			.without(components.Model)
	) {
		const model = ReplicatedStorage.Assets.KillerRoomba.Clone()
		model.Parent = Workspace
		model.PrimaryPart?.SetNetworkOwner(undefined)

		world.insert(
			id,
			components.Model({
				model: model
			})
		)
	}
}
