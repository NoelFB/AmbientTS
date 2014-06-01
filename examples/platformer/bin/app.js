var AmAssetInfo = (function () {
    function AmAssetInfo(name, file) {
        this.name = name;
        this.file = file;
    }
    return AmAssetInfo;
})();

var AmAssets = (function () {
    function AmAssets() {
        this.textures = {};
        this.sounds = {};
        this._textures = new Array();
        this._sounds = new Array();
        this._steps = 0;
        this._required = 0;
    }
    AmAssets.prototype.AddTexture = function (name, file) {
        this._textures.push(new AmAssetInfo(name, file));
        this._required++;
    };

    AmAssets.prototype.AddSound = function (name, file) {
        this._sounds.push(new AmAssetInfo(name, file));
        this._required++;
    };

    AmAssets.prototype.Load = function (onUpdate, onComplete) {
        var _this = this;
        this._steps = 0;
        this._onUpdate = onUpdate;
        this._onComplete = onComplete;

        for (var i = 0; i < this._textures.length; i++) {
            var texture = new Image();
            texture.onload = function () {
                return _this.Step();
            };
            texture.src = this._textures[i].file;

            this.textures[this._textures[i].name] = texture;
        }

        for (var i = 0; i < this._sounds.length; i++) {
            var sound = new Audio(this._sounds[i].file);
            sound.onloadeddata = function () {
                return _this.Step();
            };
            sound.src = this._sounds[i].file;

            this.sounds[this._sounds[i].name] = sound;
        }

        this._textures = new Array();
        this._sounds = new Array();
    };

    AmAssets.prototype.Step = function () {
        this._steps++;
        this.percent = this._steps / this._required;
        if (this._onUpdate != null)
            this._onUpdate(this);

        if (this._steps == this._required) {
            this.percent = 1;
            if (this._onComplete != null)
                this._onComplete(this);
            this._required = 0;
        }
    };
    return AmAssets;
})();
var AmPoint = (function () {
    function AmPoint(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    AmPoint.prototype.Add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };

    AmPoint.prototype.Subtract = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    };

    AmPoint.prototype.Multiply = function (other) {
        this.x *= other.x;
        this.y *= other.y;
    };

    AmPoint.prototype.Length = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    AmPoint.prototype.Normalize = function () {
        var length = this.Length();
        this.x /= length;
        this.y /= length;
    };

    AmPoint.Add = function (a, b) {
        return new AmPoint(a.x + b.x, a.y + b.y);
    };

    AmPoint.Subtract = function (a, b) {
        return new AmPoint(a.x - b.x, a.y - b.y);
    };

    AmPoint.Multiply = function (a, b) {
        return new AmPoint(a.x * b.x, a.y * b.y);
    };

    AmPoint.Length = function (a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    };

    AmPoint.Zero = function () {
        return new AmPoint(0, 0);
    };

    AmPoint.One = function () {
        return new AmPoint(1, 1);
    };
    return AmPoint;
})();
var AmMouse = (function () {
    function AmMouse(canvas) {
        var _this = this;
        this.position = new AmPoint(0, 0);
        this.leftPressed = false;
        this.leftReleased = false;
        this.leftDown = false;
        this.rightPressed = false;
        this.rightReleased = false;
        this.rightDown = false;
        this.treatTouchAsMouse = true;
        this.canvas = canvas;

        this.canvas.onmousedown = function (e) {
            if (("which" in e && e.which == 3) || ("button" in e && e.button == 2)) {
                _this.rightPressed = true;
                _this.rightDown = true;
            } else {
                _this.leftPressed = true;
                _this.leftDown = true;
            }
        };

        this.canvas.onmouseup = function (e) {
            if (("which" in e && e.which == 3) || ("button" in e && e.button == 2)) {
                _this.rightReleased = true;
                _this.rightDown = false;
            } else {
                _this.leftReleased = true;
                _this.leftDown = false;
            }
        };

        this.canvas.onmousemove = function (e) {
            var viewScale = Am.GetViewportScale();
            var viewOffset = Am.GetViewportOffset();
            _this.position = new AmPoint((e.offsetX - viewOffset.x) / viewScale + Am.camera.x, (e.offsetY - viewOffset.y) / viewScale + Am.camera.y);
        };

        this.canvas.addEventListener("touchstart", function (e) {
            if (_this.treatTouchAsMouse) {
                _this.leftPressed = true;
                _this.leftDown = true;
            }
        });

        this.canvas.addEventListener("touchend", function (e) {
            if (_this.treatTouchAsMouse) {
                _this.leftReleased = true;
                _this.leftDown = false;
            }
        });

        this.canvas.addEventListener("touchmove", function (e) {
            if (_this.treatTouchAsMouse) {
                var viewScale = Am.GetViewportScale();
                var viewOffset = Am.GetViewportOffset();
                _this.position = new AmPoint((e.changedTouches[0].pageX - viewOffset.x) / viewScale + Am.camera.x, (e.changedTouches[0].pageX - viewOffset.y) / viewScale + Am.camera.y);
            }
        });
    }
    Object.defineProperty(AmMouse.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        set: function (value) {
            this.position.x = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AmMouse.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        set: function (value) {
            this.position.y = value;
        },
        enumerable: true,
        configurable: true
    });

    AmMouse.prototype.Clear = function () {
        this.leftPressed = false;
        this.leftReleased = false;
        this.rightPressed = false;
        this.rightReleased = false;
    };
    return AmMouse;
})();
var AmKeyboard = (function () {
    function AmKeyboard(canvas) {
        var _this = this;
        this._pressed = new Array(256);
        this._released = new Array(256);
        this._down = new Array(256);
        window.onkeyup = function (e) {
            _this._released[e.keyCode] = true;
            _this._down[e.keyCode] = false;
        };

        window.onkeydown = function (e) {
            if (!_this._down[e.keyCode]) {
                _this._pressed[e.keyCode] = true;
                _this._down[e.keyCode] = true;
            }
        };
    }
    AmKeyboard.prototype.Pressed = function (key) {
        return this._pressed[key];
    };

    AmKeyboard.prototype.Released = function (key) {
        return this._released[key];
    };

    AmKeyboard.prototype.Down = function (key) {
        return this._down[key];
    };

    AmKeyboard.prototype.Clear = function () {
        this._pressed = new Array(256);
        this._released = new Array(256);
    };
    return AmKeyboard;
})();

