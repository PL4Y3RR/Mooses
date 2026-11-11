class PlaguesScene extends ChapterScene {
    constructor() {
        super("PlaguesScene", "Luku 4: Kymmenen vitsausta", 0x183e46);
        this.plagueNames = [
            "Vesi vereksi",
            "Sammakot",
            "Sääsket",
            "Paarmat",
            "Karjarutto",
            "Paiseet",
            "Rakeet",
            "Heinäsirkat",
            "Pimeys",
            "Esikoisten yö"
        ];
    }

    create() {
        super.create();
        this.input.on("pointerdown", pointer => this.handlePointer(pointer));
        this.startPlague(0);
        this.dialog.start([
            { speaker: "Kertoja", text: "Farao ei kuunnellut. Egyptin yllä alkoi kymmenen vitsauksen aika." },
            { speaker: "Mooses", text: "Herra, johdata kansasi vapauteen." }
        ]);
    }

    startPlague(index) {
        if (this.stageObjects) {
            this.stageObjects.forEach(object => object.destroy());
        }

        if (this.phasePrompt) this.phasePrompt.destroy();

        this.plagueIndex = index;
        this.progress = 0;
        this.elapsed = 0;
        this.phaseComplete = false;
        this.targets = [];
        this.animals = [];
        this.doors = [];
        this.flies = [];
        this.reactionSignal = null;
        this.stageObjects = [];
        this.player.setPosition(120, 720);
        this.player.setDepth(30);

        const name = this.plagueNames[index];
        this.phasePrompt = this.add.text(800, 112, `${index + 1} / 10  ${name}`, {
            fontSize: "28px",
            color: "#fff4cf",
            backgroundColor: "#152b30",
            padding: { x: 16, y: 10 },
            align: "center"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        if (index === 0) this.createRiver();
        if (index === 1) this.createClickTargets(20, "frog");
        if (index === 2) this.createClickTargets(12, "gnat");
        if (index === 3) this.createFlies();
        if (index === 4) this.createCattle();
        if (index === 5) this.startReaction();
        if (index === 6) this.createShelter();
        if (index === 7) this.createClickTargets(15, "locust");
        if (index === 8) this.createDarkness();
        if (index === 9) this.createDoors();

        this.refreshQuest();
    }

    addStageObject(object) {
        object.setDepth(object.depth || 10);
        this.stageObjects.push(object);
        return object;
    }

    createRiver() {
        this.addStageObject(this.add.rectangle(900, 480, 900, 180, 0x337f9a));
        this.addStageObject(this.add.rectangle(900, 382, 900, 18, 0xd7bd83));
        this.addStageObject(this.add.rectangle(900, 578, 900, 18, 0xd7bd83));
        this.phasePrompt.setText("Klikkaa Niiliä, kunnes sen vesi muuttuu vereksi.");
        this.river = this.stageObjects[0];
    }

    createClickTargets(count, kind) {
        for (let index = 0; index < count; index++) {
            const x = 250 + (index % 5) * 285;
            const y = 235 + Math.floor(index / 5) * 145;
            const parts = [];

            if (kind === "frog") {
                parts.push(
                    this.add.ellipse(0, 5, 40, 28, 0x59a84f),
                    this.add.circle(-11, -7, 7, 0x78c85d),
                    this.add.circle(11, -7, 7, 0x78c85d),
                    this.add.circle(-11, -7, 2, 0x17231f),
                    this.add.circle(11, -7, 2, 0x17231f)
                );
            } else if (kind === "gnat") {
                parts.push(
                    this.add.circle(0, 0, 6, 0x25312a),
                    this.add.ellipse(-8, -5, 13, 6, 0xd9e5d1, 0.8),
                    this.add.ellipse(8, -5, 13, 6, 0xd9e5d1, 0.8)
                );
            } else {
                parts.push(
                    this.add.ellipse(0, 0, 24, 13, 0x7d9d35),
                    this.add.ellipse(-8, -7, 15, 7, 0xc3d36a),
                    this.add.ellipse(8, -7, 15, 7, 0xc3d36a)
                );
            }

            const target = this.add.container(x, y, parts);
            target.setSize(48, 42);
            this.addStageObject(target);
            this.targets.push({ x, y, object: target });
        }
    }

    createFlies() {
        for (let index = 0; index < 8; index++) {
            const x = 360 + (index % 4) * 330;
            const y = 260 + Math.floor(index / 4) * 260;
            const fly = this.add.container(x, y, [
                this.add.circle(0, 0, 7, 0x262b22),
                this.add.ellipse(-8, -4, 14, 6, 0xd9e5d1, 0.8),
                this.add.ellipse(8, -4, 14, 6, 0xd9e5d1, 0.8)
            ]);
            this.addStageObject(fly);
            this.flies.push({ object: fly, homeX: x, homeY: y, phase: index });
        }
        this.phasePrompt.setText("Väistä paarmoja 12 sekuntia. Osuma palauttaa ajan.");
        this.safeTime = 0;
        this.hitCooldown = 0;
    }

    createCattle() {
        [[460, 430], [820, 570], [1150, 380], [1450, 610]].forEach(([x, y], index) => {
            const cow = this.add.container(x, y, [
                this.add.ellipse(0, 0, 72, 42, 0xf1e9d4),
                this.add.circle(-22, -15, 12, 0xeee4d0),
                this.add.circle(22, -15, 12, 0xeee4d0),
                this.add.ellipse(-12, 2, 19, 13, 0x403b35),
                this.add.ellipse(20, -8, 14, 11, 0x403b35),
                this.add.circle(32, -5, 3, 0x292620)
            ]);
            this.addStageObject(cow);
            this.animals.push({ object: cow, x, y, healed: false, index });
        });
        this.phasePrompt.setText("Auta neljää sairasta eläintä. Lähesty ja paina SPACE.");
    }

    startReaction() {
        this.reactionReady = false;
        this.reactionWait = Phaser.Math.Between(900, 1900);
        this.phasePrompt.setText("Odota merkkiä ja paina sitten SPACE. Onnistumisia tarvitaan kolme.");
        if (!this.reactionSignal || !this.reactionSignal.active) {
            this.reactionSignal = this.addStageObject(
                this.add.circle(800, 460, 54, 0x8c342d)
            );
        } else {
            this.reactionSignal.setFillStyle(0x8c342d);
        }
    }

    createShelter() {
        const shelter = this.add.container(1430, 650, [
            this.add.rectangle(0, 25, 190, 110, 0x69472c),
            this.add.triangle(0, -38, -115, 25, 0, -65, 115, 25, 0x9b7041),
            this.add.rectangle(0, 48, 42, 64, 0x31251e)
        ]);
        this.addStageObject(shelter);
        this.shelter = { x: 1430, y: 660 };
        this.phasePrompt.setText("Juokse suojaan ja pysy siellä viiden sekunnin raesateen ajan.");
        this.shelterTime = 0;
        for (let index = 0; index < 28; index++) {
            const hail = this.add.circle(
                Phaser.Math.Between(100, 1700),
                Phaser.Math.Between(170, 850),
                Phaser.Math.Between(5, 10),
                0xe7f0f1
            );
            this.addStageObject(hail);
            this.tweens.add({
                targets: hail,
                y: 900,
                duration: Phaser.Math.Between(900, 1800),
                repeat: -1,
                onRepeat: () => hail.setPosition(
                    Phaser.Math.Between(100, 1700),
                    Phaser.Math.Between(120, 250)
                )
            });
        }
    }

    createDarkness() {
        this.darkness = this.addStageObject(
            this.add.rectangle(800, 450, 1800, 900, 0x080b12, 0.94)
                .setScrollFactor(0)
                .setDepth(50)
        );
        this.light = this.addStageObject(
            this.add.circle(800, 450, 115, 0xffd779, 0.18)
                .setScrollFactor(0)
                .setDepth(51)
        );
        this.player.setDepth(52);
        this.phasePrompt.setText("Pimeys peittää maan. Etsi tien itäpäähän valon turvin.");
        this.addStageObject(this.add.rectangle(1690, 725, 90, 150, 0xe6c77e, 0.25));
    }

    createDoors() {
        [400, 900, 1400].forEach((x, index) => {
            const door = this.add.container(x, 500, [
                this.add.rectangle(0, 15, 88, 125, 0x5a3828),
                this.add.rectangle(0, 18, 62, 112, 0x9a704a),
                this.add.circle(20, 20, 4, 0xe8c86d)
            ]);
            this.addStageObject(door);
            this.doors.push({ object: door, x, y: 520, marked: false, index });
        });
        this.phasePrompt.setText("Merkitse kolmen ovenpielet karitsan verellä. Lähesty ja paina SPACE.");
    }

    handlePointer(pointer) {
        if (this.dialog.isActive() || this.phaseComplete || this.nextScene) return;

        const x = pointer.worldX;
        const y = pointer.worldY;

        if (this.plagueIndex === 0) {
            if (x < 450 || x > 1350 || y < 390 || y > 570) return;
            this.progress = Math.min(8, this.progress + 1);
            this.river.fillColor = 0x8d3332;
            this.river.setAlpha(0.35 + this.progress * 0.08);
            this.refreshQuest();
            if (this.progress >= 8) this.finishPlague("Niili muuttui vereksi. Farao ei silti päästänyt kansaa.");
            return;
        }

        const clickPlagues = [1, 2, 7];
        if (!clickPlagues.includes(this.plagueIndex)) return;

        const target = this.targets.find(item =>
            Phaser.Math.Distance.Between(x, y, item.x, item.y) < 44
        );
        if (!target) return;

        target.object.destroy();
        this.targets = this.targets.filter(item => item !== target);
        this.progress++;
        this.refreshQuest();

        const required = this.plagueIndex === 1 ? 20 : this.plagueIndex === 2 ? 12 : 15;
        if (this.progress >= required) {
            const message = this.plagueIndex === 1
                ? "Sammakot täyttivät maan ja talot."
                : this.plagueIndex === 2
                    ? "Sääsket piinasivat ihmisiä ja eläimiä."
                    : "Heinäsirkat söivät sen, mitä rae ei ollut tuhonnut.";
            this.finishPlague(message);
        }
    }

    handleAction() {
        if (this.dialog.isActive() || this.phaseComplete || this.nextScene) return;

        if (this.plagueIndex === 4) {
            const animal = this.animals.find(item =>
                !item.healed && Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, item.x, item.y
                ) < 100
            );
            if (!animal) return;
            animal.healed = true;
            animal.object.setAlpha(0.55);
            this.progress++;
            this.refreshQuest();
            if (this.progress === this.animals.length) {
                this.finishPlague("Mooses yritti auttaa eläimiä, mutta karjarutto levisi silti Egyptissä.");
            }
        } else if (this.plagueIndex === 5) {
            if (!this.reactionReady) {
                this.reactionWait = Math.max(this.reactionWait, 700);
                return;
            }
            this.progress++;
            this.reactionReady = false;
            this.reactionSignal.fillColor = 0x8c342d;
            this.refreshQuest();
            if (this.progress >= 3) {
                this.finishPlague("Merkki annettiin ajoissa, mutta faraon sydän pysyi kovana.");
            } else {
                this.startReaction();
            }
        } else if (this.plagueIndex === 9) {
            const door = this.doors.find(item =>
                !item.marked && Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, item.x, item.y
                ) < 105
            );
            if (!door) return;
            door.marked = true;
            this.progress++;
            this.addStageObject(this.add.rectangle(door.x - 42, door.y - 20, 8, 54, 0x8c3030));
            this.addStageObject(this.add.rectangle(door.x + 42, door.y - 20, 8, 54, 0x8c3030));
            this.refreshQuest();
            if (this.progress === this.doors.length) {
                this.finishPlague("Ovenpielet on merkitty. Perheet pysyivät turvassa yön yli.");
            }
        }
    }

    finishPlague(message) {
        if (this.phaseComplete) return;
        this.phaseComplete = true;

        if (this.plagueIndex === 9) {
            this.transitionAfterDialog("ExodusScene", [
                { speaker: "Kertoja", text: message },
                { speaker: "Mooses", text: "Nyt lähdemme Egyptistä. Seuratkaa minua!" }
            ]);
        } else {
            this.dialog.start([
                { speaker: "Kertoja", text: message },
                { speaker: "Farao", text: "En päästä kansaa." }
            ]);
        }
    }

    refreshQuest() {
        const descriptions = [
            `Klikkaa Niiliä: ${this.progress}/8`,
            `Kerää sammakot: ${this.progress}/20`,
            `Osu sääskiin: ${this.progress}/12`,
            `Väistä paarmoja: ${Math.floor(this.safeTime || 0)}/12 s`,
            `Auta eläimiä: ${this.progress}/4`,
            `Reaktiot: ${this.progress}/3`,
            `Suojassa: ${Math.floor(this.shelterTime || 0)}/5 s`,
            `Heinäsirkat: ${this.progress}/15`,
            "Etsi itäinen tie pimeässä",
            `Merkityt ovet: ${this.progress}/3`
        ];
        this.setQuest([descriptions[this.plagueIndex]]);
    }

    update(time, delta) {
        this.movePlayer(205);
        this.updateTransition();

        if (this.phaseComplete) {
            if (!this.dialog.isActive() && !this.nextScene) {
                this.startPlague(this.plagueIndex + 1);
            }
            return;
        }

        if (this.dialog.isActive()) return;

        if (this.plagueIndex === 3) this.updateFlies(delta, time);
        if (this.plagueIndex === 5) this.updateReaction(delta);
        if (this.plagueIndex === 6) this.updateShelter(delta);
        if (this.plagueIndex === 8 && this.player.x > 1690) {
            this.finishPlague("Pimeyden jälkeen valo palasi, mutta farao ei muuttanut päätöstään.");
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.handleAction();
        this.updateTransition();
    }

    updateFlies(delta, time) {
        this.flies.forEach(fly => {
            fly.object.setPosition(
                fly.homeX + Math.sin(time / 300 + fly.phase) * 95,
                fly.homeY + Math.cos(time / 240 + fly.phase) * 72
            );
        });

        this.hitCooldown = Math.max(0, this.hitCooldown - delta);
        const hit = this.flies.some(fly =>
            Phaser.Math.Distance.Between(
                this.player.x, this.player.y, fly.object.x, fly.object.y
            ) < 58
        );

        if (hit && this.hitCooldown === 0) {
            this.safeTime = 0;
            this.hitCooldown = 1200;
            this.refreshQuest();
        } else if (!hit) {
            this.safeTime += delta / 1000;
            this.refreshQuest();
            if (this.safeTime >= 12) this.finishPlague("Paarmat väistyivät, ja tie pysyi avoinna.");
        }
    }

    updateReaction(delta) {
        if (this.reactionReady) return;
        this.reactionWait -= delta;
        if (this.reactionWait <= 0) {
            this.reactionReady = true;
            this.reactionSignal.fillColor = 0x6abf69;
            this.phasePrompt.setText("NYT! Paina SPACE.");
        }
    }

    updateShelter(delta) {
        const safe = Math.abs(this.player.x - this.shelter.x) < 95 &&
            Math.abs(this.player.y - this.shelter.y) < 85;
        this.shelterTime = safe ? this.shelterTime + delta / 1000 : 0;
        this.refreshQuest();
        if (this.shelterTime >= 5) {
            this.finishPlague("Mooses ja hänen väkensä pääsivät suojaan raesateelta.");
        }
    }
}
