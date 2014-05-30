/// <reference path="../../ambient/utils/AmAssets.ts"/>
/// <reference path="../../ambient/AmScene.ts"/>
/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="Loader.ts"/>
/// <reference path="Creature.ts"/>
/// <reference path="Terrain.ts"/>

// asset holder
var assets:AmAssets = new AmAssets();

// start
new Ambient("Ambient JS Game Test", 160, 120, 4, 60);
Am.Run();
Am.SetScene(new Loader());

