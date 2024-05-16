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

export * from "./replicated"

export type GameLoop = Loop<[World, Widgets, Record<string, Route<any>>]>
export type RouteList = Record<string, Route<any>>

export default class MatterBootstrapper {
	public readonly world = new World()
	private readonly hotReload: MatterHotReload
	private readonly debugger: MatterDebugger
	private readonly replication: MatterReplication
	private readonly loop: GameLoop = new Loop()
	private readonly widgets!: Widgets
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
		this.loop = new Loop(this.world, this.widgets, this.routes)

		this.hotReload = new MatterHotReload(this.loop, this.systemContainer)
		this.replication = new MatterReplication(this.loop, this.routes, this.components)
		this.debugger = new MatterDebugger(this.loop)

		this.widgets = this.debugger.debugger.getWidgets()

		enableHotReload ? this.hotReload.setupHotReload() : this.loop.scheduleSystems(this.systems)
		enableDebugger && this.debugger.setupDebugger(debuggerKeycode)
		enableReplication ? this.replication.setupReplication() : Net.start(this.loop, this.routes)

		this.loop.begin({
			default: RunService.Heartbeat
		})
	}
}
