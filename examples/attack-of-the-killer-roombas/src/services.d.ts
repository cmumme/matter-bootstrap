// Typings for the DataModel. Ensure this always matches our Rojo project
interface ReplicatedStorage extends Instance {
	Assets: Folder&{
		Mothership: Model,
		KillerRoomba: Model
	}
}

interface ServerScriptService extends Instance {
	TS: Folder&{
		systems: Folder
	}
}

interface StarterPlayer extends Instance {
	StarterPlayerScripts: StarterPlayerScripts&{
		TS: Folder&{
			systems: Folder
		}
	}
}
