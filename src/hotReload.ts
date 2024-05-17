import { AnySystem } from "@rbxts/matter"
import { Context, HotReloader } from "@rbxts/rewire"
import type { GameLoop } from "."

export default class MatterHotReload {
	private readonly hotReloader = new HotReloader()
	private readonly systemsByModule: Map<ModuleScript, AnySystem> = new Map()
	private firstRunSystems?: AnySystem[] = [ ]

	// https://eryn.io/matter/docs/Guides/HotReloading#set-up-rewire
	private hotReloadCallback(loop: GameLoop, module: ModuleScript, context: Context) {
		const originalModule = context.originalModule
		const originalSystem = this.systemsByModule.get(originalModule)
		const [success, newSystem] = pcall(require, module) as LuaTuple<[boolean, AnySystem]> // Make sure the module doesn't throw

		if(!success) throw newSystem

		if(this.firstRunSystems) // Pool systems on the first run so they can be scheduled one-shot
			this.firstRunSystems.push(newSystem)
		else if(originalSystem) // System already loaded, have to replace
			loop.replaceSystem(originalSystem, newSystem)
		else // It is a new system, simply schedule it
			loop.scheduleSystem(newSystem)
		
		this.systemsByModule.set(originalModule, newSystem)
	}

	// https://eryn.io/matter/docs/Guides/HotReloading#set-up-rewire
	private hotReloadCleanup(loop: GameLoop, _: ModuleScript, context: Context) {
		if(context.isReloading) return // We only want to clean up if it's being removed entirely, not reloaded

		const dyingModule = context.originalModule
		const dyingSystem = this.systemsByModule.get(dyingModule)
		if(!dyingSystem) return

		loop.evictSystem(dyingSystem)
		this.systemsByModule.delete(dyingModule)
	}

	public setupHotReload(loop: GameLoop, systemContainer: Folder) {
		this.hotReloader.scan(
			systemContainer,
			(...args) => this.hotReloadCallback(loop, ...args),
			(...args) => this.hotReloadCleanup(loop, ...args)
		)
		if(!this.firstRunSystems) throw "firstRunSystems is undefined. Cannot fully setup hot reload."
		loop.scheduleSystems(this.firstRunSystems)
		this.firstRunSystems = undefined
	}
}
