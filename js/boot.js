const config = {

    type: Phaser.AUTO,

    parent: "game-container",

    width: 1600,

    height: 900,

    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 0
            },

            debug: false
        }
    },

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter:
            Phaser.Scale.CENTER_BOTH

    },

    scene: [

        MenuScene,
        MidianScene,
        EgyptReturnScene,
        PharaohPalaceScene,
        PlaguesScene,
        ExodusScene,
        WildernessScene,
        SpiesScene,
        NeboScene

    ]
};

window.addEventListener(
    "load",
    () => {

        console.log(
            "GAME STARTING"
        );

        new Phaser.Game(
            config
        );

    }
);