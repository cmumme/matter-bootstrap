import { Reflect } from "@rbxts/experimental-reflect"
import { REPLICATED_METADATA_KEY } from "../constants"

/**
 * Marks the target component as replicated
 */
export function Replicated(target: object, propertyKey: string | symbol) {
	return Reflect.metadata(REPLICATED_METADATA_KEY, true)(target, propertyKey)
}
