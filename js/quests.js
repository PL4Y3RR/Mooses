class QuestManager {

    constructor() {

        this.quests = {

            sheep1: false,
            sheep2: false,
            sheep3: false,

            burningBush: false,

            midianComplete: false

        };

        this.updateUI();
    }

    complete(id) {

        if (!this.quests.hasOwnProperty(id))
            return;

        this.quests[id] = true;

        this.updateUI();
    }

    isComplete(id) {

        return this.quests[id] === true;
    }

    getSheepCount() {

        let count = 0;

        if (this.quests.sheep1) count++;
        if (this.quests.sheep2) count++;
        if (this.quests.sheep3) count++;

        return count;
    }

    updateUI() {

        const questList =
            document.getElementById(
                "quest-list"
            );

        if (!questList)
            return;

        questList.innerHTML = `

        <li>
        ${this.quests.sheep1 ? "✅" : "⬜"}
        Lammas 1
        </li>

        <li>
        ${this.quests.sheep2 ? "✅" : "⬜"}
        Lammas 2
        </li>

        <li>
        ${this.quests.sheep3 ? "✅" : "⬜"}
        Lammas 3
        </li>

        <li>
        ${this.quests.burningBush ? "✅" : "⬜"}
        Löydä palava pensas
        </li>

        <li>
        ${this.quests.midianComplete ? "✅" : "⬜"}
        Midian valmis
        </li>

        `;
    }

}