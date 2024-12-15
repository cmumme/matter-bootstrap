import { ContextActionService, RunService } from "@rbxts/services"
import type { GameLoop } from "."
import { Debugger } from "@rbxts/matter"
import Plasma from "@rbxts/plasma"

export default class MatterDebugger {
	public readonly debugger = new Debugger(Plasma)

	public setupDebugger(loop: GameLoop, debuggerKeycode: Enum.KeyCode) {
		this.debugger.autoInitialize(loop)

		if(!RunService.IsClient()) return

		ContextActionService.BindAction("openMatterDebugger", (_, inputState) => {
			if(inputState !== Enum.UserInputState.End) return

			this.debugger.toggle()
		}, false, debuggerKeycode)
	}
}
