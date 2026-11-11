class SpiesScene extends ChapterScene {
    constructor() {
        super("SpiesScene", "Luku 7: Vakoojien matka", 0x647447);
    }

    create() {
        super.create();
        this.player.setPosition(120, 720);
        this.phase = "grapes";
        this.grapesFound = 0;
        this.grapesNeeded = 8;
        this.exploredSites = 0;
        this.faithScore = 0;
        this.pendingMontage = false;
        this.pendingNeboTransition = false;
        this.createLand();
        this.createGrapes();
        this.createGuards();
        this.dialog.start([
            { speaker: "Kertoja", text: "Mooses lähetti vakoojia tutkimaan luvattua maata." },
            { speaker: "Mooses", text: "Tutkikaa maa, mutta pysykää vartijoilta piilossa." }
        ]);
    }

    createLand() {
        const ground = this.add.graphics();
        ground.fillStyle(0x89995b, 1);
        ground.fillRect(0, 770, 1800, 130);
        ground.fillStyle(0x50613c, 0.9);
        ground.fillRect(1180, 300, 500, 300);
        ground.fillStyle(0x7d9950, 1);
        ground.fillEllipse(680, 610, 540, 180);
        ground.setDepth(-5);

        this.add.text(1460, 300, "LUVATTU MAA", {
            fontSize: "25px",
            color: "#f4edc8",
            fontStyle: "bold"
        }).setOrigin(0.5).setDepth(1);
    }

    createGrapes() {
        const positions = [
            [310, 520], [480, 300], [720, 700], [850, 420],
            [1080, 670], [1270, 470], [1450, 700], [1620, 360]
        ];
        this.grapes = positions.map(([x, y], index) => {
            const bunch = this.add.container(x, y, [
                this.add.circle(-12, -8, 11, 0x673c98),
                this.add.circle(8, -8, 11, 0x7949ad),
                this.add.circle(-2, 9, 11, 0x8150b5),
                this.add.circle(18, 9, 10, 0x60348e),
                this.add.rectangle(0, -25, 4, 22, 0x5c7434)
            ]);
            bunch.setDepth(12);
            return { object: bunch, x, y, phase: index, collected: false };
        });
    }

    createGuards() {
        this.guards = [
            { object: this.makeGuard(620, 420), centerX: 620, range: 170, phase: 0 },
            { object: this.makeGuard(1120, 360), centerX: 1120, range: 140, phase: 2 },
            { object: this.makeGuard(1510, 620), centerX: 1510, range: 190, phase: 4 }
        ];
    }

    makeGuard(x, y) {
        return this.add.container(x, y, [
            this.add.rectangle(0, 15, 30, 42, 0x4c3730),
            this.add.circle(0, -12, 11, 0xb68263),
            this.add.rectangle(0, -24, 28, 8, 0x8e643a),
            this.add.rectangle(18, 15, 4, 56, 0x4b3624)
        ]).setDepth(15);
    }

    startExploration() {
        this.phase = "explore";
        this.sites = [
            { x: 760, y: 270, name: "Lähde" },
            { x: 1210, y: 610, name: "Viljelymaa" },
            { x: 1610, y: 500, name: "Kukkula" }
        ];
        this.sites.forEach(site => {
            site.marker = this.add.circle(site.x, site.y, 36, 0xf2cf68, 0.45)
                .setStrokeStyle(3, 0xfff1b3)
                .setDepth(8);
            site.label = this.add.text(site.x, site.y + 48, site.name, {
                fontSize: "18px",
                color: "#fff4cf",
                backgroundColor: "#34412e",
                padding: { x: 8, y: 5 }
            }).setOrigin(0.5).setDepth(9);
            site.visited = false;
        });
        this.setQuest(["Tutki kolme paikkaa merkittyinä alueina", "Vältä liikkuvia vartijoita"]);
    }

    showChoices() {
        this.phase = "choice";
        this.dialog.start([
            { speaker: "Kertoja", text: "Vakoojat palasivat. Maa oli runsas, mutta kansa pelkäsi sen asukkaita." },
            { speaker: "Mooses", text: "Mitä kansan tulisi tehdä?" }
        ]);
        this.setQuest(["Päätä, mihin kansa luottaa", `Luottamus: ${this.faithScore}`]);

        const choices = [
            { text: "Luotamme Herran lupaukseen", score: 2, color: "#496b45" },
            { text: "Maa on liian vaikea saavuttaa", score: -1, color: "#85543f" },
            { text: "Tutkimme ensin lisää", score: 0, color: "#51657b" }
        ];

        choices.forEach((choice, index) => {
            const button = this.add.text(800, 570 + index * 75, choice.text, {
                fontSize: "22px",
                color: "#ffffff",
                backgroundColor: choice.color,
                padding: { x: 20, y: 12 }
            }).setOrigin(0.5).setScrollFactor(0).setDepth(120);
            button.setInteractive({ useHandCursor: true });
            button.on("pointerdown", () => this.chooseFaith(choice, button));
            this.choiceButtons.push(button);
        });
    }

    chooseFaith(choice, button) {
        if (this.phase !== "choice" || this.dialog.isActive()) return;

        this.phase = "choiceMade";
        this.faithScore += choice.score;
        this.choiceButtons.forEach(item => item.disableInteractive());
        button.setStyle({ color: "#ffe08a" });
        this.setQuest([`Kansan luottamus: ${this.faithScore > 0 ? "vahvistui" : this.faithScore < 0 ? "horjui" : "odottaa"}`]);
        this.dialog.start([
            {
                speaker: "Kertoja",
                text: choice.score > 0
                    ? "Kansan rohkeus vahvistui."
                    : choice.score < 0
                        ? "Epäilys kasvoi, ja kansa epäröi."
                        : "Kansa jäi odottamaan varmuutta."
            }
        ]);
        this.pendingMontage = true;
    }

    update(time, delta) {
        this.movePlayer(205);
        this.updateTransition();

        this.guards.forEach(guard => {
            guard.object.x = guard.centerX + Math.sin(time / 650 + guard.phase) * guard.range;
        });

        if (this.pendingMontage && !this.dialog.isActive()) {
            this.pendingMontage = false;
            this.phase = "montage";
            const ending = this.faithScore > 0
                ? "Kansa oppi jälleen luottamaan lupaukseen."
                : "Kansa kulki erämaassa vielä pitkään ennen seuraavaa sukupolvea.";
            this.dialog.start([
                { speaker: "Kertoja", text: "Vuosi 1: ensimmäinen sukupolvi lähti matkaan." },
                { speaker: "Kertoja", text: "Vuosi 12: leiri siirtyi halki erämaan." },
                { speaker: "Kertoja", text: "Vuosi 24: uusi sukupolvi kasvoi matkalla." },
                { speaker: "Kertoja", text: "Vuosi 40: luvatun maan raja lähestyi." },
                { speaker: "Mooses", text: ending }
            ]);
            this.pendingNeboTransition = true;
        }

        if (this.pendingNeboTransition && !this.dialog.isActive()) {
            this.pendingNeboTransition = false;
            this.transitionAfterDialog("NeboScene", [
                { speaker: "Kertoja", text: "Mooses nousi Nebon vuorelle katsomaan maata, jota kansa oli odottanut." }
            ]);
        }

        if (this.dialog.isActive() || this.phase === "choice" || this.phase === "choiceMade" || this.phase === "montage") {
            this.updateTransition();
            return;
        }

        if (this.phase === "grapes") {
            this.grapes.forEach(grape => {
                if (grape.collected) return;
                grape.object.y = grape.y + Math.sin(time / 350 + grape.phase) * 7;
                if (Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, grape.x, grape.y
                ) < 48) {
                    grape.collected = true;
                    grape.object.destroy();
                    this.grapesFound++;
                    this.refreshQuest();
                }
            });

            const caught = this.guards.some(guard =>
                Phaser.Math.Distance.Between(
                    this.player.x, this.player.y,
                    guard.object.x, guard.object.y
                ) < 68
            );
            this.alertCooldown = Math.max(0, (this.alertCooldown || 0) - delta);
            if (caught && this.alertCooldown === 0) {
                this.player.setPosition(Math.max(120, this.player.x - 100), this.player.y);
                this.alertCooldown = 2200;
                this.dialog.start([
                    { speaker: "Vakooja", text: "Vartijat huomasivat meidät. Kierretään heidän kauttaan." }
                ]);
            }

            if (this.grapesFound >= this.grapesNeeded) {
                this.phase = "grapesDone";
                this.dialog.start([
                    { speaker: "Vakooja", text: "Tämä maa on hedelmällinen. Viinirypäleet kertovat sen runsaudesta." },
                    { speaker: "Mooses", text: "Tutkikaa vielä lähteet, pellot ja kukkulat." }
                ]);
                this.pendingExploration = true;
            }
        } else if (this.phase === "explore") {
            this.sites.forEach(site => {
                if (site.visited) return;
                if (Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, site.x, site.y
                ) < 82) {
                    site.visited = true;
                    site.marker.setFillStyle(0x83bf72, 0.7);
                    this.exploredSites++;
                    this.refreshQuest();
                }
            });
            if (this.exploredSites >= this.sites.length) {
                this.choiceButtons = [];
                this.showChoices();
            }
        }

        if (this.pendingExploration && !this.dialog.isActive()) {
            this.pendingExploration = false;
            this.startExploration();
        }

        this.updateTransition();
    }

    refreshQuest() {
        if (this.phase === "grapes" || this.phase === "grapesDone") {
            this.setQuest([
                `Kerää viinirypäleet: ${this.grapesFound}/${this.grapesNeeded}`,
                "Vältä liikkuvia vartijoita"
            ]);
        } else if (this.phase === "explore") {
            this.setQuest([
                `Tutkitut paikat: ${this.exploredSites}/3`,
                "Lähde, viljelymaa ja kukkula"
            ]);
        }
    }
}
