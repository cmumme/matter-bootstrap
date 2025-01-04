import { useThrottle } from "@rbxts/matter"
import { ReplicatedStorage, Workspace } from "@rbxts/services"
import components from "shared/components"

export = function({ world }: AttackOfTheKillerRoombas) {
	// Handle Transform added/changed to existing entity with Model
	for(const [id, transformRecord] of world.queryChanged(components.Transform)) {
		if(!world.contains(id)) continue

		const model = world.get(id, components.Model)
		if(!model) continue

		if(transformRecord.new && !transformRecord.new.doNotReconcile) {
			model.model.PivotTo(transformRecord.new.cframe)
		}
	}

	// Handle Model added/changed on existing entity with Transform
	for(const [id, modelRecord] of world.queryChanged(components.Model)) {
		if(!world.contains(id)) continue

		const transform = world.get(id, components.Transform)
		if(!transform) continue

		if(modelRecord.new) {
			modelRecord.new.model.PivotTo(transform.cframe)
		}
	}

	// Update Transform on unanchored Models
	for(const [id, model, transform] of world.query(components.Model, components.Transform)) {
		if(!model.model.PrimaryPart || model.model.PrimaryPart.Anchored) continue

		const existingCFrame = transform.cframe
		const currentCFrame = model.model.GetPivot()

		// Despawn models that fall into the void
		if(currentCFrame.Y < -400) {
			world.despawn(id)
			continue
		}

		if(currentCFrame !== existingCFrame) {
			world.insert(
				id,
				components.Transform({
					cframe: currentCFrame,
					doNotReconcile: true
				})
			)
		}
	}
}
