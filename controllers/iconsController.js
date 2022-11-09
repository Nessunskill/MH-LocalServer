import iconsService from "../services/iconsService.js";

class iconsController {
    async getIcons(request, response) {
        try {
            const icons = await iconsService.getIcons();

            response.status(200).json({
                status: 200,
                data: icons
            })
        } catch (e) {
            console.log(e);
        }
    }
}

export default new iconsController();