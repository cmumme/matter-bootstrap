/*
	MatterBootstrapper.ts
	@author typechecked
	@date 5/12/2024

	A simple class that handles everything needed to bootstrap a Matter world including hot-reloading, live debug, networking, and component replication
*/

import { Loader } from "@rbxts/loader"
import { Loop, AnySystem, World } from "@rbxts/matter"
import { Widgets } from "@rbxts/plasma"
import { RunService } from "@rbxts/services"
import Net, { Route } from "@rbxts/yetanothernet"
import { ComponentList } from "./utils"
import MatterHotReload from "./hotReload"
import MatterDebugger from "./debugger"
import MatterReplication from "./replication"
import MatterCollectionService from "./collectionService"

export * from "./decorators"

export type GameLoop = Loop<[World, Widgets, Record<string, Route<any>>]>
export type RouteList = Record<string, Route<any>>

export default class MatterBootstrapper {
	public readonly world = new World()
	private readonly collectionService: MatterCollectionService
	private readonly hotReload: MatterHotReload
	private readonly debugger: MatterDebugger
	private readonly replication: MatterReplication
	private readonly loop: GameLoop = new Loop()
	private readonly widgets: Widgets
	private readonly systems: AnySystem[]

	public constructor(
		private readonly systemContainer: Folder,
		private readonly components: ComponentList | any,
		private readonly routes: RouteList = { },
		enableReplication = true,
		enableHotReload = RunService.IsStudio(),
		enableDebugger = true,
		debuggerKeycode = Enum.KeyCode.BackSlash
	) {
		this.systems = Loader.Load(this.systemContainer)

		this.debugger = new MatterDebugger()
		this.widgets = this.debugger.debugger.getWidgets()
		this.loop = new Loop(this.world, this.widgets, this.routes)

		this.collectionService = new MatterCollectionService(this.world, this.components)
		this.hotReload = new MatterHotReload(this.loop, this.systemContainer)
		this.replication = new MatterReplication(this.loop, this.routes, this.components)
		
		enableHotReload ? this.hotReload.setupHotReload() : this.loop.scheduleSystems(this.systems)
		enableDebugger && this.debugger.setupDebugger(this.loop, debuggerKeycode)
		enableReplication ? this.replication.setupReplication() : Net.start(this.loop, this.routes)

		this.loop.begin(RunService.IsServer() ? {
			default: RunService.Heartbeat,
			preSimulation: RunService.PreSimulation,
			preAnimation: RunService.PreAnimation,
			heartbeat: RunService.Heartbeat,
			postSimulation: RunService.PostSimulation,
			stepped: RunService.Stepped
		} : {
			default: RunService.Heartbeat,
			preRender: RunService.PreRender,
			preSimulation: RunService.PreSimulation,
			preAnimation: RunService.PreAnimation,
			renderStepped:  RunService.RenderStepped,
			heartbeat: RunService.Heartbeat,
			postSimulation: RunService.PostSimulation,
			stepped: RunService.Stepped
		})

		this.collectionService.setupCollectionService()
	}
}
