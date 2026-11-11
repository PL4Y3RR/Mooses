class PharaohPalaceScene extends Phaser.Scene {

    constructor() {
        super("PharaohPalace");
    }

    preload() {

        const assets =
            new AssetLoader(this);

        assets.preload();
    }

    create() {

        this.physics.world.setBounds(
            0,
            0,
            1800,
            900
        );

        this.cameras.main.setBounds(
            0,
            0,
            1800,
            900
        );

        this.cameras.main.setBackgroundColor(
            "#d8c087"
        );

        this.createPalace();

        this.createPlayer();

        this.playerFacing = 1;

        this.createAaron();

        this.createPharaoh();

        this.createMagicians();

        this.createInput();

        this.dialog =
            new DialogManager();

        this.dialogFinished = false;

        this.dialogStarted = false;

        this.pendingStaffContest = false;

        this.pendingResultDialog = false;

        this.pendingPlagueTransition = false;

        this.snakePuzzleStarted = false;

        this.snakePuzzleSolved = false;

        this.cameras.main.startFollow(
            this.player
        );

        this.updateQuestText();
    }

    createPalace() {

        const graphics =
            this.add.graphics();

        graphics.fillStyle(
            0xe0c080,
            1
        );

        graphics.fillRect(
            600,
            100,
            700,
            600
        );

        graphics.fillStyle(
            0xb8860b,
            1
        );

        for(let i=0;i<6;i++) {

            graphics.fillRect(
                700 + i * 90,
                150,
                30,
                500
            );
        }

        this.add.text(
            950,
            70,
            "FARAON PALATSI",
            {
                fontSize:"32px",
                color:"#222"
            }
        ).setOrigin(0.5);
    }

    createPlayer() {

        this.player =
            this.physics.add.sprite(
                150,
                500,
                "moses"
            );

        this.player.setDepth(10);

        this.player.setCollideWorldBounds(
            true
        );
    }

    createPharaoh() {

        this.pharaoh =
            this.physics.add.staticSprite(
                1050,
                450,
                "pharaoh"
            );

        this.pharaoh.setDepth(10);
    }

    createAaron() {

        this.aaron =
            this.physics.add.sprite(
                this.player.x - 48,
                this.player.y + 12,
                "aaron"
            );

        this.aaron.setDepth(9);

        this.aaron.setCollideWorldBounds(true);
    }

    createMagicians() {

        this.magicians = [
            this.createMagician(1190, 375, 0x754153),
            this.createMagician(1190, 525, 0x3e6572)
        ];
    }

    createMagician(x, y, robeColor) {

        const figure = this.add.container(
            x,
            y,
            [
                this.add.rectangle(0, 14, 30, 38, robeColor),
                this.add.rectangle(0, 1, 23, 4, 0xd2b779),
                this.add.circle(0, -13, 10, 0xc99472),
                this.add.rectangle(0, -24, 27, 6, robeColor)
            ]
        );

        figure.setDepth(8);

        const staff = this.add.image(
            x + 25,
            y + 12,
            "staff"
        );

        staff.setScale(0.42);
        staff.setRotation(0.18);
        staff.setDepth(9);

        return { figure, staff };
    }

    createInput() {

        this.cursors =
            this.input.keyboard.createCursorKeys();

        this.input.keyboard.on(
            "keydown-SPACE",
            () => this.interact()
        );
    }

    interact() {

        if(
            this.dialog.isActive()
        ) {
            return;
        }

        const distance =
        Phaser.Math.Distance.Between(

            this.player.x,
            this.player.y,

            this.pharaoh.x,
            this.pharaoh.y
        );

        if(distance > 120)
            return;

        if(!this.dialogStarted) {

            this.dialogStarted = true;
            this.pendingStaffContest = true;

            this.dialog.start([

                {
                    speaker:"Mooses",
                    text:"Näin sanoo Herra: päästä minun kansani."
                },

                {
                    speaker:"Farao",
                    text:"Kuka on Herra?"
                },

                {
                    speaker:"Aaron",
                    text:"Israelin Jumala."
                },

                {
                    speaker:"Farao",
                    text:"En päästä kansaa."
                },

                {
                    speaker:"Mooses",
                    text:"Näytämme sinulle merkin."
                }

            ]);
        }
    }

    createSnakePuzzle() {

        if (this.snakePuzzleStarted) return;

        this.snakePuzzleStarted = true;

        this.dialog.start([
            {
                speaker: "Kertoja",
                text: "Faraon noidat heittävät sauvansa maahan."
            }
        ]);

        this.magicians.forEach((magician, index) => {
            const landingX = magician.staff.x - 24;
            const landingY = magician.staff.y + 52;

            this.tweens.add({
                targets: magician.figure,
                angle: index === 0 ? -12 : 12,
                duration: 250,
                yoyo: true
            });

            this.tweens.add({
                targets: magician.staff,
                x: landingX,
                y: landingY,
                angle: index === 0 ? 72 : 105,
                duration: 550,
                delay: index * 180,
                ease: "Cubic.easeOut"
            });
        });

        this.time.delayedCall(1050, () => {
            this.snake = this.add.image(
                this.player.x + 28,
                this.player.y + 8,
                "staff"
            );

            this.snake.setDepth(12);
            this.snake.setScale(0.85);

            this.tweens.add({
                targets: this.snake,
                angle: 90,
                duration: 300,
                onComplete: () => {
                    this.snake.setTexture("snake");
                    this.snake.setAngle(0);
                    this.eatMagicianStaff(0);
                }
            });
        });
    }

    eatMagicianStaff(index) {

        if (index >= this.magicians.length) {
            this.snakePuzzleSolved = true;
            this.pendingResultDialog = true;
            this.updateQuestText();
            return;
        }

        const staff = this.magicians[index].staff;

        this.tweens.add({
            targets: this.snake,
            x: staff.x,
            y: staff.y,
            duration: 700,
            ease: "Sine.easeInOut",
            onComplete: () => {
                this.tweens.add({
                    targets: staff,
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 220,
                    onComplete: () => {
                        staff.destroy();
                        this.eatMagicianStaff(index + 1);
                    }
                });
            }
        });
    }

    update() {

        const speed = 200;

        this.player.setVelocity(
            0
        );

        if(
            this.cursors.left.isDown
        ) {
            this.player.setVelocityX(
                -speed
            );
        }

        if(
            this.cursors.right.isDown
        ) {
            this.player.setVelocityX(
                speed
            );
        }

        if(
            this.cursors.up.isDown
        ) {
            this.player.setVelocityY(
                -speed
            );
        }

        if(
            this.cursors.down.isDown
        ) {
            this.player.setVelocityY(
                speed
            );
        }

        if (this.cursors.left.isDown) {
            this.playerFacing = -1;
        } else if (this.cursors.right.isDown) {
            this.playerFacing = 1;
        }

        this.updateAaron();

        if (
            this.pendingStaffContest &&
            !this.dialog.isActive()
        ) {
            this.pendingStaffContest = false;
            this.dialogFinished = true;
            this.updateQuestText();
            this.createSnakePuzzle();
        }

        if (
            this.pendingResultDialog &&
            !this.dialog.isActive()
        ) {
            this.pendingResultDialog = false;
            this.dialog.start([
                {
                    speaker: "Mooses",
                    text: "Herrani sauva nieli heidän sauvansa."
                },
                {
                    speaker: "Aaron",
                    text: "Farao näki merkin, mutta ei vieläkään taipunut."
                },
                {
                    speaker: "Farao",
                    text: "En päästä kansaa."
                },
                {
                    speaker: "Kertoja",
                    text: "Ja niin alkoi ensimmäinen vitsaus."
                }
            ]);
            this.pendingPlagueTransition = true;
        }

        if (
            this.pendingPlagueTransition &&
            !this.dialog.isActive()
        ) {
            this.scene.start("PlaguesScene");
        }
    }

    updateAaron() {

        const targetX =
            this.player.x - this.playerFacing * 48;

        const targetY = this.player.y + 12;

        const distance = Phaser.Math.Distance.Between(
            this.aaron.x,
            this.aaron.y,
            targetX,
            targetY
        );

        if (distance > 8) {
            this.physics.moveTo(
                this.aaron,
                targetX,
                targetY,
                Math.min(220, Math.max(80, distance * 2))
            );
        } else {
            this.aaron.setVelocity(0, 0);
        }

        if (Math.abs(this.aaron.body.velocity.x) > 1) {
            this.aaron.setFlipX(
                this.aaron.body.velocity.x < 0
            );
        }
    }

    updateQuestText() {

        const questList =
        document.getElementById(
            "quest-list"
        );

        if(!questList)
            return;

        questList.innerHTML = `

            <li>
                ${
                    this.dialogFinished
                    ? "✅"
                    : "⬜"
                }
                Keskustele faraon kanssa
            </li>

            <li>
                ${
                    this.snakePuzzleSolved
                    ? "✅"
                    : "⬜"
                }
                Sauva käärmeeksi
            </li>

        `;
    }

}