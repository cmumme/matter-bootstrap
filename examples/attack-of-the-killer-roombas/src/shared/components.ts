import { component } from "@rbxts/matter"
import { Replicated } from "@rbxts/matter-bootstrap"

export default class {
	static Player = component<{
		instance: Player
	}>("Player")
	@Replicated
	static Target = component("Target")
	@Replicated
	static Roomba = component("Roomba")
	@Replicated
	static Mothership = component<{
		goal: Vector3,
		nextGoal: Vector3,
		lasered: boolean
	}>("Mothership")
	static Transform = component<{
		cframe: CFrame,
		doNotReconcile?: boolean
	}>("Transform")
	@Replicated
	static Model = component<{
		model: Model
	}>("Model")
	static Lasering = component<{
		remainingTime: number,
		spawned: boolean
	}>("Lasering")
	static Charge = component<{
		charge: number
	}>("Charge")
}
