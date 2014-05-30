class AmKeyboard
{

    private _pressed:Array<boolean> = new Array<boolean>(256);
    private _released:Array<boolean> = new Array<boolean>(256);
    private _down:Array<boolean> = new Array<boolean>(256);

    private _canvas:HTMLElement;

    constructor(canvas:HTMLElement)
    {
        window.onkeyup = (e:KeyboardEvent) =>
        {
            this._released[e.keyCode] = true;
            this._down[e.keyCode] = false;
        }

        window.onkeydown = (e:KeyboardEvent) =>
        {
            if (!this._down[e.keyCode])
            {
                this._pressed[e.keyCode] = true;
                this._down[e.keyCode] = true;
            }
        }
    }
    public Pressed(key:number):boolean
    {
        return this._pressed[key];
    }

    public Released(key:number):boolean
    {
        return this._released[key];
    }

    public Down(key:number):boolean
    {
        return this._down[key];
    }

    public Clear()
    {
        this._pressed = new Array<boolean>(256);
        this._released = new Array<boolean>(256);
    }
}

class AmKey
{
    public static BACKSPACE:number = 8;
    public static TAB:number = 9;
    public static ENTER:number = 13;
    public static COMMAND:number = 15;
    public static SHIFT:number = 16;
    public static CONTROL:number = 17;
    public static CAPS_LOCK:number = 20;
    public static ESCAPE:number = 27;
    public static SPACE:number = 32;
    public static PAGE_UP:number = 33;
    public static PAGE_DOWN:number = 34;
    public static END:number = 35;
    public static HOME:number = 36;
    public static LEFT:number = 37;
    public static UP:number = 38;
    public static RIGHT:number = 39;
    public static DOWN:number = 40;
    public static INSERT:number = 45;
    public static DELETE:number = 46;

    public static A:number = 65;
    public static B:number = 66;
    public static C:number = 67;
    public static D:number = 68;
    public static E:number = 69;
    public static F:number = 70;
    public static G:number = 71;
    public static H:number = 72;
    public static I:number = 73;
    public static J:number = 74;
    public static K:number = 75;
    public static L:number = 76;
    public static M:number = 77;
    public static N:number = 78;
    public static O:number = 79;
    public static P:number = 80;
    public static Q:number = 81;
    public static R:number = 82;
    public static S:number = 83;
    public static T:number = 84;
    public static U:number = 85;
    public static V:number = 86;
    public static W:number = 87;
    public static X:number = 88;
    public static Y:number = 89;
    public static Z:number = 90;

    public static F1:number = 112;
    public static F2:number = 113;
    public static F3:number = 114;
    public static F4:number = 115;
    public static F5:number = 116;
    public static F6:number = 117;
    public static F7:number = 118;
    public static F8:number = 119;
    public static F9:number = 120;
    public static F10:number = 121;
    public static F11:number = 122;
    public static F12:number = 123;
    public static F13:number = 124;
    public static F14:number = 125;
    public static F15:number = 126;

    public static DIGIT_0:number = 48;
    public static DIGIT_1:number = 49;
    public static DIGIT_2:number = 50;
    public static DIGIT_3:number = 51;
    public static DIGIT_4:number = 52;
    public static DIGIT_5:number = 53;
    public static DIGIT_6:number = 54;
    public static DIGIT_7:number = 55;
    public static DIGIT_8:number = 56;
    public static DIGIT_9:number = 57;

    public static LEFT_SQUARE_BRACKET:number = 219;
    public static RIGHT_SQUARE_BRACKET:number = 221;
}