import type { Game } from "../game"

/**
 * Allows for plugin factories return class to be easily typed. Enables proper
 * typing of a {@link Game} utilizing plugin factories.
 * 
 * @example
 * ```ts
 * export type Debugger = FactorizedPlugin<typeof debuggerFactory> // dev will use this type in their typing of Game<...>
 * export function debuggerFactory(config: DebuggerConfig) {
 * 	return class Debugger extends GamePlugin {
 * 		public myMethod() {
 * 			//
 * 		}
 * 		public init() {
 * 			//
 * 		}
 * 		public start() {
 * 			//
 * 		}
 * 	}
 * }
 * ```
 */
export type FactorizedPlugin<T extends Callback> = InstanceType<ReturnType<T>>
