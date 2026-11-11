class NeboScene extends ChapterScene {
    constructor() {
        super("NeboScene", "Luku 8: Nebon vuori", 0x9ac4d1);
        this.worldWidth = 2200;
    }

    create() {
        super.create();
        this.player.setPosition(100, 760);
        this.phase = "climb";
        this.checkpointIndex = 0;
        this.createMountain();
        this.checkpoints = [
            { x: 430, y: 680, text: "Mooses aloitti nousun." },
            { x: 820, y: 560, text: "Erämaa jäi taakse." },
            { x: 1220, y: 410, text: "Jordanin laakso avautui." },
            { x: 1650, y: 250, text: "Huippu oli jo lähellä." }
        ];
        this.checkpoints.forEach((point, index) => {
            point.marker = this.add.circle(point.x, point.y, 22, 0xf0d17b, 0.75)
                .setStrokeStyle(3, 0xfff4ce)
                .setDepth(9);
            point.label = this.add.text(point.x, point.y - 42, `${index + 1}`, {
                fontSize: "18px",
                color: "#243b35",
                backgroundColor: "#fff0bd",
                padding: { x: 7, y: 3 }
            }).setOrigin(0.5).setDepth(10);
        });
        this.refreshQuest();
        this.dialog.start([
            { speaker: "Kertoja", text: "Mooses nousi Nebon vuorelle. Luvatun maan näkeminen oli matkan viimeinen tehtävä." }
        ]);
    }

    createMountain() {
        const mountain = this.add.graphics();
        mountain.fillStyle(0x7f8e83, 1);
        mountain.beginPath();
        mountain.moveTo(280, 900);
        mountain.lineTo(1150, 620);
        mountain.lineTo(1460, 360);
        mountain.lineTo(1820, 100);
        mountain.lineTo(2200, 900);
        mountain.closePath();
        mountain.fillPath();

        mountain.fillStyle(0x5d706b, 1);
        mountain.beginPath();
        mountain.moveTo(650, 900);
        mountain.lineTo(1150, 680);
        mountain.lineTo(1460, 470);
        mountain.lineTo(1710, 360);
        mountain.lineTo(1940, 900);
        mountain.closePath();
        mountain.fillPath();

        mountain.fillStyle(0xe4e8d8, 1);
        mountain.beginPath();
        mountain.moveTo(1820, 100);
        mountain.lineTo(1730, 360);
        mountain.lineTo(1880, 315);
        mountain.closePath();
        mountain.fillPath();
        mountain.setDepth(-5);

        const path = this.add.graphics();
        path.lineStyle(18, 0xd7c294, 0.9);
        path.beginPath();
        path.moveTo(100, 760);
        path.lineTo(430, 680);
        path.lineTo(820, 560);
        path.lineTo(1220, 410);
        path.lineTo(1650, 250);
        path.lineTo(1900, 170);
        path.strokePath();
        path.setDepth(-1);
    }

    refreshQuest() {
        this.setQuest([
            `Huipulle: ${this.checkpointIndex}/${this.checkpoints.length} etappia`,
            "Seuraa vuoren rinnettä kohti itää"
        ]);
    }

    revealLand() {
        this.phase = "ending";
        const panorama = this.add.graphics();
        panorama.fillStyle(0x87b7b2, 0.92);
        panorama.fillRect(1310, 360, 800, 390);
        panorama.fillStyle(0x638d61, 1);
        panorama.beginPath();
        panorama.moveTo(1310, 640);
        panorama.lineTo(1510, 480);
        panorama.lineTo(1660, 620);
        panorama.lineTo(1820, 450);
        panorama.lineTo(2110, 650);
        panorama.lineTo(2110, 750);
        panorama.lineTo(1310, 750);
        panorama.closePath();
        panorama.fillPath();
        panorama.lineStyle(20, 0x4d9dc3, 1);
        panorama.beginPath();
        panorama.moveTo(1370, 600);
        panorama.lineTo(1530, 650);
        panorama.lineTo(1690, 595);
        panorama.lineTo(1860, 665);
        panorama.lineTo(2070, 610);
        panorama.strokePath();
        panorama.setDepth(2);

        [
            [1490, 690, "JORDAN"],
            [1780, 520, "JERIKO"],
            [1980, 700, "KANAAN"]
        ].forEach(([x, y, label]) => {
            this.add.text(x, y, label, {
                fontSize: "20px",
                color: "#f8f3d9",
                backgroundColor: "#30483b",
                padding: { x: 8, y: 5 }
            }).setOrigin(0.5).setDepth(4);
        });

        this.setQuest(["Luvattu maa näkyy vuorelta", "Jordan · Jeriko · Kanaan"]);
        this.dialog.start([
            { speaker: "Jumala", text: "Olen näyttänyt sinulle maan." },
            { speaker: "Mooses", text: "Herra on ollut uskollinen." }
        ]);
        this.pendingCredits = true;
    }

    showCredits() {
        this.phase = "credits";
        this.add.rectangle(800, 450, 1600, 900, 0x101c1a, 0.78)
            .setScrollFactor(0)
            .setDepth(200);
        this.add.text(800, 360, "MOOSEKSEN MATKA", {
            fontSize: "52px",
            color: "#f4d477",
            fontStyle: "bold",
            align: "center"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        this.add.text(800, 445, "Kiitos pelaamisesta", {
            fontSize: "30px",
            color: "#ffffff",
            align: "center"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        const back = this.add.text(800, 555, "Palaa valikkoon", {
            fontSize: "23px",
            color: "#fff0bd",
            backgroundColor: "#425a45",
            padding: { x: 18, y: 10 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        back.setInteractive({ useHandCursor: true });
        back.on("pointerdown", () => this.scene.start("Menu"));
        this.setQuest(["Luku 8 valmis", "Paina SPACE tai valitse Palaa valikkoon"]);
    }

    update() {
        if (this.phase === "credits") {
            this.player.setVelocity(0, 0);
            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                this.scene.start("Menu");
            }
            return;
        }

        this.movePlayer(190);
        this.updateTransition();

        if (this.pendingCredits && !this.dialog.isActive()) {
            this.pendingCredits = false;
            this.showCredits();
            return;
        }

        if (this.phase === "climb" && this.checkpointIndex < this.checkpoints.length) {
            const checkpoint = this.checkpoints[this.checkpointIndex];
            if (Phaser.Math.Distance.Between(
                this.player.x, this.player.y, checkpoint.x, checkpoint.y
            ) < 90) {
                checkpoint.marker.setFillStyle(0x78b876, 1);
                checkpoint.label.setColor("#d9efb2");
                this.checkpointIndex++;
                this.refreshQuest();
                this.dialog.start([
                    { speaker: "Kertoja", text: checkpoint.text }
                ]);
            }
        }

        if (this.phase === "climb" && this.checkpointIndex >= this.checkpoints.length &&
            this.player.x > 1840 && this.player.y < 230) {
            this.revealLand();
        }

        this.updateTransition();
    }
}
