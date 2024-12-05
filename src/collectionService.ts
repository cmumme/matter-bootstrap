import Object from "@rbxts/object-utils"
import type { GameLoop } from "."
import { ComponentList, decoratedComponentsIn } from "./utils"
import { ComponentCtor } from "@rbxts/matter/lib/component"
import { TAG_METADATA_KEY } from "./constants"
import { Reflect } from "@rbxts/experimental-reflect"
import { CollectionService } from "@rbxts/services"
import { AnyEntity, World } from "@rbxts/matter"

export default class MatterCollectionService {
	private readonly tagToComponentCtorMap = new Map<string, ComponentCtor>()

	public constructor(
        private readonly world: World,
		private readonly components: ComponentList
	) { }

	private spawn(componentCtor: ComponentCtor, instance: Instance) {
		const entity = this.components.Model ? this.world.spawn(
			componentCtor(),
			this.components.Model({
				instance: instance
			})
		) : this.world.spawn(componentCtor())

		instance.SetAttribute("entityId", entity)
	}

	private setupSpawning() {
		for (const [tag, componentCtor] of this.tagToComponentCtorMap) {
			for (const instance of Object.values(CollectionService.GetTagged(tag))) {
				this.spawn(componentCtor, instance)
			}

			CollectionService.GetInstanceAddedSignal(tag).Connect(instance => this.spawn(componentCtor, instance))
			CollectionService.GetInstanceRemovedSignal(tag).Connect(instance => {
				const entity = instance.GetAttribute("entityId") as AnyEntity
				if(!entity) return warn(`No entityId attribute for ${instance.GetFullName()}`)
				
				this.world.despawn(entity)
			})
		}
	}

	private setupMap() {
		for (const [componentKey, componentCtor] of Object.entries(decoratedComponentsIn(this.components, TAG_METADATA_KEY))) {
			const tag = Reflect.getMetadata(TAG_METADATA_KEY, this.components, componentKey) as string
			this.tagToComponentCtorMap.set(tag, componentCtor)
		}
	}

	public setupCollectionService() {
		this.setupMap()
		this.setupSpawning()
	}
}
