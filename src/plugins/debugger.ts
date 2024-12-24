import { Debugger } from "@rbxts/matter"
import { Game, GamePlugin } from "../game"
import type { FactorizedPlugin } from "./types"
import Plasma from "@rbxts/plasma"
import { RunService, UserInputService } from "@rbxts/services"

export interface MatterDebuggerConfig {
	/**
	 * The keycode used to open the debugger
	 * 
	 * @default {@link Enum.KeyCode.Quote}
	 */
	debuggerKeycode?: Enum.KeyCode
	/**
	 * Whether to ignore gameProcessedEvent when processing input to toggle the debugger
	 * 
	 * @default false
	 */
	debuggerKeycodeIgnoreConsumed?: boolean

	findInstanceFromEntity?: Debugger<never>["findInstanceFromEntity"]
	authorize?: Debugger<never>["authorize"]
}

export type MatterDebugger = FactorizedPlugin<typeof matterDebuggerFactory>
export function matterDebuggerFactory(config: MatterDebuggerConfig) {
	config.debuggerKeycode ??= Enum.KeyCode.Quote
	config.debuggerKeycodeIgnoreConsumed ??= false

	function setupDebuggerKeybind(matterDebugger: Debugger<never>) {
		if(!RunService.IsClient()) return
			
		UserInputService.InputEnded.Connect((input, consumed) => {
			if(consumed && !config.debuggerKeycodeIgnoreConsumed) return
			if(input.KeyCode !== config.debuggerKeycode) return

			matterDebugger.toggle()
		})
	}

	return class MatterDebugger extends GamePlugin {
		public debugger = new Debugger(Plasma)
		public widgets = this.debugger.getWidgets()

		public init() {
			this.debugger.findInstanceFromEntity = config.findInstanceFromEntity
			this.debugger.authorize = config.authorize

			// TODO: Find a better way of doing plugin factories/plugin configuration
			// Private methods/fields are not allowed on anonymous exports so we have
			// to do this
			setupDebuggerKeybind(this.debugger)

			this.debugger.autoInitialize(this.gameClass.loop)
		}

		public start() { /**/ }
	}
}
