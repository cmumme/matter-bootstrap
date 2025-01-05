import { ComponentCtor } from "@rbxts/matter/lib/component"
import { Game, GamePlugin } from "../../game"
import { Network } from "../network"
import type { FactorizedPlugin } from "../types"
import Net, { Route } from "@rbxts/yetanothernet"
import { RunService } from "@rbxts/services"
import componentsReplicateSystemFactory from "./componentsReplicate"
import componentsReceiveSystemFactory from "./componentsReceive"
import { Reflect } from "@rbxts/experimental-reflect"
import { _MATTER_REPLICATION_ROUTE_NAME, _REPLICATED_METADATA_KEY } from "./constants"

export interface ReplicationConfig {
	/**
	 * The list of components. Only replicates components annotated with the ``@Replicated`` decorator
	 */
	components: Record<string, ComponentCtor>
}

export function Replicated(target: object, propertyKey: string | symbol) {
	return Reflect.metadata(_REPLICATED_METADATA_KEY, true)(target, propertyKey)
}


export type Replication = FactorizedPlugin<typeof replicationFactory>
export function replicationFactory(config: ReplicationConfig) {
	function getNetworkingPlugin(gameClass: Game<{
		networking?: Network,
		network?: Network,
		replication?: Replication
	}>) {
		assert(gameClass.plugins.replication, `The Replication plugin must be called "replication"`)

		const network = gameClass.plugins["networking"] || gameClass.plugins["network"]
		assert(network, `The Replication plugin depends on the Network plugin. Ensure you have included it in your game's plugin list under the name "networking" or "network"`)

		return network as Network
	}

	return class MatterReplication extends GamePlugin {
		public init() {
			const networking = getNetworkingPlugin(this.gameClass)
			networking.routes[_MATTER_REPLICATION_ROUTE_NAME] = new Route({
				Channel: "Reliable",
				Event: "default"
			})

			this.gameClass.loop.scheduleSystem(
				RunService.IsServer() ?
					componentsReplicateSystemFactory(config.components, networking) :
					componentsReceiveSystemFactory(config.components, networking)
			)
			Net.start(this.gameClass.loop, networking.routes)
		}

		public start() { /**/ }
	}
}
