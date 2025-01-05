import { AnyComponent, AnyEntity, World } from "@rbxts/matter"
import { Widgets } from "@rbxts/plasma"
import { Route } from "@rbxts/yetanothernet"
import { WorldPayload } from "./payloads"
import Object from "@rbxts/object-utils"
import { _MATTER_REPLICATION_ROUTE_NAME } from "./constants"
import { ComponentCtor } from "@rbxts/matter/lib/component"
import { Network } from "../network"
import { Game } from "../../game"

export default function componentsReceiveSystemFactory(components: Record<string, ComponentCtor>, networking: Network) {
	const entityIdMap = new Map<string, AnyEntity>()
	const worldReplicationRoute = networking.routes[_MATTER_REPLICATION_ROUTE_NAME] as Route<[WorldPayload]>

	return {
		// https://eryn.io/matter/docs/Guides/Replication/#receiving-replication-on-the-client
		system: ({ world }: Game<never>) => {
			for (const [_, _1, entities] of worldReplicationRoute.query()) {
				for (const [serverEntityId, componentMap] of Object.entries(entities)) {
					let clientEntityId = entityIdMap.get(serverEntityId)

					if(clientEntityId && !next(componentMap)) { // Entity was despawned on the server, despawn it here as well
						world.despawn(clientEntityId)

						entityIdMap.delete(serverEntityId)
						continue
					}

					const componentsToInsert: AnyComponent[] = [ ]
					const componentsToRemove: ComponentCtor[] = [ ]

					for (const [name, container] of Object.entries(componentMap)) { // Collect a diff on the components within this entity (which need to be added/removed)
						if(container.data) {
							componentsToInsert.push((components[name] as (...args: unknown[])=>AnyComponent)(container.data))
						} else { // Component was deleted on the server
							componentsToRemove.push(components[name])
						}
					}

					if(!clientEntityId) { // This is a new entity
						clientEntityId = world.spawn(...componentsToInsert)

						entityIdMap.set(serverEntityId, clientEntityId)
					} else { // This is an old entity
						if(componentsToInsert.size() > 0) {
							world.insert(clientEntityId, ...componentsToInsert)
						}
						if(componentsToRemove.size() > 0) {
							world.remove(clientEntityId, ...componentsToRemove)
						}
					}
				}
			}
		},
		priority: math.huge // Run last
	}
}
