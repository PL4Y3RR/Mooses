class MenuScene extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    create() {

    const questPanel =
    document.getElementById
(
        "quest-panel"
    );

    if(questPanel) {

        questPanel.style.display =
            "none";

    }

    this.cameras.main.setBackgroundColor(
        "#101820"
    );

    this.add.text(
        800,
        120,
        "MOOSEKSEN MATKA",
        {
            fontSize: "64px",
            color: "#FFD700",
            fontStyle: "bold"
        }
    ).setOrigin(0.5);

    this.add.text(
        800,
        190,
        "Raamattuun perustuva seikkailupeli",
        {
            fontSize: "24px",
            color: "#ffffff"
        }
    ).setOrigin(0.5);

    const chapters = [

        {
            name: "Luku 1: Midianin erämaa",
            scene: "Midian",
            color: "#3344cc",
            x: 500,
            y: 300
        },

        {
            name: "Luku 2: Paluu Egyptiin",
            scene: "EgyptReturn",
            color: "#aa5522",
            x: 1100,
            y: 300
        },

        {
            name: "Luku 3: Faraon palatsi",
            scene: "PharaohPalace",
            color: "#996600",
            x: 500,
            y: 410
        },

        {
            name: "Luku 4: Kymmenen vitsausta",
            scene: "PlaguesScene",
            color: "#8d3332",
            x: 1100,
            y: 410
        },

        {
            name: "Luku 5: Exodus ja Punainenmeri",
            scene: "ExodusScene",
            color: "#23799d",
            x: 500,
            y: 520
        },

        {
            name: "Luku 6: Erämaan vaellus",
            scene: "WildernessScene",
            color: "#69724f",
            x: 1100,
            y: 520
        },

        {
            name: "Luku 7: Vakoojien matka",
            scene: "SpiesScene",
            color: "#50613c",
            x: 500,
            y: 630
        },

        {
            name: "Luku 8: Nebon vuori",
            scene: "NeboScene",
            color: "#577e82",
            x: 1100,
            y: 630
        }

    ];

    chapters.forEach(chapter => {

        const button =
        this.add.text(
            chapter.x,
            chapter.y,
            chapter.name,
            {
                fontSize: "22px",
                backgroundColor:
                    chapter.color,
                color: "#ffffff",
                padding: {
                    x: 30,
                    y: 12
                }
            }
        );

        button
            .setOrigin(0.5)
            .setInteractive(
                { useHandCursor:true }
            )
            .on(
                "pointerover",
                () => {

                    button.setScale(
                        1.05
                    );

                }
            )
            .on(
                "pointerout",
                () => {

                    button.setScale(
                        1
                    );

                }
            )
            .on(
                "pointerdown",
                () =>
                this.scene.start(
                    chapter.scene
                )
            );

    });

    this.add.text(
        800,
        720,
        "Valitse luku aloittaaksesi seikkailun",
        {
            fontSize: "20px",
            color: "#bbbbbb"
        }
    ).setOrigin(0.5);

    }
}

// Versio 0.1


// Jatka peliä
// Uusi peli
// Luvut
// Asetukset