var AmKey = (function () {
    function AmKey() {
    }
    AmKey.BACKSPACE = 8;
    AmKey.TAB = 9;
    AmKey.ENTER = 13;
    AmKey.COMMAND = 15;
    AmKey.SHIFT = 16;
    AmKey.CONTROL = 17;
    AmKey.CAPS_LOCK = 20;
    AmKey.ESCAPE = 27;
    AmKey.SPACE = 32;
    AmKey.PAGE_UP = 33;
    AmKey.PAGE_DOWN = 34;
    AmKey.END = 35;
    AmKey.HOME = 36;
    AmKey.LEFT = 37;
    AmKey.UP = 38;
    AmKey.RIGHT = 39;
    AmKey.DOWN = 40;
    AmKey.INSERT = 45;
    AmKey.DELETE = 46;

    AmKey.A = 65;
    AmKey.B = 66;
    AmKey.C = 67;
    AmKey.D = 68;
    AmKey.E = 69;
    AmKey.F = 70;
    AmKey.G = 71;
    AmKey.H = 72;
    AmKey.I = 73;
    AmKey.J = 74;
    AmKey.K = 75;
    AmKey.L = 76;
    AmKey.M = 77;
    AmKey.N = 78;
    AmKey.O = 79;
    AmKey.P = 80;
    AmKey.Q = 81;
    AmKey.R = 82;
    AmKey.S = 83;
    AmKey.T = 84;
    AmKey.U = 85;
    AmKey.V = 86;
    AmKey.W = 87;
    AmKey.X = 88;
    AmKey.Y = 89;
    AmKey.Z = 90;

    AmKey.F1 = 112;
    AmKey.F2 = 113;
    AmKey.F3 = 114;
    AmKey.F4 = 115;
    AmKey.F5 = 116;
    AmKey.F6 = 117;
    AmKey.F7 = 118;
    AmKey.F8 = 119;
    AmKey.F9 = 120;
    AmKey.F10 = 121;
    AmKey.F11 = 122;
    AmKey.F12 = 123;
    AmKey.F13 = 124;
    AmKey.F14 = 125;
    AmKey.F15 = 126;

    AmKey.DIGIT_0 = 48;
    AmKey.DIGIT_1 = 49;
    AmKey.DIGIT_2 = 50;
    AmKey.DIGIT_3 = 51;
    AmKey.DIGIT_4 = 52;
    AmKey.DIGIT_5 = 53;
    AmKey.DIGIT_6 = 54;
    AmKey.DIGIT_7 = 55;
    AmKey.DIGIT_8 = 56;
    AmKey.DIGIT_9 = 57;

    AmKey.LEFT_SQUARE_BRACKET = 219;
    AmKey.RIGHT_SQUARE_BRACKET = 221;
    return AmKey;
})();
var Ambient = (function () {
    function Ambient(name, width, height, scale, fps) {
        this.camera = new AmPoint(0, 0);
        this.clear = "#0e2129";
        this.keepPixelScale = false;
        this.smoothing = false;
        this._scale = 1;
        this._scene = null;
        this._goto = null;
        this._fullscreen = false;
        Ambient.instance = this;
        Am = this;

        this.name = name;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.deltaTime = fps / 1000;
        this._scale = scale;
    }
    Ambient.prototype.Run = function () {
        var _this = this;
        window.onload = function () {
            document.head.title = _this.name + " :: Ambient TS";
            document.body.style.backgroundColor = "#222";

            _this.container = document.createElement("div");
            _this.container.style.width = (_this.width * _this.scale) + "px";
            _this.container.style.height = (_this.height * _this.scale) + "px";
            _this.container.style.margin = "auto";
            _this.container.style.marginTop = "80px";
            _this.container.style.boxShadow = "0px 0px 128px #444";
            _this.container.style.border = "1px solid #222";
            document.body.appendChild(_this.container);

            _this.canvasScaled = document.createElement("canvas");
            _this.canvasScaled.width = _this.width * _this.scale;
            _this.canvasScaled.height = _this.height * _this.scale;
            _this.container.appendChild(_this.canvasScaled);

            _this.canvas = document.createElement("canvas");
            _this.canvas.width = _this.width;
            _this.canvas.height = _this.height;
            _this.canvas.style.display = "none";
            _this.container.appendChild(_this.canvas);

            _this.contextScaled = _this.canvasScaled.getContext("2d");
            _this.context = _this.canvas.getContext("2d");

            _this.keyboard = new AmKeyboard(_this.canvas);
            _this.mouse = new AmMouse(_this.canvasScaled);

            _this.canvasScaled.oncontextmenu = function (e) {
                e.preventDefault();
            };

            _this._date = (new Date()).getTime();
            setInterval(function () {
                return _this.Loop();
            }, 1000 / _this.fps);

            window.onresize = function () {
                if (_this._fullscreen) {
                    _this.canvasScaled.width = document.documentElement.clientWidth;
                    _this.canvasScaled.height = document.documentElement.clientHeight;
                }
            };
        };
    };

    Object.defineProperty(Ambient.prototype, "scene", {
        get: function () {
            if (this._goto != null)
                return this._goto;
            return this._scene;
        },
        set: function (value) {
            this._goto = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Ambient.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
            this.container.style.width = (this.width * this._scale) + "px";
            this.container.style.height = (this.height * this._scale) + "px";
            if (!this._fullscreen) {
                this.canvasScaled.width = this.width * this._scale;
                this.canvasScaled.height = this.height * this._scale;
            }
        },
        enumerable: true,
        configurable: true
    });


    Ambient.prototype.ToggleFullscreen = function () {
        if (this._fullscreen) {
            this.canvasScaled.style.position = "relative";
            this.canvasScaled.width = this.width * this.scale;
            this.canvasScaled.height = this.height * this.scale;
        } else {
            this.canvasScaled.style.position = "absolute";
            this.canvasScaled.style.left = "0px";
            this.canvasScaled.style.top = "0px";
            this.canvasScaled.width = document.documentElement.clientWidth;
            this.canvasScaled.height = document.documentElement.clientHeight;
        }

        this._fullscreen = !this._fullscreen;
    };

    Ambient.prototype.GetViewportScale = function () {
        var scale = Math.min(this.canvasScaled.width / this.width, this.canvasScaled.height / this.height);
        if (this.keepPixelScale)
            scale = Math.floor(scale);
        return scale;
    };

    Ambient.prototype.GetViewportOffset = function () {
        var scale = this.GetViewportScale();
        return new AmPoint((this.canvasScaled.width - this.width * scale) / 2, (this.canvasScaled.height - this.height * scale) / 2);
    };

    Ambient.prototype.Loop = function () {
        var time = (new Date()).getTime();
        this.deltaTime = (time - this._date) / 1000;
        this._date = time;

        this.Update();
        this.Render();

        if (this._goto != null) {
            if (this._scene != null)
                this._scene.End();
            this._scene = this._goto;
            this._goto = null;
            this._scene.Start();
        }

        this.keyboard.Clear();
        this.mouse.Clear();
    };

    Ambient.prototype.Update = function () {
        if (this._scene != null) {
            this._scene.Update();
        }
    };

    Ambient.prototype.DisableSmoothing = function (context) {
        context.msImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
    };

    Ambient.prototype.Render = function () {
        this.context.clearRect(0, 0, this.width, this.height);

        this.context.fillStyle = this.clear;
        this.context.fillRect(0, 0, this.width, this.height);

        Am.context.save();
        Am.context.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

        if (!this.smoothing)
            Am.DisableSmoothing(this.context);

        if (this._scene != null)
            this._scene.Render();

        Am.context.restore();

        if (!this.smoothing)
            this.DisableSmoothing(this.contextScaled);

        this.contextScaled.clearRect(0, 0, this.canvasScaled.width, this.canvasScaled.height);
        this.contextScaled.fillStyle = "#000000";
        this.contextScaled.fillRect(0, 0, this.canvasScaled.width, this.canvasScaled.height);

        var scale = this.GetViewportScale();
        var offset = this.GetViewportOffset();
        this.contextScaled.drawImage(this.canvas, offset.x, offset.y, this.width * scale, this.height * scale);
    };
    return Ambient;
})();

