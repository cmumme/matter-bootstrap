import { Reflect } from "@rbxts/experimental-reflect"
import Object from "@rbxts/object-utils"
import { REPLICATED_METADATA_KEY } from "./constants"
import { AnyComponent } from "@rbxts/matter/lib/component"

export type ComponentList = Record<string, (...args: any[]) => AnyComponent>

/**
 * Fetches components marked as replicated with the \@Replicated decorator within a list of components
 * 
 * @param components The list of components
 * @returns A subset of ``components`` including only components that are marked as Replicated (\@Replicated decorator)
 */
export const replicatedComponentsIn = (components: ComponentList) => {
	const replicatedComponents = { } as ComponentList

	for (const [componentKey, component] of Object.entries(components) as [string, any]) {
		const isReplicated = Reflect.getMetadata(REPLICATED_METADATA_KEY, components, componentKey as string) as boolean
		if(!isReplicated) continue
	
		replicatedComponents[componentKey as string] = component
	}

	return replicatedComponents
}
