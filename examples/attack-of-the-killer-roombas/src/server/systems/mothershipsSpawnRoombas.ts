import { useDeltaTime, useThrottle } from "@rbxts/matter"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import components from "shared/components"

export = function({ world }: AttackOfTheKillerRoombas) {
	// eslint-disable-next-line prefer-const
	for(let [id, model, lasering, transform] of
		world.query(components.Model, components.Lasering, components.Transform, components.Mothership)
	) {
		const beam = model.model.FindFirstChild("Beam") as BasePart
		if(beam) beam.Transparency = 1 - lasering.remainingTime

		lasering = lasering.patch({
			remainingTime: lasering.remainingTime - useDeltaTime()
		})

		if(!lasering.spawned) {
			const spawnPosition = new Vector3(
				transform.cframe.Position.X,
				11,
				transform.cframe.Position.Z
			)

			world.spawn(
				components.Roomba(),
				components.Charge({
					charge: 100
				}),
				components.Transform({
					cframe: new CFrame(spawnPosition)
				})
			)

			lasering = lasering.patch({
				spawned: true
			})
		}
		
		if(lasering.remainingTime <= 0) {
			world.remove(id, components.Lasering)
		} else {
			world.insert(id, lasering)
		}
	}
}