var Am;
var AmComponent = (function () {
    function AmComponent() {
        this.active = true;
        this.visible = true;
        this.position = new AmPoint(0, 0);
    }
    Object.defineProperty(AmComponent.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        set: function (value) {
            this.position.x = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AmComponent.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        set: function (value) {
            this.position.y = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AmComponent.prototype, "scenePosition", {
        get: function () {
            if (this.entity == null)
                return this.position;
            return AmPoint.Add(this.position, this.entity.position);
        },
        set: function (value) {
            if (this.entity == null)
                this.position = value;
            else
                this.position = AmPoint.Subtract(value, this.entity.position);
        },
        enumerable: true,
        configurable: true
    });

    AmComponent.prototype.Start = function () {
    };

    AmComponent.prototype.End = function () {
    };

    AmComponent.prototype.Update = function () {
    };

    AmComponent.prototype.Render = function () {
    };
    return AmComponent;
})();
var AmEntity = (function () {
    function AmEntity() {
        this.position = new AmPoint(0, 0);
        this.active = true;
        this.visible = true;
        this.depth = 0;
        this.components = new Array();
    }
    Object.defineProperty(AmEntity.prototype, "x", {
        get: function () {
            return this.position.x;
        },
        set: function (value) {
            this.position.x = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AmEntity.prototype, "y", {
        get: function () {
            return this.position.y;
        },
        set: function (value) {
            this.position.y = value;
        },
        enumerable: true,
        configurable: true
    });

    AmEntity.prototype.Start = function () {
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].entity = this;
            this.components[i].Start();
        }
    };
    AmEntity.prototype.End = function () {
    };

    AmEntity.prototype.Add = function (component) {
        this.components.push(component);
        if (this.scene != null) {
            component.entity = this;
            component.Start();
        }
    };

    AmEntity.prototype.Remove = function (component) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i] == component) {
                this.components.splice(i, 1);
                break;
            }
        }
        component.End();
        component.entity = null;
    };

    AmEntity.prototype.Update = function () {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].active)
                this.components[i].Update();
        }
    };

    AmEntity.prototype.Render = function () {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].visible)
                this.components[i].Render();
        }
    };
    return AmEntity;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColliderType;
