import type { GameLoop, RouteList } from ".."
import Net, { Route } from "@rbxts/yetanothernet"
import { ComponentList } from "../utils"
import { MATTER_REPLICATION_ROUTE_NAME } from "../constants"
import { RunService } from "@rbxts/services"
import componentsReplicateSystemFactory from "./componentsReplicate"
import componentsReceiveSystemFactory from "./componentsReceive"

export default class MatterReplication {
	public setupReplication(loop: GameLoop, routes: RouteList, components: ComponentList) {
		routes[MATTER_REPLICATION_ROUTE_NAME] = new Route({ Event: "default", Channel: "Reliable" })
		Net.start(loop, routes)

		loop.scheduleSystem(
			RunService.IsServer() ?
				componentsReplicateSystemFactory(components) :
				componentsReceiveSystemFactory(components)
		)
	}
}
