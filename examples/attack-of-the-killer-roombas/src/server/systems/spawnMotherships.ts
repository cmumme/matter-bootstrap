import { useThrottle } from "@rbxts/matter"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import components from "shared/components"

export = function({ world }: AttackOfTheKillerRoombas) {
	if(useThrottle(10)) {
		const spawnPosition = new Vector3(500, 500, 500)
			.mul(new Vector3(
				math.random(1, 2) === 1 ? 1 : -1,
				1,
				math.random(1, 2) === 1 ? 1 : -1,
			))
		const despawnPosition = new Vector3(500, 500, 500)
			.mul(new Vector3(
				math.random(1, 2) === 1 ? 1 : -1,
				1,
				math.random(1, 2) === 1 ? 1 : -1,
			))
		const goalPosition = new Vector3(
			math.random(-100, 100),
			100,
			math.random(-100, 100)
		)

		world.spawn(
			components.Mothership({
				goal: goalPosition,
				nextGoal: despawnPosition,
				lasered: false
			}),
			components.Transform({
				cframe: new CFrame(spawnPosition)
			})
		)
	}

	for(const [id] of
		world.query(components.Transform, components.Mothership)
			.without(components.Model)
	) {
		const model = ReplicatedStorage.Assets.Mothership.Clone()
		model.Parent = Workspace
		model.PrimaryPart?.SetNetworkOwner(undefined)

		world.insert(
			id,
			components.Model({
				model: model
			})
		)
	}

	for(const [id, mothership, transform] of
		world.query(components.Mothership, components.Transform)
			.without(components.Lasering)
	) {
		if(transform.cframe.Position.sub(mothership.goal).Magnitude < 10) {
			if(mothership.lasered) {
				world.despawn(id)
			} else {
				world.insert(
					id,
					mothership.patch({
						goal: mothership.nextGoal,
						lasered: true
					}),
					components.Lasering({
						remainingTime: 1,
						spawned: false
					})
				)
			}
		}
	}

	for(const [, mothership, model] of
		world.query(components.Mothership, components.Model)
			.without(components.Lasering)
	) {
		const alignPosition = model.model
			.FindFirstChild("Roomba")
			?.FindFirstChild("AlignPosition") as BodyPosition | undefined
		if(!alignPosition) continue

		alignPosition.Position = mothership.goal
	}
}