(function (ColliderType) {
    ColliderType[ColliderType["Hitbox"] = 0] = "Hitbox";
    ColliderType[ColliderType["Grid"] = 1] = "Grid";
})(ColliderType || (ColliderType = {}));

var AmCollider = (function (_super) {
    __extends(AmCollider, _super);
    function AmCollider(type) {
        _super.call(this);
        this._tag = "";
        this._totag = "";
        this.type = type;
        this.visible = false;
    }
    AmCollider.prototype.GetTag = function () {
        return this._tag;
    };

    AmCollider.prototype.Tag = function (tag) {
        if (this.entity == null || this.entity.scene == null)
            this._totag = tag;
        else {
            this.entity.scene.SetColliderTag(this, tag, this._tag);
            this._tag = tag;
        }
    };

    AmCollider.prototype.UnTag = function () {
        if (this.entity == null || this.entity.scene == null)
            this._totag = "";
        else {
            this.entity.scene.SetColliderTag(this, this._tag, "");
            this._tag = "";
        }
    };

    AmCollider.prototype.Start = function () {
        _super.prototype.Start.call(this);
        if (this._totag != this._tag) {
            this.entity.scene.SetColliderTag(this, this._tag, this._totag);
            this._tag = this._totag;
        }
    };

    AmCollider.prototype.End = function () {
        this._totag = this._tag;
        this._tag = "";
        this.entity.scene.SetColliderTag(this, this._totag, "");
    };

    AmCollider.prototype.Collide = function (tag, x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var result = null;

        this.position.x += x;
        this.position.y += y;

        if (this.entity != null && this.entity.scene != null) {
            var colliders = this.entity.scene.colliders[tag];
            for (var i = 0; i < colliders.length; i++) {
                if (this.Overlaps(colliders[i])) {
                    result = colliders[i];
                    break;
                }
            }
        }

        this.position.x -= x;
        this.position.y -= y;

        return result;
    };

    AmCollider.prototype.Check = function (tag, x, y) {
        return (this.Collide(tag, x, y) != null);
    };

    AmCollider.prototype.Overlaps = function (other) {
        return false;
    };
    return AmCollider;
})(AmComponent);
var AmScene = (function () {
    function AmScene() {
        this.entities = new Array();
        this.adding = new Array();
        this.removing = new Array();
        this.colliders = {};
    }
    AmScene.prototype.Start = function () {
    };

    AmScene.prototype.End = function () {
    };

    AmScene.prototype.Add = function (entity) {
        this.adding.push(entity);
        return entity;
    };

    AmScene.prototype.Remove = function (entity) {
        this.removing.push(entity);
        return entity;
    };

    AmScene.prototype.SetColliderTag = function (collider, prev, next) {
        if (prev != "") {
            var list = this.colliders[prev];
            for (var i = 0; i < list.length; i++) {
                if (list[i] == collider) {
                    list.splice(i, 1);
                    break;
                }
            }

            this.colliders[prev] = list;
        }

        if (next != "") {
            if (this.colliders[next] == null)
                this.colliders[next] = new Array();
            this.colliders[next].push(collider);
        }
    };

    AmScene.prototype.Update = function () {
        for (var i = 0; i < this.removing.length; i++) {
            for (var j = 0; j < this.entities.length; j++) {
                if (this.entities[j] == this.removing[i]) {
                    this.entities.splice(i, 1);
                    break;
                }
            }

            this.removing[i].End();
            this.removing[i].scene = null;
        }

        this.removing = new Array();

        for (var i = 0; i < this.adding.length; i++) {
            this.entities.push(this.adding[i]);
            this.adding[i].scene = this;
            this.adding[i].Start();
        }

        this.adding = new Array();

        this.SortEntitiesByDepth(this.entities);

        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active)
                this.entities[i].Update();
        }
    };

    AmScene.prototype.Render = function () {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].visible)
                this.entities[i].Render();
        }
    };

    AmScene.prototype.SortEntitiesByDepth = function (entities) {
        var i, j, increment;
        var temp;
        increment = 3;

        while (increment > 0) {
            for (i = 0; i < entities.length; i++) {
                j = i;
                temp = entities[i];

                while ((j >= increment) && (entities[j - increment].depth < temp.depth)) {
                    entities[j] = entities[j - increment];
                    j = j - increment;
                }

                entities[j] = temp;
            }

            if (Math.floor(increment / 2) != 0) {
                increment = Math.floor(increment / 2);
            } else if (Math.floor(increment) == 1) {
                increment = 0;
            } else {
                increment = 1;
            }
        }
    };
    return AmScene;
})();
var Loader = (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        _super.call(this);
        this.percent = 0;

        assets.AddTexture("grass", "textures/grass.png");
        assets.AddTexture("player", "textures/player.png");
        assets.Load(null, null);
    }
    Loader.prototype.Begin = function () {
        Am.scene = new AmScene();
        Am.scene.Add(new Terrain());
        Am.scene.Add(new Creature());
    };

    Loader.prototype.Update = function () {
        if (this.percent < assets.percent)
            this.percent += Am.deltaTime;
        if (this.percent >= assets.percent && assets.percent >= 1)
            this.Begin();
    };

    Loader.prototype.Render = function () {
        Am.context.fillStyle = "#ffffff";
        Am.context.fillRect(0, Am.height / 2 - 4, Am.width * this.percent, 8);
        for (var i = 0; i < 10; i++) {
            Am.context.globalAlpha = (1 - (i / 10)) / 16;
            Am.context.fillRect(0, Am.height / 2 - 4 - i, Am.width * this.percent, 8 + i * 2);
        }
        Am.context.globalAlpha = 1;
    };
    return Loader;
})(AmScene);
var AmOverlaps = (function () {
    function AmOverlaps() {
    }
    AmOverlaps.HitboxToHitbox = function (a, b) {
        var pa = a.scenePosition;
        var pb = b.scenePosition;

        return (pa.x + a.width > pb.x && pa.y + a.height > pb.y && pa.x < pb.x + b.width && pa.y < pb.y + b.height);
    };

    AmOverlaps.HitboxToGrid = function (a, b) {
        var pa = a.scenePosition;
        var pb = b.scenePosition;

        var left = Math.floor((pa.x - pb.x) / b.tileWidth);
        var top = Math.floor((pa.y - pb.y) / b.tileHeight);
        var right = Math.ceil((pa.x + a.width - pb.x) / b.tileWidth);
        var bottom = Math.ceil((pa.y + a.height - pb.y) / b.tileHeight);

        for (var i = left; i < right; i++) {
            for (var j = top; j < bottom; j++) {
                if (b.Get(i, j))
                    return true;
            }
        }

        return false;
    };

    AmOverlaps.GridToGrid = function (a, b) {
        return false;
    };
    return AmOverlaps;
})();
var AmHitbox = (function (_super) {
    __extends(AmHitbox, _super);
    function AmHitbox(x, y, width, height) {
        _super.call(this, 0 /* Hitbox */);
        this.position = new AmPoint(x, y);
        this.width = width;
        this.height = height;
    }
    AmHitbox.prototype.Overlaps = function (other) {
        if (other.type == 0 /* Hitbox */)
            return AmOverlaps.HitboxToHitbox(this, other);
        else if (other.type == 1 /* Grid */)
            return AmOverlaps.HitboxToGrid(this, other);
        return false;
    };
    return AmHitbox;
})(AmCollider);
var AmRectangle = (function () {
    function AmRectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return AmRectangle;
})();
var AmGraphic = (function (_super) {
    __extends(AmGraphic, _super);
    function AmGraphic(texture, bounds) {
        if (typeof bounds === "undefined") { bounds = null; }
        _super.call(this);
        this.scale = AmPoint.One();
        this.origin = AmPoint.Zero();

        this.texture = texture;
        if (bounds == null)
            this.bounds = new AmRectangle(0, 0, texture.width, texture.height);
        else
            this.bounds = bounds;
    }
    AmGraphic.prototype.Update = function () {
    };

    AmGraphic.prototype.Render = function () {
        Am.context.save();
        Am.context.translate(this.scenePosition.x, this.scenePosition.y);
        Am.context.scale(this.scale.x, this.scale.y);
        Am.context.translate(-this.origin.x, -this.origin.y);
        Am.context.drawImage(this.texture, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, 0, 0, this.bounds.width, this.bounds.height);
        Am.context.restore();
    };
    return AmGraphic;
})(AmComponent);
var AmAnimation = (function () {
    function AmAnimation(name, frames, speed, loop) {
        this.index = 0;
        this.name = name;
        this.frames = frames;
        this.speed = speed;
        this.loop = loop;
    }
    return AmAnimation;
})();

