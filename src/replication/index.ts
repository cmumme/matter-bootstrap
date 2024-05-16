import type { GameLoop, RouteList } from ".."
import Net, { Route } from "@rbxts/yetanothernet"
import { ComponentList } from "../utils"
import { MATTER_REPLICATION_ROUTE_NAME } from "../constants"
import { RunService } from "@rbxts/services"
import componentsReplicateSystemFactory from "./componentsReplicate"
import componentsReceiveSystemFactory from "./componentsReceive"

export default class MatterReplication {
	public constructor(
        private readonly loop: GameLoop,
        private readonly routes: RouteList,
        private readonly components: ComponentList
	) { }

	public setupReplication() {
		this.routes[MATTER_REPLICATION_ROUTE_NAME] = new Route({ Event: "default", Channel: "Reliable" })
		Net.start(this.loop, this.routes)

		this.loop.scheduleSystem(
			RunService.IsServer() ?
				componentsReplicateSystemFactory(this.components) :
				componentsReceiveSystemFactory(this.components)
		)
	}
}
