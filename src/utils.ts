import { Reflect } from "@rbxts/experimental-reflect"
import Object from "@rbxts/object-utils"
import { AnyComponent } from "@rbxts/matter/lib/component"

export type ComponentList = Record<string, (...args: any[]) => AnyComponent>

/**
 * Fetches components decorating with ``decorationKey`` within a list of components
 * 
 * @param components The list of components
 * @param decorationKey The metadata key that the decorator applies
 * @returns A subset of ``components`` including only components that are marked as decorated with ``decorationKey``
 */
export const decoratedComponentsIn = (components: ComponentList, decorationKey: string) => {
	const decoratedComponents = { } as ComponentList

	for (const [componentKey, component] of Object.entries(components)) {
		const isDecorated = Reflect.getMetadata(decorationKey, components, componentKey)
		if(!isDecorated) continue
	
		decoratedComponents[componentKey] = component
	}

	return decoratedComponents
}
