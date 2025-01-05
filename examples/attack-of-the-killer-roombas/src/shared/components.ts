import { component } from "@rbxts/matter"

export = {
	Player: component<{
		instance: Player
	}>("Player"),
	Mothership: component<{
		goal: Vector3,
		nextGoal: Vector3,
		lasered: boolean
	}>("Mothership"),
	Transform: component<{
		cframe: CFrame
	}>("Transform"),
	Model: component<{
		model: Model
	}>("Model"),
	Lasering: component<{
		remainingTime: number
	}>("Lasering")
}
