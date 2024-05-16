import { World, useEvent, AnyEntity, AnyComponent } from "@rbxts/matter"
import Object from "@rbxts/object-utils"
import { Widgets } from "@rbxts/plasma"
import { Players } from "@rbxts/services"
import { Route } from "@rbxts/yetanothernet"
import { MATTER_REPLICATION_ROUTE_NAME } from "../constants"
import { ComponentList, replicatedComponentsIn } from "../utils"
import { EntityPayload, WorldPayload } from "./payloads"

export default function componentsReplicateSystemFactory(components: ComponentList) {
	return {
		// https://eryn.io/matter/docs/Guides/Replication#replicating-changes-to-the-clients
		system: (world: World, _: Widgets, routes?: Record<string, Route<any>>) => {
			if(!routes) throw "No routes passed to the componentsReplicate system! Cannot proceed"
	
			const worldReplicationRoute = routes[MATTER_REPLICATION_ROUTE_NAME]
			const replicatedComponents = replicatedComponentsIn(components)
	
			// Replicate the entire world to new players
			for (const [_, player] of useEvent(Players, "PlayerAdded")) {
				const payload: WorldPayload = { }
	
				for (const [entityId, components] of world) {
					const entityPayload: EntityPayload = { }
	
					for (const [component, componentData] of components) {
						if(!Object.values(replicatedComponents).includes(component)) continue
	
						entityPayload[tostring(component)] = { data: componentData }
					}
	
					payload[tostring(entityId)] = entityPayload
				}

				worldReplicationRoute.send(payload).to(player)
			}
	
			// Replicate changes as needed
			const diff: WorldPayload = { }
	
			Object.values(replicatedComponents).forEach(component => {
				for (const [entityId, record] of world.queryChanged(component)) {
					const entityStringId = tostring(entityId) // have to convert number to string in order to send via remote
					const componentName = tostring(component)

					diff[entityStringId] ??= {}
	
					if(!world.contains(entityId) && record.new !== undefined) continue
	
					diff[entityStringId][componentName] = { data: record.new }
				}
			})
	
			if(!next(diff)) return
			worldReplicationRoute.send(diff)
		},
		priority: math.huge // Run last
	}
}