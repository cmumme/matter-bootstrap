import { useEvent, useThrottle } from "@rbxts/matter"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import components from "shared/components"

export = function({ world }: AttackOfTheKillerRoombas) {
	for(const [id,model] of world.query(components.Model)) {
		for(const [,] of useEvent(model.model, "AncestryChanged")) {
			if(!model.model.IsDescendantOf(game)) {
				world.remove(id, components.Model)
				break
			}
		}
	}

	for(const [,modelRecord] of world.queryChanged(components.Model)) {
		if(!modelRecord.new) {
			if(modelRecord.old && modelRecord.old.model) {
				modelRecord.old.model.Destroy()
			}
		}
	}
}
