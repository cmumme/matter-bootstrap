import { Loader } from "@rbxts/loader"
import { Loop, AnySystem, World } from "@rbxts/matter"
import { Widgets } from "@rbxts/plasma"
import { RunService } from "@rbxts/services"
import { Route, start as netStart } from "@rbxts/yetanothernet"
import { ComponentList } from "./utils"
import MatterHotReload from "./hotReload"
import MatterDebugger from "./debugger"
import MatterReplication from "./replication"

export type RouteList = Record<string, Route<any>>
export type GameLoop<T extends RouteList = RouteList> = Loop<[World, Widgets, T]>
export interface MatterConfiguration {
	routes: RouteList,

	replication: boolean,
	hotReload: boolean,
	debugger: boolean,

	debuggerKeycode: Enum.KeyCode
}

/**
 * A simple class that handles everything needed to bootstrap a Matter world
 * including hot-reloading, live debug, networking,
 * and component replication.
 */
export default class MatterBootstrap {
	public readonly world = new World()
	private readonly loop: GameLoop = new Loop()
	private readonly hotReload = new MatterHotReload()
	private readonly debugger = new MatterDebugger()
	private readonly replication = new MatterReplication()
	private readonly systems: AnySystem[]
	private readonly routes: RouteList

	/**
	 * Creates a new MatterBootstrap class and starts the game loop
	 * 
	 * @param systemContainer The Folder instance your system scripts are contained in. Recursive.
	 * @param components A class containing your Matter components as static fields.
	 * @param configuration The configuration options to use for this Matter setup.
	 */
	public constructor(
		private readonly systemContainer: Folder,
		private readonly components: ComponentList | any,
		private readonly configuration: MatterConfiguration
	) {
		this.systems = Loader.Load(this.systemContainer)
		this.routes = configuration.routes ?? { }
		this.loop = new Loop(
			this.world,
			this.debugger.debugger.getWidgets(),
			this.routes
		)

		this.setup()
		this.begin()
	}

	private setup() {
		this.configuration.hotReload ?
			this.hotReload.setupHotReload(
				this.loop,
				this.systemContainer
			) :
			this.loop.scheduleSystems(this.systems)

		this.configuration.debugger &&
			this.debugger.setupDebugger(
				this.loop,
				this.configuration.debuggerKeycode
			)

		this.configuration.replication ?
			this.replication.setupReplication(
				this.loop,
				this.routes,
				this.components
			) :
			netStart(
				this.loop,
				this.routes
			)
	}

	private begin() {
		this.loop.begin({
			default: RunService.Heartbeat
		})
	}
}
