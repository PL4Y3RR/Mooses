class SaveManager {

    save(data) {

        try {

            localStorage.setItem(

                "mooses_save",

                JSON.stringify(data)

            );

            console.log(
                "Tallennettu."
            );

        } catch (error) {

            console.error(
                error
            );
        }
    }

    load() {

        const saveData =

            localStorage.getItem(
                "mooses_save"
            );

        if (!saveData)
            return null;

        try {

            return JSON.parse(
                saveData
            );

        } catch (error) {

            console.error(
                error
            );

            return null;
        }
    }

    delete() {

        localStorage.removeItem(
            "mooses_save"
        );
    }

}