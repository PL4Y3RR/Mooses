class MidianScene extends Phaser.Scene {
    constructor() {
        super("Midian");
    }

    preload() {
        const assets = new AssetLoader(this);
        assets.preload();
    }

    create() {
        this.physics.world.setBounds(0, 0, 1600, 900);
        
        this.cameras.main.setBounds(0, 0, 1600, 900);
        this.cameras.main.setBackgroundColor("#c2b280");

        this.createMountains();
        this.createGrassPatches();
        this.createOasis();
        this.createRocks();
        this.createPlayer();

        this.cameras.main.startFollow(this.player);
        
        this.createSheep();
        this.createBush();
        this.createInput();
        
        this.dialog = new DialogManager();
        this.updateQuestText();

        this.wordQuestActive = false;
        this.collectedWords = [];
        this.expectedWords = ["MINÄ", "OLEN", "SE", "JOKA", "OLEN"];
        this.bushPuzzleSolved = false;
    }

    createMountains() {
        const graphics = this.add.graphics();
        graphics.setDepth(-10);

        graphics.fillStyle(0x708090, 0.7);
        graphics.beginPath();
        graphics.moveTo(0, 500);
        graphics.lineTo(200, 250);
        graphics.lineTo(500, 500);
        graphics.lineTo(800, 200);
        graphics.lineTo(1200, 500);
        graphics.lineTo(1600, 300);
        graphics.lineTo(1600, 900);
        graphics.lineTo(0, 900);
        graphics.closePath();
        graphics.fillPath();

        graphics.fillStyle(0x9e7b56, 0.9);
        graphics.beginPath();
        graphics.moveTo(0, 500);
        graphics.lineTo(350, 320);
        graphics.lineTo(700, 500);
        graphics.lineTo(1050, 380);
        graphics.lineTo(1450, 500);
        graphics.lineTo(1600, 420);
        graphics.lineTo(1600, 900);
        graphics.lineTo(0, 900);
        graphics.closePath();
        graphics.fillPath();
    }

    createGrassPatches() {
        const graphics = this.add.graphics();
        graphics.setDepth(-5);
        graphics.fillStyle(0x557a2b, 0.8);

        const patchPositions = [
            [700, 320], [800, 380], [680, 420], [780, 280],
            [300, 600], [1400, 700], [200, 300], [1000, 450]
        ];

        patchPositions.forEach(pos => {
            graphics.fillCircle(pos[0], pos[1], Phaser.Math.Between(15, 35));
        });
    }

    createPlayer() {
        this.player = this.physics.add.sprite(150, 500, "moses");
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
    }

    createRocks() {
        this.rocks = this.physics.add.staticGroup();
        const positions = [
            [550, 250], [590, 250], [630, 250], [670, 250],
            [1200, 650], [1240, 650]
        ];
        positions.forEach(pos => {
            const rock = this.rocks.create(pos[0], pos[1], "rock");
            rock.setDepth(5);
        });
    }

    createOasis() {
        const grassEdge = this.add.circle(750, 350, 130, 0x4a7c59);
        grassEdge.setDepth(1);

        const edge = this.add.circle(750, 350, 110, 0x2e8b57);
        edge.setDepth(2);

        const water = this.add.circle(750, 350, 95, 0x3fa9f5);
        water.setDepth(3);
    }

    createSheep() {
        this.sheepFound = 0;
        this.totalSheep = 21;
        this.sheepGroup = this.physics.add.group();

        const positions = [
            [250, 200], [1300, 250], [1150, 700],
            [350, 680], [450, 550], [720, 650],
            [850, 220], [1000, 300], [1450, 450],
            [1400, 750], [250, 500], [450, 350],
            [750, 520], [900, 700], [1100, 180],
            [1350, 560], [300, 800], [700, 350],
            [1000, 520], [1500, 200], [1500, 800]
        ];

        positions.forEach(pos => {
            const sheep = this.sheepGroup.create(pos[0], pos[1], "sheep");
            sheep.collected = false;
            sheep.followingPlayer = false;
            sheep.setCollideWorldBounds(true);
            sheep.setBounce(0.35, 0.35);
            sheep.setDepth(8);
            this.setupSheepAI(sheep);
        });

        this.physics.add.collider(this.sheepGroup, this.rocks);
    }

    setupSheepAI(sheep) {
        sheep.moveTimer = this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: () => {
                if (!sheep.active || sheep.collected || sheep.followingPlayer) return;
                if (Math.random() < 0.4) {
                    sheep.setVelocity(0, 0);
                } else {
                    const angle = Phaser.Math.Between(0, 360);
                    const speed = Phaser.Math.Between(20, 50);
                    this.physics.velocityFromAngle(angle, speed, sheep.body.velocity);
                    if (sheep.body.velocity.x !== 0) {
                        sheep.flipX = sheep.body.velocity.x < 0;
                    }
                }
            },
            loop: true
        });
    }

    updateSheep() {
        this.sheepGroup.children.each(sheep => {
            if (!sheep.active || sheep.collected) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                sheep.x,
                sheep.y
            );

            if (!sheep.followingPlayer && distance < 180) {
                sheep.followingPlayer = true;
                sheep.setTint(0xffefbd);
            }

            if (!sheep.followingPlayer) return;

            const angle = Phaser.Math.Angle.Between(
                sheep.x,
                sheep.y,
                this.player.x,
                this.player.y
            );

            this.physics.velocityFromRotation(
                angle,
                72,
                sheep.body.velocity
            );

            if (sheep.body.velocity.x !== 0) {
                sheep.setFlipX(sheep.body.velocity.x < 0);
            }
        });
    }

    createBush() {
        this.bushUnlocked = false;
        this.bush = this.physics.add.sprite(1100, 620, "bush");
        this.bush.setVisible(false);
        this.bush.setDepth(9);
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-SPACE", () => this.interact());
    }

    interact() {
        if (!this.bushUnlocked) return;

        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.bush.x, this.bush.y
        );

        if (distance > 80 || this.dialog.isActive()) return;

        if (!this.bushDialogSeen) {
            this.bushDialogSeen = true;

            this.dialog.start([
                { speaker: "Jumala", text: "Mooses!" },
                { speaker: "Mooses", text: "Tässä minä olen." },
                { speaker: "Jumala", text: "Älä tule lähemmäksi." },
                { speaker: "Jumala", text: "Riisu kengät jaloistasi, sillä paikka jossa seisot on pyhä maa." },
                { speaker: "Jumala", text: "Minä olen sinun isiesi Jumala." },
                { speaker: "Jumala", text: "Olen nähnyt kansani kurjuuden Egyptissä." },
                { speaker: "Jumala", text: "Etsi sanat ja kokoa nimeni oikeaan järjestykseen." }
            ]);

            this.createWordQuest();
        }
    }

    createWordQuest() {
        this.wordQuestActive = true;
        this.wordGroup = this.physics.add.group();

        const words = [
            { text: "MINÄ", x: 300, y: 400 },
            { text: "OLEN", x: 700, y: 180 },
            { text: "SE",   x: 900, y: 350 },
            { text: "JOKA", x: 1200, y: 500 },
            { text: "OLEN", x: 1000, y: 750 }
        ];

        words.forEach(word => {
            const text = this.add.text(
                word.x, word.y, word.text,
                {
                    fontSize: "32px",
                    color: "#ffffff",
                    backgroundColor: "#000088",
                    padding: 8
                }
            );
            text.setDepth(11);

            this.physics.add.existing(text);
            this.wordGroup.add(text);

            this.tweens.add({
                targets: text,
                y: word.y - 10,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    update() {
        const speed = 180;
        this.player.setVelocity(0);

        let isMoving = false;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            isMoving = true;
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            isMoving = true;
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            isMoving = true;
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            isMoving = true;
        }

        if (isMoving) {
            this.player.rotation = Math.sin(this.time.now * 0.015) * 0.05;
        } else {
            this.player.rotation = 0;
        }

        this.updateSheep();
        this.checkSheep();
        this.checkWords();

        this.physics.world.collide(this.player, this.rocks);

        if (this.player.x > 1550 && this.bushPuzzleSolved) {
            this.scene.start("EgyptReturn");
        }
    }

    checkSheep() {
        this.sheepGroup.children.each(sheep => {
            if (sheep.collected || this.dialog.isActive()) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                sheep.x, sheep.y
            );

            if (distance < 45) {
                sheep.collected = true;
                if (sheep.moveTimer) sheep.moveTimer.remove();
                sheep.destroy();

                this.sheepFound++;
                this.updateQuestText();

                if (this.sheepFound >= this.totalSheep) {
                    this.bushUnlocked = true;
                    this.bush.setVisible(true);

                    this.tweens.add({
                        targets: this.bush,
                        alpha: 0.6,
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });

                    this.dialog.start([
                        {
                            speaker: "Mooses",
                            text: "Kaikki 21 lammasta ovat turvassa. Nyt voin lähestyä palavaa pensasta."
                        },
                        {
                            speaker: "Jumala",
                            text: "Tule tänne, Mooses. Minulla on sinulle tehtävä."
                        }
                    ]);
                } else if (this.sheepFound === 7 || this.sheepFound === 14) {
                    this.dialog.start([
                        {
                            speaker: "Mooses",
                            text: `${this.sheepFound} / ${this.totalSheep} lammasta löytynyt. Lähellä olevat lampaat seuraavat minua.`
                        }
                    ]);
                }
            }
        });
    }

    checkWords() {
        if (!this.wordQuestActive || !this.wordGroup) return;

        this.wordGroup.children.each(word => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                word.x, word.y
            );

            if (distance < 40) {
                const expected = this.expectedWords[this.collectedWords.length];

                if (word.text === expected) {
                    this.collectedWords.push(word.text);
                    word.destroy();

                    this.showDialog("Kerätty: " + word.text);

                    if (this.collectedWords.length === 5) {
                        this.wordQuestActive = false;
                        this.bushPuzzleSolved = true;

                        this.showDialog("Oikein! MINÄ OLEN SE JOKA OLEN");
                        
                        this.dialog.start([
                            {
                                speaker: "Jumala",
                                text: "Oikein. Nyt voit jatkaa matkaa Egyptiin."
                            }
                        ]);
                    }
                } else {
                    this.showDialog("Väärä järjestys. Aloita alusta.");
                    this.restartWordQuest();
                }
            }
        });
    }

    restartWordQuest() {
        this.wordGroup.clear(true, true);
        this.collectedWords = [];
        this.createWordQuest();
    }

    updateQuestText() {
        const questList = document.getElementById("quest-list");
        if (!questList) return;

        questList.innerHTML = `
            <li>Lampaat: ${this.sheepFound}/${this.totalSheep}</li>
            <li>
                ${
                    this.sheepFound >= this.totalSheep
                    ? "✅ Kaikki lampaat löydetty"
                    : "⬜ Etsi kaikki 21 lammasta"
                }
            </li>
        `;
    }

    showDialog(text) {
        const dialog = document.getElementById("dialog-box");
        const dialogText = document.getElementById("dialog-text");

        if (!dialog || !dialogText) return;

        dialog.classList.remove("hidden");
        dialogText.textContent = text;

        clearTimeout(this.dialogTimeout);
        this.dialogTimeout = setTimeout(
            () => dialog.classList.add("hidden"),
            5000
        );
    }
}