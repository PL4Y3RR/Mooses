class WildernessScene extends ChapterScene {
    constructor() {
        super("WildernessScene", "Luku 6: Erämaa", 0x7d8b63);
    }

    create() {
        super.create();
        this.player.setPosition(120, 720);
        this.phaseItems = [];
        this.phase = "manna";
        this.mannaCollected = 0;
        this.commandmentsProgress = 0;
        this.createLandscape();
        this.createManna();
        this.input.keyboard.on("keydown-SPACE", () => this.interact());
        this.dialog.start([
            { speaker: "Kertoja", text: "Erämaassa kansa oppi luottamaan siihen, että jokaiselle päivälle riittää." },
            { speaker: "Mooses", text: "Kerätkää aamun manna ja seuratkaa minua." }
        ]);
    }

    createLandscape() {
        const ground = this.add.graphics();
        ground.fillStyle(0xc3b27e, 1);
        ground.fillRect(0, 770, 1800, 130);
        ground.fillStyle(0x69724f, 0.9);
        ground.beginPath();
        ground.moveTo(950, 770);
        ground.lineTo(1170, 350);
        ground.lineTo(1400, 770);
        ground.closePath();
        ground.fillPath();
        ground.fillStyle(0x8e956a, 0.9);
        ground.beginPath();
        ground.moveTo(1180, 770);
        ground.lineTo(1450, 260);
        ground.lineTo(1740, 770);
        ground.closePath();
        ground.fillPath();
        ground.setDepth(-5);

        this.add.text(1490, 245, "SIINAI", {
            fontSize: "22px",
            color: "#fff0c1",
            fontStyle: "bold"
        }).setOrigin(0.5).setDepth(1);
    }

    addPhaseItem(object) {
        if (object.depth === 0) object.setDepth(12);
        this.phaseItems.push(object);
        return object;
    }

    clearPhaseItems() {
        this.phaseItems.forEach(object => object.destroy());
        this.phaseItems = [];
        if (this.commandmentCards) {
            this.commandmentCards.forEach(card => card.destroy());
            this.commandmentCards = [];
        }
        if (this.commandHint) {
            this.commandHint.destroy();
            this.commandHint = null;
        }
    }

    createManna() {
        this.phase = "manna";
        this.clearPhaseItems();
        this.manna = [];
        this.phasePrompt = this.add.text(800, 115, "Kerää 12 manna-annosta", {
            fontSize: "25px",
            color: "#fff4cf",
            backgroundColor: "#394334",
            padding: { x: 14, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        for (let index = 0; index < 12; index++) {
            const x = 240 + (index % 6) * 255;
            const y = 250 + Math.floor(index / 6) * 260;
            const manna = this.add.container(x, y, [
                this.add.ellipse(0, 0, 34, 24, 0xf6edc9),
                this.add.ellipse(-5, -4, 10, 7, 0xffffff),
                this.add.ellipse(7, 4, 8, 6, 0xd6c691)
            ]);
            this.addPhaseItem(manna);
            this.manna.push({ object: manna, x, y, phase: index, collected: false });
        }
        this.refreshQuest();
    }

    interact() {
        if (this.dialog.isActive() || this.nextScene) return;

        if (this.phase !== "rock") return;

        const rock = this.rocks.find(item =>
            !item.hit && Phaser.Math.Distance.Between(
                this.player.x, this.player.y, item.x, item.y
            ) < 105
        );
        if (!rock) return;

        if (!rock.correct) {
            this.setQuest(["Tämä kallio ei vastaa. Etsi toinen ja kokeile uudelleen."]);
            return;
        }

        rock.hit = true;
        const water = this.addPhaseItem(
            this.add.ellipse(rock.x, rock.y - 35, 38, 70, 0x63c7e6, 0.9)
        );
        this.tweens.add({
            targets: water,
            y: rock.y - 150,
            alpha: 0,
            duration: 900
        });
        this.phase = "rockDone";
        this.pendingPhase = "commandments";
        this.dialog.start([
            { speaker: "Mooses", text: "Vesi pulppusi kalliosta ja kansa sai juotavaa." },
            { speaker: "Kertoja", text: "Siinain vuorella Mooses vastaanotti käskyt." }
        ]);
    }

    startRockChallenge() {
        this.phase = "rock";
        this.clearPhaseItems();
        this.rocks = [
            { x: 540, y: 570, correct: false, hit: false },
            { x: 930, y: 460, correct: true, hit: false },
            { x: 1320, y: 610, correct: false, hit: false }
        ];
        this.rocks.forEach((rock, index) => {
            const shape = this.add.container(rock.x, rock.y, [
                this.add.ellipse(0, 0, 150, 100, index === 1 ? 0x807d65 : 0x777663),
                this.add.ellipse(-25, -12, 72, 34, 0x99947b),
                this.add.ellipse(35, 12, 48, 25, 0x666653)
            ]);
            this.addPhaseItem(shape);
        });
        this.phasePrompt.setText("Etsi oikea kallio. Lähesty ja lyö sitä SPACE-näppäimellä.");
        this.refreshQuest();
    }

    createCommandments() {
        this.phase = "commandments";
        this.clearPhaseItems();
        this.commandmentsProgress = 0;
        this.phasePrompt.setText("Kymmenen käskyä");
        this.commandHint = this.add.text(800, 160, "Järjestä käskyt oikeaan järjestykseen klikkaamalla", {
            fontSize: "22px",
            color: "#fff4cf",
            backgroundColor: "#394334",
            padding: { x: 14, y: 8 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.commandments = [
            "Älä pidä muita jumalia.",
            "Älä käytä Herran nimeä väärin.",
            "Pyhitä lepopäivä.",
            "Kunnioita isääsi ja äitiäsi.",
            "Älä tapa.",
            "Älä tee aviorikosta.",
            "Älä varasta.",
            "Älä todista väärin.",
            "Älä himoitse lähimmäisesi puolisoa.",
            "Älä himoitse lähimmäisesi omaisuutta."
        ];
        const displayOrder = [6, 2, 9, 0, 4, 8, 1, 5, 3, 7];
        this.commandmentCards = [];

        displayOrder.forEach((commandIndex, slot) => {
            const column = slot % 2;
            const row = Math.floor(slot / 2);
            const card = this.add.text(
                column === 0 ? 420 : 1180,
                225 + row * 112,
                this.commandments[commandIndex],
                {
                    fontSize: "18px",
                    color: "#fff7dd",
                    backgroundColor: "#425a45",
                    padding: { x: 14, y: 12 },
                    wordWrap: { width: 610 }
                }
            ).setOrigin(0.5).setScrollFactor(0).setDepth(110);
            card.setInteractive({ useHandCursor: true });
            card.commandIndex = commandIndex;
            card.answered = false;
            card.on("pointerdown", () => {
                this.chooseCommandment(card.commandIndex, card);
            });
            this.commandmentCards.push(card);
        });
        this.refreshQuest();
    }

    chooseCommandment(commandIndex, card) {
        if (this.phase !== "commandments" || this.dialog.isActive() || card.answered) return;

        if (commandIndex !== this.commandmentsProgress) {
            this.commandHint.setText("Tämä ei ole seuraava käsky. Yritä toista.");
            card.setStyle({ backgroundColor: "#8b3c32" });
            this.time.delayedCall(500, () => {
                if (card.active && !card.answered) {
                    card.setStyle({ backgroundColor: "#425a45" });
                }
                if (this.commandHint && this.commandHint.active) {
                    this.commandHint.setText("Järjestä käskyt oikeaan järjestykseen klikkaamalla");
                }
            });
            return;
        }

        card.answered = true;
        card.disableInteractive();
        card.setStyle({ color: "#d8e9ae", backgroundColor: "#33463a" });
        card.setText(`${this.commandmentsProgress + 1}. ${this.commandments[commandIndex]}`);
        this.commandmentsProgress++;
        this.refreshQuest();

        if (this.commandmentsProgress === this.commandments.length) {
            this.phase = "calfReady";
            this.dialog.start([
                { speaker: "Kertoja", text: "Mooses viipyi vuorella. Leirissä kansa alkoi menettää kärsivällisyytensä." },
                { speaker: "Aaron", text: "Kansa valoi kultaisen vasikan ja alkoi palvoa sitä." }
            ]);
            this.pendingCalf = true;
        }
    }

    createGoldenCalf() {
        this.phase = "calf";
        this.clearPhaseItems();
        this.phasePrompt.setText("Kultainen vasikka");
        const calf = this.add.container(900, 520, [
            this.add.ellipse(0, 0, 260, 145, 0xd7a62e),
            this.add.circle(-115, -76, 62, 0xe4b938),
            this.add.circle(115, -76, 62, 0xe4b938),
            this.add.ellipse(0, -72, 140, 96, 0xd7a62e),
            this.add.circle(-35, -78, 7, 0x342b1e),
            this.add.circle(35, -78, 7, 0x342b1e),
            this.add.rectangle(-75, 96, 28, 94, 0xb78222),
            this.add.rectangle(75, 96, 28, 94, 0xb78222)
        ]);
        this.addPhaseItem(calf);
        this.setQuest(["Kultainen vasikka on leirissä", "Kuuntele Mooseksen paluu"]);
        this.dialog.start([
            { speaker: "Mooses", text: "Miksi käännyitte pois siitä tiestä, jonka Herra antoi?" },
            { speaker: "Kertoja", text: "Kansa ymmärsi rikkoneensa luottamuksen. Matka jatkui kohti luvattua maata." }
        ]);
        this.pendingSpies = true;
    }

    refreshQuest() {
        if (this.phase === "manna") {
            this.setQuest([`Kerää manna: ${this.mannaCollected}/12`, "Liiku nuolinäppäimillä"]);
        } else if (this.phase === "rock") {
            this.setQuest(["Etsi oikea kallio", "Lähesty ja paina SPACE"]);
        } else if (this.phase === "commandments") {
            this.setQuest([`Käskyt järjestyksessä: ${this.commandmentsProgress}/10`]);
        }
    }

    update(time) {
        this.movePlayer(190);
        this.updateTransition();

        if (this.pendingPhase && !this.dialog.isActive()) {
            const phase = this.pendingPhase;
            this.pendingPhase = null;
            if (phase === "rock") this.startRockChallenge();
            if (phase === "commandments") this.createCommandments();
        }

        if (this.pendingCalf && !this.dialog.isActive()) {
            this.pendingCalf = false;
            this.createGoldenCalf();
        }

        if (this.pendingSpies && !this.dialog.isActive()) {
            this.pendingSpies = false;
            this.transitionAfterDialog("SpiesScene", [
                { speaker: "Mooses", text: "Valitkaa vakoojia tutkimaan luvattua maata." }
            ]);
        }

        if (this.dialog.isActive()) return;

        if (this.phase === "manna") {
            this.manna.forEach(item => {
                if (item.collected) return;
                item.object.y = item.y + Math.sin(time / 300 + item.phase) * 8;
                if (Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, item.object.x, item.object.y
                ) < 48) {
                    item.collected = true;
                    item.object.destroy();
                    this.mannaCollected++;
                    this.refreshQuest();
                }
            });
            if (this.mannaCollected >= 12) {
                this.phase = "mannaDone";
                this.pendingPhase = "rock";
                this.dialog.start([
                    { speaker: "Mooses", text: "Jokaiselle riitti manna. Etsikää nyt kallio, josta saamme vettä." }
                ]);
            }
        }

        this.updateTransition();
    }
}
