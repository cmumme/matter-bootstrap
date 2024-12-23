import { Loader } from "@rbxts/loader"
import { Loop, AnySystem, World, AnyComponent } from "@rbxts/matter"
import Object from "@rbxts/object-utils"
import { RunService } from "@rbxts/services"

const CURRENT_RUNTIME_LOOP_EVENTS = RunService.IsServer() ? {
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
}

export type ComponentList = Record<string, (...args: any[]) => AnyComponent>
export type GamePluginCtor<T extends GamePlugin = GamePlugin> = new (game: Game<never>) => T

/**
 * Construction options for Game
 */
export interface GameConfig<T extends { [name: string]: GamePlugin }> {
	/**
	 * The folder containing the games systems
	 */
	systemsFolder: Folder
	/**
	 * A table of all components in the game
	 * 
	 * @optional
	 */
	componentList?: ComponentList
	/**
	 * A table of all plugin constructors to 
	 * 
	 * @optional
	 */
	plugins?: {
		[K in keyof T]: GamePluginCtor<T[K]>
	}
}

/**
 * The base class for all game plugins
 */
export abstract class GamePlugin {
	public constructor(
		public gameClass: Game<never>
	) { }

	/**
	 * Runs once before the Matter Loop has begun
	 */
	abstract init(): void
	/**
	 * Runs once after the Matter Loop has begun
	 */
	abstract start(): void
}

/**
 * Bootstraps the game world
 * 
 * @example
 * ```ts
 * // src/bootstrap.server.ts
 * import { ServerStorage } from "@rbxts/services"
 * import { Game } from "@rbxts/matter-bootstrap"
 * import { Replication } from "@rbxts/matter-bootstrap/plugins"
 * import Components from "shared/components"
 * 
 * new Game<GamePlugins>({
 * 	systemsFolder: ServerStorage.systems,
 * 	componentList: Components,
 * 	plugins: {
 * 		replication: Replication({ }),
 * 	},
 * }).begin()
 * ```
 * 
 * ```ts
 * // src/systems/sayHelloToPlayers.ts
 * import Components from "shared/components"
 * 
 * export = function(exampleGame: ExampleGame) {
 * 	for(const [,playerRecord] in exampleGame.world.queryChanged(Components.Player)) {
 * 		if(playerRecord.new && !playerRecord.old) {
 * 			// player has joined!
 * 			exampleGame.plugins.networking.send(playerRecord.new.instance, "hello")
 * 		}
 * 	}
 * }
 * ```
 * 
 * ```ts
 * // src/shared/components.ts
 * export = {
 * 	Player: new component("Player")
 * }
 * ```
 * 
 * ```ts
 * // src/game.d.ts
 * type ExampleGame = Game<{
 * 	networking: Network,
 * 	playerEntities: PlayerEntities
 * }>
 * ```
 */
export class Game<T extends { [name: string]: GamePlugin }> {
	public readonly world = new World()
	public readonly plugins: T = { } as T
	public readonly components: ComponentList
	public readonly loop: Loop<[ Game<T> ]>
	private readonly systems: AnySystem[]

	public constructor(
		private readonly config: GameConfig<T>
	) {
		this.components = config.componentList ?? { }
		this.systems = Loader.Load(config.systemsFolder)
		this.loop = new Loop(this)

		this.loadPlugins()
	}

	public begin() {
		this.dispatchPluginEvent("init")
		this.beginLoop()
		this.dispatchPluginEvent("start")
	}

	private beginLoop() {
		this.loop.scheduleSystems(this.systems)
		this.loop.setWorlds([ this.world ])

		this.loop.begin(CURRENT_RUNTIME_LOOP_EVENTS as never)
	}

	private loadPlugins() {
		const pluginEntries = Object.entries(this.config.plugins ?? { } as T) as [
			keyof T,
			GamePluginCtor<T[keyof T]>
		][]
					
		pluginEntries.forEach(([pluginName, plugin]) => {
			this.plugins[pluginName] = new plugin(this as never)
		})
	}

	private dispatchPluginEvent(event: "init" | "start") {
		Object.entries(this.plugins).forEach(([, plugin]) => {
			(plugin as GamePlugin)[event]()
		})
	}
}