var AmAnimator = (function (_super) {
    __extends(AmAnimator, _super);
    function AmAnimator(texture, frameWidth, frameHeight) {
        _super.call(this, texture, new AmRectangle(0, 0, frameWidth, frameHeight));
        this.animations = {};
        this.frame = 0;
        this._current = null;
        this._stopped = true;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
    }
    AmAnimator.prototype.Add = function (name, frames, speed) {
        this.animations[name] = new AmAnimation(name, frames, speed, true);
    };

    AmAnimator.prototype.Play = function (name, restart) {
        this._stopped = false;
        this._current = this.animations[name];

        if (restart)
            this._current.index = 0;
    };

    AmAnimator.prototype.Current = function () {
        return this._current.name;
    };

    AmAnimator.prototype.Stop = function () {
        this._stopped = true;
    };

    AmAnimator.prototype.Playing = function () {
        return !this._stopped;
    };

    AmAnimator.prototype.Stopped = function () {
        return this._stopped;
    };

    AmAnimator.prototype.Update = function () {
        _super.prototype.Update.call(this);

        if (!this._stopped) {
            this._current.index += this._current.speed * Am.deltaTime;
            while (this._current.index > this._current.frames.length)
                this._current.index -= this._current.frames.length;
            this.frame = this._current.frames[Math.floor(this._current.index)];
        }
    };

    AmAnimator.prototype.Render = function () {
        var columns = Math.floor(this.texture.width / this.frameWidth);
        var column = Math.floor(this.frame % columns);
        var row = Math.floor(this.frame / columns);
        this.bounds = new AmRectangle(column * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight);

        _super.prototype.Render.call(this);
    };
    return AmAnimator;
})(AmGraphic);
var Creature = (function (_super) {
    __extends(Creature, _super);
    function Creature() {
        _super.call(this);
        this.speed = new AmPoint(0, 0);
        this.facing = 1;
        this.accel = 240;
        this.gravity = 360;
        this.frictionGround = 160;
        this.frictionAir = 90;
        this.jumpForce = 120;
        this.maxspeed = new AmPoint(48, 224);
        this.movementRemainder = new AmPoint(0, 0);
        this.position = new AmPoint(80, 60);

        this.collider = new AmHitbox(-4, -8, 8, 8);
        this.Add(this.collider);

        this.sprite = new AmAnimator(assets.textures["player"], 16, 16);
        this.sprite.Add("idle", [0], 0);
        this.sprite.Add("run", [0, 1, 0, 2], 10);
        this.sprite.Add("jump", [1], 0);
        this.sprite.Play("idle", true);
        this.sprite.origin.x = 8;
        this.sprite.origin.y = 16;
        this.Add(this.sprite);

        this.depth = 5;
    }
    Creature.prototype.Update = function () {
        _super.prototype.Update.call(this);

        var axis = (Am.keyboard.Down(AmKey.LEFT) ? -1 : (Am.keyboard.Down(AmKey.RIGHT) ? 1 : 0));

        if (axis != 0)
            this.facing = axis;

        this.speed.x += axis * this.accel * Am.deltaTime;

        if (axis == 0) {
            var friction = this.frictionAir;
            if (this.collider.Check("solid", 0, 1))
                friction = this.frictionGround;

            var sign = this.Sign(this.speed.x);
            this.speed.x -= sign * friction * Am.deltaTime;
            if (this.Sign(this.speed.x) != sign)
                this.speed.x = 0;
        }

        if (!this.collider.Check("solid", 0, 1)) {
            if (Am.keyboard.Down(AmKey.UP) && Math.abs(this.speed.y) < 60)
                this.speed.y += this.gravity / 2 * Am.deltaTime;
            else
                this.speed.y += this.gravity * Am.deltaTime;
        }

        if (Am.keyboard.Pressed(AmKey.UP) && this.collider.Check("solid", 0, 1)) {
            this.speed.y = -this.jumpForce;
        }

        if (Math.abs(this.speed.x) > this.maxspeed.x)
            this.speed.x = this.Sign(this.speed.x) * this.maxspeed.x;
        if (Math.abs(this.speed.y) > this.maxspeed.y)
            this.speed.y = this.Sign(this.speed.y) * this.maxspeed.y;

        this.MoveX(this.speed.x * Am.deltaTime);
        this.MoveY(this.speed.y * Am.deltaTime);

        if (this.collider.Check("solid", 0, 1)) {
            if (axis == 0)
                this.sprite.Play("idle", false);
            else
                this.sprite.Play("run", false);
        } else
            this.sprite.Play("jump", false);

        Am.camera.x = this.position.x - Am.width / 2;
        if (Am.camera.x < 0)
            Am.camera.x = 0;
        if (Am.camera.x + Am.width > 40 * 8)
            Am.camera.x = 40 * 8 - Am.width;

        if (Am.keyboard.Pressed(AmKey.F))
            Am.ToggleFullscreen();
        if (Am.keyboard.Pressed(AmKey.P))
            Am.keepPixelScale = !Am.keepPixelScale;

        if (this.sprite.scale.y < 1)
            this.sprite.scale.y += Am.deltaTime * 2;
        else
            this.sprite.scale.y = 1;

        this.sprite.scale.x = this.facing * Math.abs(this.sprite.scale.x);
        if (Math.abs(this.sprite.scale.x) > 1)
            this.sprite.scale.x -= this.facing * Am.deltaTime * 2;
        else
            this.sprite.scale.x = this.facing;
    };

    Creature.prototype.MoveX = function (amount) {
        amount += this.movementRemainder.x;
        this.movementRemainder.x = amount % 1;
        var moveBy = amount > 0 ? Math.floor(amount) : Math.ceil(amount);

        if (this.collider == null)
            this.position.x += moveBy;
        else {
            var step = this.Sign(moveBy);
            while (moveBy != 0) {
                if (!this.collider.Check("solid", step, 0)) {
                    this.position.x += step;
                    moveBy -= step;
                } else {
                    this.speed.x = 0;
                    break;
                }
            }
        }
    };

    Creature.prototype.MoveY = function (amount) {
        amount += this.movementRemainder.y;
        this.movementRemainder.y = amount % 1;
        var moveBy = amount > 0 ? Math.floor(amount) : Math.ceil(amount);

        if (this.collider == null)
            this.position.y += moveBy;
        else {
            var step = this.Sign(moveBy);
            while (moveBy != 0) {
                if (!this.collider.Check("solid", 0, step)) {
                    this.position.y += step;
                    moveBy -= step;
                } else {
                    if (this.speed.y > 10) {
                        this.sprite.scale.x = 1.25;
                        this.sprite.scale.y = 0.75;
                    }
                    this.speed.y = 0;
                    break;
                }
            }
        }
    };

    Creature.prototype.Sign = function (n) {
        return (n > 0 ? 1 : (n < 0 ? -1 : 0));
    };
    return Creature;
})(AmEntity);
var AmTilemap = (function (_super) {
    __extends(AmTilemap, _super);
    function AmTilemap(texture, tileWidth, tileHeight, columns, rows, stacking) {
        _super.call(this, texture, new AmRectangle(0, 0, tileWidth, tileHeight));

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = columns;
        this.rows = rows;
        this.stacking = stacking;

        this.data = new Array();
        for (var i = 0; i < columns; i++) {
            this.data.push(new Array());
            for (var j = 0; j < rows; j++) {
                this.data[i].push(new Array());
            }
        }
    }
    AmTilemap.prototype.Set = function (column, row, tileX, tileY) {
        if (column >= 0 && row >= 0 && column < this.columns && row < this.rows) {
            if (!this.stacking)
                this.data[column][row] = new Array();
            this.data[column][row].push(this.GetIndex(tileX, tileY));
        }
    };

    AmTilemap.prototype.Clear = function (column, row) {
        if (column >= 0 && row >= 0 && column < this.columns && row < this.rows)
            this.data[column][row] = new Array();
    };

    AmTilemap.prototype.ClearRect = function (column, row, w, h) {
        for (var i = Math.max(0, column); i < Math.min(this.columns, column + w); i++)
            for (var j = Math.max(0, row); j < Math.min(this.rows, row + h); j++)
                this.data[i][j] = new Array();
    };

    AmTilemap.prototype.ClearAll = function () {
        for (var i = 0; i < this.columns; i++)
            for (var j = 0; j < this.rows; j++)
                this.data[i][j] = new Array();
    };

    AmTilemap.prototype.GetIndex = function (tileX, tileY) {
        return tileY * this.columns + tileX;
    };

    AmTilemap.prototype.Render = function () {
        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                for (var tile = 0; tile < this.data[i][j].length; tile++) {
                    var tx = (this.data[i][j][tile] % this.columns);
                    var ty = Math.floor(this.data[i][j][tile] / this.columns);

                    Am.context.drawImage(this.texture, tx * this.tileWidth, ty * this.tileHeight, this.tileWidth, this.tileHeight, this.scenePosition.x + i * this.tileWidth * this.scale.x, this.scenePosition.y + j * this.tileHeight * this.scale.y, this.tileWidth * this.scale.x, this.tileHeight * this.scale.y);
                }
            }
        }
    };
    return AmTilemap;
})(AmGraphic);
var AmHitgrid = (function (_super) {
    __extends(AmHitgrid, _super);
    function AmHitgrid(tileWidth, tileHeight, columns, rows) {
        _super.call(this, 1 /* Grid */);
        this.outsideReturnValue = true;

        this.columns = columns;
        this.rows = rows;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.solids = new Array();
        for (var i = 0; i < columns; i++) {
            this.solids.push(new Array());
            for (var j = 0; j < rows; j++) {
                this.solids[i].push(false);
            }
        }
    }
    AmHitgrid.prototype.Set = function (x, y, solid) {
        if (x >= 0 && y >= 0 && x < this.columns && y < this.rows)
            this.solids[x][y] = solid;
    };

    AmHitgrid.prototype.SetRect = function (x, y, w, h, solid) {
        for (var i = Math.max(0, x); i < Math.min(this.columns, x + w); i++)
            for (var j = Math.max(0, y); j < Math.min(this.rows, y + h); j++)
                this.solids[i][j] = solid;
    };

    AmHitgrid.prototype.Get = function (x, y) {
        if (x < 0 || y < 0 || x >= this.columns || y >= this.rows)
            return this.outsideReturnValue;
        return this.solids[x][y];
    };

    AmHitgrid.prototype.Overlaps = function (other) {
        if (other.type == 0 /* Hitbox */)
            return AmOverlaps.HitboxToGrid(other, this);
        else if (other.type == 1 /* Grid */)
            return AmOverlaps.GridToGrid(this, other);
        return false;
    };
    return AmHitgrid;
})(AmCollider);
var Terrain = (function (_super) {
    __extends(Terrain, _super);
    function Terrain() {
        _super.call(this);

        this.tilemap = new AmTilemap(assets.textures["grass"], 8, 8, 40, 15, true);
        this.collider = new AmHitgrid(8, 8, 40, 15);
        this.collider.Tag("solid");

        this.collider.SetRect(0, 0, 2, 15, true);
        this.collider.SetRect(0, 0, 40, 2, true);
        this.collider.SetRect(0, 13, 40, 2, true);
        this.collider.SetRect(38, 0, 2, 15, true);
        this.collider.SetRect(8, 10, 4, 15, true);
        this.collider.SetRect(16, 7, 5, 4, true);

        this.Add(this.tilemap);
        this.Add(this.collider);

        this.GenerateTiles();
    }
    Terrain.prototype.Update = function () {
        _super.prototype.Update.call(this);

        if (Am.mouse.leftPressed || Am.mouse.rightPressed) {
            var point = new AmPoint(Math.floor(Am.mouse.x / 8), Math.floor(Am.mouse.y / 8));
            this.collider.Set(point.x, point.y, Am.mouse.leftPressed);

            this.tilemap.ClearRect(point.x - 1, point.y - 1, 3, 3);
            for (var i = -1; i < 2; i++)
                for (var j = -1; j < 2; j++)
                    this.GenerateTile(point.x + i, point.y + j);
        }
    };

    Terrain.prototype.GenerateTiles = function () {
        for (var i = 0; i < this.collider.columns; i++)
            for (var j = 0; j < this.collider.rows; j++)
                this.GenerateTile(i, j);
    };

    Terrain.prototype.GenerateTile = function (x, y) {
        var up = this.collider.Get(x, y - 1);
        var right = this.collider.Get(x + 1, y);
        var left = this.collider.Get(x - 1, y);
        var down = this.collider.Get(x, y + 1);

        if (this.collider.Get(x, y)) {
            if (left && up && down && right) {
                this.tilemap.Set(x, y, 2, 2);
            } else if (left && !up && right && down) {
                this.tilemap.Set(x, y, 2, 1);
            } else if (left && up && right && !down) {
                this.tilemap.Set(x, y, 2, 3);
            } else if (!left && up && right && down) {
                this.tilemap.Set(x, y, 1, 2);
            } else if (left && up && !right && down) {
                this.tilemap.Set(x, y, 3, 2);
            } else if (!left && !up && right && down) {
                this.tilemap.Set(x, y, 1, 1);
            } else if (left && !up && !right && down) {
                this.tilemap.Set(x, y, 3, 1);
            } else if (!left && up && right && !down) {
                this.tilemap.Set(x, y, 1, 3);
            } else if (left && up && !right && !down) {
                this.tilemap.Set(x, y, 3, 3);
            } else if (!left && up && !right && down) {
                this.tilemap.Set(x, y, 5, 2);
            } else if (left && !up && right && !down) {
                this.tilemap.Set(x, y, 2, 5);
            } else if (!left && !up && !right && down) {
                this.tilemap.Set(x, y, 5, 1);
            } else if (!left && up && !right && !down) {
                this.tilemap.Set(x, y, 5, 3);
            } else if (!left && !up && right && !down) {
                this.tilemap.Set(x, y, 1, 5);
            } else if (left && !up && !right && !down) {
                this.tilemap.Set(x, y, 3, 5);
            } else if (!left && !up && !right && !down) {
                this.tilemap.Set(x, y, 5, 5);
            }
        } else {
            if (down)
                this.tilemap.Set(x, y, 1 + Math.floor(Math.random() * 3), 0);
            if (right)
                this.tilemap.Set(x, y, 0, 1 + Math.floor(Math.random() * 3));
            if (up)
                this.tilemap.Set(x, y, 1 + Math.floor(Math.random() * 3), 4);
            if (left)
                this.tilemap.Set(x, y, 4, 1 + Math.floor(Math.random() * 3));
        }
    };

    Terrain.prototype.Render = function () {
        _super.prototype.Render.call(this);

        Am.context.beginPath();
        Am.context.lineWidth = 1;
        Am.context.strokeStyle = '#ff0000';
        Am.context.rect(Math.floor(Am.mouse.x / 8) * 8, Math.floor(Am.mouse.y / 8) * 8, 8, 8);
        Am.context.stroke();
    };
    return Terrain;
})(AmEntity);
var assets = new AmAssets();

new Ambient("Ambient JS Game Test", 160, 120, 4, 60);
Am.Run();
Am.scene = new Loader();
