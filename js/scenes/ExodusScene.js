class ExodusScene extends ChapterScene {
    constructor() {
        super("ExodusScene", "Luku 5: Exodus", 0x9a6b45);
    }

    create() {
        super.create();
        this.player.setPosition(120, 700);
        this.phase = "gather";
        this.peopleJoined = 0;
        this.peopleNeeded = 5;
        this.sheepJoined = 0;
        this.sheepNeeded = 3;
        this.companions = [];
        this.createRoute();
        this.createPeople();
        this.createSheep();
        this.createPowerMeter();
        this.refreshQuest();
        this.dialog.start([
            { speaker: "Kertoja", text: "Farao päästi kansan lähtemään. Mooses johtaa väen kohti erämaata." },
            { speaker: "Mooses", text: "Kukaan ei jää jälkeen. Kootkaa myös lampaat." }
        ]);
    }

    createRoute() {
        const ground = this.add.graphics();
        ground.fillStyle(0x77583b, 1);
        ground.fillRect(0, 770, 1800, 130);
        ground.fillStyle(0x4a9cc2, 0.94);
        ground.fillRect(700, 0, 460, 900);
        ground.fillStyle(0x23799d, 0.6);
        for (let index = 0; index < 8; index++) {
            ground.fillEllipse(750 + index * 55, 180 + (index % 2) * 90, 90, 24);
        }
        ground.setDepth(-5);

        this.add.text(920, 790, "PUNAINEN MERI", {
            fontSize: "24px",
            color: "#e4f5ff",
            fontStyle: "bold"
        }).setOrigin(0.5).setDepth(2);

        this.seaLeft = this.add.rectangle(815, 440, 230, 900, 0x2488b0, 0.95)
            .setDepth(8);
        this.seaRight = this.add.rectangle(1045, 440, 230, 900, 0x2488b0, 0.95)
            .setDepth(8);
    }

    createPeople() {
        const positions = [
            [360, 500], [500, 300], [600, 650], [420, 760], [620, 430]
        ];
        const colors = [0xe8c64d, 0x78a9c1, 0xa77bba, 0x88aa66, 0xd98964];

        positions.forEach(([x, y], index) => {
            const person = this.add.image(x, y, "aaron")
                .setTint(colors[index])
                .setDepth(12);
            const label = this.add.text(x, y + 34, "KANSAA", {
                fontSize: "12px",
                color: "#fff4cf",
                backgroundColor: "#3b2b20",
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5).setDepth(12);
            this.companions.push({
                object: person,
                label,
                joined: false,
                type: "person",
                homeX: x,
                homeY: y,
                slot: index
            });
        });
    }

    createSheep() {
        [[460, 600], [560, 540], [650, 740]].forEach(([x, y], index) => {
            const sheep = this.add.image(x, y, "sheep").setDepth(12);
            this.companions.push({
                object: sheep,
                label: null,
                joined: false,
                type: "sheep",
                homeX: x,
                homeY: y,
                slot: index
            });
        });
    }

    createPowerMeter() {
        this.powerBar = this.add.graphics()
            .setScrollFactor(0)
            .setDepth(90);
    }

    interact() {
        if (this.dialog.isActive() || this.phase !== "gather") return;

        const available = this.companions
            .filter(companion => !companion.joined)
            .sort((a, b) =>
                Phaser.Math.Distance.Between(this.player.x, this.player.y, a.object.x, a.object.y) -
                Phaser.Math.Distance.Between(this.player.x, this.player.y, b.object.x, b.object.y)
            );
        const target = available[0];

        if (!target || Phaser.Math.Distance.Between(
            this.player.x, this.player.y, target.object.x, target.object.y
        ) > 95) return;

        target.joined = true;
        if (target.type === "person") {
            this.peopleJoined++;
            if (target.label) target.label.destroy();
        } else {
            this.sheepJoined++;
        }

        this.refreshQuest();
        if (this.peopleJoined >= this.peopleNeeded && this.sheepJoined >= this.sheepNeeded) {
            this.startSeaChallenge();
        }
    }

    startSeaChallenge() {
        this.phase = "charge";
        this.player.setPosition(560, 700);
        this.dialog.start([
            { speaker: "Aaron", text: "Faraon sotilaat lähestyvät. Meri on edessämme." },
            { speaker: "Mooses", text: "Pidä SPACE painettuna ja kokoa voima. Tie aukeaa." }
        ]);
        this.refreshQuest();
    }

    openSea() {
        if (this.phase !== "charge") return;
        this.phase = "opening";
        this.power = 100;
        this.tweens.add({
            targets: this.seaLeft,
            x: 300,
            duration: 1800,
            ease: "Cubic.easeInOut"
        });
        this.tweens.add({
            targets: this.seaRight,
            x: 1500,
            duration: 1800,
            ease: "Cubic.easeInOut",
            onComplete: () => {
                this.phase = "crossing";
                this.player.setPosition(650, 700);
                this.crossingTime = 25;
                this.createGuards();
                this.dialog.start([
                    { speaker: "Kertoja", text: "Meri jakautui, ja kansa kulki kuivaa maata pitkin." },
                    { speaker: "Mooses", text: "Älkää pysähtykö. Pääskää toiselle rannalle!" }
                ]);
                this.refreshQuest();
            }
        });
    }

    createGuards() {
        this.guards = [
            this.add.circle(1510, 300, 20, 0x332c29).setDepth(18),
            this.add.circle(1580, 620, 20, 0x332c29).setDepth(18),
            this.add.circle(1470, 760, 20, 0x332c29).setDepth(18)
        ];
    }

    followCompanions() {
        this.companions.forEach(companion => {
            if (!companion.joined || !companion.object.active) return;
            const slot = companion.slot + (companion.type === "sheep" ? 5 : 0);
            const targetX = this.player.x - 62 - (slot % 3) * 34;
            const targetY = this.player.y + 22 + (slot % 2) * 28;
            companion.object.x += (targetX - companion.object.x) * 0.08;
            companion.object.y += (targetY - companion.object.y) * 0.08;
            if (companion.label) {
                companion.label.setPosition(companion.object.x, companion.object.y + 34);
            }
            if (companion.type === "sheep") {
                companion.object.setFlipX(targetX < companion.object.x);
            }
        });
    }

    refreshQuest() {
        if (this.phase === "gather") {
            this.setQuest([
                `Kokoa kansa: ${this.peopleJoined}/${this.peopleNeeded}`,
                `Ota lampaat mukaan: ${this.sheepJoined}/${this.sheepNeeded}`,
                "Lähesty ja paina SPACE"
            ]);
        } else if (this.phase === "charge" || this.phase === "opening") {
            this.setQuest([
                "Punainenmeri",
                "Pidä SPACE pohjassa ja täytä voimamittari",
                `${Math.floor(this.power || 0)}%`
            ]);
        } else {
            this.setQuest([
                `Kulje meren yli: ${Math.max(0, Math.ceil(this.crossingTime || 0))} s`,
                "Pidä kansa ja lampaat mukanasi",
                "Väistä egyptiläisiä vartijoita"
            ]);
        }
    }

    update(time, delta) {
        this.movePlayer(205);
        this.followCompanions();

        if (this.phase === "gather" && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.interact();
        }

        if (this.phase === "charge" && !this.dialog.isActive()) {
            this.power = Phaser.Math.Clamp(
                (this.power || 0) + (this.spaceKey.isDown ? delta * 0.075 : -delta * 0.025),
                0,
                100
            );
            this.powerBar.clear();
            this.powerBar.fillStyle(0x17231f, 0.9).fillRoundedRect(470, 155, 660, 30, 8);
            this.powerBar.fillStyle(0xf1c75b, 1).fillRoundedRect(478, 161, 644 * this.power / 100, 18, 6);
            this.refreshQuest();
            if (this.power >= 100) this.openSea();
        }

        if (this.phase === "crossing" && !this.dialog.isActive()) {
            this.crossingTime -= delta / 1000;
            this.guards.forEach(guard => {
                const angle = Phaser.Math.Angle.Between(
                    guard.x, guard.y, this.player.x, this.player.y
                );
                guard.x += Math.cos(angle) * 55 * delta / 1000;
                guard.y += Math.sin(angle) * 55 * delta / 1000;
                if (Phaser.Math.Distance.Between(guard.x, guard.y, this.player.x, this.player.y) < 80) {
                    this.crossingTime -= delta / 1000;
                }
            });
            this.refreshQuest();

            const groupReachedBank = this.companions.every(
                companion => companion.object.x > 1450
            );

            if (this.player.x > 1690 && groupReachedBank) {
                this.transitionAfterDialog("WildernessScene", [
                    { speaker: "Aaron", text: "Kansa ja lampaat pääsivät turvaan." },
                    { speaker: "Kertoja", text: "Erämaassa odotti pitkä matka." }
                ]);
            } else if (this.crossingTime <= 0) {
                this.player.setPosition(650, 700);
                this.crossingTime = 25;
                this.dialog.start([
                    { speaker: "Aaron", text: "Vartijat ovat lähellä. Jatketaan nopeasti!" }
                ]);
            }
        }

        this.updateTransition();
    }
}
