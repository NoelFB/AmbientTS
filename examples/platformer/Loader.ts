/// <reference path="../../ambient/AmScene.ts"/>
/// <reference path="../../ambient/Ambient.ts"/>

class Loader extends AmScene
{
	public percent:number = 0;

	constructor()
	{
		super();

		assets.AddTexture("grass", "textures/grass.png");
		assets.AddTexture("player", "textures/player.png");
		assets.Load(null, null);
	}

	public Begin()
	{
		Am.scene = new AmScene();
		Am.scene.Add(new Terrain());
		Am.scene.Add(new Creature());
	}

	public Update()
	{
		if (this.percent < assets.percent)
			this.percent += Am.deltaTime;
		if (this.percent >= assets.percent && assets.percent >= 1)
			this.Begin();
	}

	public Render()
	{
		Am.context.fillStyle = "#ffffff";
		Am.context.fillRect(0, Am.height / 2 - 4, Am.width * this.percent, 8);
		for (var i = 0; i < 10; i ++)
		{
			Am.context.globalAlpha = (1 - (i / 10)) / 16;
			Am.context.fillRect(0, Am.height / 2 - 4 - i, Am.width * this.percent, 8 + i * 2);
		}
		Am.context.globalAlpha = 1;
	}
}