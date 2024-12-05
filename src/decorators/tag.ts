import { Reflect } from "@rbxts/experimental-reflect"
import { TAG_METADATA_KEY } from "../constants"
import { RunService } from "@rbxts/services"

export function Tag(tag: string, clientAvailable = false) {
	return (target: object, propertyKey: string | symbol) => {
		if (RunService.IsClient() && !clientAvailable) return
		return Reflect.metadata(TAG_METADATA_KEY, tag)(target, propertyKey)
	}
}
