import { component } from "@rbxts/matter"

export = {
	Player: component<{
		instance: Player
	}>("Player"),
	Target: component("Target"),
	Roomba: component("Roomba"),
	Mothership: component<{
		goal: Vector3,
		nextGoal: Vector3,
		lasered: boolean
	}>("Mothership"),
	Transform: component<{
		cframe: CFrame,
		doNotReconcile?: boolean
	}>("Transform"),
	Model: component<{
		model: Model
	}>("Model"),
	Lasering: component<{
		remainingTime: number,
		spawned: boolean
	}>("Lasering"),
	Charge: component<{
		charge: number
	}>("Charge")
}
