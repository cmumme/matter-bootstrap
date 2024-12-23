import components from "shared/components"

// Greets new players
export = function({ world }: HelloWorldGame) {
	for(const [,playerRecord] of world.queryChanged(components.Player)) {
		if(playerRecord.new && !playerRecord.old) {
			// Player has just spawned, greet them!
			const player = playerRecord.new.instance
			print(`Hello, ${player.DisplayName} (@${player.Name})`)
		}
	}
}
