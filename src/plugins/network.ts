import Net, { Route } from "@rbxts/yetanothernet"
import { Game, GamePlugin } from "../game"
import type { FactorizedPlugin } from "./types"
import type { Replication } from "./replication"

export type RouteList = Record<string, Route<any>>
export interface NetworkConfig<Y extends RouteList> {
	routes?: Y
}

export type Network = FactorizedPlugin<typeof networkFactory>
export function networkFactory<Y extends RouteList>(config: NetworkConfig<Y>) {
	config.routes ??= { } as Y

	return class Network<T extends RouteList = Y> extends GamePlugin {
		public readonly routes: T

		public constructor(gameClass: Game<never>) {
			super(gameClass)

			this.routes = (config.routes ?? { }) as T
		}

		public init() {
			// let replication handle init otherwise, it needs to inject some routes
			if(!(this.gameClass.plugins as {
				replication?: Replication
			}).replication) Net.start(this.gameClass.loop, this.routes)
		}

		public start() { /**/ }
	}
}
