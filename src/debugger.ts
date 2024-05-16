import { ContextActionService, RunService } from "@rbxts/services"
import type { GameLoop } from "."
import { Debugger } from "@rbxts/matter"
import Plasma from "@rbxts/plasma"

export default class MatterDebugger {
	public readonly debugger = new Debugger(Plasma)

	public constructor(
        private readonly loop: GameLoop
	) { }

	public setupDebugger(debuggerKeycode: Enum.KeyCode) {
		this.debugger.autoInitialize(this.loop)

		if(!RunService.IsClient()) return

		ContextActionService.BindAction("openMatterDebugger", (_, inputState) => {
			if(inputState !== Enum.UserInputState.End) return

			this.debugger.toggle()
		}, false, debuggerKeycode)
	}
}
