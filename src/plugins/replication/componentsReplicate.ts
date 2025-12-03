import { World, useEvent, AnyEntity, AnyComponent } from "@rbxts/matter"
import Object from "@rbxts/object-utils"
import { Widgets } from "@rbxts/plasma"
import { Players } from "@rbxts/services"
import { Route } from "@rbxts/yetanothernet"
import { EntityPayload, WorldPayload } from "./payloads"
import { _MATTER_REPLICATION_ROUTE_NAME, _REPLICATED_METADATA_KEY } from "./constants"
import { ComponentCtor } from "@rbxts/matter/lib/component"
import { Reflect } from "@rbxts/experimental-reflect"
import { Game } from "../../game"
import { Network } from "../network"

/**
 * Fetches components decorating with ``decorationKey`` within a list of components
 * 
 * @param components The list of components
 * @param decorationKey The metadata key that the decorator applies
 * @returns A subset of ``components`` including only components that are marked as decorated with ``decorationKey``
 */
export const decoratedComponentsIn = (components: Record<string, ComponentCtor>, decorationKey: string) => {
	const decoratedComponents = { } as Record<string, ComponentCtor>

	for (const [componentKey, component] of Object.entries(components)) {
		const isDecorated = Reflect.getMetadata(decorationKey, components, componentKey)
		if(!isDecorated) continue
	
		decoratedComponents[componentKey] = component
	}

	return decoratedComponents
}


export default function componentsReplicateSystemFactory(components: Record<string, ComponentCtor>, networking: Network) {
	return {
		// https://eryn.io/matter/docs/Guides/Replication#replicating-changes-to-the-clients
		system: ({ world }: Game<never>) => {	
			const worldReplicationRoute = networking.routes[_MATTER_REPLICATION_ROUTE_NAME]
			const replicatedComponents = decoratedComponentsIn(components, _REPLICATED_METADATA_KEY)
	
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
	
					if(!world.contains(entityId)) continue
	
					diff[entityStringId][componentName] = { data: record.new }
				}
			})
	
			if(Object.keys(diff).size() <= 0) return
			worldReplicationRoute.send(diff)
		},
		priority: math.huge // Run last
	}
}
